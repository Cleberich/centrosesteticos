// app/layout.js
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "BarberManager - Gestión Profesional de Barberías",
  description: "Gestiona tu barbería como un profesional con BarberManager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="light">
      <body className={`${manrope.variable} font-sans`}>{children}</body>
    </html>
  );
}
