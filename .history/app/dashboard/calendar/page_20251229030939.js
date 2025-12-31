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
  Clock,
  User,
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
      duration: 60, // Cita estándar de 1 hora
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

  const handleDelete = () => {
    setAppointments(appointments.filter((a) => a.id !== currentApp.id));
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-30">
        <div className="flex items-center gap-3">
          <CalendarIcon size={20} className="text-blue-600" />
          <h1 className="text-lg font-bold dark:text-white">Septiembre 2025</h1>
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

      {/* GRID */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[1000px] h-full flex flex-col">
          {/* Header Días */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-20">
            <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-800" />
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 uppercase text-[10px] font-black tracking-widest text-slate-400">
              {DAYS.map((d, i) => (
                <div key={d} className="py-4 text-center">
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex relative flex-1"
            style={{ height: 13 * HOUR_HEIGHT }}
          >
            {/* Horas */}
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

            {/* Grid Interactivo */}
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative bg-slate-50/20">
              {/* Espacios vacíos */}
              {Array.from({ length: 13 * 7 }).map((_, idx) => (
                <div
                  key={idx}
                  className="hover:bg-blue-50/50 cursor-cell border-b border-slate-50 dark:border-slate-800/50"
                  style={{ height: HOUR_HEIGHT }}
                  onClick={() =>
                    handleOpenCreate(idx % 7, Math.floor(idx / 7) + START_HOUR)
                  }
                />
              ))}

              {/* Renderizado de Citas (Limitado a su día/columna) */}
              {filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  onClick={(e) => handleOpenEdit(app, e)}
                  className={`absolute left-[4px] right-[4px] rounded-lg border-l-[3px] p-2 z-10 transition-transform active:scale-95 ${
                    app.status === "done"
                      ? "bg-slate-100 border-slate-400 grayscale"
                      : app.status === "cancelled"
                      ? "bg-red-50 border-red-500 opacity-50"
                      : "bg-blue-50 dark:bg-blue-900/20 border-blue-600 text-blue-700 dark:text-blue-300 shadow-sm"
                  }`}
                  style={{
                    top: getTimeTop(app.start),
                    height: (app.duration / 60) * HOUR_HEIGHT - 2,
                    gridColumnStart: app.day + 1,
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-bold">{app.start}</span>
                    {app.status === "done" && <CheckCircle2 size={10} />}
                  </div>
                  <p className="text-[11px] font-bold leading-tight truncate">
                    {app.title}
                  </p>
                  <p className="text-[9px] font-black mt-1">${app.total}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER DE GESTIÓN */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-[450px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white uppercase italic">
                {currentApp.id ? "Editar Cita" : "Nueva Reserva"}
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="flex-1 overflow-y-auto p-8 space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Día del Servicio
                  </label>
                  <select
                    value={currentApp.day}
                    onChange={(e) =>
                      setCurrentApp({
                        ...currentApp,
                        day: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-sm outline-none"
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
                    Hora
                  </label>
                  <input
                    type="time"
                    value={currentApp.start}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, start: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Cliente
                </label>
                <div className="relative flex items-center">
                  <User size={16} className="absolute left-4 text-slate-400" />
                  <input
                    required
                    value={currentApp.customer}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, customer: e.target.value })
                    }
                    className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold outline-none"
                    placeholder="Nombre del cliente"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Servicios (Día seleccionado)
                </label>
                <div className="space-y-2">
                  {AVAILABLE_SERVICES.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        currentApp.selectedServiceIds.includes(s.id)
                          ? "border-blue-600 bg-blue-50/30"
                          : "border-slate-50 dark:border-slate-800 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-5 rounded border flex items-center justify-center ${
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

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Monto Total
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  ${currentTotal}
                </span>
              </div>
              <div className="flex gap-3">
                {currentApp.id && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="p-4 text-red-500 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20"
                >
                  {currentApp.id ? "Guardar Cambios" : "Confirmar Cita"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
