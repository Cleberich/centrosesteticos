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

// Paleta de colores profesionales para los barberos
const BARBER_COLORS = [
  {
    bg: "bg-blue-600",
    border: "border-blue-400",
    text: "text-white",
    tab: "bg-blue-600",
  },
  {
    bg: "bg-emerald-600",
    border: "border-emerald-400",
    text: "text-white",
    tab: "bg-emerald-600",
  },
  {
    bg: "bg-purple-600",
    border: "border-purple-400",
    text: "text-white",
    tab: "bg-purple-600",
  },
  {
    bg: "bg-amber-600",
    border: "border-amber-400",
    text: "text-white",
    tab: "bg-amber-600",
  },
  {
    bg: "bg-rose-600",
    border: "border-rose-400",
    text: "text-white",
    tab: "bg-rose-600",
  },
  {
    bg: "bg-indigo-600",
    border: "border-indigo-400",
    text: "text-white",
    tab: "bg-indigo-600",
  },
];

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [team, setTeam] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [viewFilter, setViewFilter] = useState("all");

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

  // --- ASIGNACIÓN DE COLORES DINÁMICOS ---
  const barberColorMap = useMemo(() => {
    const map = {};
    team.forEach((barber, index) => {
      map[barber.name] = BARBER_COLORS[index % BARBER_COLORS.length];
    });
    return map;
  }, [team]);

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
    await updateDoc(doc(db, "barberias", user.uid), { appointments: newList });
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
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest"
          >
            Nueva Cita
          </button>
        </div>

        {/* SELECTOR CON CÓDIGO DE COLORES */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setViewFilter("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
              viewFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-400 dark:bg-slate-800"
            }`}
          >
            <Users size={14} /> Todos
          </button>
          {team.map((barber) => {
            const color = barberColorMap[barber.name];
            return (
              <button
                key={barber.id}
                onClick={() => setViewFilter(barber.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                  viewFilter === barber.name
                    ? `${color.tab} text-white shadow-lg`
                    : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                }`}
              >
                <div
                  className={`size-2 rounded-full ${
                    viewFilter === barber.name ? "bg-white" : color.tab
                  }`}
                />
                {barber.name}
              </button>
            );
          })}
        </div>
      </header>

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

              {filteredAppointments.map((app) => {
                const color = barberColorMap[app.barber] || BARBER_COLORS[0];
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      setCurrentApp(app);
                      setIsDrawerOpen(true);
                    }}
                    className={`absolute left-1 right-1 rounded-xl border-l-4 p-2 z-10 overflow-hidden shadow-md transition-all cursor-pointer ${
                      app.status === "done"
                        ? "bg-slate-100 border-slate-300 text-slate-400 grayscale"
                        : `${color.bg} ${color.border} ${color.text}`
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
                        <span className="text-[7px] bg-black/20 px-1 rounded uppercase font-black">
                          {app.barber.split(" ")[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1 opacity-80 text-[8px] font-bold">
                      <Clock size={8} /> {app.duration} min
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* El Drawer de creación se mantiene igual... */}
    </div>
  );
}
