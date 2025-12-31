"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Loader2,
  Clock,
  Users,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt,
  Check,
  Trash2,
  Phone,
  Mail,
  Calendar as CalendarIcon,
} from "lucide-react";
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

const BARBER_COLORS = [
  { bg: "bg-blue-600", border: "border-blue-400", tab: "bg-blue-600" },
  { bg: "bg-emerald-600", border: "border-emerald-400", tab: "bg-emerald-600" },
  { bg: "bg-purple-600", border: "border-purple-400", tab: "bg-purple-600" },
  { bg: "bg-amber-600", border: "border-amber-400", tab: "bg-amber-600" },
];

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("cash");
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [viewFilter, setViewFilter] = useState("all");

  // FUNCIÓN CLAVE PARA LA FECHA ACTUAL (YYYY-MM-DD)
  const getTodayString = () => {
    return new Date().toLocaleDateString("sv-SE"); // Retorna exactamente "2025-12-29"
  };

  const [currentApp, setCurrentApp] = useState({
    customer: "",
    phone: "",
    email: "",
    barber: "",
    start: "09:00",
    day: 0,
    date: getTodayString(),
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
          setTeam(data.barbers || []);
          setAvailableServices(data.services || []);
          setAppointments(data.appointments || []);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const barberColorMap = useMemo(() => {
    const map = {};
    team.forEach((barber, index) => {
      map[barber.name] = BARBER_COLORS[index % BARBER_COLORS.length];
    });
    return map;
  }, [team]);

  // FILTRO ULTRA ESTRICTO
  const filteredAppointments = useMemo(() => {
    const hoy = getTodayString();

    return appointments
      .filter((app) => {
        // 1. Limpiamos cualquier espacio o carácter invisible del dato de la DB
        const appDate = app.date ? String(app.date).trim() : "";

        // 2. Comparación binaria exacta
        return appDate === hoy;
      })
      .filter((app) => viewFilter === "all" || app.barber === viewFilter);
  }, [appointments, viewFilter]);

  const { totalAmount, totalDuration } = useMemo(() => {
    if (!currentApp.selectedServiceIds)
      return { totalAmount: 0, totalDuration: 0 };
    return currentApp.selectedServiceIds.reduce(
      (acc, id) => {
        const service = availableServices.find(
          (s) => String(s.id) === String(id)
        );
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
    if (!currentApp.customer) return alert("Falta el nombre");

    const appData = {
      ...currentApp,
      id: currentApp.id || Date.now().toString(),
      date: currentApp.date || getTodayString(),
      total: totalAmount,
      duration: totalDuration,
    };

    const newList = appointments.some((a) => a.id === appData.id)
      ? appointments.map((a) => (a.id === appData.id ? appData : a))
      : [...appointments, appData];

    setAppointments(newList);
    await updateDoc(doc(db, "barberias", user.uid), { appointments: newList });
    setIsDrawerOpen(false);
  };

  const handleDelete = async () => {
    if (!confirm("¿Borrar cita?")) return;
    const newList = appointments.filter((a) => a.id !== currentApp.id);
    setAppointments(newList);
    await updateDoc(doc(db, "barberias", user.uid), { appointments: newList });
    setIsDrawerOpen(false);
  };

  const getTimeTop = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return (hours + minutes / 60 - START_HOUR) * HOUR_HEIGHT;
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center dark:bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      <header className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black italic uppercase dark:text-white">
              Agenda de Hoy
            </h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              {getTodayString()}
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentApp({
                ...currentApp,
                id: null,
                customer: "",
                phone: "",
                email: "",
                selectedServiceIds: [],
                date: getTodayString(),
              });
              setIsDrawerOpen(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase"
          >
            Nueva Cita
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setViewFilter("all")}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase shrink-0 ${
              viewFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
            }`}
          >
            Todos
          </button>
          {team.map((b) => (
            <button
              key={b.id}
              onClick={() => setViewFilter(b.name)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase shrink-0 ${
                viewFilter === b.name
                  ? `${barberColorMap[b.name]?.tab} text-white`
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-auto relative">
        <div
          className="min-w-[1000px] flex relative"
          style={{ height: 13 * HOUR_HEIGHT }}
        >
          <div className="w-20 shrink-0 border-r dark:border-slate-800 text-[10px] font-bold text-slate-300 text-center">
            {Array.from({ length: 13 }).map((_, i) => (
              <div key={i} style={{ height: HOUR_HEIGHT }} className="pt-2">
                {(i + START_HOUR).toString().padStart(2, "0")}:00
              </div>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7 divide-x dark:divide-slate-800 relative">
            {filteredAppointments.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  setCurrentApp(app);
                  setIsDrawerOpen(true);
                }}
                className={`absolute left-1 right-1 rounded-xl p-2 z-10 cursor-pointer ${
                  barberColorMap[app.barber]?.bg || "bg-blue-600"
                } text-white shadow-lg`}
                style={{
                  top: getTimeTop(app.start),
                  height: (app.duration / 60) * HOUR_HEIGHT - 2,
                  gridColumnStart: app.day + 1,
                }}
              >
                <p className="text-[10px] font-black uppercase italic truncate">
                  {app.customer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-[450px] bg-white dark:bg-slate-900 h-full p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8 text-white">
              <h2 className="text-2xl font-black uppercase italic">Detalles</h2>
              <div className="flex gap-2">
                {currentApp.id && (
                  <button onClick={handleDelete} className="p-2 text-rose-500">
                    <Trash2 size={20} />
                  </button>
                )}
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <input
                value={currentApp.customer}
                onChange={(e) =>
                  setCurrentApp({ ...currentApp, customer: e.target.value })
                }
                className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white"
                placeholder="Nombre"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={currentApp.phone}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, phone: e.target.value })
                  }
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs dark:text-white"
                  placeholder="Teléfono"
                />
                <input
                  value={currentApp.email}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, email: e.target.value })
                  }
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs dark:text-white"
                  placeholder="Email"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={currentApp.start}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, start: e.target.value })
                  }
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white"
                />
                <select
                  value={currentApp.barber}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, barber: e.target.value })
                  }
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white"
                >
                  {team.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
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
                          ? prev.selectedServiceIds.filter((id) => id !== s.id)
                          : [...prev.selectedServiceIds, s.id],
                      }))
                    }
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex justify-between ${
                      currentApp.selectedServiceIds.includes(s.id)
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10"
                        : "border-transparent bg-slate-50 dark:bg-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold dark:text-white">
                      {s.name}
                    </span>
                    <span className="text-xs font-black text-blue-600">
                      ${s.price}
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase"
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
