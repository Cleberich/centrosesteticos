// app/register/page.js
import Link from "next/link";

export default function RegisterPage() {
  return (
    <>
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <div className="size-8 text-primary">
            <svg
              className="w-full h-full"
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
            BarberManager
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden md:flex items-center gap-9">
            <Link
              href="/"
              className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/#features"
              className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors"
            >
              Funcionalidades
            </Link>
            <Link
              href="/#pricing"
              className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors"
            >
              Precios
            </Link>
            <Link
              href="/soporte"
              className="text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium leading-normal transition-colors"
            >
              Soporte
            </Link>
          </div>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
            <span className="truncate">Iniciar Sesión</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-10 px-4 md:px-10 lg:px-40 w-full max-w-[1440px] mx-auto">
        {/* Heading Section */}
        <div className="w-full max-w-[960px] flex flex-col gap-6 mb-8">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                Registra tu Barbería
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                Únete a la plataforma líder y gestiona tus reservas
                profesionalmente.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-lg">lock</span>
              <span>Registro 100% Seguro</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-medium text-slate-900 dark:text-white">
              <span>Progreso del registro</span>
              <span>Paso 1 de 3</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: "33%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[960px] grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Section 1: General Info */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">storefront</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Información del Negocio
                </h2>
              </div>
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Nombre de la Barbería
                    </span>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                      placeholder="Ej. Barbería El Caballero"
                      type="text"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Correo Electrónico Comercial
                    </span>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                      placeholder="contacto@barberia.com"
                      type="email"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    Dirección Completa
                  </span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">
                      location_on
                    </span>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                      placeholder="Calle Principal 123, Local 4"
                      type="text"
                    />
                  </div>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Ciudad
                    </span>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                      placeholder="Ciudad de México"
                      type="text"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Teléfono
                    </span>
                    <input
                      className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                      placeholder="+52 55 1234 5678"
                      type="tel"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Section 2: Hours */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Horario de Atención
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Define tu horario estándar. Podrás añadir excepciones más
                  tarde.
                </p>

                {[
                  { day: "Lunes", open: true },
                  { day: "Martes", open: true },
                  {
                    day: "Sábado",
                    open: true,
                    altOpen: "10:00 AM",
                    altClose: "04:00 PM",
                  },
                  { day: "Domingo", open: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-50 dark:border-slate-700/50 last:border-0 ${
                      !item.open ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 w-32">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-primary focus:ring-primary size-5"
                        defaultChecked={item.open}
                        disabled={!item.open}
                      />
                      <span className="text-slate-900 dark:text-white font-medium">
                        {item.day}
                      </span>
                    </div>
                    {item.open ? (
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <select className="rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                          <option>{item.altOpen || "09:00 AM"}</option>
                          <option>10:00 AM</option>
                        </select>
                        <span className="text-slate-400">-</span>
                        <select className="rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                          <option>{item.altClose || "06:00 PM"}</option>
                          <option>08:00 PM</option>
                        </select>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-slate-500">
                        Cerrado
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Plan Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">
                    workspace_premium
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Selecciona tu Plan
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Inicial
                  </h3>
                  <div className="my-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      $29
                    </span>
                    <span className="text-xs text-slate-500">/mes</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-green-500">
                        check
                      </span>{" "}
                      1 Barbero
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-green-500">
                        check
                      </span>{" "}
                      50 Reservas/mes
                    </li>
                  </ul>
                  <input
                    className="w-full text-primary focus:ring-primary"
                    name="plan"
                    type="radio"
                  />
                </div>

                {/* Pro (Recomendado) */}
                <div className="relative border-2 border-primary rounded-lg p-4 cursor-pointer bg-blue-50/30 dark:bg-blue-900/10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                    Recomendado
                  </div>
                  <h3 className="font-bold text-primary">Profesional</h3>
                  <div className="my-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      $49
                    </span>
                    <span className="text-xs text-slate-500">/mes</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-green-500">
                        check
                      </span>{" "}
                      3 Barberos
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-green-500">
                        check
                      </span>{" "}
                      Reservas Ilimitadas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-green-500">
                        check
                      </span>{" "}
                      Recordatorios SMS
                    </li>
                  </ul>
                  <input
                    className="w-full text-primary focus:ring-primary"
                    name="plan"
                    type="radio"
                    defaultChecked
                  />
                </div>

                {/* Enterprise */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Empresa
                  </h3>
                  <div className="my-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      $99
                    </span>
                    <span className="text-xs text-slate-500">/mes</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-green-500">
                        check
                      </span>{" "}
                      Barberos Ilimitados
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-green-500">
                        check
                      </span>{" "}
                      App Personalizada
                    </li>
                  </ul>
                  <input
                    className="w-full text-primary focus:ring-primary"
                    name="plan"
                    type="radio"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2">
                <span>Continuar al Pago</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Right Column: Summary & Image */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="sticky top-24 space-y-6">
              {/* Image Card */}
              <div className="rounded-xl overflow-hidden shadow-sm h-48 relative group">
                <img
                  alt="Interior de barbería moderna y elegante"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKD_blW_JGWbX8QwR0e_8w3afF-vX-zA22U7H7XOSFIXlQ3DYy1oFEdQ4lQhH08jFN0vSdkyjMXTv1G7R35BkNUODrZhgET35UkN_DXQD0hJppHO971WEvb2TF3L8VOLc8sTXxRgA71yPsHm_pWLhUAS6HzhXbjhDA8rrNq1p2G9zgigMkeqTxurWt-mNN70xAUmhRdJNg73eP80WmoM-aGZNlK38H7bFIOhxFpLCZ6neG7hmRlpRLTF-K2pD1mDaNtpHUQ8gfn_Zk"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <p className="text-white text-sm font-medium">
                    Únete a más de 2,000 barberías exitosas.
                  </p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Resumen
                </h3>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Plan Seleccionado:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Profesional
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Precio Mensual:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    $49.00
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 text-lg">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Total a Pagar:
                  </span>
                  <span className="font-black text-primary">$49.00</span>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex gap-3 items-start mt-2">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                    verified_user
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Garantía de devolución de 30 días. Puedes cancelar en
                    cualquier momento.
                  </p>
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                  ¿Necesitas ayuda?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Si tienes dudas sobre el proceso de registro, contáctanos.
                </p>
                <Link
                  href="/soporte"
                  className="text-sm text-primary font-bold hover:underline flex items-center gap-1"
                >
                  Contactar Soporte
                  <span className="material-symbols-outlined text-sm">
                    open_in_new
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
