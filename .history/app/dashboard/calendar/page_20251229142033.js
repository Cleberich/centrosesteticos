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
  Check,
  User,
  AlertTriangle,
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
      title: "Roberto - Corte",
      barber: "Juan Pérez",
      status: "pending",
      selectedServiceIds: ["s1"],
      total: 20,
    },
  ]);

  const [currentApp, setCurrentApp] = useState({
    id: null,
    customer: "",
    barber: "Juan Pérez",
    start: "09:00",
    day: 0,
    status: "pending",
    selectedServiceIds: [],
  });

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
    setCurrentApp({ ...app });
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
    if (currentApp.selectedServiceIds.length === 0)
      return alert("Selecciona al menos un servicio");

    const appData = {
      ...currentApp,
      title: `${currentApp.customer || "Cliente"} - ${
        currentApp.selectedServiceIds.length
      } Serv.`,
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

  const setStatus = (status) => {
    if (status === "cancelled") {
      setAppointments(appointments.filter((a) => a.id !== currentApp.id));
    } else {
      setAppointments(
        appointments.map((a) =>
          a.id === currentApp.id ? { ...a, status: "done" } : a
        )
      );
    }
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-lg font-bold text-blue-600 italic uppercase tracking-tighter">
          Agenda Diaria
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleOpenCreate(0, 9)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs"
          >
            + Nueva Cita
          </button>
        </div>
      </header>

      {/* GRID DEL CALENDARIO */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[1000px] h-full flex flex-col">
          {/* Header de Días */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-20">
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
            {/* Eje de Horas */}
            <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-800 text-[10px] font-medium text-slate-300 text-center">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} style={{ height: HOUR_HEIGHT }} className="pt-1">
                  {(i + START_HOUR).toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Grid Interactivo */}
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative overflow-hidden">
              {/* Celdas para crear */}
              {Array.from({ length: 13 * 7 }).map((_, idx) => (
                <div
                  key={idx}
                  className="hover:bg-blue-50/40 cursor-cell border-b border-slate-50 dark:border-slate-800/50"
                  style={{ height: HOUR_HEIGHT }}
                  onClick={() =>
                    handleOpenCreate(idx % 7, Math.floor(idx / 7) + START_HOUR)
                  }
                />
              ))}

              {/* RENDERIZADO DE CITAS - ESTRICTAMENTE EN SU DÍA */}
              {filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  onClick={(e) => handleOpenEdit(app, e)}
                  className={`absolute left-1 right-1 rounded-lg border-l-4 p-2 z-10 transition-all active:scale-95 ${
                    app.status === "done"
                      ? "bg-slate-100 border-emerald-500 opacity-60"
                      : "bg-blue-50 border-blue-600 text-blue-800 shadow-sm"
                  }`}
                  style={{
                    top: getTimeTop(app.start),
                    height: (app.duration / 60) * HOUR_HEIGHT - 4,
                    gridColumnStart: app.day + 1, // Esto ancla la cita a la columna del día seleccionado
                    gridColumnEnd: app.day + 2, // Esto garantiza que NO se extienda a la siguiente columna
                  }}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[9px] font-bold">{app.start}</span>
                    {app.status === "done" && (
                      <CheckCircle2 size={10} className="text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] font-bold leading-tight truncate">
                    {app.title}
                  </p>
                  <p className="text-[9px] font-black mt-1 opacity-70">
                    ${app.total}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER LATERAL */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-[450px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white uppercase italic tracking-tighter">
                Detalles de Cita
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {currentApp.id && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setStatus("done")}
                    className="flex flex-col items-center gap-2 p-5 rounded-3xl border-2 border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
                  >
                    <CheckCircle2 size={28} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Finalizar
                    </span>
                  </button>
                  <button
                    onClick={() => setStatus("cancelled")}
                    className="flex flex-col items-center gap-2 p-5 rounded-3xl border-2 border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                  >
                    <AlertTriangle size={28} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Cancelar
                    </span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Día Asignado
                  </label>
                  <select
                    value={currentApp.day}
                    onChange={(e) =>
                      setCurrentApp({
                        ...currentApp,
                        day: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-sm outline-none border-none"
                  >
                    {DAYS.map((d, i) => (
                      <option key={d} value={i}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={currentApp.start}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, start: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-sm outline-none border-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Nombre Cliente
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    required
                    value={currentApp.customer}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, customer: e.target.value })
                    }
                    className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none border-none"
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Servicios del Día
                </label>
                <div className="space-y-2">
                  {AVAILABLE_SERVICES.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        currentApp.selectedServiceIds.includes(s.id)
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-transparent bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-5 rounded border-2 flex items-center justify-center transition-all ${
                            currentApp.selectedServiceIds.includes(s.id)
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {currentApp.selectedServiceIds.includes(s.id) && (
                            <Check size={12} strokeWidth={4} />
                          )}
                        </div>
                        <span className="text-sm font-bold">{s.name}</span>
                      </div>
                      <span className="text-sm font-black text-blue-600">
                        ${s.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t bg-slate-50/30">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  ${currentTotal}
                </span>
              </div>
              <button
                onClick={handleSave}
                className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/40 active:scale-95 transition-all"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
