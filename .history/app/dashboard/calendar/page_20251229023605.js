"use client";
import React, { useState, useMemo } from "react";
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
  X,
  Save,
} from "lucide-react";

// --- CONSTANTES DE CONFIGURACIÓN ---
const HOUR_HEIGHT = 96; // Altura en px de 1 hora (h-24 en Tailwind)
const START_HOUR = 8; // El calendario empieza a las 8:00

// --- UTILIDADES ---
// Convierte hora "HH:MM" a posición "top" en píxeles
const getTimeTop = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const decimalHours = hours + minutes / 60;
  return (decimalHours - START_HOUR) * HOUR_HEIGHT;
};

// Calcula la altura basada en la duración en minutos
const getDurationHeight = (durationMin) => (durationMin / 60) * HOUR_HEIGHT;

export default function CalendarPage() {
  // --- ESTADOS ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBarbers, setSelectedBarbers] = useState([
    "Juan Pérez",
    "Carlos Ruiz",
    "Miguel Ángel",
  ]);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      day: 0,
      start: "10:00",
      duration: 90,
      color: "blue",
      title: "Corte Clásico",
      barber: "Juan Pérez",
    },
    {
      id: 2,
      day: 2,
      start: "09:00",
      duration: 60,
      color: "green",
      title: "Afeitado Spa",
      barber: "Carlos Ruiz",
      status: "done",
    },
    {
      id: 3,
      day: 3,
      start: "11:30",
      duration: 60,
      color: "purple",
      title: "Corte y Barba",
      barber: "Miguel Ángel",
      note: "VIP",
    },
  ]);

  // --- LÓGICA DE FILTRADO ---
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => selectedBarbers.includes(app.barber));
  }, [appointments, selectedBarbers]);

  const toggleBarber = (name) => {
    setSelectedBarbers((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#f6f6f8] dark:bg-[#0a0f1a] text-slate-900 dark:text-white overflow-hidden font-sans">
      {/* HEADER */}
      <header className="fixed top-0 w-full flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Scissors size={20} />
            </div>
            <h2 className="text-xl font-black italic tracking-tighter uppercase">
              Barber<span className="text-blue-600">Manager</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2">
            <Search size={18} className="text-slate-400" />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-48"
              placeholder="Buscar..."
            />
          </div>
          <div className="size-10 rounded-2xl bg-blue-600 border-2 border-white dark:border-slate-700" />
        </div>
      </header>

      <div className="flex flex-1 pt-[73px]">
        {/* SIDEBAR */}
        <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all mb-8"
          >
            <Plus size={18} /> Nueva Reserva
          </button>

          <div className="space-y-8">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                Filtrar Equipo
              </h3>
              <div className="space-y-2">
                {["Juan Pérez", "Carlos Ruiz", "Miguel Ángel"].map((name) => (
                  <label
                    key={name}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBarbers.includes(name)}
                      onChange={() => toggleBarber(name)}
                      className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-600/20 bg-transparent cursor-pointer"
                    />
                    <span
                      className={`text-sm font-bold transition-colors ${
                        selectedBarbers.includes(name)
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400"
                      }`}
                    >
                      {name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* CALENDARIO MAIN */}
        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0a0f1a]">
          {/* TOOLBAR */}
          <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-black italic uppercase">
                7 <span className="text-blue-600">Sep</span>
              </h1>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg">
                  <ChevronLeft size={18} />
                </button>
                <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* GRID */}
          <div className="flex-1 overflow-auto relative">
            <div className="min-w-[1000px]">
              {/* Header Días */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/90 dark:bg-slate-900/90 z-30">
                <div className="w-20 shrink-0 border-r border-slate-100 dark:border-slate-800" />
                <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800">
                  {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                    (d, i) => (
                      <div
                        key={d}
                        className={`text-center py-4 ${
                          i === 3 ? "bg-blue-600/5" : ""
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                          {d}
                        </span>
                        <p
                          className={`text-lg font-black ${
                            i === 3 ? "text-blue-600" : ""
                          }`}
                        >
                          {i + 4}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="flex relative h-[1248px]">
                {" "}
                {/* 13 horas * 96px */}
                <div className="w-20 shrink-0 border-r border-slate-100 dark:border-slate-800 text-right pr-4 pt-2 text-[10px] font-black text-slate-400 space-y-[84px]">
                  {Array.from({ length: 13 }).map((_, i) => (
                    <div key={i}>
                      {(i + START_HOUR).toString().padStart(2, "0")}:00
                    </div>
                  ))}
                </div>
                <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative">
                  {/* Líneas de fondo */}
                  {Array.from({ length: 13 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full border-b border-dashed border-slate-100 dark:border-slate-800"
                      style={{ top: i * HOUR_HEIGHT }}
                    />
                  ))}

                  {/* Renderizado de Citas Filtradas */}
                  {filteredAppointments.map((app) => (
                    <div
                      key={app.id}
                      className={`absolute left-1 right-1 grid grid-cols-7 w-full pointer-events-none`}
                      style={{ top: getTimeTop(app.start) }}
                    >
                      <div
                        className={`col-start-${
                          app.day + 1
                        } pointer-events-auto border-l-4 rounded-xl p-3 shadow-lg flex flex-col transition-transform hover:scale-[1.02] z-10 ${
                          app.color === "blue"
                            ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700"
                            : app.color === "green"
                            ? "bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700"
                            : "bg-purple-50 dark:bg-purple-900/30 border-purple-500 text-purple-700"
                        }`}
                        style={{
                          height: getDurationHeight(app.duration),
                          gridColumnStart: app.day + 1,
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black uppercase">
                            {app.start}
                          </span>
                          {app.status === "done" && <CheckCircle2 size={14} />}
                        </div>
                        <span className="text-sm font-black dark:text-white truncate">
                          {app.title}
                        </span>
                        <span className="text-[10px] font-bold opacity-70 mt-auto">
                          {app.barber}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* DRAWER LATERAL (FORMULARIO) */}
      <div
        className={`fixed inset-y-0 right-0 w-[400px] bg-white dark:bg-slate-900 shadow-2xl z-[100] transform transition-transform duration-300 border-l border-slate-200 dark:border-slate-800 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">
              Nueva <span className="text-blue-600">Reserva</span>
            </h2>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Servicio
              </label>
              <select className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold">
                <option>Corte Clásico</option>
                <option>Barba y Afeitado</option>
                <option>Corte y Tinte</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Hora
                </label>
                <input
                  type="time"
                  defaultValue="10:00"
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Día
                </label>
                <select className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold">
                  <option value="0">Lunes</option>
                  <option value="1">Martes</option>
                  <option value="2">Miércoles</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Asignar Barbero
              </label>
              <div className="grid grid-cols-1 gap-2">
                {["Juan Pérez", "Carlos Ruiz", "Miguel Ángel"].map((b) => (
                  <button
                    key={b}
                    className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-left font-bold hover:border-blue-500 transition-all focus:bg-blue-600/5 focus:border-blue-500"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="w-full py-4 mt-8 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2">
            <Save size={18} /> Confirmar Reserva
          </button>
        </div>
      </div>

      {/* OVERLAY CUANDO EL DRAWER ESTÁ ABIERTO */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
        />
      )}
    </div>
  );
}
