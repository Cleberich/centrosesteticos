// app/layout.js
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-manrope",
});

// Configuración de metadatos optimizada para SEO
export const metadata = {
  title: {
    default: "AgendaBarber | Gestión y Agenda para Barberías",
    template: "%s | AgendaBarber",
  },
  description:
    "AgendaBarber es la plataforma líder para gestionar turnos, contabilidad y estadísticas de tu barbería. Optimiza tu tiempo y escala tu negocio con herramientas profesionales.",
  keywords: [
    "AgendaBarber",
    "agenda para barberías",
    "gestión de barbería",
    "software para barberos",
    "turnos online barbería",
    "control de caja barbería",
  ],
  authors: [{ name: "AgendaBarber Team" }],
  creator: "AgendaBarber",
  publisher: "AgendaBarber",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Metadatos para Redes Sociales (Open Graph)
  openGraph: {
    title: "AgendaBarber | Gestión y Agenda Profesional para Barberías",
    description:
      "La herramienta definitiva para el barbero moderno. Agendas, reportes y control total.",
    url: "https://agendabarber.com", // Cambia por tu dominio real
    siteName: "AgendaBarber",
    locale: "es_ES",
    type: "website",
  },
  // Metadatos para Twitter
  twitter: {
    card: "summary_large_image",
    title: "AgendaBarber | Software para Barberías",
    description: "Organiza tu agenda y finanzas en un solo lugar.",
  },
  // Favicons e iconos
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
    <html lang="es" className="scroll-smooth dark">
      <body
        className={`${manrope.variable} font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
