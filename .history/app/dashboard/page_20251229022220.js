// app/dashboard/page.js
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full flex-row overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark h-full justify-between p-4">
        <div className="flex flex-col gap-4">
          {/* Shop Profile */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-sm border border-slate-200 dark:border-slate-700"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCd0Tfh5LsSV45UhdH1bBQ_wKukeFCCK0ztKcYJLpYYxOQpHhvdAsRcAgjYEGEGnWjFxZavBfN0kP4ryWoucBn0-b9RpcGXsr5d3aDas2U4DCbGSAj1Rj1VzFe6RIInUqbT5eZeQ8Xm9pL7UftmyV1Cex3WrCgtL7NfeXurcr0eqOtrFo0ZSJQ_FDXbstT_fXHuHfoVdGsZjISqS_SZqFL0ncqMW7YlsnGe4SJISMWbqcwm-rMZGuyrOHNYq-gjOZFMUhC-pr5iMaXq")',
              }}
            ></div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-normal text-slate-900 dark:text-white">
                Barbería Elite
              </h1>
              <span className="text-primary text-xs font-semibold bg-primary/10 px-2 py-0.5 rounded-full w-fit">
                Plan Pro
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 mt-4">
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary"
            >
              <span className="material-symbols-outlined icon-filled">
                dashboard
              </span>
              <p className="text-sm font-semibold">Panel de Control</p>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined">calendar_month</span>
              <p className="text-sm font-medium">Calendario</p>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined">group</span>
              <p className="text-sm font-medium">Clientes</p>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined">content_cut</span>
              <p className="text-sm font-medium">Servicios</p>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined">badge</span>
              <p className="text-sm font-medium">Personal</p>
            </Link>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-1">
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
            <p className="text-sm font-medium">Configuración</p>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium">Cerrar Sesión</p>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="flex-none flex flex-wrap items-center justify-between gap-4 p-6 md:p-8 pb-4 bg-background-light dark:bg-background-dark">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl md:text-[32px] font-bold leading-tight tracking-tight">
              Hola, Barbería Elite
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">
              Resumen de hoy, 24 de Octubre
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="text-sm font-bold">Nueva Reserva</span>
          </button>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-0">
          <div className="flex flex-col gap-6 max-w-[1200px] mx-auto xl:mx-0">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Ingresos de hoy",
                  value: "$450.00",
                  change: "+12%",
                  color: "green",
                },
                {
                  title: "Citas programadas",
                  value: "12",
                  change: "0%",
                  color: "slate",
                },
                {
                  title: "Clientes nuevos",
                  value: "3",
                  change: "+1",
                  color: "green",
                },
                {
                  title: "Satisfacción",
                  value: "4.9",
                  change: "+0.2%",
                  color: "green",
                  icon: "star",
                  iconColor: "yellow",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-xl p-5 bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      {stat.title}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        stat.color === "green"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                    {stat.icon && (
                      <span
                        className={`material-symbols-outlined text-${stat.iconColor}-500 icon-filled text-xl`}
                      >
                        {stat.icon}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Appointments */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Next Appointment */}
                <section>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      notifications_active
                    </span>
                    Próxima Cita
                  </h3>
                  <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div
                        className="w-full md:w-48 aspect-video md:aspect-square bg-cover bg-center rounded-lg flex-shrink-0"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuByDLHAkIcD3Y1tGWmmwihQ_JZc_zZ8iwUwZiqa84cIqB13OD7DmEglOTKGX5gSr8HVdXN1MNMqiqZIRX1I2hgmh3WoVQG1aRHvgtPPLG9FIEXyXdnOuCaUbykIsxGyrO2xhMkFsWq3Ht2RN_z7IxyCiML42nPFu2zNok5luR4t_R7RbVuzANHgoZ2SGydeh0pcN7zKGcu15rKagXEvNN42oRTRuPjcVpV3n2t8Vt8GnME-WZnibfOS1JcXj5awIEWCEgi5uHRV5j_F")',
                        }}
                      ></div>
                      <div className="flex flex-col justify-between flex-1 py-1">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                Carlos Ruiz
                              </h4>
                              <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Cliente frecuente • 14 visitas
                              </p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 text-sm font-bold border border-blue-100 dark:border-blue-900/30">
                              14:00 PM
                            </span>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {[
                              { icon: "content_cut", text: "Corte Clásico" },
                              { icon: "face", text: "Barba" },
                              { icon: "badge", text: "Barbero: Miguel" },
                            ].map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {item.icon}
                                </span>
                                {item.text}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3 mt-5 md:mt-0">
                          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            <span>Iniciar Servicio</span>
                            <span className="material-symbols-outlined text-[18px]">
                              play_arrow
                            </span>
                          </button>
                          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Rest of the Day */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Resto del día
                    </h3>
                    <Link
                      href="#"
                      className="text-sm font-semibold text-primary hover:text-primary/80"
                    >
                      Ver calendario completo
                    </Link>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        time: "15:00",
                        name: "Pedro Sanchez",
                        service: "Corte de Cabello • 45 min",
                        barber: "Juan",
                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDp1wwrzYHH8wMjy5CFdp0s1GVUXERtI6vl3wLtZqmp53UhH-FbLmcQxgyWV0djbs73bKESt_S24In3r4a7wBehb03r8B7o8UHmcxECdLJbIntn-ayx-XVd62Vws7xPjMP_Xl_l2kAjSyNNy5LfDPG0lVlyOiC0_eCQw2EjTJZZDMmEIWiTlnQCSEnR8sfcWKg5xJpCJmrB2nrAgnte0PT5Hmy75UHeo4zyI4BCebF4h7cDF3FDGcnM1Ja8tDcUbaQ1fsJ8rpPRRDkH",
                      },
                      {
                        time: "16:15",
                        name: "Andrés López",
                        service: "Afeitado y Toalla Caliente • 30 min",
                        barber: "Miguel",
                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZGXOE-EleWFtBxDdQ6QgwibwwxZh3vRWd5G_Esg9fEjFlpAwQkH-ZBgMCFfxNHmjghieGSQ0n16pcZEdKMmFcGFCF5PQ1MBhnaPMP5ewzr19lJjDp3HwAhCz28hY3g5vQ1QDh6udcBOiSztF0vYKsqzCRA1vUqebF1Go-8aHHCj8012aiwRUCHxjI5iVm-NTfYWg83oM-vRZcV-Gm1M469KlViBhnznqa2KbxvWD9XNqQr9WyVgMgMP_0YlgKBFbnuLrdiJqw4t5o",
                      },
                      {
                        time: "17:00",
                        name: "Roberto Gómez",
                        service: "Corte Padre e Hijo • 1h 15m",
                        barber: "Juan",
                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHPQvhlWIM7jHgnz-qBqPYpKXkho2qW6ZFIRZV1nEsmv24-EgQajHYjTyp1WWziDzr1yLWbv2iI5RWhtLCzvXy6m8aFc1o2T9AxoMK9B9yFXSyinZt5gtuYlRUObDpAw-WAakke8NG069PZngCaa_9_T5gZ1e98QwQ9ku3YrgPf23C-fISsFZWzsYMjo1xswSh1NxmqqkCyZTw_dIKg6tZ2kyAY_rwu0QG8NbAhal5cRRGes3NJa-ap6zQBNSJdH5SYCxESaNT1Vlj",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-4 p-4 rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-800 hover:border-primary/30 transition-colors cursor-pointer group ${
                          i === 2 ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center min-w-[60px] bg-slate-50 dark:bg-slate-800 rounded-lg py-2 border border-slate-100 dark:border-slate-700">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.time}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            PM
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">
                            {item.name}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {item.service}
                          </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <div
                            className="bg-cover bg-center size-8 rounded-full border border-slate-200 dark:border-slate-700"
                            style={{ backgroundImage: `url("${item.img}")` }}
                          ></div>
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {item.barber}
                          </span>
                        </div>
                        <div className="text-slate-400 group-hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">
                            chevron_right
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Quick Actions & Staff */}
              <div className="flex flex-col gap-6">
                {/* Quick Actions */}
                <section>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    Accesos Rápidos
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        icon: "person_add",
                        label: "Cliente Walk-in",
                        active: true,
                      },
                      { icon: "block", label: "Bloquear Hora", active: true },
                      {
                        icon: "edit_calendar",
                        label: "Turnos Staff",
                        active: false,
                      },
                      { icon: "payments", label: "Gastos", active: false },
                    ].map((action, i) => (
                      <button
                        key={i}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors gap-2 text-center group`}
                      >
                        <span
                          className={`material-symbols-outlined text-3xl group-hover:scale-110 transition-transform ${
                            action.active ? "text-primary" : "text-slate-500"
                          }`}
                        >
                          {action.icon}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Staff Status */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Estado del Personal
                    </h3>
                    <button className="text-xs font-semibold text-slate-500 hover:text-primary">
                      Ver Todos
                    </button>
                  </div>
                  <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4">
                    {[
                      {
                        name: "Juan",
                        status: "Disponible",
                        color: "green",
                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsUBKuL77vDZtdCWVBAwHNg5vZDVi3PEX79CKj6JOVXHEbQMtu8boQkiKPCf7eBlJ3Sj3fEzi_PHWf3eW8SnOOU8_lZiRa4DTsHqEHBMKWROluYaiRaWI66NsX_v8fmx6iVXsRZp1eoDjYqSBJqwzHcJp4r_HvqiOpGKv2arjbR_Z8ZIgbYwmoq1ND8oLCRIeWiWCo59BnbMqNiObVyImtKt_U52f7p8zbsCIYWN_DxyBA4plI1CWCrZUl13QPcp8okJrPWs1NyaPj",
                      },
                      {
                        name: "Miguel",
                        status: "Ocupado (15m)",
                        color: "red",
                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuByNAMe3cmJU2jjKmQkkdLcsT2eoXpjPiu7iyRw848cCvv9HmmaR9hL8-H6eOGfGPb0Djw9EDXl35BvLGx3VzGJbX-dKtesxPla7ZoLDZSgSa93RhEoECzSq5YzYnkfysOxF3-TJCGQPgWS4k17JNqEKA97xkdDbCYg4BwFOARTFU-PWuUbyEdFDL8T-BU02VJCOy-jTnnPSfuH1IGUONgNhqUkbnyzKMab0P46TM0cskly0iLXmxUrRKytL84i3mSf4HjBDwpNjJ-Z",
                      },
                      {
                        name: "Sara",
                        status: "Fuera de turno",
                        color: "slate",
                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXsRX7oQj3nQMWa24TJLXNmqHRP-rFxnDUgLXd9F2I4GqPvnOEsDe7LyZ5lOSKPDvYYULHMHS5gFUx54NBhW0WIvkScBn6bUtaqxGbTti7_RAPTT5n_qk7uxQDAk_bPgUg5HvskT-AU2WbFuvPIS-LIvwIKo85NhLe3fy_eC1a_kX-vWZyEloJzQF0AU3YRcqdkSx8PCEza2rl2yx1cMz8dLl-57jyRkG88u9wBh-BD1VsD5c3tbUI-sQrxbW8_fhL2ZGmuwfsPw4Q",
                        grayscale: true,
                      },
                    ].map((staff, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div
                              className={`bg-cover bg-center size-10 rounded-full border border-slate-200 dark:border-slate-700 ${
                                staff.grayscale ? "grayscale" : ""
                              }`}
                              style={{ backgroundImage: `url("${staff.img}")` }}
                            ></div>
                            <div
                              className={`absolute bottom-0 right-0 size-3 bg-${staff.color}-500 border-2 border-white dark:border-card-dark rounded-full`}
                            ></div>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {staff.name}
                            </p>
                            <p
                              className={`text-xs font-medium ${
                                staff.color === "green"
                                  ? "text-green-600 dark:text-green-400"
                                  : staff.color === "red"
                                  ? "text-red-500"
                                  : "text-slate-500"
                              }`}
                            >
                              {staff.status}
                            </p>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-primary">
                          <span className="material-symbols-outlined text-[20px]">
                            chat
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Marketing Mini Card */}
                <div className="bg-gradient-to-br from-primary to-[#053db5] rounded-xl p-5 text-white flex flex-col gap-3 relative overflow-hidden shadow-lg shadow-primary/20">
                  <div className="absolute -top-6 -right-6 bg-white/10 size-24 rounded-full blur-xl"></div>
                  <div className="z-10">
                    <h4 className="font-bold text-base mb-1">
                      ¡Impulsa tus ventas!
                    </h4>
                    <p className="text-sm text-blue-100 mb-3">
                      Envía un descuento a los 5 clientes que no han venido en
                      30 días.
                    </p>
                    <button className="w-full bg-white text-primary text-xs font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors">
                      Crear Promoción
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
