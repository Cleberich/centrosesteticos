"use client";

import React, { useState } from "react";
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
  X,
  Search,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  // --- ESTADOS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("hoy");
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      time: "15:00",
      name: "Pedro Sanchez",
      service: "Corte • 45 min",
      barber: "Juan",
      status: "pendiente",
      img: "3",
    },
    {
      id: 2,
      time: "16:15",
      name: "Andrés López",
      service: "Barba • 30 min",
      barber: "Miguel",
      status: "pendiente",
      img: "4",
    },
    {
      id: 3,
      time: "17:00",
      name: "Roberto Gómez",
      service: "Corte & Barba • 1h",
      barber: "Juan",
      status: "pendiente",
      img: "5",
    },
  ]);

  // --- LÓGICA ---
  const filteredAppointments = appointments.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAppointment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newApp = {
      id: Date.now(),
      name: formData.get("clientName"),
      service: formData.get("service") + " • 30 min",
      time: formData.get("time"),
      barber: "Juan",
      status: "pendiente",
      img: "1",
    };
    setAppointments(
      [...appointments, newApp].sort((a, b) => a.time.localeCompare(b.time))
    );
    setIsModalOpen(false);
  };

  const deleteAppointment = (id) => {
    if (confirm("¿Estás seguro de cancelar esta cita?")) {
      setAppointments(appointments.filter((app) => app.id !== id));
    }
  };

  const completeService = (id) => {
    alert("¡Servicio iniciado con éxito!");
    // Aquí podrías cambiar el estado a 'en proceso'
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      {/* Sidebar (Igual al anterior pero con funcionalidad de navegación) */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full p-6">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <img
                src="https://i.pravatar.cc/100?u=shop"
                className="size-12 rounded-full border-2 border-blue-600"
                alt="Logo"
              />
              <div>
                <h1 className="text-base font-bold truncate">Barbería Elite</h1>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                  Plan Pro
                </span>
              </div>
            </div>
            <nav className="space-y-1">
              <SidebarLink
                href="#"
                icon={<LayoutDashboard size={20} />}
                label="Panel de Control"
                active
              />
              <SidebarLink
                href="/dashboard/calendar"
                icon={<Calendar size={20} />}
                label="Calendario"
              />
              <SidebarLink
                href="#"
                icon={<Users size={20} />}
                label="Clientes"
              />
              <SidebarLink
                href="/dashboard/services"
                icon={<Scissors size={20} />}
                label="Servicios"
              />
            </nav>
          </div>
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header con Buscador Real */}
        <header className="flex-none flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl w-96 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar cliente por nombre..."
              className="bg-transparent border-none outline-none ml-3 text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 font-bold text-sm"
            >
              <Plus size={18} /> Nueva Reserva
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Stats Dinámicos */}
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
              value={appointments.length.toString()}
              change="Refrescado"
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
            <div className="lg:col-span-2 space-y-8">
              {/* Próxima Cita con Interacción */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <BellRing className="text-blue-600" size={20} /> En este
                  momento
                </h3>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-6 relative z-10">
                    <img
                      src="https://i.pravatar.cc/150?u=carlos"
                      className="size-24 rounded-2xl object-cover border-2 border-white/20"
                      alt="C"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-2xl font-bold">Carlos Ruiz</h4>
                          <p className="text-blue-100 text-sm">
                            Corte Clásico + Barba
                          </p>
                        </div>
                        <div className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-md">
                          14:00 PM
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => completeService(1)}
                          className="flex-1 bg-white text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg"
                        >
                          Iniciar Servicio
                        </button>
                        <button className="px-4 py-3 bg-blue-500 rounded-xl hover:bg-blue-400 transition-colors">
                          <MessageSquare size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Lista Filtrable */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex gap-6">
                    <button
                      onClick={() => setActiveTab("hoy")}
                      className={`text-sm font-bold pb-2 transition-all ${
                        activeTab === "hoy"
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-slate-400"
                      }`}
                    >
                      Hoy ({filteredAppointments.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("pendientes")}
                      className={`text-sm font-bold pb-2 transition-all ${
                        activeTab === "pendientes"
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-slate-400"
                      }`}
                    >
                      Pendientes de Pago
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((app) => (
                      <AppointmentItem
                        key={app.id}
                        {...app}
                        onDelete={() => deleteAppointment(app.id)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                      <Search
                        className="mx-auto text-slate-300 mb-2"
                        size={40}
                      />
                      <p className="text-slate-500 text-sm">
                        No se encontraron citas con ese nombre.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar Derecho (Staff & Acciones) */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-lg font-bold">Estado del Personal</h3>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-sm">
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
                </div>
              </section>

              <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="size-20 bg-blue-600/20 absolute -right-4 -top-4 rounded-full blur-2xl"></div>
                <h4 className="font-bold mb-2">Tip del día 💡</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Los clientes que reciben recordatorios por WhatsApp tienen un
                  40% menos de probabilidades de faltar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL DE NUEVA RESERVA --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Nueva Reserva
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Nombre del Cliente
                </label>
                <input
                  required
                  name="clientName"
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Hora
                  </label>
                  <input
                    required
                    name="time"
                    type="time"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Servicio
                  </label>
                  <select
                    name="service"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Corte</option>
                    <option>Barba</option>
                    <option>Combo Elite</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] mt-4"
              >
                Confirmar Reserva
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- SUB-COMPONENTES (Actualizados con props de acción) --- */

function SidebarLink({
  href,
  icon,
  label,
  active = false,
  variant = "default",
}) {
  const styles = active
    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900";
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm ${styles} ${
        variant === "danger" ? "text-red-500" : ""
      }`}
    >
      {icon} <span>{label}</span>
    </Link>
  );
}

function StatCard({ title, value, change, icon, color }) {
  const colorMap = {
    emerald: "text-emerald-500 bg-emerald-50",
    blue: "text-blue-500 bg-blue-50",
    violet: "text-violet-500 bg-violet-50",
    amber: "text-amber-500 bg-amber-50",
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <span className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-black">{value}</h4>
        <span className="text-[10px] font-bold text-emerald-500">{change}</span>
      </div>
    </div>
  );
}

function AppointmentItem({ time, name, service, barber, img, onDelete }) {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-all shadow-sm">
      <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg text-center min-w-[65px]">
        <span className="block text-xs font-black">{time}</span>
        <span className="text-[10px] text-slate-400 uppercase">PM</span>
      </div>
      <div className="flex-1">
        <h5 className="font-bold text-sm">{name}</h5>
        <p className="text-xs text-slate-500">{service}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <img
            src={`https://i.pravatar.cc/100?u=${img}`}
            className="size-6 rounded-full"
            alt="B"
          />
          <span className="text-xs font-medium text-slate-600">{barber}</span>
        </div>
        <button
          onClick={onDelete}
          className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

function StaffItem({ name, status, color, img }) {
  const colorMap = {
    emerald: "bg-emerald-500",
    red: "bg-red-500",
    slate: "bg-slate-400",
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={`https://i.pravatar.cc/100?u=${img}`}
            className="size-10 rounded-full"
            alt={name}
          />
          <div
            className={`absolute bottom-0 right-0 size-3 ${colorMap[color]} border-2 border-white dark:border-slate-900 rounded-full`}
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
