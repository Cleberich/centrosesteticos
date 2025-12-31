import Link from "next/link";
import {
  Scissors,
  Menu,
  CheckCircle2,
  Calendar,
  BarChart3, // Nuevo: para estadísticas
  PieChart, // Nuevo: para contabilidad
  Smartphone,
  Check,
  Globe,
  Instagram,
  Linkedin,
  Star,
  User,
  History,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-3">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white mb-6">
                <span className="text-xl gap-2 flex font-black uppercase tracking-tighter italic">
                  Agenda <Scissors size={28} className="text-blue-600" /> Barber
                </span>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-9">
              <a
                className="text-sm font-bold hover:text-blue-600 transition-colors uppercase tracking-tight"
                href="#features"
              >
                Funcionalidades
              </a>
              <a
                className="text-sm font-bold hover:text-blue-600 transition-colors uppercase tracking-tight"
                href="#pricing"
              >
                Precios
              </a>
              <Link
                className="text-sm font-bold hover:text-blue-600 transition-colors uppercase tracking-tight"
                href="/login"
              >
                Ingresar
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="hidden sm:flex items-center justify-center rounded-xl h-10 px-6 bg-blue-600 hover:bg-blue-700 transition-all text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
              >
                Empezar Ahora
              </Link>
              <button className="md:hidden p-2 text-slate-600 dark:text-slate-300">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-12 lg:py-24">
          <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-16 items-center">
            <div className="flex flex-col gap-6 lg:w-1/2">
              <div className="flex flex-col gap-5 text-left">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  Control Total de tu Negocio
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter uppercase italic">
                  Eleva el nivel de tu{" "}
                  <span className="text-blue-600">Barbería</span>
                </h1>
                <h2 className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
                  Organiza tu agenda, controla tus ingresos y profesionaliza el
                  trato con tus clientes con la plataforma de gestión más
                  completa.
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-xl h-14 px-10 bg-blue-600 hover:bg-blue-700 transition-all text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-500/25"
                >
                  Registrar mi barbería
                </Link>
                <button className="flex items-center justify-center rounded-xl h-14 px-10 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-600 transition-all text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest">
                  Ver Demo
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -inset-10 bg-blue-600/10 rounded-full blur-3xl"></div>
              <div className="relative w-full aspect-square sm:aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80')] bg-center bg-cover rounded-3xl shadow-2xl border-8 border-white dark:border-slate-900">
                <div className="absolute top-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl hidden sm:block border border-slate-100 dark:border-slate-700 animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600">
                      <BarChart3 size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">
                        Ingresos Hoy
                      </p>
                      <p className="text-lg font-black dark:text-white">
                        $12,450
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
      <section className="py-24 px-4 sm:px-10 max-w-7xl mx-auto" id="features">
        <div className="text-center mb-16">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-4">
            Herramientas Profesionales
          </h2>
          <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
            Todo lo que necesitas para <br /> gestionar tu equipo
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Calendar size={32} />,
              title: "Gestión de Agenda",
              desc: "Calendario dinámico e intuitivo. Organiza los turnos de todos tus barberos en una sola vista.",
            },
            {
              icon: <PieChart size={32} />,
              title: "Contabilidad Real",
              desc: "Registra cada pago, controla el efectivo en caja y visualiza tus ingresos diarios o mensuales.",
            },
            {
              icon: <BarChart3 size={32} />,
              title: "Estadísticas",
              desc: "Reportes de rendimiento por barbero, servicios más pedidos y crecimiento de tu negocio.",
            },
            {
              icon: <History size={32} />,
              title: "Fidelización",
              desc: "Mantén un historial detallado de cada cliente, sus preferencias y sus últimas visitas.",
            },
            {
              icon: <Smartphone size={32} />,
              title: "WhatsApp",
              desc: "Herramientas manuales para enviar recordatorios y confirmaciones personalizadas de forma rápida.",
            },
            {
              icon: <CheckCircle2 size={32} />,
              title: "Gestión de Equipo",
              desc: "Configura comisiones personalizadas para cada barbero y controla su productividad.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group flex flex-col gap-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300"
            >
              <div className="text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tight">
                {item.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="py-24 px-4 bg-slate-50 dark:bg-slate-950"
        id="pricing"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter">
              Planes de Membresía
            </h2>
            <p className="text-lg text-slate-500 font-medium font-sans">
              Gestión profesional para cada etapa de tu negocio.
            </p>
          </div>

          {/* Grid con items de igual altura (items-stretch) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {[
              {
                name: "Free",
                price: "$0",
                features: ["1 Barbero", "20 Reservas/mes", "Gestión de Agenda"],
                cta: "Plan Actual",
                icon: <User size={20} className="text-slate-400" />,
              },
              {
                name: "Básico",
                price: "$690",
                features: [
                  "1 Barbero",
                  "150 Reservas/mes",
                  "Gestión de Agenda",
                ],
                cta: "Elegir",
                icon: (
                  <div className="text-blue-500">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                ),
              },
              {
                name: "Profesional",
                price: "$1290",
                features: [
                  "3 Barberos",
                  "600 Reservas/mes",
                  "Gestión de Agenda",
                  "Estadísticas",
                ],
                cta: "Elegir",
                popular: true, // Destaca por estilo, no por tamaño
                icon: (
                  <Star
                    size={20}
                    className="text-blue-500"
                    fill="currentColor"
                  />
                ),
              },
              {
                name: "Elite",
                price: "$1900",
                features: [
                  "Barberos Ilimitados",
                  "Reservas Ilimitadas",
                  "Gestión de Agenda",
                  "Estadísticas",
                  "Marketing",
                ],
                cta: "Elegir",
                icon: (
                  <div className="text-blue-500">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                ),
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col rounded-[2.5rem] p-8 transition-all duration-300 border-2 ${
                  plan.popular
                    ? "border-blue-600 bg-blue-50/30 dark:bg-blue-900/10 shadow-xl shadow-blue-500/10 z-10"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a1120]"
                }`}
              >
                {/* Etiqueta flotante para el Profesional */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap shadow-md">
                    Más Elegido
                  </div>
                )}

                <div className="flex flex-col gap-2 mb-6">
                  <div className="mb-2">{plan.icon}</div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white italic">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-black ${
                        plan.name === "Free"
                          ? "text-slate-400"
                          : "text-blue-600"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">
                      / mes
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-4 mb-8 flex-grow">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-[11px] font-black uppercase tracking-tight text-slate-500 dark:text-slate-300"
                    >
                      <div className="size-5 shrink-0 rounded-full border-2 border-green-500/50 flex items-center justify-center text-green-500 mt-0.5">
                        <Check size={10} strokeWidth={5} />
                      </div>
                      <span className="leading-tight">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full rounded-2xl h-14 font-black uppercase tracking-[0.2em] text-xs transition-all ${
                    plan.name === "Free"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 active:scale-95"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white mb-6">
                <span className="text-xl gap-2 flex font-black uppercase tracking-tighter italic">
                  Agenda <Scissors size={28} className="text-blue-600" /> Barber
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Potenciando barberías mediante tecnología aplicada a la gestión
                real y diaria.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16">
              <div>
                <h4 className="font-black uppercase text-xs tracking-widest mb-6">
                  Navegación
                </h4>
                <ul className="flex flex-col gap-3 text-sm font-bold text-slate-400 uppercase tracking-tight">
                  <li>
                    <a
                      className="hover:text-blue-600 transition-colors"
                      href="#"
                    >
                      Inicio
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-blue-600 transition-colors"
                      href="#features"
                    >
                      Funciones
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-blue-600 transition-colors"
                      href="#pricing"
                    >
                      Planes
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-black uppercase text-xs tracking-widest mb-6">
                  Legal
                </h4>
                <ul className="flex flex-col gap-3 text-sm font-bold text-slate-400 uppercase tracking-tight">
                  <li>
                    <a
                      className="hover:text-blue-600 transition-colors"
                      href="#"
                    >
                      Privacidad
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-blue-600 transition-colors"
                      href="#"
                    >
                      Términos
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              © 2025 BarberManager. El arte de gestionar bien.
            </p>
            <div className="flex gap-6 text-slate-400">
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
