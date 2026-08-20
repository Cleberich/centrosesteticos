"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Calendar,
  Users,
  CreditCard,
  Plus,
  Search,
  Clock,
  Scissors,
  Eye,
  LogOut,
  LayoutDashboard,
  Stethoscope,
  MessageSquare,
  Star,
  Bell,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Filter,
  Check,
} from "lucide-react";

export default function AppEsteticaCRM() {
  const [view, setView] = useState("schedule"); // 'schedule' | 'clients' | 'doctors' | 'services' | 'payments' | 'reviews' | 'messages' | 'dashboard'
  const [selectedCategory, setSelectedCategory] = useState("all");

  // --- DATOS MOCK DEL CRM (Peluquería, Manicuría, Pestañas, Estética) ---
  const [appointments] = useState([
    {
      id: "APT-001",
      client: "Lucía Méndez",
      service: "Balayage + Nutrición",
      category: "peluqueria",
      specialist: "Carlos Ruiz",
      time: "09:00 AM",
      duration: "2h",
      station: "Sillón 02",
      badgeClass: "bg-[#ffd8d6] text-[#b33a3a] border-[#f5b8b5]",
    },
    {
      id: "APT-002",
      client: "Ana Paula Silva",
      service: "Kapping Gel + Nail Art",
      category: "manicuria",
      specialist: "Sofía Martínez",
      time: "10:00 AM",
      duration: "1h 30m",
      station: "Mesa 01",
      badgeClass: "bg-[#d1f4e0] text-[#1e7e4c] border-[#a8e6c1]",
    },
    {
      id: "APT-003",
      client: "Valeria Gómez",
      service: "Extensión Volumen Ruso",
      category: "pestanas",
      specialist: "Valentina Kohl",
      time: "11:00 AM",
      duration: "1h 45m",
      station: "Cabina 03",
      badgeClass: "bg-[#e2e8f0] text-[#334155] border-[#cbd5e1]",
    },
    {
      id: "APT-004",
      client: "Camila Torres",
      service: "Tratamiento Facial Botox",
      category: "estetica",
      specialist: "Dra. Emily Ross",
      time: "12:30 PM",
      duration: "1h",
      station: "Cabina 01",
      badgeClass: "bg-[#ffd8d6] text-[#b33a3a] border-[#f5b8b5]",
    },
  ]);

  const [clients] = useState([
    {
      id: "CLI-101",
      name: "Valeria Gómez",
      phone: "+598 99 123 456",
      visits: 12,
      lastVisit: "2026-08-10",
      alerts: "Alergia a adhesivos de cianocrilato (usar pegamento Sensitive)",
      lastService: "Lifting de Pestañas + Tinte",
      status: "VIP",
      doctor: "Valentina Kohl",
      time: "09:00 AM",
    },
    {
      id: "CLI-102",
      name: "Lucía Méndez",
      phone: "+598 98 654 321",
      visits: 5,
      lastVisit: "2026-08-15",
      alerts: "Cuero cabelludo sensible - Decoloración máxima 20 vol.",
      lastService: "Balayage",
      status: "Completado",
      doctor: "Carlos Ruiz",
      time: "11:30 AM",
    },
  ]);

  const [specialists] = useState([
    {
      id: "ESP-001",
      name: "Dra. Olivia Grant",
      specialty: "Estética Facial & Botox",
      phone: "+598 99 000 111",
      rating: 4.9,
      reviews: "215",
    },
    {
      id: "ESP-002",
      name: "Carlos Ruiz",
      specialty: "Peluquería & Colorimetría",
      phone: "+598 99 222 333",
      rating: 4.8,
      reviews: "198",
    },
    {
      id: "ESP-003",
      name: "Valentina Kohl",
      specialty: "Especialista en Pestañas & Cejas",
      phone: "+598 99 444 555",
      rating: 4.9,
      reviews: "310",
    },
  ]);

  return (
    <div className="flex min-h-screen bg-[#fcf8f7] text-[#334155] font-sans antialiased">
      {/* SIDEBAR (ESTILO BYUTIE) */}
      <aside className="w-60 min-h-screen bg-white border-r border-[#f1e9e7] p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2">
            <div className="w-6 h-6 rounded-md bg-[#22c55e]/20 text-[#16a34a] flex items-center justify-center font-bold text-xs">
              ✦
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              byutie
            </span>
          </div>

          {/* Menú de Navegación */}
          <nav className="space-y-1">
            {[
              {
                id: "dashboard",
                label: "Dashboard",
                icon: <LayoutDashboard size={16} />,
              },
              { id: "clients", label: "Clientes", icon: <Users size={16} /> },
              {
                id: "doctors",
                label: "Especialistas",
                icon: <Stethoscope size={16} />,
              },
              {
                id: "schedule",
                label: "Agenda & Turnos",
                icon: <Calendar size={16} />,
              },
              {
                id: "services",
                label: "Tratamientos",
                icon: <Sparkles size={16} />,
              },
              { id: "reviews", label: "Reseñas", icon: <Star size={16} /> },
              {
                id: "payments",
                label: "Caja & Pagos",
                icon: <CreditCard size={16} />,
              },
              {
                id: "messages",
                label: "Mensajes",
                icon: <MessageSquare size={16} />,
                badge: 8,
              },
            ].map((item) => {
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#c6f6d5] text-[#15803d]"
                      : "text-[#94a3b8] hover:bg-[#f8fafc] hover:text-[#475569]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#f87171] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tarjeta Promocional Inferior */}
        <div className="space-y-4">
          <div className="bg-[#fde8e8] border border-[#fbd5d5] p-4 rounded-2xl space-y-3">
            <p className="text-[11px] leading-relaxed text-[#475569] font-medium">
              Sincronización automática de WhatsApp Bot activada para
              confirmación de turnos.
            </p>
            <button className="w-full py-1.5 bg-[#86efac] hover:bg-[#4ade80] text-[#14532d] rounded-full text-[11px] font-bold transition-all">
              Ver Actualizaciones
            </button>
          </div>

          <button
            onClick={() => setView("schedule")}
            className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-[#94a3b8] hover:text-[#475569] transition-colors w-full"
          >
            <LogOut size={15} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER SUPERIOR */}
        <header className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold text-slate-900">
            {view === "schedule" && "Agenda & Horarios de Turnos"}
            {view === "clients" && "Fichas de Clientes"}
            {view === "doctors" && "Especialistas & Esteticistas"}
            {view === "services" && "Catálogo de Tratamientos"}
            {view === "payments" && "Caja & Reportes Financieros"}
            {view === "reviews" && "Reseñas & Opiniones"}
            {view === "messages" && "Mensajería & WhatsApp"}
            {view === "dashboard" && "Panel General"}
          </h1>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-white border border-[#f1e9e7] text-slate-400 hover:text-slate-600">
              <Bell size={16} />
            </button>

            <div className="flex items-center gap-2.5 bg-white pl-2 pr-3 py-1 rounded-full border border-[#f1e9e7]">
              <div className="w-7 h-7 rounded-full bg-rose-200 overflow-hidden flex items-center justify-center font-bold text-xs text-rose-700">
                A
              </div>
              <span className="text-xs font-bold text-slate-800">
                Anahera Jones
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* ==========================================
            VISTA 1: AGENDA (SURGERY SCHEDULE)
        ========================================== */}
        {view === "schedule" && (
          <div className="space-y-4">
            {/* Barra de Filtros */}
            <div className="bg-white p-4 rounded-2xl border border-[#f1e9e7] space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: "all", label: "Todos" },
                    { id: "peluqueria", label: "Peluquería" },
                    { id: "manicuria", label: "Manicuría" },
                    { id: "pestanas", label: "Pestañas" },
                    { id: "estetica", label: "Estética Facial" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                        selectedCategory === cat.id
                          ? "bg-[#f8fafc] border-slate-300 text-slate-800"
                          : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Check
                        size={12}
                        className={
                          selectedCategory === cat.id
                            ? "opacity-100"
                            : "opacity-0"
                        }
                      />
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-slate-200 rounded-full px-3 py-1 text-xs text-slate-600 font-medium cursor-pointer">
                    <span>Todas las Estaciones</span>
                    <ChevronDown size={14} className="ml-1 text-slate-400" />
                  </div>
                  <div className="flex bg-[#e2e8f0] p-0.5 rounded-full text-[11px] font-bold text-slate-600">
                    <button className="px-2.5 py-0.5 rounded-full bg-[#86efac] text-slate-900">
                      Día
                    </button>
                    <button className="px-2.5 py-0.5 rounded-full">
                      Semana
                    </button>
                    <button className="px-2.5 py-0.5 rounded-full">Mes</button>
                  </div>
                </div>
              </div>

              {/* Días de la semana */}
              <div className="grid grid-cols-6 gap-2 pt-2 border-t border-slate-100 text-center">
                {[
                  { day: "Lunes", date: "18" },
                  { day: "Martes", date: "19" },
                  { day: "Miércoles", date: "20" },
                  { day: "Jueves", date: "21" },
                  { day: "Viernes", date: "22" },
                  { day: "Sábado", date: "23" },
                ].map((d, i) => (
                  <div key={i} className="py-1">
                    <p className="text-[11px] font-medium text-slate-400">
                      {d.day}
                    </p>
                    <p className="text-sm font-extrabold text-slate-800">
                      {d.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid Bloques de Agenda */}
            <div className="bg-white p-6 rounded-2xl border border-[#f1e9e7] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments
                .filter(
                  (app) =>
                    selectedCategory === "all" ||
                    app.category === selectedCategory,
                )
                .map((app) => (
                  <div
                    key={app.id}
                    className={`p-4 rounded-xl border ${app.badgeClass} space-y-2 relative`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold opacity-80">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {app.time} ({app.duration})
                      </span>
                      <span>{app.station}</span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {app.client} - {app.service}
                      </h4>
                      <p className="text-[11px] font-semibold opacity-80 mt-1">
                        Especialista: {app.specialist}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ==========================================
            VISTA 2: CLIENTES / PACIENTES
        ========================================== */}
        {view === "clients" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Buscar cliente, alergia, servicio..."
                  className="w-full pl-9 pr-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none"
                />
              </div>
              <button className="flex items-center gap-1.5 bg-[#86efac] text-slate-900 text-xs font-bold px-4 py-2 rounded-full">
                <Plus size={14} /> Nuevo Cliente
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#f1e9e7] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold">
                  <tr>
                    <th className="p-3.5 pl-6">ID Cliente</th>
                    <th className="p-3.5">Nombre</th>
                    <th className="p-3.5">Teléfono / Alerta</th>
                    <th className="p-3.5">Especialista</th>
                    <th className="p-3.5">Último Servicio</th>
                    <th className="p-3.5 pr-6">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {clients.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 pl-6 text-slate-400 font-bold">
                        {c.id}
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">
                        {c.name}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        <div>{c.phone}</div>
                        <div className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle size={10} /> {c.alerts}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600">{c.doctor}</td>
                      <td className="p-3.5 text-slate-600">{c.lastService}</td>
                      <td className="p-3.5 pr-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            c.status === "VIP"
                              ? "bg-[#d1f4e0] text-[#1e7e4c]"
                              : "bg-[#ffd8d6] text-[#b33a3a]"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            VISTA 3: ESPECIALISTAS (DOCTORS)
        ========================================== */}
        {view === "doctors" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialists.map((esp) => (
              <div
                key={esp.id}
                className="bg-white p-5 rounded-2xl border border-[#f1e9e7] space-y-3 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-rose-100 mx-auto flex items-center justify-center font-bold text-rose-600 text-lg">
                  {esp.name[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {esp.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {esp.specialty}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{esp.phone}</p>
                </div>
                <div className="pt-2 border-t border-slate-50 flex items-center justify-center gap-1 text-xs font-bold text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span>{esp.rating}</span>
                  <span className="text-slate-400 font-normal">
                    ({esp.reviews} reseñas)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==========================================
            VISTA 4: TRATAMIENTOS / SERVICIOS
        ========================================== */}
        {view === "services" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Peluquería",
                icon: <Scissors size={20} />,
                count: "12 Servicios",
                color: "bg-amber-50 text-amber-700",
              },
              {
                title: "Manicuría",
                icon: <Sparkles size={20} />,
                count: "8 Servicios",
                color: "bg-emerald-50 text-emerald-700",
              },
              {
                title: "Pestañas & Cejas",
                icon: <Eye size={20} />,
                count: "6 Servicios",
                color: "bg-rose-50 text-rose-700",
              },
            ].map((cat, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-[#f1e9e7] space-y-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center font-bold`}
                >
                  {cat.icon}
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {cat.count}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ==========================================
            VISTA 5: PAGOS & FINANZAS
        ========================================== */}
        {view === "payments" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                {
                  title: "Facturación Total",
                  value: "$81,500",
                  change: "+2.45%",
                  isUp: true,
                },
                {
                  title: "Cobrado Hoy",
                  value: "$43,000",
                  change: "+3.68%",
                  isUp: true,
                },
                {
                  title: "Pendiente",
                  value: "$20,500",
                  change: "-1.20%",
                  isUp: false,
                },
                {
                  title: "Comisiones Staff",
                  value: "$18,000",
                  change: "+0.84%",
                  isUp: true,
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-2xl border border-[#f1e9e7] space-y-1"
                >
                  <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                    <span>{card.title}</span>
                    <span
                      className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        card.isUp
                          ? "bg-[#d1f4e0] text-[#1e7e4c]"
                          : "bg-[#ffd8d6] text-[#b33a3a]"
                      }`}
                    >
                      {card.isUp ? (
                        <ArrowUpRight size={10} />
                      ) : (
                        <ArrowDownRight size={10} />
                      )}{" "}
                      {card.change}
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#f1e9e7] p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-xs">
                Transacciones Recientes
              </h3>
              <div className="divide-y divide-slate-50 text-xs font-medium">
                {[
                  {
                    id: "INV-001",
                    name: "Lucía Méndez",
                    treatment: "Balayage + Nutrición",
                    method: "Tarjeta de Crédito",
                    amount: "$3,500",
                    status: "Cobrado",
                  },
                  {
                    id: "INV-002",
                    name: "Ana Paula Silva",
                    treatment: "Kapping Gel",
                    method: "Mercado Pago",
                    amount: "$1,200",
                    status: "Cobrado",
                  },
                  {
                    id: "INV-003",
                    name: "Valeria Gómez",
                    treatment: "Volumen Ruso",
                    method: "Efectivo",
                    amount: "$2,800",
                    status: "Cobrado",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="py-3 flex items-center justify-between"
                  >
                    <span className="font-bold text-slate-400">{row.id}</span>
                    <span className="font-bold text-slate-800">{row.name}</span>
                    <span className="text-slate-500">{row.treatment}</span>
                    <span className="text-slate-400">{row.method}</span>
                    <span className="font-bold text-slate-900">
                      {row.amount}
                    </span>
                    <span className="bg-[#d1f4e0] text-[#1e7e4c] font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VISTAS MOCK SECUNDARIAS */}
        {(view === "reviews" ||
          view === "messages" ||
          view === "dashboard") && (
          <div className="bg-white p-12 rounded-2xl border border-[#f1e9e7] text-center space-y-3">
            <div className="w-10 h-10 bg-[#c6f6d5] text-[#15803d] rounded-full flex items-center justify-center mx-auto">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold text-sm text-slate-800">
              Módulo {view.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Sección adaptada al diseño visual de Byutie.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
