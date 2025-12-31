"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  User,
  Check,
  Loader2,
  Clock,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const HOUR_HEIGHT = 70;
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

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Datos desde BD
  const [availableServices, setAvailableServices] = useState([]);
  const [team, setTeam] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Estado formulario
  const [currentApp, setCurrentApp] = useState({
    id: null,
    customer: "",
    barber: "",
    start: "09:00",
    day: 0,
    status: "pending",
    selectedServiceIds: [],
  });

  // --- 1. CARGAR DATOS REALES ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "barberias", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAvailableServices(data.services || []);
          setTeam(data.barbers || []);
          setAppointments(data.appointments || []);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- 2. PERSISTENCIA EN FIRESTORE ---
  const saveToFirebase = async (newList) => {
    if (!user) return;
    const docRef = doc(db, "barberias", user.uid);
    await updateDoc(docRef, { appointments: newList });
  };

  const currentTotal = useMemo(() => {
    return currentApp.selectedServiceIds.reduce((acc, id) => {
      const service = availableServices.find((s) => s.id === id);
      return acc + (Number(service?.price) || 0);
    }, 0);
  }, [currentApp.selectedServiceIds, availableServices]);

  const handleOpenCreate = (day, hour) => {
    setCurrentApp({
      id: null,
      customer: "",
      barber: team[0]?.name || "Sin asignar",
      start: `${hour.toString().padStart(2, "0")}:00`,
      day,
      status: "pending",
      selectedServiceIds: [],
    });
    setIsDrawerOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentApp.customer || currentApp.selectedServiceIds.length === 0) {
      return alert("Completa el cliente y elige al menos un servicio");
    }

    const appData = {
      ...currentApp,
      title: `${currentApp.customer} (${currentApp.barber})`,
      total: currentTotal,
      duration: 60,
    };

    let newList;
    if (currentApp.id) {
      newList = appointments.map((a) => (a.id === currentApp.id ? appData : a));
    } else {
      newList = [...appointments, { ...appData, id: Date.now() }];
    }

    setAppointments(newList);
    await saveToFirebase(newList);
    setIsDrawerOpen(false);
  };

  const setStatus = async (status) => {
    let newList;
    if (status === "cancelled") {
      newList = appointments.filter((a) => a.id !== currentApp.id);
    } else {
      newList = appointments.map((a) =>
        a.id === currentApp.id ? { ...a, status: "done" } : a
      );
    }
    setAppointments(newList);
    await saveToFirebase(newList);
    setIsDrawerOpen(false);
  };

  const getTimeTop = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return (hours + minutes / 60 - START_HOUR) * HOUR_HEIGHT;
  };

  if (loading)
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-2" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Sincronizando Agenda...
        </span>
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      <header className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-xl font-black italic uppercase tracking-tighter dark:text-white">
          Agenda <span className="text-blue-600">Semanal</span>
        </h1>
        <button
          onClick={() => handleOpenCreate(0, 9)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          + Nueva Cita
        </button>
      </header>

      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[1100px] h-full flex flex-col">
          <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20">
            <div className="w-20 shrink-0 border-r border-slate-100 dark:border-slate-800" />
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800">
              {DAYS.map((d) => (
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
            <div className="w-20 shrink-0 border-r border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-300 text-center">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} style={{ height: HOUR_HEIGHT }} className="pt-2">
                  {(i + START_HOUR).toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative">
              {Array.from({ length: 13 * 7 }).map((_, idx) => (
                <div
                  key={idx}
                  className="hover:bg-blue-50/50 cursor-pointer border-b border-slate-50 dark:border-slate-800/40"
                  style={{ height: HOUR_HEIGHT }}
                  onClick={() =>
                    handleOpenCreate(idx % 7, Math.floor(idx / 7) + START_HOUR)
                  }
                />
              ))}

              {appointments.map((app) => (
                <div
                  key={app.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentApp(app);
                    setIsDrawerOpen(true);
                  }}
                  className={`absolute left-1 right-1 rounded-2xl border-l-4 p-3 z-10 transition-all shadow-sm ${
                    app.status === "done"
                      ? "bg-slate-100 border-emerald-500 opacity-60"
                      : "bg-blue-600 border-blue-400 text-white"
                  }`}
                  style={{
                    top: getTimeTop(app.start),
                    height: HOUR_HEIGHT - 4,
                    gridColumnStart: app.day + 1,
                    gridColumnEnd: app.day + 2,
                  }}
                >
                  <p className="text-[10px] font-black uppercase truncate italic">
                    {app.customer}
                  </p>
                  <p className="text-[8px] font-bold opacity-80">
                    {app.barber}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-[450px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase italic tracking-tighter dark:text-white">
                Detalles del <span className="text-blue-600">Turno</span>
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full dark:text-white"
              >
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {currentApp.id && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setStatus("done")}
                    className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest"
                  >
                    <CheckCircle2 size={16} /> Cobrar
                  </button>
                  <button
                    onClick={() => setStatus("cancelled")}
                    className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-100 text-red-600 font-black text-[10px] uppercase tracking-widest"
                  >
                    <AlertTriangle size={16} /> Borrar
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Barbero que toma el turno
                </label>
                <select
                  value={currentApp.barber}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, barber: e.target.value })
                  }
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none border-none"
                >
                  {team.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Cliente
                </label>
                <input
                  required
                  value={currentApp.customer}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, customer: e.target.value })
                  }
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold outline-none border-none dark:text-white"
                  placeholder="Ej: Roberto Gómez"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Servicios (Checkbox)
                </label>
                <div className="space-y-2">
                  {availableServices.map((s) => (
                    <div
                      key={s.id}
                      onClick={() =>
                        setCurrentApp((prev) => ({
                          ...prev,
                          selectedServiceIds: prev.selectedServiceIds.includes(
                            s.id
                          )
                            ? prev.selectedServiceIds.filter(
                                (id) => id !== s.id
                              )
                            : [...prev.selectedServiceIds, s.id],
                        }))
                      }
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        currentApp.selectedServiceIds.includes(s.id)
                          ? "border-blue-600 bg-blue-50/50"
                          : "border-transparent bg-slate-50 dark:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-5 rounded flex items-center justify-center border-2 ${
                            currentApp.selectedServiceIds.includes(s.id)
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {currentApp.selectedServiceIds.includes(s.id) && (
                            <Check size={12} strokeWidth={4} />
                          )}
                        </div>
                        <span className="text-xs font-bold dark:text-white">
                          {s.name}
                        </span>
                      </div>
                      <span className="text-xs font-black text-blue-600">
                        ${s.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t dark:border-slate-800">
              <div className="flex justify-between items-end mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Total a cobrar
                </span>
                <span className="text-4xl font-black italic tracking-tighter dark:text-white">
                  ${currentTotal}
                </span>
              </div>
              <button
                onClick={handleSave}
                className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-500/30"
              >
                Guardar Cita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
