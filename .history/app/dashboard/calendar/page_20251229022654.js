"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Scissors,
  User,
} from "lucide-react";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const hours = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];
  const barbers = ["Juan", "Miguel", "Sara"];

  // Datos de ejemplo para las citas
  const appointments = [
    {
      id: 1,
      barber: "Juan",
      time: "10:00",
      client: "Carlos R.",
      service: "Corte",
      duration: 1,
    },
    {
      id: 2,
      barber: "Miguel",
      time: "11:00",
      client: "Ana M.",
      service: "Tinte",
      duration: 2,
    },
    {
      id: 3,
      barber: "Sara",
      time: "09:00",
      client: "Luis P.",
      service: "Barba",
      duration: 1,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Calendario
            </h1>
            <p className="text-slate-500">Gestiona los turnos de tu equipo</p>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <button className="p-2 hover:bg-slate-100 rounded-lg">
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-sm min-w-[140px] text-center">
              Lunes, 24 Octubre
            </span>
            <button className="p-2 hover:bg-slate-100 rounded-lg">
              <ChevronRight size={20} />
            </button>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all">
            <Plus size={20} /> Agendar Cita
          </button>
        </header>

        {/* Rejilla del Calendario */}
        <div className="flex-1 overflow-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="p-4 border-r border-slate-100 dark:border-slate-800 w-24"></th>
                {barbers.map((barber) => (
                  <th
                    key={barber}
                    className="p-4 text-center font-black uppercase text-sm tracking-widest text-blue-600"
                  >
                    {barber}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => (
                <tr
                  key={hour}
                  className="border-b border-slate-50 dark:border-slate-800/50"
                >
                  <td className="p-4 text-xs font-bold text-slate-400 text-center border-r border-slate-100 dark:border-slate-800">
                    {hour}
                  </td>
                  {barbers.map((barber) => {
                    const app = appointments.find(
                      (a) => a.barber === barber && a.time === hour
                    );
                    return (
                      <td key={barber} className="p-2 h-24 relative group">
                        {app ? (
                          <div
                            className={`h-full w-full rounded-xl p-3 text-white shadow-md transition-transform group-hover:scale-[1.02] cursor-pointer ${
                              app.duration > 1 ? "bg-indigo-600" : "bg-blue-600"
                            }`}
                          >
                            <p className="text-[10px] font-bold opacity-80 uppercase">
                              {app.service}
                            </p>
                            <p className="font-bold text-sm truncate">
                              {app.client}
                            </p>
                            <div className="flex items-center gap-1 mt-1 opacity-70">
                              <Clock size={10} />{" "}
                              <span className="text-[10px]">{hour}</span>
                            </div>
                          </div>
                        ) : (
                          <button className="w-full h-full rounded-xl border border-dashed border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center">
                            <Plus size={16} className="text-slate-400" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
