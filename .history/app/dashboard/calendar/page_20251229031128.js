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

  // NUEVA LÓGICA DE ESTADOS REQUERIDA
  const setStatus = (status) => {
    if (status === "cancelled") {
      // Si cancela, eliminamos la cita para liberar la hora
      setAppointments(appointments.filter((a) => a.id !== currentApp.id));
      setIsDrawerOpen(false);
    } else {
      // Si finaliza, actualizamos el estado visual
      setAppointments(
        appointments.map((a) =>
          a.id === currentApp.id ? { ...a, status: "done" } : a
        )
      );
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-lg font-bold text-blue-600">
          Calendario Operativo
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleOpenCreate(new Date().getDay() - 1, 9)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs"
          >
            + Nueva Cita
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[1000px] h-full flex flex-col">
          <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 z-20">
            <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-800" />
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 uppercase text-[10px] font-black tracking-widest text-slate-400">
              {DAYS.map((d) => (
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
            <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-800 text-[10px] font-medium text-slate-300 text-center">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} style={{ height: HOUR_HEIGHT }} className="pt-1">
                  {(i + START_HOUR).toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative">
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

              {filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  onClick={(e) => handleOpenEdit(app, e)}
                  className={`absolute left-[4px] right-[4px] rounded-lg border-l-[3px] p-2 z-10 transition-all ${
                    app.status === "done"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 opacity-60 grayscale"
                      : "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
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
                  <p className="text-[11px] font-bold truncate">{app.title}</p>
                  <p className="text-[9px] font-black mt-1">${app.total}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-[450px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white uppercase italic">
                {currentApp.id ? "Gestionar Cita" : "Nueva Reserva"}
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* ACCIONES RÁPIDAS (Solo si la cita ya existe) */}
              {currentApp.id && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setStatus("done")}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    <CheckCircle2 size={24} />
                    <span className="text-[10px] font-black uppercase">
                      Finalizar
                    </span>
                  </button>
                  <button
                    onClick={() => setStatus("cancelled")}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <AlertTriangle size={24} />
                    <span className="text-[10px] font-black uppercase">
                      Cancelar (Borrar)
                    </span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">
                    Día
                  </label>
                  <select
                    value={currentApp.day}
                    onChange={(e) =>
                      setCurrentApp({
                        ...currentApp,
                        day: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-sm"
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
                    Hora
                  </label>
                  <input
                    type="time"
                    value={currentApp.start}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, start: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  Cliente
                </label>
                <input
                  required
                  value={currentApp.customer}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, customer: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold"
                  placeholder="Nombre..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  Servicios
                </label>
                {AVAILABLE_SERVICES.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer ${
                      currentApp.selectedServiceIds.includes(s.id)
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-50"
                    }`}
                  >
                    <span className="text-sm font-bold">{s.name}</span>
                    <span className="text-sm font-black text-blue-600">
                      ${s.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 border-t bg-slate-50/50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Total
                </span>
                <span className="text-3xl font-black text-slate-900">
                  ${currentTotal}
                </span>
              </div>
              <button
                onClick={handleSave}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
