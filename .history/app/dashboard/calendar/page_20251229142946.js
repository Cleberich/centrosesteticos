"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  CheckCircle2,
  Loader2,
  Clock,
  Users,
  UserCircle,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt,
  Check,
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

  const saveToFirebase = async (newList) => {
    const docRef = doc(db, "barberias", user.uid);
    await updateDoc(docRef, { appointments: newList });
  };

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
    await saveToFirebase(newList);
    setIsDrawerOpen(false);
  };

  const handleFinalizePayment = async () => {
    const updatedApp = {
      ...currentApp,
      status: "done",
      total: totalAmount,
      paymentMethod: selectedMethod,
      paidAt: new Date().toISOString(),
    };
    const newList = appointments.map((a) =>
      a.id === currentApp.id ? updatedApp : a
    );
    setAppointments(newList);
    await saveToFirebase(newList);
    setShowPaymentSelector(false);
    setIsDrawerOpen(false);
  };

  const getTimeTop = (timeStr) => {
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
      {/* HEADER CON FILTROS DE BARBERO */}
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
              setShowPaymentSelector(false);
              setIsDrawerOpen(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20"
          >
            Nueva Cita
          </button>
        </div>

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
                    ? `${color?.tab} text-white`
                    : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                }`}
              >
                <div
                  className={`size-2 rounded-full ${
                    viewFilter === barber.name ? "bg-white" : color?.tab
                  }`}
                />
                {barber.name}
              </button>
            );
          })}
        </div>
      </header>

      {/* CALENDARIO GRID */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[1000px] h-full flex flex-col">
          <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#0a0f1a] z-20">
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
                      setShowPaymentSelector(false);
                      setIsDrawerOpen(true);
                    }}
                    className={`absolute left-1 right-1 rounded-xl border-l-4 p-2 z-10 overflow-hidden shadow-md transition-all cursor-pointer ${
                      app.status === "done"
                        ? "bg-slate-100 border-slate-300 text-slate-400 grayscale opacity-60"
                        : `${color?.bg} ${color?.border} ${color?.text}`
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
                      {app.status === "done" && (
                        <CheckCircle2 size={10} className="text-emerald-500" />
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

      {/* DRAWER UNIFICADO */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-[450px] bg-white dark:bg-slate-900 h-full flex flex-col p-8 overflow-y-auto animate-in slide-in-from-right shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">
                {showPaymentSelector
                  ? "Cobrar"
                  : currentApp.id
                  ? "Editar"
                  : "Nuevo"}{" "}
                <span className="text-blue-600">Turno</span>
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full dark:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {!showPaymentSelector ? (
              <form onSubmit={handleSave} className="space-y-6">
                {currentApp.id && currentApp.status !== "done" && (
                  <button
                    type="button"
                    onClick={() => setShowPaymentSelector(true)}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                  >
                    <CreditCard size={20} /> Proceder al Cobro
                  </button>
                )}
                {currentApp.status === "done" && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-600">
                    <CheckCircle2 size={20} />{" "}
                    <span className="text-[10px] font-black uppercase">
                      Servicio Cobrado con {currentApp.paymentMethod}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">
                      Día
                    </label>
                    <select
                      disabled={currentApp.status === "done"}
                      value={currentApp.day}
                      onChange={(e) =>
                        setCurrentApp({
                          ...currentApp,
                          day: parseInt(e.target.value),
                        })
                      }
                      className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white border-none outline-none"
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
                      Hora
                    </label>
                    <input
                      disabled={currentApp.status === "done"}
                      type="time"
                      value={currentApp.start}
                      onChange={(e) =>
                        setCurrentApp({ ...currentApp, start: e.target.value })
                      }
                      className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white border-none outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Barbero
                  </label>
                  <select
                    disabled={currentApp.status === "done"}
                    value={currentApp.barber}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, barber: e.target.value })
                    }
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white border-none outline-none"
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
                    Cliente
                  </label>
                  <input
                    disabled={currentApp.status === "done"}
                    value={currentApp.customer}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, customer: e.target.value })
                    }
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white border-none outline-none"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Servicios
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {availableServices.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          if (currentApp.status !== "done")
                            setCurrentApp((prev) => ({
                              ...prev,
                              selectedServiceIds:
                                prev.selectedServiceIds.includes(s.id)
                                  ? prev.selectedServiceIds.filter(
                                      (id) => id !== s.id
                                    )
                                  : [...prev.selectedServiceIds, s.id],
                            }));
                        }}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
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
                            {s.name} ({s.time}m)
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
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Total: {totalDuration} min
                    </p>
                    <p className="text-3xl font-black text-blue-600">
                      ${totalAmount}
                    </p>
                  </div>
                  {currentApp.status !== "done" && (
                    <button
                      type="submit"
                      className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl"
                    >
                      Guardar Turno
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-4">
                <button
                  onClick={() => setShowPaymentSelector(false)}
                  className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-2"
                >
                  ← Volver
                </button>
                <div className="grid grid-cols-1 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center justify-between p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10"
                          : "border-transparent bg-slate-50 dark:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-2xl ${
                            selectedMethod === method.id
                              ? "bg-blue-600 text-white"
                              : "bg-white text-slate-400 dark:bg-slate-700"
                          }`}
                        >
                          {method.icon}
                        </div>
                        <span className="font-black uppercase text-[11px] tracking-widest dark:text-white">
                          {method.name}
                        </span>
                      </div>
                      {selectedMethod === method.id && (
                        <Check size={20} className="text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleFinalizePayment}
                  className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl"
                >
                  Finalizar Cobro de ${totalAmount}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
