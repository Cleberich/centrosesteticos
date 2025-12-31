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
  Calendar as CalendarIcon,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const HOUR_HEIGHT = 80; // Altura de 1 hora en píxeles
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

  const [availableServices, setAvailableServices] = useState([]);
  const [team, setTeam] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [currentApp, setCurrentApp] = useState({
    id: null,
    customer: "",
    barber: "",
    start: "09:00",
    day: 0,
    status: "pending",
    selectedServiceIds: [],
  });

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

  // --- LÓGICA DE TIEMPO Y PRECIO DINÁMICO ---
  const { totalAmount, totalDuration } = useMemo(() => {
    return currentApp.selectedServiceIds.reduce(
      (acc, id) => {
        const service = availableServices.find((s) => s.id === id);
        return {
          totalAmount: acc.totalAmount + (Number(service?.price) || 0),
          totalDuration: acc.totalDuration + (Number(service?.time) || 30), // Default 30 min si no hay tiempo
        };
      },
      { totalAmount: 0, totalDuration: 0 }
    );
  }, [currentApp.selectedServiceIds, availableServices]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentApp.customer || currentApp.selectedServiceIds.length === 0) {
      return alert("Faltan datos del cliente o servicios");
    }

    const appData = {
      ...currentApp,
      total: totalAmount,
      duration: totalDuration, // Guardamos la duración total en minutos
    };

    let newList = currentApp.id
      ? appointments.map((a) => (a.id === currentApp.id ? appData : a))
      : [...appointments, { ...appData, id: Date.now() }];

    setAppointments(newList);
    const docRef = doc(db, "barberias", user.uid);
    await updateDoc(docRef, { appointments: newList });
    setIsDrawerOpen(false);
  };

  const getTimeTop = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return (hours + minutes / 60 - START_HOUR) * HOUR_HEIGHT;
  };

  // Función para calcular la altura de la cita según los minutos
  const getAppHeight = (durationInMinutes) => {
    return (durationInMinutes / 60) * HOUR_HEIGHT;
  };

  if (loading)
    return (
      <div className="h-full flex items-center justify-center dark:bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      <header className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-xl font-black italic uppercase tracking-tighter dark:text-white">
          Agenda <span className="text-blue-600">Pro</span>
        </h1>
        <button
          onClick={() => {
            setCurrentApp({
              id: null,
              customer: "",
              barber: team[0]?.name || "",
              start: "09:00",
              day: 0,
              status: "pending",
              selectedServiceIds: [],
            });
            setIsDrawerOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest"
        >
          Nueva Cita
        </button>
      </header>

      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[1000px] h-full flex flex-col">
          {/* Header Días */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-20">
            <div className="w-20 shrink-0 border-r border-slate-100 dark:border-slate-800" />
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 uppercase text-[10px] font-black text-slate-400">
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
            {/* Horas */}
            <div className="w-20 shrink-0 border-r border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-300 text-center">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} style={{ height: HOUR_HEIGHT }} className="pt-2">
                  {(i + START_HOUR).toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Grid con Citas Dinámicas */}
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative">
              {Array.from({ length: 13 * 7 }).map((_, idx) => (
                <div
                  key={idx}
                  className="hover:bg-blue-50/30 border-b border-slate-50 dark:border-slate-800/40"
                  style={{ height: HOUR_HEIGHT }}
                />
              ))}

              {appointments.map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    setCurrentApp(app);
                    setIsDrawerOpen(true);
                  }}
                  className={`absolute left-1 right-1 rounded-xl border-l-4 p-2 z-10 overflow-hidden shadow-md transition-all ${
                    app.status === "done"
                      ? "bg-slate-100 border-slate-400"
                      : "bg-blue-600 border-blue-400 text-white"
                  }`}
                  style={{
                    top: getTimeTop(app.start),
                    height: getAppHeight(app.duration) - 2, // AQUÍ SE APLICA LA DURACIÓN
                    gridColumnStart: app.day + 1,
                    gridColumnEnd: app.day + 2,
                  }}
                >
                  <p className="text-[10px] font-black uppercase italic leading-none">
                    {app.customer}
                  </p>
                  <div className="flex items-center gap-1 mt-1 opacity-80 text-[8px] font-bold">
                    <Clock size={8} /> {app.duration} min
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER FORMULARIO */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-[450px] bg-white dark:bg-slate-900 h-full flex flex-col p-8 overflow-y-auto">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 dark:text-white">
              Agendar <span className="text-blue-600">Servicio</span>
            </h2>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
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
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white border-none"
                  >
                    {DAYS.map((d, i) => (
                      <option key={d} value={i}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    value={currentApp.start}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, start: e.target.value })
                    }
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white border-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Barbero Asignado
                </label>
                <select
                  value={currentApp.barber}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, barber: e.target.value })
                  }
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white border-none"
                >
                  {team.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Nombre Cliente
                </label>
                <input
                  value={currentApp.customer}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, customer: e.target.value })
                  }
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white border-none"
                  placeholder="Ej: Roberto Gómez"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Seleccionar Servicios
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
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        currentApp.selectedServiceIds.includes(s.id)
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10"
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
                          {s.name} ({s.time} min)
                        </span>
                      </div>
                      <span className="text-xs font-black text-blue-600">
                        ${s.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Duración Total
                    </p>
                    <p className="text-lg font-black dark:text-white">
                      {totalDuration} minutos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Total
                    </p>
                    <p className="text-3xl font-black text-blue-600">
                      ${totalAmount}
                    </p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-500/30"
                >
                  Confirmar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
