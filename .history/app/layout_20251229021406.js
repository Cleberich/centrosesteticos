// app/layout.js
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "Registro de Barbería - BarberManager",
  description:
    "Registra tu barbería en la plataforma líder de gestión profesional.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="light">
      <body
        className={`${manrope.variable} font-sans bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
