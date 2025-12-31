import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Configuración del cliente
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});
export async function POST(request) {
  const { planName, price, userId } = await request.json();

  try {
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            title: `Plan ${planName} - BarberPro`,
            quantity: 1,
            unit_price: Number(price),
            currency_id: "ARS", // O tu moneda local
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/dashboard/settings?status=success`,
          failure: `${process.env.NEXT_PUBLIC_URL}/dashboard/settings?status=failure`,
        },
        auto_return: "approved",
        external_reference: userId, // Guardamos el UID para identificar al barbero
      },
    });

    return NextResponse.json({ init_point: preference.init_point });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear pago" }, { status: 500 });
  }
}
