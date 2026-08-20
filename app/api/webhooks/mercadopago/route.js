import { NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getPaymentId = (request, body) =>
  body?.data?.id || body?.id || new URL(request.url).searchParams.get("data.id");

const getPlanData = (payment) => {
  const reference = String(payment.external_reference || "");
  const [userId, planId] = reference.split("|");
  const metadata = payment.metadata || {};

  return {
    userId: metadata.userId || userId,
    planId: metadata.planId || planId,
    planName: metadata.planName || payment.description || "Plan AppEstetica",
  };
};

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const paymentId = getPaymentId(request, body);
    const accessToken = process.env.MP_ACCESS_TOKEN?.trim();

    if (!paymentId || !accessToken) {
      return NextResponse.json({ received: true });
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

    const { userId, planId, planName } = getPlanData(payment);
    if (!userId) {
      console.error("Pago aprobado sin usuario asociado", paymentId);
      return NextResponse.json({ error: "Pago sin usuario asociado" }, { status: 422 });
    }

    const approvedAt = payment.date_approved
      ? new Date(payment.date_approved)
      : new Date();
    const expiresAt = new Date(approvedAt.getTime() + 30 * DAY_IN_MS);
    const paymentRecord = {
      paymentId: String(payment.id),
      date: Timestamp.fromDate(approvedAt),
      amount: Number(payment.transaction_amount) || 0,
      planType: planId || planName,
      method: "mercadopago",
      status: "approved",
      registeredAt: Timestamp.now(),
    };

    const businessRef = getAdminDb().collection("centros_estetica").doc(userId);
    const businessSnapshot = await businessRef.get();
    if (!businessSnapshot.exists) {
      console.error("No existe el centro asociado al pago", userId);
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    const existingHistory = businessSnapshot.data()?.paymentHistory || [];
    if (existingHistory.some((item) => String(item.paymentId) === String(payment.id))) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    await businessRef.update({
      "plan.type": planId || planName,
      "plan.price": Number(payment.transaction_amount) || 0,
      "plan.status": "active",
      "plan.paymentStatus": "paid",
      "plan.lastPaymentId": String(payment.id),
      "plan.lastPayment": Timestamp.fromDate(approvedAt),
      "plan.nextPayment": Timestamp.fromDate(expiresAt),
      "plan.expiresAt": Timestamp.fromDate(expiresAt),
      paymentHistory: FieldValue.arrayUnion(paymentRecord),
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error en webhook de Mercado Pago", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}