import { NextResponse } from "next/server";
import {
  confirmPayment,
  getPaymentUserId,
  syncSubscription,
} from "@/services/mercadopago/confirmPayment";

const getMercadoPagoError = (responseData, fallback) =>
  responseData?.message ||
  responseData?.error ||
  responseData?.cause?.[0]?.description ||
  fallback;

export async function POST(request) {
  try {
    const { paymentId, preapprovalId, userId } = await request.json();
    const accessToken = process.env.MP_ACCESS_TOKEN?.trim();

    if ((!paymentId && !preapprovalId) || !userId || !accessToken) {
      return NextResponse.json(
        { error: "Faltan datos para confirmar el pago o la suscripción" },
        { status: 400 },
      );
    }

    if (preapprovalId) {
      const subscriptionResponse = await fetch(
        `https://api.mercadopago.com/preapproval/${encodeURIComponent(preapprovalId)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      const subscription = await subscriptionResponse.json();

      if (!subscriptionResponse.ok) {
        return NextResponse.json(
          {
            error: getMercadoPagoError(
              subscription,
              "No se pudo verificar la suscripción en Mercado Pago",
            ),
          },
          { status: 502 },
        );
      }

      if (getPaymentUserId(subscription) !== userId) {
        return NextResponse.json(
          { error: "La suscripción no pertenece a este usuario" },
          { status: 403 },
        );
      }

      const result = await syncSubscription(subscription);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
      return NextResponse.json({ saved: true, subscription: true });
    }

    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const payment = await paymentResponse.json();

    if (!paymentResponse.ok) {
      return NextResponse.json(
        {
          error: getMercadoPagoError(
            payment,
            "No se pudo verificar el pago en Mercado Pago",
          ),
        },
        { status: 502 },
      );
    }

    if (getPaymentUserId(payment) !== userId) {
      return NextResponse.json({ error: "El pago no pertenece a este usuario" }, { status: 403 });
    }

    if (payment.status !== "approved") {
      return NextResponse.json({ saved: false, status: payment.status });
    }

    const result = await confirmPayment(payment);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ saved: true, duplicate: result.duplicate });
  } catch (error) {
    console.error("Error confirmando el pago al volver a Settings", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}