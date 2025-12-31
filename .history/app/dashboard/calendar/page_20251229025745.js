"use client";
import React, { useState, useMemo } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";

const HOUR_HEIGHT = 64; // Reducido de 96 para que quepa más en pantalla
const START_HOUR = 8;

const getTimeTop = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours + minutes / 60 - START_HOUR) * HOUR_HEIGHT;
};

export default function CalendarPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBarbers, setSelectedBarbers] = useState([
    "Juan Pérez",
    "Carlos Ruiz",
    "Miguel Ángel",
  ]);

  const appointments = [
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
      color: "emerald",
      title: "Afeitado Spa",
      barber: "Carlos Ruiz",
      status: "done",
    },
    {
      id: 3,
      day: 3,
      start: "11:30",
      duration: 60,
      color: "indigo",
      title: "Corte y Barba",
      barber: "Miguel Ángel",
    },
  ];

  const filteredAppointments = useMemo(
    () => appointments.filter((app) => selectedBarbers.includes(app.barber)),
    [selectedBarbers]
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      {/* HEADER COMPACTO */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <CalendarIcon size={20} className="text-blue-600" />
            <h1 className="text-lg font-bold dark:text-white tracking-tight">
              Septiembre, 2025
            </h1>
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
            <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md shadow-sm transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {["Juan Pérez", "Carlos Ruiz", "Miguel Ángel"].map((barber) => (
              <button
                key={barber}
                onClick={() =>
                  setSelectedBarbers((prev) =>
                    prev.includes(barber)
                      ? prev.filter((b) => b !== barber)
                      : [...prev, barber]
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  selectedBarbers.includes(barber)
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-blue-600 dark:border-blue-600"
                    : "bg-transparent border-slate-200 text-slate-400 hover:border-slate-300"
                }`}
              >
                {barber.split(" ")[0]}
              </button>
            ))}
          </div>
          <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 mx-2" />
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-500/10"
          >
            <Plus size={14} /> Nueva Cita
          </button>
        </div>
      </header>

      {/* ÁREA DEL CALENDARIO */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[1000px] h-full flex flex-col">
          {/* Días de la semana */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-20">
            <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-800" />
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d, i) => (
                <div key={d} className="py-3 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                    {d}
                  </span>
                  <p
                    className={`text-sm font-bold mt-0.5 ${
                      i === 2
                        ? "text-blue-600"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {i + 7}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cuerpo del Calendario */}
          <div
            className="flex relative flex-1"
            style={{ height: 13 * HOUR_HEIGHT }}
          >
            {/* Eje de Horas */}
            <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-800 text-[10px] font-medium text-slate-400">
              {Array.from({ length: 13 }).map((_, i) => (
                <div
                  key={i}
                  style={{ height: HOUR_HEIGHT }}
                  className="flex justify-center pt-1"
                >
                  {(i + START_HOUR).toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Cuadrícula de Eventos */}
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative">
              {Array.from({ length: 13 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-b border-slate-50 dark:border-slate-800/50"
                  style={{ top: i * HOUR_HEIGHT }}
                />
              ))}

              {filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  className={`absolute left-[4px] right-[4px] rounded-lg border-l-[3px] p-2 transition-all hover:brightness-95 cursor-pointer z-10 ${
                    app.color === "blue"
                      ? "bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400"
                      : app.color === "emerald"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400"
                      : "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-400"
                  }`}
                  style={{
                    top: getTimeTop(app.start),
                    height: (app.duration / 60) * HOUR_HEIGHT - 2,
                    gridColumnStart: app.day + 1,
                  }}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[9px] font-bold opacity-80">
                      {app.start}
                    </span>
                    {app.status === "done" && <CheckCircle2 size={10} />}
                  </div>
                  <p className="text-[11px] font-bold leading-tight truncate">
                    {app.title}
                  </p>
                  <p className="text-[9px] font-medium mt-1 opacity-70 italic">
                    {app.barber.split(" ")[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
