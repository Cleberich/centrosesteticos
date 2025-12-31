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

export async function POST(request) {
  try {
    const { planId, planName, price, userId } = await request.json();

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          // Asegúrate de que este token sea el APP_USR
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              title: `Plan ${planName} - BarberManager`,
              unit_price: Number(price),
              quantity: 1,
              currency_id: "UYU",
            },
          ],
          external_reference: userId,
          back_urls: {
            // IMPORTANTE: Agregamos ?plan=${planId} para que tu web sepa qué plan compró al volver
            success: `https://barberias.vercel.app/dashboard/settings?plan=${planId}`,
            failure:
              "https://barberias-aldia.vercel.app/dashboard/settings?status=failed",
            pending:
              "https://barberias-aldia.vercel.app/dashboard/settings?status=pending",
          },
          auto_return: "approved",
          // Evita que los usuarios puedan pagar con medios que demoran (ej. Abitab)
          // si quieres activación instantánea
          payment_methods: {
            installments: 1, // Limita a 1 cuota si prefieres
            excluded_payment_types: [{ id: "ticket" }],
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("DETALLE ERROR MP:", data);
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    // EN PRODUCCIÓN: Siempre usamos init_point
    return NextResponse.json({
      url: data.init_point,
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
