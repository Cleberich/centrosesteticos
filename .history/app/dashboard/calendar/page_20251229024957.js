"use client";
import React, { useState, useMemo } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Search,
  X,
  Filter,
} from "lucide-react";

const HOUR_HEIGHT = 96;
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
    },
  ];

  const filteredAppointments = useMemo(
    () => appointments.filter((app) => selectedBarbers.includes(app.barber)),
    [selectedBarbers]
  );

  return (
    <>
      {/* HEADER DEL CALENDARIO */}
      <header className="flex-none flex items-center justify-between px-8 py-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-black italic uppercase">Calendario</h1>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all">
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
          <span className="font-bold text-slate-500">Septiembre 2025</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-2 mr-4">
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
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                  selectedBarbers.includes(barber)
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-slate-200 text-slate-400"
                }`}
              >
                {barber.split(" ")[0]}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 font-bold text-sm flex items-center gap-2"
          >
            <Plus size={18} /> Nueva Reserva
          </button>
        </div>
      </header>

      {/* GRID DEL CALENDARIO */}
      <div className="flex-1 overflow-auto bg-white dark:bg-slate-950 relative">
        <div className="min-w-[1000px]">
          {/* Header Días */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/90 dark:bg-slate-900/90 z-30">
            <div className="w-20 shrink-0 border-r border-slate-100 dark:border-slate-800" />
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 font-black uppercase text-[10px] tracking-widest text-slate-400">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d, i) => (
                <div key={d} className="text-center py-4">
                  {d}{" "}
                  <span className="block text-lg text-slate-900 dark:text-white">
                    {i + 7}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Horas y Citas */}
          <div className="flex relative h-[1248px]">
            <div className="w-20 shrink-0 border-r border-slate-100 dark:border-slate-800 text-right pr-4 text-[10px] font-black text-slate-400">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} style={{ height: HOUR_HEIGHT }} className="pt-2">
                  {(i + START_HOUR).toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative">
              {Array.from({ length: 13 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-b border-dashed border-slate-100 dark:border-slate-800"
                  style={{ top: i * HOUR_HEIGHT }}
                />
              ))}

              {filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  className={`absolute left-1 right-1 rounded-xl p-3 border-l-4 shadow-lg z-10 ${
                    app.color === "blue"
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700"
                      : app.color === "green"
                      ? "bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700"
                      : "bg-purple-50 dark:bg-purple-900/30 border-purple-500 text-purple-700"
                  }`}
                  style={{
                    top: getTimeTop(app.start),
                    height: (app.duration / 60) * HOUR_HEIGHT,
                    gridColumnStart: app.day + 1,
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black">{app.start}</span>
                    {app.status === "done" && <CheckCircle2 size={12} />}
                  </div>
                  <p className="text-xs font-black dark:text-white truncate">
                    {app.title}
                  </p>
                  <p className="text-[9px] font-bold opacity-60 uppercase">
                    {app.barber.split(" ")[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER FORMULARIO (Se mantiene igual pero integrado) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-[400px] bg-white dark:bg-slate-900 h-full shadow-2xl p-8 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase italic">
                Nueva <span className="text-blue-600">Reserva</span>
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <X />
              </button>
            </div>
            {/* Formulario simplificado */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Nombre Cliente
                </label>
                <input
                  type="text"
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold"
                  placeholder="Juan Pérez"
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/30">
                Guardar Cita
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
