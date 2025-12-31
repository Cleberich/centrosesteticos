"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Filter,
  CheckCircle2,
  X,
} from "lucide-react";

export default function CalendarPage() {
  const [view, setView] = useState("day");
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      barber: "Juan",
      time: "10:00",
      client: "Carlos Ruiz",
      service: "Corte + Barba",
      type: "premium",
    },
    {
      id: 2,
      barber: "Sara",
      time: "11:00",
      client: "Elena M.",
      service: "Color",
      type: "standard",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const barbers = ["Juan", "Miguel", "Sara"];
  const hours = Array.from({ length: 10 }, (_, i) => `${i + 9}:00`);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950 p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Header Interactivo */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Agenda <span className="text-blue-600">Real-Time</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Gestiona {appointments.length} citas para hoy
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setView("day")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              view === "day"
                ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600"
                : "text-slate-400"
            }`}
          >
            Día
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              view === "week"
                ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600"
                : "text-slate-400"
            }`}
          >
            Semana
          </button>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-slate-500/10"
        >
          <Plus size={18} strokeWidth={3} /> AGENDAR CITA
        </button>
      </header>

      {/* Selector de Barbero */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {barbers.map((b) => (
          <button
            key={b}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-bold hover:border-blue-500 transition-colors"
          >
            <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>{" "}
            {b}
          </button>
        ))}
      </div>

      {/* Grid de Calendario Estilo Timeline */}
      <div className="flex-1 overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_repeat(3,1fr)] min-w-[800px]">
          {/* Header de columnas */}
          <div className="p-4 border-b border-r border-slate-100 dark:border-slate-800"></div>
          {barbers.map((b) => (
            <div
              key={b}
              className="p-4 text-center font-black text-xs uppercase tracking-widest border-b border-r border-slate-100 dark:border-slate-800 text-slate-400"
            >
              {b}
            </div>
          ))}

          {/* Filas de horas */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="p-6 text-[10px] font-black text-slate-400 text-center border-r border-b border-slate-100 dark:border-slate-800">
                {hour}
              </div>
              {barbers.map((barber) => {
                const app = appointments.find(
                  (a) => a.barber === barber && a.time === hour
                );
                return (
                  <div
                    key={barber}
                    className="p-2 border-r border-b border-slate-100 dark:border-slate-800 group relative min-h-[100px]"
                  >
                    {app ? (
                      <div
                        className={`p-4 rounded-2xl h-full shadow-lg transition-all group-hover:rotate-1 cursor-pointer ${
                          app.type === "premium"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <p className="text-[9px] font-black uppercase opacity-70 mb-1">
                          {app.service}
                        </p>
                        <p className="font-bold text-sm leading-tight">
                          {app.client}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                          <CheckCircle2 size={14} className="opacity-50" />
                          <span className="text-[10px] font-bold">
                            Iniciado
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full h-full rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 hover:border-blue-300 dark:hover:border-blue-900 transition-all flex items-center justify-center"
                      >
                        <Plus className="text-blue-500" size={20} />
                      </button>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
