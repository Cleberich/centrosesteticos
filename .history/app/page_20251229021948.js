import Link from "next/link";
import {
  Scissors,
  Menu,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Megaphone,
  Check,
  Globe,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
                <Scissors size={20} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Barber<span className="text-blue-600">Manager</span>
              </h2>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {["Funcionalidades", "Precios"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item}
                </Link>
              ))}
              <Link
                href="/login"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Ingresar
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <button className="hidden sm:flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-500/20">
                Registrar barbería
              </button>
              <button className="md:hidden p-2 text-slate-600 dark:text-slate-300">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex flex-col gap-6 lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 self-center lg:self-start rounded-full bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Nuevo: Integración con WhatsApp
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                Gestiona tu barbería como un{" "}
                <span className="text-blue-600">profesional</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
                Olvídate del papel y lápiz. Consigue más clientes, automatiza
                tus reservas y controla tus finanzas con nuestra plataforma todo
                en uno.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
                <button className="flex items-center justify-center rounded-xl h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-all shadow-lg shadow-blue-500/25">
                  Empezar prueba gratis
                </button>
                <button className="flex items-center justify-center rounded-xl h-14 px-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-600 transition-all font-bold text-lg">
                  Ver demostración
                </button>
              </div>
              <p className="text-sm text-slate-500 italic">
                * No requiere tarjeta de crédito
              </p>
            </div>

            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
                {/* Reemplaza con una imagen real más adelante */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                {/* Notificación Flotante */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/20 transform transition-transform group-hover:-translate-y-2">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        Nueva Reserva Confirmada
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Carlos M. • Corte y Barba • Hoy 16:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="funcionalidades"
        className="py-24 bg-slate-50 dark:bg-slate-900/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Todo lo que necesitas para crecer
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16 text-lg">
            Herramientas diseñadas específicamente para el flujo de trabajo de
            una barbería moderna.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Agenda 24/7",
                desc: "Tus clientes reservan a cualquier hora desde su móvil, sin llamadas.",
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Pagos Seguros",
                desc: "Reduce las faltas solicitando pagos anticipados o señas online.",
              },
              {
                icon: <Megaphone className="w-8 h-8" />,
                title: "Marketing Automatizado",
                desc: "Envía recordatorios por WhatsApp y recupera clientes inactivos.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section (Simplificado) */}
      <section id="precios" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            Planes que escalan contigo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* ... Aquí puedes repetir la lógica de planes con el icono <Check /> de Lucide ... */}
            <PlanCard
              name="Barbería Pro"
              price="49"
              popular={true}
              features={[
                "Agenda Ilimitada",
                "5 Barberos",
                "WhatsApp Marketing",
                "Reportes PDF",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer (Simplificado) */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-8 text-slate-400">
            <Instagram className="hover:text-blue-600 cursor-pointer" />
            <Linkedin className="hover:text-blue-600 cursor-pointer" />
            <Globe className="hover:text-blue-600 cursor-pointer" />
          </div>
          <p className="text-sm text-slate-500">
            © 2025 BarberManager. Hecho para profesionales del corte.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Subcomponente para Planes (para limpiar el código principal)
const PlanCard = ({ name, price, features, popular = false }) => (
  <div
    className={`p-8 rounded-2xl border ${
      popular
        ? "border-blue-600 ring-4 ring-blue-600/10"
        : "border-slate-200 dark:border-slate-800"
    } bg-white dark:bg-slate-900 relative flex flex-col`}
  >
    {popular && (
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
        Más Elegido
      </span>
    )}
    <h3 className="text-xl font-bold mb-2">{name}</h3>
    <div className="flex items-baseline justify-center gap-1 mb-6">
      <span className="text-4xl font-black">${price}</span>
      <span className="text-slate-500">/mes</span>
    </div>
    <ul className="space-y-4 mb-8 flex-1">
      {features.map((f, i) => (
        <li
          key={i}
          className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 text-left"
        >
          <Check size={18} className="text-green-500 shrink-0" />
          {f}
        </li>
      ))}
    </ul>
    <button
      className={`w-full py-3 rounded-xl font-bold transition-all ${
        popular
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
      }`}
    >
      Seleccionar Plan
    </button>
  </div>
);

export default HomePage;
