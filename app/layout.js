import { Manrope } from "next/font/google";
import "./globals.css";
// 1. Importamos el componente de Vercel
import { Analytics } from "@vercel/analytics/react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-manrope",
});

// Configuración de metadatos optimizada para SEO para Centro de Estética
export const metadata = {
  title: {
    default: "Aura Estética | Gestión y Agenda para Centros de Belleza",
    template: "%s | Aura Estética",
  },
  description:
    "Aura Estética es la plataforma integral para gestionar turnos, tratamientos, fichas de pacientes y estadísticas de tu centro de estética o spa. Profesionaliza tu servicio hoy.",
  keywords: [
    "Aura Estética",
    "software centro estética",
    "agenda para spa",
    "gestión de centros de belleza",
    "turnos estética online",
    "fichas de pacientes digitales",
    "control de stock estética",
  ],
  authors: [{ name: "Aura Estética Team" }],
  creator: "Aura Estética",
  publisher: "Aura Estética",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Metadatos para Redes Sociales (Open Graph)
  openGraph: {
    title: "Aura Estética | Gestión y Agenda Profesional para Estética y Spa",
    description:
      "La herramienta definitiva para el sector de la belleza. Agendas inteligentes, historial de tratamientos y control total.",
    url: "https://aura-estetica.vercel.app", // Cambia por tu dominio real si lo tienes
    siteName: "Aura Estética",
    locale: "es_ES",
    type: "website",
  },
  // Metadatos para Twitter
  twitter: {
    card: "summary_large_image",
    title: "Aura Estética | Software para Centros de Belleza",
    description: "Eleva el estándar de tu centro con una gestión impecable.",
  },
  // Favicons e iconos (asegúrate de actualizarlos en tu carpeta public)
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  // Robots para permitir indexación
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${manrope.variable} font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50`}
      >
        {children}
        {/* 2. Añadimos el componente al final del body */}
        <Analytics />
      </body>
    </html>
  );
}
