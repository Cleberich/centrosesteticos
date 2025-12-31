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
  Star,
  User,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Scissors size={20} />
              </div>
              <h2 className="text-lg font-bold tracking-tight">
                BarberManager
              </h2>
            </div>
            <nav className="hidden md:flex items-center gap-9">
              <a
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                href="#features"
              >
                Funcionalidades
              </a>
              <a
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                href="#pricing"
              >
                Precios
              </a>
              <a
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                href="/login"
              >
                Ingresar
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-bold">
                Registrar mi barbería
              </button>
              <a href="/register" className="md:hidden p-2">
                <Menu size={24} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-12 lg:py-20">
          <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 items-center">
            <div className="flex flex-col gap-6 lg:w-1/2">
              <div className="flex flex-col gap-4 text-left">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  Nuevo: Integración con WhatsApp
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                  Gestiona tu barbería como un profesional
                </h1>
                <h2 className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  Olvídate del papel y lápiz. Consigue más clientes, automatiza
                  tus reservas y controla tus finanzas con nuestra plataforma
                  todo en uno.
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-blue-600 hover:bg-blue-700 transition-all text-white text-base font-bold shadow-lg shadow-blue-500/20">
                  Empezar prueba gratis
                </button>
                <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-900 dark:text-white text-base font-bold">
                  Ver demostración
                </button>
              </div>
              <p className="text-sm text-slate-500">
                * No requiere tarjeta de crédito para empezar.
              </p>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-blue-600/20 rounded-xl blur-2xl opacity-50 dark:opacity-20"></div>
              <div className="relative w-full aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80')] bg-center bg-cover rounded-xl shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur p-4 rounded-lg shadow-lg transform transition-transform group-hover:-translate-y-2 duration-300">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Nueva Reserva Confirmada
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Carlos M. - Corte y Barba - Hoy 16:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Stats Bar */}
      <div className="w-full border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-center">
            La plataforma elegida por más de 500 barberías
          </p>
          <div className="flex items-center gap-8 md:gap-12 text-slate-400">
            <div className="flex items-center gap-2">
              <Scissors size={18} /> BarberKings
            </div>
            <div className="flex items-center gap-2">
              <User size={18} /> Gentleman's Club
            </div>
            <div className="flex items-center gap-2">
              <Star size={18} /> EliteCuts
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-10 max-w-7xl mx-auto" id="features">
        <div className="flex flex-col gap-4 mb-12 text-center items-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            Beneficios Principales
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Herramientas diseñadas específicamente para el crecimiento de tu
            negocio de barbería.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Calendar size={32} />,
              title: "Agenda 24/7",
              desc: "Tus clientes reservan mientras duermes. Gestión inteligente de turnos y disponibilidad.",
            },
            {
              icon: <ShieldCheck size={32} />,
              title: "Pagos Seguros",
              desc: "Reduce las inasistencias solicitando depósitos previos o cobros completos online.",
            },
            {
              icon: <Megaphone size={32} />,
              title: "Marketing Automático",
              desc: "Recordatorios por SMS y WhatsApp para evitar olvidos y fidelizar clientes.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-2">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-10 max-w-7xl mx-auto" id="pricing">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Planes de Membresía
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Elige el plan perfecto para la etapa de tu negocio.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {[
            {
              name: "Barbero Independiente",
              desc: "Para profesionales que inician.",
              price: 19,
              features: [
                "Agenda Online Básica",
                "Hasta 100 Clientes",
                "Recordatorios por Email",
              ],
              popular: false,
            },
            {
              name: "Barbería Profesional",
              desc: "Para dueños de local.",
              price: 49,
              features: [
                "Agenda Ilimitada",
                "Hasta 5 Barberos",
                "Recordatorios SMS & WhatsApp",
                "Reportes Financieros",
                "Pagos Online",
              ],
              popular: true,
            },
            {
              name: "Franquicias",
              desc: "Para múltiples sucursales.",
              price: 99,
              features: [
                "Todo lo de Pro",
                "Múltiples Locales",
                "API & Integraciones",
                "Soporte Prioritario 24/7",
              ],
              popular: false,
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 flex flex-col gap-6 relative transition-all ${
                plan.popular
                  ? "border-2 border-blue-600 bg-white dark:bg-slate-800 shadow-xl md:-translate-y-4"
                  : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Más Popular
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-2">{plan.desc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">${plan.price}</span>
                <span className="text-slate-500">/mes</span>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <Check
                      size={18}
                      className={
                        plan.popular ? "text-blue-600" : "text-green-500"
                      }
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full rounded-lg h-12 font-bold transition-colors ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                    : "border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                }`}
              >
                {plan.popular
                  ? "Probar Pro Gratis"
                  : plan.price === 99
                  ? "Contactar Ventas"
                  : "Comenzar Gratis"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl bg-slate-900 dark:bg-blue-900/20 p-8 sm:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl"></div>
            <div className="relative z-10 text-white">
              <h2 className="text-3xl sm:text-4xl font-black mb-6">
                ¿Listo para llevar tu barbería al siguiente nivel?
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                Únete a cientos de barberos que ya han modernizado su negocio.
                Prueba BarberManager gratis por 14 días.
              </p>
              <button className="inline-flex min-w-[200px] items-center justify-center rounded-lg h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold transition-all shadow-xl shadow-blue-900/50">
                Registrar mi barbería ahora
              </button>
              <p className="mt-4 text-sm text-slate-400">
                Sin contratos forzosos. Cancela cuando quieras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white mb-4">
                <Scissors size={24} className="text-blue-600" />
                <span className="text-lg font-bold">BarberManager</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                La plataforma líder en gestión para barberías modernas.
                Simplificamos tu día a día.
              </p>
            </div>
            {[
              {
                title: "Producto",
                links: [
                  "Funcionalidades",
                  "Precios",
                  "Integraciones",
                  "Actualizaciones",
                ],
              },
              {
                title: "Compañía",
                links: ["Sobre Nosotros", "Blog", "Carreras", "Contacto"],
              },
              {
                title: "Legal",
                links: ["Privacidad", "Términos", "Seguridad"],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold mb-4">{col.title}</h4>
                <ul className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a
                        className="hover:text-blue-600 transition-colors"
                        href="#"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © 2024 BarberManager. Todos los derechos reservados.
            </p>
            <div className="flex gap-4 text-slate-400">
              <Link href="#" className="hover:text-blue-600">
                <Globe size={20} />
              </Link>
              <Link href="#" className="hover:text-blue-600">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="hover:text-blue-600">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
