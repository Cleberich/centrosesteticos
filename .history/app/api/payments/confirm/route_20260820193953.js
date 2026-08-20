import { NextResponse } from "next/server";
import { confirmPayment, getPaymentUserId } from "@/services/mercadopago/confirmPayment";

export async function POST(request) {
  try {
    const { paymentId, userId } = await request.json();
    const accessToken = process.env.MP_ACCESS_TOKEN?.trim();

    if (!paymentId || !userId || !accessToken) {
      return NextResponse.json(
        { error: "Faltan datos para confirmar el pago" },
        { status: 400 },
      );
    }

    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const payment = await paymentResponse.json();

    if (!paymentResponse.ok) {
      return NextResponse.json(
        { error: "No se pudo verificar el pago en Mercado Pago" },
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