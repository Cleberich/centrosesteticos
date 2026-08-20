import { NextResponse } from "next/server";
import {
  confirmPayment,
  syncSubscription,
} from "@/services/mercadopago/confirmPayment";

const getPaymentId = (request, body) =>
  body?.data?.id || body?.id || new URL(request.url).searchParams.get("data.id");

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const paymentId = getPaymentId(request, body);
    const accessToken = process.env.MP_ACCESS_TOKEN?.trim();

    if (!paymentId || !accessToken) {
      return NextResponse.json({ received: true });
    }

    const notificationType = body.type || body.topic;
    if (notificationType === "subscription_preapproval") {
      const subscriptionResponse = await fetch(
        `https://api.mercadopago.com/preapproval/${encodeURIComponent(paymentId)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      const subscription = await subscriptionResponse.json();

      if (!subscriptionResponse.ok) {
        return NextResponse.json(
          { error: "No se pudo consultar la suscripción" },
          { status: 502 },
        );
      }

      const result = await syncSubscription(subscription);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
      return NextResponse.json({ received: true, subscription: true });
    }

    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const payment = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error("No se pudo consultar el pago de Mercado Pago", payment);
      return NextResponse.json({ error: "No se pudo consultar el pago" }, { status: 502 });
    }

    if (payment.status !== "approved") {
      return NextResponse.json({ received: true, status: payment.status });
    }

    const result = await confirmPayment(payment);
    if (!result.ok) {
      console.error(result.error, paymentId);
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ received: true, duplicate: result.duplicate });
  } catch (error) {
    console.error("Error en webhook de Mercado Pago", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}