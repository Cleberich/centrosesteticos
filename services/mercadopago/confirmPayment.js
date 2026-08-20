import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const toDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

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

export async function confirmPayment(payment) {
  const { userId, planId, planName } = getPlanData(payment);
  if (!userId) {
    return { ok: false, status: 422, error: "Pago sin usuario asociado" };
  }

  const businessRef = getAdminDb().collection("centros_estetica").doc(userId);
  const businessSnapshot = await businessRef.get();
  if (!businessSnapshot.exists) {
    return { ok: false, status: 404, error: "Cliente no encontrado" };
  }

  const businessData = businessSnapshot.data() || {};
  const existingHistory = businessData.paymentHistory || [];
  if (existingHistory.some((item) => String(item.paymentId) === String(payment.id))) {
    return { ok: true, duplicate: true, userId };
  }

  const approvedAt = toDate(payment.date_approved) || new Date();
  const currentExpiry = toDate(businessData.plan?.expiresAt);
  const subscriptionStart =
    currentExpiry && currentExpiry > approvedAt ? currentExpiry : approvedAt;
  const expiresAt = new Date(subscriptionStart.getTime() + 30 * DAY_IN_MS);
  const amount = Number(payment.transaction_amount) || 0;
  const planType = planId || planName;
  const paymentRecord = {
    paymentId: String(payment.id),
    date: Timestamp.fromDate(approvedAt),
    amount,
    currency: payment.currency_id || "UYU",
    planType,
    planName,
    method: "mercadopago",
    paymentMethod: payment.payment_method_id || null,
    installments: Number(payment.installments) || 1,
    status: payment.status,
    expiresAt: Timestamp.fromDate(expiresAt),
    payerEmail: payment.payer?.email || null,
    registeredAt: Timestamp.now(),
  };

  await businessRef.update({
    "plan.type": planType,
    "plan.name": planName,
    "plan.price": amount,
    "plan.status": "active",
    "plan.paymentStatus": "paid",
    "plan.lastPaymentId": String(payment.id),
    "plan.lastPayment": Timestamp.fromDate(approvedAt),
    "plan.lastPaymentAmount": amount,
    "plan.lastPaymentMethod": payment.payment_method_id || "mercadopago",
    "plan.lastPaymentStatus": payment.status,
    "plan.nextPayment": Timestamp.fromDate(expiresAt),
    "plan.expiresAt": Timestamp.fromDate(expiresAt),
    paymentHistory: FieldValue.arrayUnion(paymentRecord),
  });

  return { ok: true, duplicate: false, userId, planType, expiresAt };
}

export function getPaymentUserId(payment) {
  return getPlanData(payment).userId;
}
