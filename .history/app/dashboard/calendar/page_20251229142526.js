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
  Users,
  UserCircle,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const HOUR_HEIGHT = 80;
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

  // --- NUEVO ESTADO: FILTRO DE VISTA ---
  const [viewFilter, setViewFilter] = useState("all"); // "all" o el nombre del barbero

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

  // --- FILTRADO DE CITAS SEGÚN EL BARBERO SELECCIONADO ---
  const filteredAppointments = useMemo(() => {
    if (viewFilter === "all") return appointments;
    return appointments.filter((app) => app.barber === viewFilter);
  }, [appointments, viewFilter]);

  const { totalAmount, totalDuration } = useMemo(() => {
    return currentApp.selectedServiceIds.reduce(
      (acc, id) => {
        const service = availableServices.find((s) => s.id === id);
        return {
          totalAmount: acc.totalAmount + (Number(service?.price) || 0),
          totalDuration: acc.totalDuration + (Number(service?.time) || 30),
        };
      },
      { totalAmount: 0, totalDuration: 0 }
    );
  }, [currentApp.selectedServiceIds, availableServices]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentApp.customer || currentApp.selectedServiceIds.length === 0)
      return alert("Faltan datos");

    const appData = {
      ...currentApp,
      total: totalAmount,
      duration: totalDuration,
    };
    let newList = currentApp.id
      ? appointments.map((a) => (a.id === currentApp.id ? appData : a))
      : [...appointments, { ...appData, id: Date.now() }];

    setAppointments(newList);
    await updateDoc(docRef, { appointments: newList });
    setIsDrawerOpen(false);
  };

  const getTimeTop = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return (hours + minutes / 60 - START_HOUR) * HOUR_HEIGHT;
  };

  if (loading)
    return (
      <div className="h-full flex items-center justify-center dark:bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      {/* HEADER CON FILTROS */}
      <header className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black italic uppercase tracking-tighter dark:text-white">
            Agenda{" "}
            <span className="text-blue-600">
              {viewFilter === "all" ? "General" : viewFilter}
            </span>
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
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20"
          >
            Nueva Cita
          </button>
        </div>

        {/* SELECTOR DE BARBERO (TABS) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setViewFilter("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
              viewFilter === "all"
                ? "bg-slate-900 text-white dark:bg-blue-600"
                : "bg-slate-100 text-slate-400 dark:bg-slate-800"
            }`}
          >
            <Users size={14} /> Todos
          </button>
          {team.map((barber) => (
            <button
              key={barber.id}
              onClick={() => setViewFilter(barber.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                viewFilter === barber.name
                  ? "bg-slate-900 text-white dark:bg-blue-600"
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800"
              }`}
            >
              <UserCircle size={14} /> {barber.name}
            </button>
          ))}
        </div>
      </header>

      {/* CUERPO DEL CALENDARIO */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[1000px] h-full flex flex-col">
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
                  className="border-b border-slate-50 dark:border-slate-800/40"
                  style={{ height: HOUR_HEIGHT }}
                />
              ))}

              {/* RENDERIZADO FILTRADO */}
              {filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    setCurrentApp(app);
                    setIsDrawerOpen(true);
                  }}
                  className={`absolute left-1 right-1 rounded-xl border-l-4 p-2 z-10 overflow-hidden shadow-md transition-all ${
                    app.status === "done"
                      ? "bg-slate-100 border-slate-400 text-slate-400"
                      : "bg-blue-600 border-blue-400 text-white"
                  }`}
                  style={{
                    top: getTimeTop(app.start),
                    height: (app.duration / 60) * HOUR_HEIGHT - 2,
                    gridColumnStart: app.day + 1,
                    gridColumnEnd: app.day + 2,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black uppercase italic leading-none truncate">
                      {app.customer}
                    </p>
                    {viewFilter === "all" && (
                      <span className="text-[7px] bg-white/20 px-1 rounded uppercase font-black">
                        {app.barber.split(" ")[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1 opacity-80 text-[8px] font-bold">
                    <Clock size={8} /> {app.duration} min
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* El Drawer de creación se mantiene igual que el anterior... */}
    </div>
  );
}
