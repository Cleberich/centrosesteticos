// /*SANDBOX*/
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const { planId, planName, price, userId } = await request.json();

//     const response = await fetch(
//       "https://api.mercadopago.com/checkout/preferences",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN.trim()}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           items: [
//             {
//               title: `Plan ${planName}`,
//               unit_price: Number(price),
//               quantity: 1,
//               currency_id: "UYU",
//             },
//           ],
//           external_reference: userId,
//           back_urls: {
//             success: "https://finanzas-aldia.vercel.app/",
//             failure: "http://localhost:3000/dashboard/settings",
//             pending: "http://localhost:3000/dashboard/settings",
//           },
//           auto_return: "approved",
//         }),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("DETALLE ERROR MP:", data);
//       return NextResponse.json({ error: data.message }, { status: 400 });
//     }

//     return NextResponse.json({
//       url: data.sandbox_init_point || data.init_point,
//     });
//   } catch (error) {
//     console.error("Error en el servidor:", error);
//     return NextResponse.json({ error: "Error interno" }, { status: 500 });
//   }
// }

/*PRODUCTION*/
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";

export async function POST(request) {
  try {
    const { planId, planName, price, userId, email } = await request.json();
    const payerEmail = String(email || "").trim().toLowerCase();
    const accessToken = process.env.MP_ACCESS_TOKEN?.trim();
    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL || "https://centros-esteticos.vercel.app"
    ).replace(/\/$/, "");

    if (!accessToken) {
      console.error("MP_ACCESS_TOKEN no está configurado");
      return NextResponse.json(
        { error: "Mercado Pago no está configurado en el servidor" },
        { status: 500 },
      );
    }

    if (
      !planId ||
      !planName ||
      !userId ||
      !payerEmail ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0
    ) {
      return NextResponse.json(
        { error: "Datos de checkout inválidos" },
        { status: 400 },
      );
    }

    const response = await fetch(
      "https://api.mercadopago.com/preapproval",
      {
        method: "POST",
        headers: {
          // Asegúrate de que este token sea el APP_USR
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payer_email: payerEmail,
          reason: `Suscripción mensual Plan ${planName}`,
          external_reference: `${userId}|${planId}`,
          status: "pending",
          auto_recurring: {
            frequency: 1,
            frequency_type: "months",
            transaction_amount: Number(price),
            currency_id: "UYU",
          },
          notification_url: `${appUrl}/api/webhooks/mercadopago`,
          back_url: `${appUrl}/dashboard/settings`,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("DETALLE ERROR MP:", data);
      return NextResponse.json(
        {
          error:
            data.message ||
            data.error ||
            data.cause?.[0]?.description ||
            "Mercado Pago rechazó la suscripción",
        },
        { status: response.status >= 400 && response.status < 500 ? 400 : 502 },
      );
    }

    const checkoutUrl = data.init_point || data.sandbox_init_point;
    if (!checkoutUrl) {
      console.error("Mercado Pago no devolvió una URL de checkout", data);
      return NextResponse.json(
        { error: "Mercado Pago no devolvió un enlace de pago" },
        { status: 502 },
      );
    }

    await getAdminDb()
      .collection("centros_estetica")
      .doc(userId)
      .update({
        "plan.pendingSubscriptionId": String(data.id),
        "plan.pendingSubscriptionStatus": data.status || "pending",
        "plan.pendingSubscriptionPlan": planId,
        "plan.pendingSubscriptionPrice": Number(price),
        "plan.pendingPayerEmail": payerEmail,
        "plan.pendingSubscriptionCreatedAt": Timestamp.now(),
      });

    return NextResponse.json({ url: checkoutUrl, subscriptionId: data.id });
  } catch (error) {
    console.error("Error en el servidor:", error);
    const errorMessage = String(error?.message || "");
    if (errorMessage.includes("Faltan FIREBASE_")) {
      return NextResponse.json(
        {
          error:
            "Falta configurar Firebase Admin en el servidor. Agrega FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY.",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "No se pudo guardar la suscripción en la base de datos" },
      { status: 500 },
    );
  }
}
