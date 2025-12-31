import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  BadgeCheck,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  Clock,
  UserPlus,
  Star,
  Play,
  MoreHorizontal,
  MessageSquare,
  BellRing,
  ChevronRight,
  ScissorsLineDashed,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full p-6">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-8">
            {/* Shop Profile */}
            <div className="flex items-center gap-3 px-2">
              <div className="relative size-12 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=100&h=100&fit=crop"
                  className="rounded-full object-cover border-2 border-blue-600 shadow-sm"
                  alt="Shop Profile"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 size-4 rounded-full border-2 border-white dark:border-slate-900"></div>
              </div>
              <div className="overflow-hidden">
                <h1 className="text-base font-bold truncate">Barbería Elite</h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full uppercase">
                  <BadgeCheck size={10} /> Plan Pro
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              <SidebarLink
                href="#"
                icon={<LayoutDashboard size={20} />}
                label="Panel de Control"
                active
              />
              <SidebarLink
                href="#"
                icon={<Calendar size={20} />}
                label="Calendario"
              />
              <SidebarLink
                href="#"
                icon={<Users size={20} />}
                label="Clientes"
              />
              <SidebarLink
                href="#"
                icon={<Scissors size={20} />}
                label="Servicios"
              />
              <SidebarLink
                href="#"
                icon={<BadgeCheck size={20} />}
                label="Personal"
              />
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-1 pt-6 border-t border-slate-100 dark:border-slate-800">
            <SidebarLink
              href="#"
              icon={<Settings size={20} />}
              label="Configuración"
            />
            <SidebarLink
              href="#"
              icon={<LogOut size={20} />}
              label="Cerrar Sesión"
              variant="danger"
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex-none flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Hola, Barbería Elite 👋
            </h2>
            <p className="text-slate-500 text-sm">
              Resumen de hoy, 24 de Octubre
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-blue-600 relative">
              <BellRing size={20} />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 font-bold text-sm">
              <Plus size={18} />
              Nueva Reserva
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Ingresos hoy"
              value="$450.00"
              change="+12%"
              icon={<TrendingUp size={16} />}
              color="emerald"
            />
            <StatCard
              title="Citas hoy"
              value="12"
              change="0%"
              icon={<Clock size={16} />}
              color="blue"
            />
            <StatCard
              title="Clientes nuevos"
              value="3"
              change="+1"
              icon={<UserPlus size={16} />}
              color="violet"
            />
            <StatCard
              title="Satisfacción"
              value="4.9"
              change="+0.2%"
              icon={<Star size={16} />}
              color="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Appointments */}
            <div className="lg:col-span-2 space-y-8">
              {/* Next Appointment Card */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <BellRing className="text-blue-600" size={20} /> Próxima Cita
                </h3>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
                      className="w-full md:w-32 h-32 object-cover rounded-xl"
                      alt="Cliente"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold">Carlos Ruiz</h4>
                          <p className="text-slate-500 text-sm italic">
                            Cliente frecuente • 14 visitas
                          </p>
                        </div>
                        <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-black border border-blue-100 dark:border-blue-800">
                          14:00 PM
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Tag
                          icon={<Scissors size={12} />}
                          text="Corte Clásico"
                        />
                        <Tag
                          icon={<ScissorsLineDashed size={12} />}
                          text="Barba"
                        />
                        <Tag
                          icon={<Users size={12} />}
                          text="Barbero: Miguel"
                        />
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold text-sm transition-colors">
                          <Play size={16} fill="currentColor" /> Iniciar
                          Servicio
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Schedule List */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Resto del día</h3>
                  <button className="text-sm font-bold text-blue-600">
                    Ver todo
                  </button>
                </div>
                <div className="space-y-3">
                  <AppointmentItem
                    time="15:00"
                    name="Pedro Sanchez"
                    service="Corte • 45 min"
                    barber="Juan"
                    img="3"
                  />
                  <AppointmentItem
                    time="16:15"
                    name="Andrés López"
                    service="Barba • 30 min"
                    barber="Miguel"
                    img="4"
                  />
                  <AppointmentItem
                    time="17:00"
                    name="Roberto Gómez"
                    service="Corte & Barba • 1h"
                    barber="Juan"
                    img="5"
                    opacity
                  />
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold">Accesos Rápidos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <QuickActionButton icon={<UserPlus />} label="Walk-in" />
                  <QuickActionButton icon={<Clock />} label="Bloqueo" />
                  <QuickActionButton icon={<Calendar />} label="Staff" />
                  <QuickActionButton icon={<TrendingUp />} label="Gastos" />
                </div>
              </section>

              {/* Staff Status */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold">Personal</h3>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
                  <StaffItem
                    name="Juan"
                    status="Disponible"
                    color="emerald"
                    img="6"
                  />
                  <StaffItem
                    name="Miguel"
                    status="En servicio (15m)"
                    color="red"
                    img="7"
                  />
                  <StaffItem
                    name="Sara"
                    status="Ausente"
                    color="slate"
                    img="8"
                  />
                </div>
              </section>

              {/* Marketing Card */}
              <div className="bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-blue-500/20 group">
                <div className="absolute -top-10 -right-10 bg-white/10 size-32 rounded-full group-hover:scale-110 transition-transform"></div>
                <h4 className="font-bold text-lg mb-2 relative z-10">
                  ¡Aumenta tus ventas!
                </h4>
                <p className="text-blue-100 text-sm mb-4 relative z-10">
                  Hay 5 clientes que no vienen hace 30 días. Envíales un cupón.
                </p>
                <button className="w-full bg-white text-blue-600 font-bold py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors relative z-10">
                  Crear Promoción
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- SUB-COMPONENTES PARA LIMPIAR EL CÓDIGO --- */

function SidebarLink({
  href,
  icon,
  label,
  active = false,
  variant = "default",
}) {
  const baseStyles =
    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm";
  const variants = {
    default: active
      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
    danger: "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10",
  };

  return (
    <Link href={href} className={`${baseStyles} ${variants[variant]}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function StatCard({ title, value, change, icon, color }) {
  const colors = {
    emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    violet: "text-violet-500 bg-violet-50 dark:bg-violet-900/20",
    amber: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <span className={`p-2 rounded-lg ${colors[color]}`}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-black">{value}</h4>
        <span className="text-[10px] font-bold text-emerald-500">{change}</span>
      </div>
    </div>
  );
}

function AppointmentItem({
  time,
  name,
  service,
  barber,
  img,
  opacity = false,
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-all cursor-pointer ${
        opacity ? "opacity-50" : ""
      }`}
    >
      <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg text-center min-w-[65px]">
        <span className="block text-xs font-black">{time}</span>
        <span className="text-[10px] text-slate-500 uppercase">PM</span>
      </div>
      <div className="flex-1">
        <h5 className="font-bold text-sm">{name}</h5>
        <p className="text-xs text-slate-500">{service}</p>
      </div>
      <div className="flex items-center gap-2">
        <img
          src={`https://i.pravatar.cc/150?u=${img}`}
          className="size-6 rounded-full border border-white"
          alt={barber}
        />
        <span className="text-xs font-medium text-slate-600">{barber}</span>
      </div>
      <ChevronRight size={16} className="text-slate-300" />
    </div>
  );
}

function Tag({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700">
      {icon} {text}
    </span>
  );
}

function QuickActionButton({ icon, label }) {
  return (
    <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-600 hover:text-blue-600 transition-all gap-2">
      <span className="text-slate-400 group-hover:text-blue-600">{icon}</span>
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}

function StaffItem({ name, status, color, img }) {
  const statusColors = {
    emerald: "bg-emerald-500",
    red: "bg-red-500",
    slate: "bg-slate-400",
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={`https://i.pravatar.cc/150?u=${img}`}
            className="size-10 rounded-full object-cover"
            alt={name}
          />
          <div
            className={`absolute bottom-0 right-0 size-3 ${statusColors[color]} border-2 border-white dark:border-slate-900 rounded-full`}
          ></div>
        </div>
        <div>
          <p className="text-sm font-bold">{name}</p>
          <p className="text-[11px] text-slate-500 font-medium">{status}</p>
        </div>
      </div>
      <button className="p-2 text-slate-400 hover:text-blue-600">
        <MessageSquare size={18} />
      </button>
    </div>
  );
}
