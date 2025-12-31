import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { planId, planName, price, userId } = await request.json();

    // Verificamos si el token existe en el servidor
    if (!process.env.MP_ACCESS_TOKEN) {
      console.error("TOKEN FALTANTE: Configura MP_ACCESS_TOKEN en .env.local");
      return NextResponse.json(
        { error: "Configuración de servidor incompleta" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
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
          back_urls: {
            // Cambia localhost por tu dominio real cuando subas a producción
            success: `${
              process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
            }/dashboard/settings?status=approved&plan=${planId}`,
            failure: `${
              process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
            }/dashboard/settings?status=failed`,
          },
          auto_return: "approved",
          external_reference: userId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Error en Mercado Pago" },
        { status: response.status }
      );
    }

    return NextResponse.json({ url: data.init_point });
  } catch (error) {
    console.error("Error en API Route:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
