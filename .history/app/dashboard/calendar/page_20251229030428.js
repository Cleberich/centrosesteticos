"use client";
import React, { useState, useMemo } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Calendar as CalendarIcon,
  Trash2,
  User,
  Scissors,
} from "lucide-react";

const HOUR_HEIGHT = 64;
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
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      day: 0,
      start: "10:00",
      duration: 60,
      color: "blue",
      title: "Corte Clásico",
      barber: "Juan Pérez",
      status: "pending",
    },
    {
      id: 2,
      day: 2,
      start: "09:00",
      duration: 60,
      color: "emerald",
      title: "Barba Royal",
      barber: "Carlos Ruiz",
      status: "done",
    },
  ]);

  // Estado para el formulario
  const [currentApp, setCurrentApp] = useState({
    id: null,
    title: "",
    barber: "Juan Pérez",
    start: "09:00",
    day: 0,
    status: "pending",
  });

  const filteredAppointments = useMemo(
    () => appointments.filter((app) => selectedBarbers.includes(app.barber)),
    [appointments, selectedBarbers]
  );

  // Abrir para Nueva Cita
  const handleOpenCreate = (day, hour) => {
    const timeStr = `${hour.toString().padStart(2, "0")}:00`;
    setCurrentApp({
      id: null,
      title: "",
      barber: selectedBarbers[0],
      start: timeStr,
      day,
      status: "pending",
    });
    setIsDrawerOpen(true);
  };

  // Abrir para Editar Cita
  const handleOpenEdit = (app, e) => {
    e.stopPropagation(); // Evita que el clic en la cita dispare el clic en el fondo
    setCurrentApp(app);
    setIsDrawerOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentApp.id) {
      setAppointments(
        appointments.map((a) => (a.id === currentApp.id ? currentApp : a))
      );
    } else {
      setAppointments([
        ...appointments,
        { ...currentApp, id: Date.now(), duration: 60, color: "blue" },
      ]);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = () => {
    setAppointments(appointments.filter((a) => a.id !== currentApp.id));
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <CalendarIcon size={20} className="text-blue-600" />
            <h1 className="text-lg font-bold dark:text-white tracking-tight text-blue-600">
              Septiembre, 2025
            </h1>
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
            <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {["Juan Pérez", "Carlos Ruiz", "Miguel Ángel"].map((b) => (
              <button
                key={b}
                onClick={() =>
                  setSelectedBarbers((prev) =>
                    prev.includes(b)
                      ? prev.filter((x) => x !== b)
                      : [...prev, b]
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                  selectedBarbers.includes(b)
                    ? "bg-slate-900 dark:bg-blue-600 text-white border-transparent"
                    : "text-slate-400 border-slate-200"
                }`}
              >
                {b.split(" ")[0]}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleOpenCreate(0, 9)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2"
          >
            <Plus size={14} /> Nueva Cita
          </button>
        </div>
      </header>

      {/* CALENDARIO */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[1000px] h-full flex flex-col">
          {/* Header Días */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-20">
            <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-800" />
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:border-slate-800 uppercase text-[10px] font-black tracking-widest text-slate-400">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d, i) => (
                <div key={d} className="py-4 text-center">
                  {d}{" "}
                  <span className="text-slate-900 dark:text-white ml-1">
                    {i + 7}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex relative flex-1"
            style={{ height: 13 * HOUR_HEIGHT }}
          >
            {/* Horas */}
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

            {/* Grid Interactivo */}
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative">
              {/* Celdas para crear haciendo clic */}
              {Array.from({ length: 13 * 7 }).map((_, idx) => {
                const day = idx % 7;
                const hour = Math.floor(idx / 7) + START_HOUR;
                return (
                  <div
                    key={idx}
                    className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-cell transition-colors"
                    style={{ height: HOUR_HEIGHT }}
                    onClick={() => handleOpenCreate(day, hour)}
                  />
                );
              })}

              {/* Render de Citas */}
              {filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  onClick={(e) => handleOpenEdit(app, e)}
                  className={`absolute left-[4px] right-[4px] rounded-lg border-l-[3px] p-2 transition-all hover:scale-[1.02] cursor-pointer z-10 ${
                    app.status === "done"
                      ? "bg-slate-100 dark:bg-slate-800 border-slate-400 grayscale"
                      : app.status === "cancelled"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-500 opacity-50 line-through"
                      : "bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400 shadow-sm"
                  }`}
                  style={{
                    top: getTimeTop(app.start),
                    height: (app.duration / 60) * HOUR_HEIGHT - 2,
                    gridColumnStart: app.day + 1,
                  }}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[9px] font-bold">{app.start}</span>
                    {app.status === "done" && <CheckCircle2 size={10} />}
                  </div>
                  <p className="text-[11px] font-bold leading-tight truncate">
                    {app.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER DE EDICIÓN / CREACIÓN */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-[400px] bg-white dark:bg-slate-900 h-full shadow-2xl p-8 animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold dark:text-white uppercase tracking-tighter italic">
                {currentApp.id ? "Gestionar Cita" : "Nueva Reserva"}
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">
                    Cliente / Servicio
                  </label>
                  <input
                    required
                    value={currentApp.title}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, title: e.target.value })
                    }
                    className="w-full bg-transparent font-bold dark:text-white outline-none"
                    placeholder="Ej: Carlos - Corte degradado"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">
                      Hora Inicio
                    </label>
                    <input
                      type="time"
                      value={currentApp.start}
                      onChange={(e) =>
                        setCurrentApp({ ...currentApp, start: e.target.value })
                      }
                      className="bg-transparent font-bold dark:text-white outline-none w-full"
                    />
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">
                      Barbero
                    </label>
                    <select
                      value={currentApp.barber}
                      onChange={(e) =>
                        setCurrentApp({ ...currentApp, barber: e.target.value })
                      }
                      className="bg-transparent font-bold dark:text-white outline-none w-full text-sm"
                    >
                      {["Juan Pérez", "Carlos Ruiz", "Miguel Ángel"].map(
                        (b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {currentApp.id && (
                  <div className="space-y-3 pt-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">
                      Actualizar Estado
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentApp({ ...currentApp, status: "done" })
                        }
                        className={`py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${
                          currentApp.status === "done"
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        Finalizado
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentApp({ ...currentApp, status: "cancelled" })
                        }
                        className={`py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${
                          currentApp.status === "cancelled"
                            ? "bg-red-500 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        Cancelado
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-10 space-y-3">
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                  {currentApp.id ? "Guardar Cambios" : "Confirmar Reserva"}
                </button>
                {currentApp.id && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full py-4 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Eliminar Cita
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
