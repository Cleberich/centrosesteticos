"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Menu,
  X,
  Calendar as CalendarIcon,
  Check,
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
  Filter,
} from "lucide-react";

export default function AppEsteticaLanding() {
  const [view, setView] = useState("schedule"); // 'schedule' | 'clients' | 'doctors' | 'services' | 'payments' | 'reviews' | 'messages' | 'dashboard'
  const [selectedCategory, setSelectedCategory] = useState("all");

  // --- DATOS MOCK ADAPTADOS A ESTÉTICA / PELUQUERÍA / PESTAÑAS / MANICURÍA ---
  const [appointments] = useState([
    {
      id: "APT-001",
      client: "Lucía Méndez",
      service: "Balayage + Nutrición",
      category: "peluqueria",
      specialist: "Dra. Olivia Grant",
      time: "09:00 AM",
      duration: "2h",
      station: "OR 1",
      badgeClass: "bg-[#ffd8d6] text-[#b33a3a] border-[#f5b8b5]",
    },
    {
      id: "APT-002",
      client: "Ana Paula Silva",
      service: "Kapping Gel + Nail Art",
      category: "manicuria",
      specialist: "Dra. Clara Lee",
      time: "10:00 AM",
      duration: "1h 30m",
      station: "OR 2",
      badgeClass: "bg-[#d1f4e0] text-[#1e7e4c] border-[#a8e6c1]",
    },
    {
      id: "APT-003",
      client: "Valeria Gómez",
      service: "Extensión Volumen Ruso",
      category: "pestanas",
      specialist: "Dra. Sophia Clark",
      time: "11:00 AM",
      duration: "1h 45m",
      station: "OR 3",
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
      station: "OR 1",
      badgeClass: "bg-[#ffd8d6] text-[#b33a3a] border-[#f5b8b5]",
    },
  ]);

  const [patients] = useState([
    {
      id: "PB-001",
      name: "Sarah Miller",
      date: "2026-09-12",
      time: "09:00 AM",
      doctor: "Dr. Olivia Grant",
      treatment: "Facial Rejuvenation",
      status: "Completed",
    },
    {
      id: "PB-002",
      name: "Maurice Galley",
      date: "2026-09-12",
      time: "12:00 PM",
      doctor: "Dr. David Carter",
      treatment: "Laser Hair Removal",
      status: "In Progress",
    },
    {
      id: "PB-003",
      name: "Julia Watson",
      date: "2026-09-12",
      time: "02:30 PM",
      doctor: "Dr. Emily Ross",
      treatment: "Botox Injections",
      status: "Scheduled",
    },
  ]);

  const [doctors] = useState([
    {
      id: "DR-001",
      name: "Dr. Olivia Grant",
      specialty: "Dermatology",
      phone: "(123) 456-7890",
      rating: 4.9,
      reviews: "2,150",
    },
    {
      id: "DR-002",
      name: "Dr. David Carter",
      specialty: "Aesthetic Medicine",
      phone: "(123) 456-7891",
      rating: 4.8,
      reviews: "1,980",
    },
    {
      id: "DR-003",
      name: "Dr. Emily Ross",
      specialty: "Cosmetic Surgery",
      phone: "(123) 456-7892",
      rating: 4.7,
      reviews: "1,750",
    },
  ]);

  return (
    <div className="flex min-h-screen bg-[#fcf8f7] text-[#334155] font-sans antialiased">
      {/* SIDEBAR FIJO (ESTILO BYUTIE) */}
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
              { id: "clients", label: "Patients", icon: <Users size={16} /> },
              {
                id: "doctors",
                label: "Doctors",
                icon: <Stethoscope size={16} />,
              },
              {
                id: "appointments",
                label: "Appointments",
                icon: <CalendarIcon size={16} />,
              },
              {
                id: "schedule",
                label: "Surgery Schedule",
                icon: <CalendarIcon size={16} />,
              },
              {
                id: "services",
                label: "Treatments",
                icon: <Sparkles size={16} />,
              },
              { id: "reviews", label: "Reviews", icon: <Star size={16} /> },
              {
                id: "payments",
                label: "Payments",
                icon: <CreditCard size={16} />,
              },
              {
                id: "messages",
                label: "Messages",
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
              Enjoy improved performance, new features, and a smoother
              interface.
            </p>
            <button className="w-full py-1.5 bg-[#86efac] hover:bg-[#4ade80] text-[#14532d] rounded-full text-[11px] font-bold transition-all">
              Explore the Updates!
            </button>
          </div>

          <button
            onClick={() => setView("schedule")}
            className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-[#94a3b8] hover:text-[#475569] transition-colors w-full"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* BARRA SUPERIOR / HEADER */}
        <header className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-xl font-bold text-slate-900">
            {view === "schedule" && "Surgery Schedule"}
            {view === "clients" && "Patients"}
            {view === "doctors" && "Doctors"}
            {view === "services" && "Treatments"}
            {view === "payments" && "Payments"}
            {view === "reviews" && "Reviews"}
            {view === "messages" && "Messages"}
            {view === "dashboard" && "Dashboard"}
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
            VISTA 1: SURGERY SCHEDULE (AGENDA)
        ========================================== */}
        {view === "schedule" && (
          <div className="space-y-4">
            {/* Barra de Filtros */}
            <div className="bg-white p-4 rounded-2xl border border-[#f1e9e7] space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    "Dermatology",
                    "Body Contouring",
                    "Laser Treatments",
                    "Aesthetic Medicine",
                    "Plastic Surgery",
                    "Cosmetic Surgery",
                  ].map((cat, idx) => (
                    <button
                      key={idx}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                        idx === 0
                          ? "bg-[#f8fafc] border-slate-300 text-slate-800"
                          : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Check
                        size={12}
                        className={idx === 0 ? "opacity-100" : "opacity-0"}
                      />
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-slate-200 rounded-full px-3 py-1 text-xs text-slate-600 font-medium cursor-pointer">
                    <span>All Rooms</span>
                    <ChevronDown size={14} className="ml-1 text-slate-400" />
                  </div>
                  <div className="flex items-center bg-white border border-slate-200 rounded-full px-3 py-1 text-xs text-slate-600 font-medium cursor-pointer">
                    <span>All Doctors</span>
                    <ChevronDown size={14} className="ml-1 text-slate-400" />
                  </div>
                  <div className="flex bg-[#e2e8f0] p-0.5 rounded-full text-[11px] font-bold text-slate-600">
                    <button className="px-2.5 py-0.5 rounded-full bg-[#86efac] text-slate-900">
                      Day
                    </button>
                    <button className="px-2.5 py-0.5 rounded-full">Week</button>
                    <button className="px-2.5 py-0.5 rounded-full">
                      Month
                    </button>
                  </div>
                </div>
              </div>

              {/* Selector de Días de la Semana */}
              <div className="grid grid-cols-6 gap-2 pt-2 border-t border-slate-100 text-center">
                {[
                  { day: "Monday", date: "18" },
                  { day: "Tuesday", date: "19" },
                  { day: "Wednesday", date: "20" },
                  { day: "Thursday", date: "21" },
                  { day: "Friday", date: "22" },
                  { day: "Saturday", date: "23" },
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

            {/* Grid de Horarios Estilo Calendario Block */}
            <div className="bg-white p-6 rounded-2xl border border-[#f1e9e7] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.map((app) => (
                <div
                  key={app.id}
                  className={`p-4 rounded-xl border ${app.badgeClass} space-y-2 relative`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold opacity-80">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {app.time}
                    </span>
                    <span>{app.station}</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {app.specialist} - {app.service}
                    </h4>
                    <p className="text-[11px] font-semibold opacity-70 mt-1">
                      {app.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            VISTA 2: PATIENTS (PACIENTES)
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
                  placeholder="Search patient, treatment, etc"
                  className="w-full pl-9 pr-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none"
                />
              </div>
              <button className="flex items-center gap-1.5 bg-[#86efac] text-slate-900 text-xs font-bold px-4 py-2 rounded-full">
                <Plus size={14} /> Add Patient
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#f1e9e7] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold">
                  <tr>
                    <th className="p-3.5 pl-6">Patient ID</th>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Date & Time</th>
                    <th className="p-3.5">Doctor</th>
                    <th className="p-3.5">Treatment</th>
                    <th className="p-3.5 pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {patients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 pl-6 text-slate-400 font-bold">
                        {p.id}
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">
                        {p.name}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {p.date} - {p.time}
                      </td>
                      <td className="p-3.5 text-slate-600">{p.doctor}</td>
                      <td className="p-3.5 text-slate-600">{p.treatment}</td>
                      <td className="p-3.5 pr-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            p.status === "Completed"
                              ? "bg-[#d1f4e0] text-[#1e7e4c]"
                              : p.status === "In Progress"
                                ? "bg-[#ffd8d6] text-[#b33a3a]"
                                : "bg-[#e2e8f0] text-[#334155]"
                          }`}
                        >
                          {p.status}
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
            VISTA 3: DOCTORS (ESPECIALISTAS / TARJETAS)
        ========================================== */}
        {view === "doctors" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-2xl border border-[#f1e9e7] space-y-3 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-rose-100 mx-auto flex items-center justify-center font-bold text-rose-600 text-lg">
                  {doc.name.split(" ")[1][0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {doc.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {doc.specialty}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{doc.phone}</p>
                </div>
                <div className="pt-2 border-t border-slate-50 flex items-center justify-center gap-1 text-xs font-bold text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span>{doc.rating}</span>
                  <span className="text-slate-400 font-normal">
                    ({doc.reviews} reviews)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==========================================
            VISTA 4: PAYMENTS (PAGOS & MÉTRICAS)
        ========================================== */}
        {view === "payments" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                {
                  title: "Total Invoice",
                  value: "815",
                  change: "+2.45%",
                  isUp: true,
                },
                {
                  title: "Paid Invoice",
                  value: "430",
                  change: "+3.68%",
                  isUp: true,
                },
                {
                  title: "Pending",
                  value: "205",
                  change: "-1.20%",
                  isUp: false,
                },
                {
                  title: "Overdue",
                  value: "180",
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
                Recent Transactions
              </h3>
              <div className="divide-y divide-slate-50 text-xs font-medium">
                {[
                  {
                    id: "BT-INV-001",
                    name: "Sarah Miller",
                    treatment: "Facial Rejuvenation",
                    method: "Credit Card",
                    amount: "$300",
                    status: "Paid",
                  },
                  {
                    id: "BT-INV-002",
                    name: "Claire Thompson",
                    treatment: "Lip Fillers",
                    method: "Credit Card",
                    amount: "$250",
                    status: "Paid",
                  },
                  {
                    id: "BT-INV-003",
                    name: "Ethan Hughes",
                    treatment: "Tattoo Removal",
                    method: "PayPal",
                    amount: "$500",
                    status: "Paid",
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

        {/* VISTAS MOCK GENERALES */}
        {(view === "services" ||
          view === "reviews" ||
          view === "messages" ||
          view === "dashboard" ||
          view === "appointments") && (
          <div className="bg-white p-12 rounded-2xl border border-[#f1e9e7] text-center space-y-3">
            <div className="w-10 h-10 bg-[#c6f6d5] text-[#15803d] rounded-full flex items-center justify-center mx-auto">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Module {view}</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              This module is styled to match the exact ui kit provided in the
              reference screenshots.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
