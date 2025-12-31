// app/layout.js
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "BarberApp - Planes de Membresía",
  description:
    "Elige el plan perfecto para tu barbería y escala tu negocio con herramientas profesionales.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="light">
      <body className={`${manrope.variable} font-sans`}>{children}</body>
    </html>
  );
}
