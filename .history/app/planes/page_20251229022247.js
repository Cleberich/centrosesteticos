import Link from "next/link";
import {
  Scissors,
  Menu,
  Check,
  X,
  CheckCircle2,
  Minus,
  Instagram,
  Twitter,
} from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Top Navigation */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="px-4 md:px-10 py-3 flex items-center justify-between mx-auto max-w-7xl">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
              <Scissors size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">BarberApp</h2>
          </Link>

          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <nav className="flex items-center gap-6">
              {["Funciones", "Testimonios", "Contacto"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {item}
                </Link>
              ))}
              <Link href="#" className="text-sm font-semibold text-blue-600">
                Precios
              </Link>
            </nav>
            <div className="flex gap-3 ml-4">
              <button className="px-4 py-2 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Iniciar Sesión
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20">
                Empezar Gratis
              </button>
            </div>
          </div>
          <button className="md:hidden p-2">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full max-w-4xl px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Elige el plan perfecto para tu barbería
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Gestiona reservas, clientes y pagos sin complicaciones. Escala tu
            negocio con nuestras herramientas profesionales.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <button className="px-6 py-2 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900">
              Mensual
            </button>
            <button className="px-6 py-2 rounded-xl text-sm font-bold bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm ring-1 ring-black/5">
              Anual{" "}
              <span className="ml-1 text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="w-full max-w-7xl px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {/* Basic Plan */}
            <div className="flex flex-col gap-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold mb-2">Básico</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Ideal para barberos independientes que recién comienzan.
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tight">$0</span>
                  <span className="text-slate-500 font-medium">/mes</span>
                </div>
              </div>
              <button className="w-full py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Comenzar Gratis
              </button>
              <div className="space-y-4 flex-grow">
                {[
                  "1 Barbero",
                  "50 Reservas/mes",
                  "Agenda Básica",
                  "Soporte por Email",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Check size={18} className="text-blue-600 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {f}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-600 line-through">
                  <X size={18} className="shrink-0" />
                  <span>Recordatorios SMS</span>
                </div>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="flex flex-col gap-8 rounded-3xl border-2 border-blue-600 bg-white dark:bg-slate-900 p-8 shadow-2xl relative lg:-translate-y-4 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest">
                MÁS POPULAR
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-blue-600">
                  Profesional
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Para barberías en crecimiento que necesitan control total.
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tight">
                    $29
                  </span>
                  <span className="text-slate-500 font-medium">/mes</span>
                </div>
              </div>
              <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25">
                Prueba de 14 días gratis
              </button>
              <div className="space-y-4 flex-grow">
                {[
                  "Hasta 5 Barberos",
                  "Reservas Ilimitadas",
                  "Recordatorios SMS Automáticos",
                  "Pagos Online & Depósitos",
                  "Reportes Avanzados",
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm font-medium"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-blue-600 shrink-0"
                    />
                    <span className="text-slate-700 dark:text-slate-200">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="flex flex-col gap-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold mb-2">Empresarial</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Solución completa para cadenas y grandes establecimientos.
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tight">
                    $99
                  </span>
                  <span className="text-slate-500 font-medium">/mes</span>
                </div>
              </div>
              <button className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-colors">
                Contactar Ventas
              </button>
              <div className="space-y-4 flex-grow">
                {[
                  "Barberos Ilimitados",
                  "Múltiples Sucursales",
                  "App Personalizada (Marca Blanca)",
                  "API Access",
                  "Gerente de Cuenta Dedicado",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Check size={18} className="text-blue-600 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="w-full max-w-5xl px-4 pb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Compara las características
            </h2>
            <p className="text-slate-500">
              Todo lo que necesitas saber para tomar la mejor decisión.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-5 text-left text-sm font-bold">
                      Características
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-bold">
                      Básico
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-bold text-blue-600">
                      Profesional
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-bold">
                      Empresarial
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { f: "Agenda Online", b: "check", p: "check", e: "check" },
                    {
                      f: "Recordatorios SMS",
                      b: "minus",
                      p: "check",
                      e: "check",
                    },
                    {
                      f: "Pagos con Tarjeta",
                      b: "minus",
                      p: "Sí (2.5% comisión)",
                      e: "Sí (1.5% comisión)",
                    },
                    {
                      f: "App Móvil Clientes",
                      b: "minus",
                      p: "check",
                      e: "Marca Blanca",
                    },
                    {
                      f: "Soporte Técnico",
                      b: "Email",
                      p: "Chat en vivo",
                      e: "24/7 Dedicado",
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {row.f}
                      </td>
                      <td className="px-6 py-4 text-center text-sm italic">
                        {renderCell(row.b)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-semibold">
                        {renderCell(row.p)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        {renderCell(row.e)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Scissors size={20} className="text-blue-600" />
            <span className="font-bold text-xl tracking-tight">BarberApp</span>
          </div>

          <nav className="flex gap-8">
            {["Privacidad", "Términos"].map((link) => (
              <Link
                key={link}
                href="#"
                className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                {link}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="#"
              className="text-slate-400 hover:text-pink-500 transition-colors"
            >
              <Instagram size={20} />
            </Link>
            <p className="text-slate-400 text-sm ml-4 border-l pl-6 border-slate-200 dark:border-slate-700">
              © 2025 BarberApp Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper para renderizar iconos en la tabla
function renderCell(val) {
  if (val === "check")
    return <Check className="mx-auto text-green-500" size={20} />;
  if (val === "minus")
    return <Minus className="mx-auto text-slate-300" size={20} />;
  return (
    <span className="text-slate-600 dark:text-slate-400 font-medium">
      {val}
    </span>
  );
}
