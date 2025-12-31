"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Calendar as CalendarIcon,
  Trash2,
  Scissors,
  Check,
} from "lucide-react";

const HOUR_HEIGHT = 64;
const START_HOUR = 8;
const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

// Simulación de base de datos de servicios
const AVAILABLE_SERVICES = [
  { id: "s1", name: "Corte Clásico", price: 20 },
  { id: "s2", name: "Barba Royal", price: 15 },
  { id: "s3", name: "Limpieza Facial", price: 25 },
  { id: "s4", name: "Combo Elite", price: 40 },
];

const getTimeTop = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours + minutes / 60 - START_HOUR) * HOUR_HEIGHT;
};

export default function CalendarPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBarbers, setSelectedBarbers] = useState([
    "Juan Pérez",
    "Carlos Ruiz",
  ]);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      day: 0,
      start: "10:00",
      duration: 60,
      title: "Juan - Corte",
      barber: "Juan Pérez",
      status: "pending",
      services: ["s1"],
      total: 20,
    },
  ]);

  // Estado del formulario
  const [currentApp, setCurrentApp] = useState({
    id: null,
    customer: "",
    barber: "Juan Pérez",
    start: "09:00",
    day: 0,
    status: "pending",
    selectedServiceIds: [],
  });

  // Cálculo del total en tiempo real
  const currentTotal = useMemo(() => {
    return currentApp.selectedServiceIds.reduce((acc, id) => {
      const service = AVAILABLE_SERVICES.find((s) => s.id === id);
      return acc + (service?.price || 0);
    }, 0);
  }, [currentApp.selectedServiceIds]);

  const filteredAppointments = useMemo(
    () => appointments.filter((app) => selectedBarbers.includes(app.barber)),
    [appointments, selectedBarbers]
  );

  const handleOpenCreate = (day, hour) => {
    setCurrentApp({
      id: null,
      customer: "",
      barber: selectedBarbers[0] || "Juan Pérez",
      start: `${hour.toString().padStart(2, "0")}:00`,
      day,
      status: "pending",
      selectedServiceIds: [],
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (app, e) => {
    e.stopPropagation();
    setCurrentApp({
      ...app,
      selectedServiceIds: app.services || [],
      customer: app.title.split(" - ")[0], // Asumimos que guardamos "Cliente - Servicio"
    });
    setIsDrawerOpen(true);
  };

  const toggleService = (id) => {
    setCurrentApp((prev) => ({
      ...prev,
      selectedServiceIds: prev.selectedServiceIds.includes(id)
        ? prev.selectedServiceIds.filter((sid) => sid !== id)
        : [...prev.selectedServiceIds, id],
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const appData = {
      ...currentApp,
      title: `${currentApp.customer} - ${currentApp.selectedServiceIds.length} serv.`,
      services: currentApp.selectedServiceIds,
      total: currentTotal,
      duration: 60,
    };

    if (currentApp.id) {
      setAppointments(
        appointments.map((a) => (a.id === currentApp.id ? appData : a))
      );
    } else {
      setAppointments([...appointments, { ...appData, id: Date.now() }]);
    }
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      {/* HEADER REUTILIZADO */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-blue-600">
            Calendario Operativo
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {["Juan Pérez", "Carlos Ruiz"].map((b) => (
              <button
                key={b}
                onClick={() =>
                  setSelectedBarbers((prev) =>
                    prev.includes(b)
                      ? prev.filter((x) => x !== b)
                      : [...prev, b]
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  selectedBarbers.includes(b)
                    ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600"
                    : "text-slate-400"
                }`}
              >
                {b.split(" ")[0]}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleOpenCreate(new Date().getDay() - 1, 9)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs"
          >
            + Nueva Cita
          </button>
        </div>
      </header>

      {/* GRID CALENDARIO */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[1000px] h-full flex flex-col">
          <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 z-20">
            <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-800" />
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800">
              {DAYS.map((d, i) => (
                <div
                  key={d}
                  className="py-4 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest"
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex relative flex-1"
            style={{ height: 13 * HOUR_HEIGHT }}
          >
            <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-800 text-[10px] font-medium text-slate-300">
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

            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative">
              {Array.from({ length: 13 * 7 }).map((_, idx) => (
                <div
                  key={idx}
                  className="hover:bg-blue-50/30 cursor-cell"
                  style={{ height: HOUR_HEIGHT }}
                  onClick={() =>
                    handleOpenCreate(idx % 7, Math.floor(idx / 7) + START_HOUR)
                  }
                />
              ))}

              {filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  onClick={(e) => handleOpenEdit(app, e)}
                  className={`absolute left-[4px] right-[4px] rounded-lg border-l-[3px] p-2 z-10 ${
                    app.status === "done"
                      ? "bg-slate-100 border-slate-400 opacity-60"
                      : "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                  }`}
                  style={{
                    top: getTimeTop(app.start),
                    height: (app.duration / 60) * HOUR_HEIGHT - 2,
                    gridColumnStart: app.day + 1,
                  }}
                >
                  <p className="text-[10px] font-bold truncate">{app.title}</p>
                  <p className="text-[9px] font-black mt-1">${app.total}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER AVANZADO */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-[450px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white uppercase italic">
                {currentApp.id ? "Editar Cita" : "Nueva Reserva"}
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <X />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="flex-1 overflow-y-auto p-8 space-y-6"
            >
              {/* DIA Y HORA */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">
                    Día de la semana
                  </label>
                  <select
                    value={currentApp.day}
                    onChange={(e) =>
                      setCurrentApp({
                        ...currentApp,
                        day: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-sm outline-none border-none"
                  >
                    {DAYS.map((d, i) => (
                      <option key={d} value={i}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">
                    Hora de inicio
                  </label>
                  <input
                    type="time"
                    value={currentApp.start}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, start: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-sm outline-none"
                  />
                </div>
              </div>

              {/* CLIENTE */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  Nombre del Cliente
                </label>
                <input
                  required
                  value={currentApp.customer}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, customer: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold outline-none"
                  placeholder="Ej: Roberto Gómez"
                />
              </div>

              {/* MULTI-SERVICIOS */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  Servicios Requeridos
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {AVAILABLE_SERVICES.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        currentApp.selectedServiceIds.includes(s.id)
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                          : "border-slate-100 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-5 rounded-md border flex items-center justify-center transition-all ${
                            currentApp.selectedServiceIds.includes(s.id)
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {currentApp.selectedServiceIds.includes(s.id) && (
                            <Check size={12} strokeWidth={4} />
                          )}
                        </div>
                        <span className="text-sm font-bold dark:text-white">
                          {s.name}
                        </span>
                      </div>
                      <span className="text-sm font-black text-blue-600">
                        ${s.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            {/* FOOTER CON TOTAL */}
            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex justify-between items-end mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Total a cobrar
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  ${currentTotal}
                </span>
              </div>
              <button
                onClick={handleSave}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20"
              >
                {currentApp.id ? "Actualizar Reserva" : "Confirmar Reserva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
