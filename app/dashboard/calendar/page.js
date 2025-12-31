"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  CheckCircle2,
  Loader2,
  Clock,
  Banknote,
  Smartphone,
  Receipt,
  CreditCard,
  Check,
  Trash2,
  Plus,
  AlertOctagon,
  Phone,
  Sparkles,
  Flower2,
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const HOUR_HEIGHT = 95;
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

const SPECIALIST_COLORS = [
  {
    bg: "bg-white",
    border: "border-slate-300",
    accent: "bg-pink-600",
    tab: "bg-pink-600",
  },
  {
    bg: "bg-white",
    border: "border-slate-300",
    accent: "bg-purple-600",
    tab: "bg-purple-600",
  },
  {
    bg: "bg-white",
    border: "border-slate-300",
    accent: "bg-indigo-600",
    tab: "bg-indigo-600",
  },
  {
    bg: "bg-white",
    border: "border-slate-300",
    accent: "bg-rose-600",
    tab: "bg-rose-600",
  },
];

const PAYMENT_METHODS = [
  { id: "cash", name: "Efectivo", icon: <Banknote size={16} /> },
  { id: "transfer", name: "Transferencia", icon: <Receipt size={16} /> },
  { id: "mp", name: "Mercado Pago", icon: <Smartphone size={16} /> },
  { id: "pos", name: "POS / Tarjeta", icon: <CreditCard size={16} /> },
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
  const [isInactive, setIsInactive] = useState(false);

  const [currentApp, setCurrentApp] = useState({
    id: null,
    customer: "",
    phone: "",
    specialist: "",
    start: "09:00",
    day: 0,
    status: "pending",
    selectedServiceIds: [], // <--- MUY IMPORTANTE ESTA LÍNEA
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "centros_estetica", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTeam(data.specialists || []);
          setAvailableServices(data.services || []);
          setAppointments(data.appointments || []);
          setIsInactive(data.plan?.status === "inactive");
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const specialistColorMap = useMemo(() => {
    const map = {};
    team.forEach(
      (s, i) => (map[s.name] = SPECIALIST_COLORS[i % SPECIALIST_COLORS.length])
    );
    return map;
  }, [team]);

  const filteredAppointments = useMemo(() => {
    if (viewFilter === "all") return appointments;
    return appointments.filter((app) => app.specialist === viewFilter);
  }, [appointments, viewFilter]);

  const { totalAmount, totalDuration } = useMemo(() => {
    if (!currentApp.selectedServiceIds?.length)
      return { totalAmount: 0, totalDuration: 0 };
    return currentApp.selectedServiceIds.reduce(
      (acc, id) => {
        const s = availableServices.find(
          (svc) => String(svc.id) === String(id)
        );
        return {
          totalAmount: acc.totalAmount + (Number(s?.price) || 0),
          totalDuration: acc.totalDuration + (Number(s?.time) || 60),
        };
      },
      { totalAmount: 0, totalDuration: 0 }
    );
  }, [currentApp.selectedServiceIds, availableServices]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentApp.customer) return alert("Nombre obligatorio");
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(
      today.getDate() +
        (currentApp.day - (today.getDay() === 0 ? 6 : today.getDay() - 1))
    );

    const appData = {
      ...currentApp,
      id: currentApp.id || Math.random().toString(36).substring(2, 15),
      total: totalAmount,
      duration: totalDuration,
      date: targetDate.toLocaleDateString("sv-SE"),
      createdAt: currentApp.createdAt || new Date().toISOString(),
    };

    const newList = appointments.some(
      (a) => String(a.id) === String(currentApp.id)
    )
      ? appointments.map((a) =>
          String(a.id) === String(currentApp.id) ? appData : a
        )
      : [...appointments, appData];

    await updateDoc(doc(db, "centros_estetica", user.uid), {
      appointments: newList,
    });
    setAppointments(newList);
    setIsDrawerOpen(false);
  };

  const getTimeTop = (t) => {
    const [h, m] = t.split(":").map(Number);
    return (h + m / 60 - START_HOUR) * HOUR_HEIGHT;
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-pink-500" size={40} />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900  font-sans text-slate-900">
      {/* HEADER */}
      <header className="px-8 py-5 border-b-2 border-slate-100 sticky top-0 bg-white dark:bg-slate-900  z-40">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl dark:text-white text-slate-900 font-black uppercase  tracking-tighter">
            Agenda <span className="text-pink-600">Web</span>
          </h1>
          <button
            onClick={() => {
              setCurrentApp({
                id: null,
                customer: "",
                phone: "",
                specialist: team[0]?.name || "",
                start: "09:00",
                day: 0,
                status: "pending",
                selectedServiceIds: [],
              });
              setShowPaymentSelector(false);
              setIsDrawerOpen(true);
            }}
            className="dark:bg-pink-600 bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg"
          >
            + Nueva Cita
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setViewFilter("all")}
            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              viewFilter === "all"
                ? "bg-pink-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            Todos
          </button>
          {team.map((s) => (
            <button
              key={s.id}
              onClick={() => setViewFilter(s.name)}
              className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                viewFilter === s.name
                  ? `${specialistColorMap[s.name]?.tab} text-white`
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </header>

      {/* CALENDARIO */}
      <div className="flex-1 w-full overflow-auto bg-white dark:bg-slate-900 ">
        <div className="w-full h-full flex flex-col">
          <div className="flex border-b-2 border-slate-200 dark:border-slate-700 sticky top-0 z-20">
            <div className="w-20 border-r-2 border-slate-200 dark:border-slate-700" />
            <div className="flex-1 grid grid-cols-7 divide-x-2 divide-slate-100 dark:divide-slate-800 uppercase text-[11px] font-black text-slate-900">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="py-4 text-center bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300"
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
            <div className="w-20 border-r-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[12px] font-black text-slate-400 text-center">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} style={{ height: HOUR_HEIGHT }} className="pt-2">
                  {(i + START_HOUR).toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-7 divide-x-2 divide-slate-200 relative  bg-white dark:bg-slate-800 ">
              {Array.from({ length: 13 * 7 }).map((_, idx) => (
                <div
                  key={idx}
                  className="border-b border-slate-100 dark:border-slate-700"
                  style={{ height: HOUR_HEIGHT }}
                />
              ))}
              {filteredAppointments.map((app) => {
                const colors =
                  specialistColorMap[app.specialist] || SPECIALIST_COLORS[0];
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      setCurrentApp(app);
                      setShowPaymentSelector(false);
                      setIsDrawerOpen(true);
                    }}
                    className={`absolute left-1 right-1 rounded-lg border-2 shadow-sm cursor-pointer z-10 overflow-hidden flex bg-white ${colors.border}`}
                    style={{
                      top: getTimeTop(app.start) + 2,
                      height:
                        ((Number(app.duration) || 60) / 60) * HOUR_HEIGHT - 4,
                      gridColumnStart: app.day + 1,
                      gridColumnEnd: app.day + 2,
                    }}
                  >
                    <div className={`w-1.5 shrink-0 ${colors.accent}`} />
                    <div className="p-2 overflow-hidden">
                      <p className="text-[11px] font-black uppercase text-slate-900 leading-tight truncate">
                        {app.customer}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                        {app.start}hs • {app.duration}m
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full md:max-w-[480px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col p-8 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase text-slate-900 dark:text-slate-100">
                {showPaymentSelector ? "Cobrar" : "Detalles"}{" "}
                <span className="text-pink-600">Web</span>
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 bg-slate-100 rounded-lg text-slate-500 hover:text-red-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-32">
              {!showPaymentSelector ? (
                <form onSubmit={handleSave} className="space-y-6">
                  {currentApp.id && currentApp.status !== "done" && (
                    <button
                      type="button"
                      onClick={() => setShowPaymentSelector(true)}
                      className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 mb-4 transition-all hover:scale-[1.02]"
                    >
                      Confirmar y Cobrar
                    </button>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                        Clienta
                      </label>
                      <input
                        required
                        value={currentApp.customer}
                        onChange={(e) =>
                          setCurrentApp({
                            ...currentApp,
                            customer: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-slate-100 border-2 border-transparent focus:border-slate-900 rounded-xl font-bold outline-none uppercase text-sm"
                        placeholder="VALENTINA GÓMEZ"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                        WhatsApp
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          value={currentApp.phone}
                          onChange={(e) =>
                            setCurrentApp({
                              ...currentApp,
                              phone: e.target.value,
                            })
                          }
                          className="w-full pl-12 pr-4 py-4 bg-slate-100 border-2 border-transparent focus:border-slate-900 rounded-xl font-bold outline-none text-sm"
                          placeholder="09X XXX XXX"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
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
                          className="w-full p-4 bg-slate-100 rounded-xl font-bold outline-none text-sm uppercase"
                        >
                          {DAYS.map((d, i) => (
                            <option key={i} value={i}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                          Hora
                        </label>
                        <input
                          type="time"
                          value={currentApp.start}
                          onChange={(e) =>
                            setCurrentApp({
                              ...currentApp,
                              start: e.target.value,
                            })
                          }
                          className="w-full p-4 bg-slate-100 rounded-xl font-bold outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                        Especialista
                      </label>
                      <select
                        value={currentApp.specialist}
                        onChange={(e) =>
                          setCurrentApp({
                            ...currentApp,
                            specialist: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-slate-100 rounded-xl font-bold outline-none text-sm uppercase"
                      >
                        {team.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex justify-between">
                        <span>Tratamientos</span>
                        {currentApp.selectedServiceIds?.length === 0 && (
                          <span className="text-rose-500 animate-pulse">
                            Selección obligatoria
                          </span>
                        )}
                      </label>

                      <div className="grid gap-2">
                        {availableServices.map((s) => {
                          const isSelected =
                            currentApp.selectedServiceIds?.includes(s.id);
                          return (
                            <div
                              key={s.id}
                              onClick={() => {
                                if (currentApp.status !== "done") {
                                  const currentIds =
                                    currentApp.selectedServiceIds || [];
                                  setCurrentApp((prev) => ({
                                    ...prev,
                                    selectedServiceIds: isSelected
                                      ? currentIds.filter((id) => id !== s.id)
                                      : [...currentIds, s.id],
                                  }));
                                }
                              }}
                              className={`p-4 rounded-2xl border-2 flex justify-between items-center cursor-pointer transition-all group ${
                                isSelected
                                  ? "border-pink-500 bg-pink-50 shadow-sm"
                                  : "border-transparent bg-slate-50 hover:bg-slate-100"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {/* Icono de Checkbox Estético */}
                                <div
                                  className={`size-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                                    isSelected
                                      ? "bg-pink-500 border-pink-500 shadow-lg shadow-pink-500/20"
                                      : "bg-white border-slate-200"
                                  }`}
                                >
                                  {isSelected && (
                                    <Check
                                      size={14}
                                      className="text-white"
                                      strokeWidth={4}
                                    />
                                  )}
                                </div>
                                <span
                                  className={`text-[11px] font-black uppercase tracking-tight ${
                                    isSelected
                                      ? "text-pink-700"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {s.name}
                                </span>
                              </div>

                              <span
                                className={`text-xs font-black ${
                                  isSelected
                                    ? "text-pink-600"
                                    : "text-slate-400"
                                }`}
                              >
                                ${s.price}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <button
                    onClick={() => setShowPaymentSelector(false)}
                    className="text-[10px] font-black uppercase text-slate-400 mb-4 hover:text-pink-600"
                  >
                    ← Volver
                  </button>
                  <div className="grid gap-3">
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id)}
                        className={`p-6 rounded-[2rem] border-2 flex justify-between items-center transition-all ${
                          selectedMethod === m.id
                            ? "border-pink-500 bg-pink-50"
                            : "border-slate-100 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-5">
                          <div
                            className={`p-4 rounded-2xl ${
                              selectedMethod === m.id
                                ? "bg-pink-500 text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {m.icon}
                          </div>
                          <span className="font-black text-xs uppercase tracking-widest">
                            {m.name}
                          </span>
                        </div>
                        {selectedMethod === m.id && (
                          <div className="size-6 bg-pink-500 rounded-full flex items-center justify-center text-white">
                            <Check size={14} strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* TOTAL FIJO ABAJO */}
            <div className="relative bottom-0 left-0 right-0 pt-2 ">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    Duración
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {totalDuration} min
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    Costo Total
                  </p>
                  <p className="text-4xl font-black text-pink-500 tracking-tighter">
                    ${totalAmount}
                  </p>
                </div>
              </div>
              {!showPaymentSelector ? (
                <button
                  onClick={handleSave}
                  className="w-full py-5 bg-slate-900 dark:bg-pink-700 text-white rounded-full font-black uppercase tracking-[0.2em] shadow-xl hover:bg-pink-600 transition-all"
                >
                  Guardar Agenda
                </button>
              ) : (
                <button
                  onClick={() => alert("Cita finalizada")}
                  className="w-full py-5 bg-pink-500 text-white rounded-full font-black uppercase tracking-[0.2em] shadow-xl"
                >
                  Finalizar $${totalAmount}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
