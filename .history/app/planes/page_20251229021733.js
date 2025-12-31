// app/page.js
import Link from "next/link";

export default function PricingPage() {
  return (
    <>
      {/* Top Navigation */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="px-4 md:px-10 py-3 flex items-center justify-between mx-auto max-w-[1280px]">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <div className="size-8 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">
                content_cut
              </span>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight">
              BarberApp
            </h2>
          </div>
          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <nav className="flex items-center gap-6">
              <Link
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors text-slate-700 dark:text-slate-300"
              >
                Funciones
              </Link>
              <Link href="#" className="text-sm font-medium text-primary">
                Precios
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors text-slate-700 dark:text-slate-300"
              >
                Testimonios
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors text-slate-700 dark:text-slate-300"
              >
                Contacto
              </Link>
            </nav>
            <div className="flex gap-3">
              <button className="flex items-center justify-center rounded-lg h-9 px-4 border border-gray-200 dark:border-gray-700 text-sm font-bold bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="truncate">Iniciar Sesión</span>
              </button>
              <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                <span className="truncate">Empezar Gratis</span>
              </button>
            </div>
          </div>
          <button className="md:hidden p-2 text-slate-700 dark:text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full max-w-[960px] px-4 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-4">
            Elige el plan perfecto para tu barbería
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Gestiona reservas, clientes y pagos sin complicaciones. Escala tu
            negocio con nuestras herramientas profesionales.
          </p>
          <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-gray-200 dark:bg-gray-800 mb-8">
            <button className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Mensual
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-bold bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              Anual{" "}
              <span className="text-primary text-xs ml-1 font-extrabold">
                -20%
              </span>
            </button>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="w-full max-w-[1200px] px-4 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <div className="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Básico
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Ideal para barberos independientes que recién comienzan.
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    $0
                  </span>
                  <span className="text-base font-bold text-slate-500 dark:text-slate-400">
                    /mes
                  </span>
                </div>
              </div>
              <button className="w-full h-12 rounded-lg bg-gray-100 dark:bg-gray-700 text-slate-900 dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Comenzar Gratis
              </button>
              <div className="space-y-4">
                {[
                  "1 Barbero",
                  "50 Reservas/mes",
                  "Agenda Básica",
                  "Soporte por Email",
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex gap-3 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span
                      className="material-symbols-outlined text-primary"
                      style={{ fontSize: "20px" }}
                    >
                      check
                    </span>
                    {feature}
                  </div>
                ))}
                <div className="flex gap-3 text-sm text-slate-400 dark:text-slate-600 line-through">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    close
                  </span>
                  Recordatorios SMS
                </div>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="flex flex-col gap-6 rounded-xl border-2 border-primary bg-white dark:bg-gray-800 p-8 shadow-xl relative scale-100 lg:scale-105 z-10">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">
                MÁS POPULAR
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-primary">Profesional</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Para barberías en crecimiento que necesitan control total.
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    $29
                  </span>
                  <span className="text-base font-bold text-slate-500 dark:text-slate-400">
                    /mes
                  </span>
                </div>
              </div>
              <button className="w-full h-12 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-md">
                Prueba de 14 días
              </button>
              <div className="space-y-4">
                {[
                  "Hasta 5 Barberos",
                  "Reservas Ilimitadas",
                  "Recordatorios SMS Automáticos",
                  "Pagos Online & Depósitos",
                  "Reportes Avanzados",
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <span
                      className="material-symbols-outlined text-primary"
                      style={{ fontSize: "20px" }}
                    >
                      check_circle
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Empresarial
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Solución completa para cadenas y grandes establecimientos.
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    $99
                  </span>
                  <span className="text-base font-bold text-slate-500 dark:text-slate-400">
                    /mes
                  </span>
                </div>
              </div>
              <button className="w-full h-12 rounded-lg bg-gray-100 dark:bg-gray-700 text-slate-900 dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Contactar Ventas
              </button>
              <div className="space-y-4">
                {[
                  "Barberos Ilimitados",
                  "Múltiples Sucursales",
                  "App Personalizada (Marca Blanca)",
                  "API Access",
                  "Gerente de Cuenta Dedicado",
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex gap-3 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span
                      className="material-symbols-outlined text-primary"
                      style={{ fontSize: "20px" }}
                    >
                      check
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Title */}
        <section className="w-full max-w-[960px] px-4 pt-10 pb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Compara las características en detalle
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Todo lo que necesitas saber para tomar la mejor decisión.
          </p>
        </section>

        {/* Feature Comparison Table */}
        <section className="w-full max-w-[960px] px-4 pb-20 @container">
          <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white w-1/4">
                      Características
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 dark:text-white w-1/4">
                      Básico
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-primary w-1/4">
                      Profesional
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 dark:text-white w-1/4">
                      Empresarial
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {[
                    {
                      feature: "Agenda Online",
                      basic: "check",
                      pro: "check",
                      enterprise: "check",
                    },
                    {
                      feature: "Recordatorios SMS",
                      basic: "remove",
                      pro: "check",
                      enterprise: "check",
                    },
                    {
                      feature: "Pagos con Tarjeta",
                      basic: "remove",
                      pro: "Sí (2.5% comisión)",
                      enterprise: "Sí (1.5% comisión)",
                    },
                    {
                      feature: "App Móvil Clientes",
                      basic: "remove",
                      pro: "check",
                      enterprise: "Marca Blanca",
                    },
                    {
                      feature: "Soporte Técnico",
                      basic: "Email",
                      pro: "Chat en vivo",
                      enterprise: "24/7 Dedicado",
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        {row.basic === "check" ? (
                          <span
                            className="material-symbols-outlined text-green-500"
                            style={{ fontSize: "20px" }}
                          >
                            check
                          </span>
                        ) : row.basic === "remove" ? (
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "20px" }}
                          >
                            remove
                          </span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">
                            {row.basic}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        {row.pro === "check" ? (
                          <span
                            className="material-symbols-outlined text-green-500"
                            style={{ fontSize: "20px" }}
                          >
                            check
                          </span>
                        ) : (
                          <span className="text-slate-800 dark:text-slate-200">
                            {row.pro}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        {row.enterprise === "check" ? (
                          <span
                            className="material-symbols-outlined text-green-500"
                            style={{ fontSize: "20px" }}
                          >
                            check
                          </span>
                        ) : (
                          <span className="text-slate-800 dark:text-slate-200">
                            {row.enterprise}
                          </span>
                        )}
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
      <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 mt-auto">
        <div className="max-w-[960px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="size-6 text-primary">
              <span className="material-symbols-outlined">content_cut</span>
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-lg">
              BarberApp
            </span>
          </div>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm"
            >
              Privacidad
            </Link>
            <Link
              href="#"
              className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm"
            >
              Términos
            </Link>
            <Link
              href="#"
              className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm"
            >
              Instagram
            </Link>
          </div>
          <p className="text-slate-400 dark:text-slate-600 text-sm">
            © 2023 BarberApp Inc.
          </p>
        </div>
      </footer>
    </>
  );
}
