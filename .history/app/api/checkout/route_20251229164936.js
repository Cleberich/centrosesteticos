import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { planId, planName, price, userId } = await request.json();

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          // REEMPLAZA ESTO CON TU TOKEN REAL DE MERCADO PAGO
          Authorization: `Bearer APP_USR-8386419448375631-010515-56f87455e8109d9418652427a1a9e38e-201646279`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              title: `Plan ${planName}`,
              unit_price: Number(price),
              quantity: 1,
              currency_id: "UYU",
            },
          ],
          back_urls: {
            success: `http://localhost:3000/dashboard/settings?status=approved&plan=${planId}`,
            failure: `http://localhost:3000/dashboard/settings?status=failed`,
          },
          auto_return: "approved",
        }),
      }
    );

    const data = await response.json();
    return NextResponse.json({ url: data.init_point });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
