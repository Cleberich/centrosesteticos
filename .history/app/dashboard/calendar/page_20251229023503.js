"use client";
import React, { useState } from "react";
import {
  Scissors,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarRange,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Filter,
  MoreHorizontal,
} from "lucide-react";

// --- Componentes Reutilizables ---

const BarberLink = ({ name, checked, img }) => (
  <label className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all group">
    <input
      type="checkbox"
      defaultChecked={checked}
      className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-600/20 bg-transparent"
    />
    <div
      className="h-8 w-8 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-700"
      style={{ backgroundImage: `url(${img})` }}
    />
    <span className="font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-blue-600">
      {name}
    </span>
  </label>
);

const Appointment = ({
  top,
  height,
  color,
  time,
  title,
  person,
  status,
  note,
}) => {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300",
    green:
      "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-300",
    amber:
      "bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-700 dark:text-amber-300",
  };

  return (
    <div
      className={`absolute left-1 right-1 border-l-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all p-3 flex flex-col z-10 hover:z-20 ${colors[color]}`}
      style={{ top: `${top}px`, height: `${height}px` }}
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-black uppercase tracking-wider">
          {time}
        </span>
        {status === "done" && <CheckCircle2 size={14} />}
      </div>
      <span className="text-sm font-black leading-tight mt-1">{title}</span>
      <div className="flex items-center gap-2 mt-auto">
        <div className="size-5 rounded-full bg-slate-200 dark:bg-slate-700" />
        <span className="text-[11px] font-bold opacity-80">{person}</span>
      </div>
      {note && (
        <p className="text-[10px] mt-1 italic opacity-70 truncate">{note}</p>
      )}
    </div>
  );
};

export default function CalendarPage() {
  const [view, setView] = useState("semana");

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 a 20:00

  return (
    <div className="flex h-screen w-full bg-[#f6f6f8] dark:bg-[#0a0f1a] text-slate-900 dark:text-white overflow-hidden font-sans">
      {/* 1. HEADER FIJO */}
      <header className="fixed top-0 w-full flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Scissors size={20} />
            </div>
            <h2 className="text-xl font-black italic tracking-tighter uppercase">
              Barber<span className="text-blue-600">Manager</span>
            </h2>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            {["Dashboard", "Calendario", "Clientes", "Ajustes"].map((item) => (
              <a
                key={item}
                href="#"
                className={`text-sm font-black uppercase tracking-widest transition-colors ${
                  item === "Calendario"
                    ? "text-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2 border border-transparent focus-within:border-blue-500 transition-all">
            <Search size={18} className="text-slate-400" />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-56 placeholder-slate-400"
              placeholder="Buscar reserva..."
            />
          </div>
          <div className="size-10 rounded-2xl bg-slate-200 border-2 border-white dark:border-slate-700 shadow-sm" />
        </div>
      </header>

      <div className="flex flex-1 pt-[73px]">
        {/* 2. SIDEBAR IZQUIERDO */}
        <aside className="hidden lg:flex w-80 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-y-auto custom-scrollbar">
          <button className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all mb-8">
            <Plus size={18} /> Nueva Reserva
          </button>

          {/* Mini Calendario */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-6 mb-8 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <span className="font-black text-xs uppercase tracking-tighter">
                Septiembre 2023
              </span>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-[10px] font-black text-slate-400 text-center mb-4 uppercase">
              <span>L</span>
              <span>M</span>
              <span>M</span>
              <span>J</span>
              <span>V</span>
              <span>S</span>
              <span>D</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
              {Array.from({ length: 14 }, (_, i) => (
                <span
                  key={i}
                  className={`p-2 rounded-xl cursor-pointer transition-all ${
                    i + 1 === 7
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                Equipo
              </h3>
              <div className="space-y-1">
                <BarberLink
                  name="Juan Pérez"
                  checked
                  img="https://i.pravatar.cc/100?u=1"
                />
                <BarberLink
                  name="Carlos Ruiz"
                  checked
                  img="https://i.pravatar.cc/100?u=2"
                />
                <BarberLink
                  name="Miguel Ángel"
                  checked
                  img="https://i.pravatar.cc/100?u=3"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* 3. CALENDARIO PRINCIPAL */}
        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0a0f1a]">
          {/* Toolbar del Calendario */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800 gap-6">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                7 <span className="text-blue-600">Sep</span> 2023
              </h1>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl gap-1">
                <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all">
                  <ChevronLeft size={18} />
                </button>
                <button className="px-4 py-1.5 text-xs font-black uppercase tracking-widest hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all">
                  Hoy
                </button>
                <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
              {[
                { id: "dia", icon: CalendarIcon, label: "Día" },
                { id: "semana", icon: CalendarRange, label: "Semana" },
                { id: "mes", icon: CalendarDays, label: "Mes" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    view === item.id
                      ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Calendario */}
          <div className="flex-1 overflow-auto custom-scrollbar relative">
            <div className="min-w-[1000px] h-full flex flex-col">
              {/* Header Días */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-30">
                <div className="w-24 shrink-0 bg-slate-50/50 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800" />
                <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800">
                  {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                    (day, idx) => (
                      <div
                        key={day}
                        className={`text-center py-4 ${
                          idx === 3 ? "bg-blue-600/5" : ""
                        }`}
                      >
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                          {day}
                        </p>
                        <div
                          className={`text-xl font-black mx-auto size-10 flex items-center justify-center rounded-2xl transition-all ${
                            idx === 3
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40"
                              : "text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {idx + 4}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Body con Horas */}
              <div className="flex flex-1 relative min-h-[1200px]">
                {/* Gutter de Tiempo */}
                <div className="w-24 shrink-0 bg-slate-50/30 dark:bg-slate-800/20 border-r border-slate-100 dark:border-slate-800 text-right pr-4 pt-4 space-y-[80px]">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="text-[10px] font-black text-slate-400 uppercase tracking-tighter"
                    >
                      {hour.toString().padStart(2, "0")}:00
                    </div>
                  ))}
                </div>

                {/* Columnas del Grid */}
                <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative">
                  {/* Líneas Horizontales */}
                  <div className="absolute inset-0 flex flex-col pointer-events-none">
                    {hours.map((h) => (
                      <div
                        key={h}
                        className="h-24 border-b border-dashed border-slate-100 dark:border-slate-800"
                      />
                    ))}
                  </div>

                  {/* Indicador de Hora Actual */}
                  <div className="absolute top-[380px] w-full border-t-2 border-red-500 z-20 pointer-events-none">
                    <div className="absolute -left-1.5 -top-1.5 size-3 bg-red-500 rounded-full ring-4 ring-red-500/20 shadow-lg" />
                  </div>

                  {/* Monday (Column 0) */}
                  <div className="relative">
                    <Appointment
                      top={200}
                      height={120}
                      color="blue"
                      time="10:00 - 11:30"
                      title="Corte Clásico"
                      person="J. Pérez"
                    />
                  </div>

                  {/* Tuesday (Column 1) */}
                  <div className="relative" />

                  {/* Wednesday (Column 2) */}
                  <div className="relative">
                    <Appointment
                      top={100}
                      height={80}
                      color="green"
                      time="09:00"
                      title="Afeitado Spa"
                      person="C. Ruiz"
                      status="done"
                    />
                    <Appointment
                      top={450}
                      height={180}
                      color="purple"
                      time="14:00 - 16:00"
                      title="Tinte Premium"
                      person="Maria L."
                    />
                  </div>

                  {/* Thursday (Today) */}
                  <div className="relative bg-blue-600/[0.02]">
                    <Appointment
                      top={340}
                      height={100}
                      color="blue"
                      time="11:30 - 12:30"
                      title="Corte y Barba"
                      person="Miguel Á."
                      note="Cliente VIP"
                    />
                  </div>

                  {/* Resto de columnas... */}
                  <div className="relative" />
                  <div className="relative bg-slate-50/50 dark:bg-slate-900/30" />
                  <div className="relative bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-center">
                    <span className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-300 -rotate-90">
                      Cerrado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
