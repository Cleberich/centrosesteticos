"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  CheckCircle2,
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
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// --- CONFIGURACIÓN ESTÁTICA ---
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
];

const PAYMENT_METHODS = [
  { id: "cash", name: "Efectivo", icon: <Banknote size={16} /> },
  { id: "transfer", name: "Transferencia", icon: <Receipt size={16} /> },
  { id: "mp", name: "Mercado Pago", icon: <Smartphone size={16} /> },
  { id: "pos", name: "POS / Tarjeta", icon: <CreditCard size={16} /> },
];

export default function CalendarPage() {
  // --- ESTADOS ---
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [viewFilter, setViewFilter] = useState("all");

  // Drawer y Pagos
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("cash");

  const [currentApp, setCurrentApp] = useState({
    id: null,
    customer: "",
    phone: "",
    email: "",
    barber: "",
    start: "09:00",
    day: 0,
    status: "pending",
    selectedServiceIds: [],
  });

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "barberias", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTeam(data.barbers || []);
          setServices(data.services || []);
          setAppointments(data.appointments || []);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- CÁLCULOS ---
  const barberColorMap = useMemo(() => {
    const map = {};
    team.forEach(
      (b, i) => (map[b.name] = BARBER_COLORS[i % BARBER_COLORS.length])
    );
    return map;
  }, [team]);

  const filteredAppointments = useMemo(() => {
    return viewFilter === "all"
      ? appointments
      : appointments.filter((a) => a.barber === viewFilter);
  }, [appointments, viewFilter]);

  const { totalAmount, totalDuration } = useMemo(() => {
    return currentApp.selectedServiceIds.reduce(
      (acc, id) => {
        const s = services.find((serv) => serv.id === id);
        return {
          totalAmount: acc.totalAmount + (Number(s?.price) || 0),
          totalDuration: acc.totalDuration + (Number(s?.time) || 30),
        };
      },
      { totalAmount: 0, totalDuration: 0 }
    );
  }, [currentApp.selectedServiceIds, services]);

  // --- ACCIONES ---
  const saveApps = async (newList) => {
    setAppointments(newList);
    await updateDoc(doc(db, "barberias", user.uid), { appointments: newList });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentApp.customer || currentApp.selectedServiceIds.length === 0)
      return alert("Completa cliente y servicios");

    const appData = {
      ...currentApp,
      total: totalAmount,
      duration: totalDuration,
    };
    const newList = currentApp.id
      ? appointments.map((a) => (a.id === currentApp.id ? appData : a))
      : [...appointments, { ...appData, id: Date.now() }];

    await saveApps(newList);
    setIsDrawerOpen(false);
  };

  const handleDelete = async () => {
    if (window.confirm("¿Liberar turno?")) {
      await saveApps(appointments.filter((a) => a.id !== currentApp.id));
      setIsDrawerOpen(false);
    }
  };

  const handleFinalizePayment = async () => {
    const updated = {
      ...currentApp,
      status: "done",
      paymentMethod: selectedMethod,
      paidAt: new Date().toISOString(),
    };
    await saveApps(
      appointments.map((a) => (a.id === currentApp.id ? updated : a))
    );
    setIsDrawerOpen(false);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center dark:bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#0a0f1a] overflow-hidden">
      {/* HEADER */}
      <header className="px-8 py-6 border-b dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-black italic uppercase dark:text-white">
            Agenda <span className="text-blue-600">Pro</span>
          </h1>
          <button
            onClick={() => {
              setCurrentApp({
                id: null,
                customer: "",
                phone: "",
                email: "",
                barber: team[0]?.name || "",
                start: "09:00",
                day: 0,
                status: "pending",
                selectedServiceIds: [],
              });
              setShowPaymentSelector(false);
              setIsDrawerOpen(true);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase"
          >
            Nueva Cita
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setViewFilter("all")}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase ${
              viewFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            Todos
          </button>
          {team.map((b) => (
            <button
              key={b.id}
              onClick={() => setViewFilter(b.name)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase ${
                viewFilter === b.name
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </header>

      {/* CALENDARIO GRID */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[1000px]">
          <div className="flex sticky top-0 bg-white dark:bg-[#0a0f1a] z-20 border-b dark:border-slate-800">
            <div className="w-20 shrink-0" />
            <div className="flex-1 grid grid-cols-7 text-[10px] font-black text-slate-400 py-4 divide-x dark:divide-slate-800">
              {DAYS.map((d) => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>
          </div>
          <div className="flex relative" style={{ height: 13 * HOUR_HEIGHT }}>
            <div className="w-20 shrink-0 border-r dark:border-slate-800 text-[10px] font-bold text-slate-300 text-center">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} style={{ height: HOUR_HEIGHT }} className="pt-2">
                  {(i + START_HOUR).toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-7 divide-x dark:divide-slate-800 relative">
              {Array.from({ length: 13 * 7 }).map((_, i) => (
                <div
                  key={i}
                  className="border-b dark:border-slate-800/40"
                  style={{ height: HOUR_HEIGHT }}
                />
              ))}
              {filteredAppointments.map((app) => {
                const color = barberColorMap[app.barber] || BARBER_COLORS[0];
                const [h, m] = app.start.split(":").map(Number);
                const top = (h + m / 60 - START_HOUR) * HOUR_HEIGHT;
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      setCurrentApp(app);
                      setShowPaymentSelector(false);
                      setIsDrawerOpen(true);
                    }}
                    className={`absolute left-1 right-1 rounded-xl border-l-4 p-2 cursor-pointer shadow-sm ${
                      app.status === "done"
                        ? "bg-slate-100 text-slate-400 grayscale opacity-50"
                        : `${color.bg} ${color.text} ${color.border}`
                    }`}
                    style={{
                      top,
                      height: (app.duration / 60) * HOUR_HEIGHT - 2,
                      gridColumnStart: app.day + 1,
                    }}
                  >
                    <p className="text-[9px] font-black uppercase truncate">
                      {app.customer}
                    </p>
                    <p className="text-[7px] font-bold opacity-80">
                      {app.start} - {app.duration}m
                    </p>
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full p-8 overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase dark:text-white">
                {showPaymentSelector ? "Cobrar" : "Cita"}
              </h2>
              <div className="flex gap-2">
                {currentApp.id &&
                  currentApp.status !== "done" &&
                  !showPaymentSelector && (
                    <button
                      onClick={handleDelete}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="dark:text-white"
                >
                  <X />
                </button>
              </div>
            </div>

            {!showPaymentSelector ? (
              <form onSubmit={handleSave} className="space-y-4">
                {currentApp.id && currentApp.status !== "done" && (
                  <button
                    type="button"
                    onClick={() => setShowPaymentSelector(true)}
                    className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg"
                  >
                    Cobrar Servicio
                  </button>
                )}

                <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                  <input
                    required
                    value={currentApp.customer}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, customer: e.target.value })
                    }
                    className="w-full p-3 bg-white dark:bg-slate-800 rounded-lg text-sm font-bold dark:text-white"
                    placeholder="Nombre del Cliente"
                    disabled={currentApp.status === "done"}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg px-3">
                      <Phone size={14} className="text-slate-400 mr-2" />
                      <input
                        value={currentApp.phone}
                        onChange={(e) =>
                          setCurrentApp({
                            ...currentApp,
                            phone: e.target.value,
                          })
                        }
                        className="w-full py-3 bg-transparent text-xs font-bold dark:text-white outline-none"
                        placeholder="Teléfono"
                        disabled={currentApp.status === "done"}
                      />
                    </div>
                    <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg px-3">
                      <Mail size={14} className="text-slate-400 mr-2" />
                      <input
                        value={currentApp.email}
                        onChange={(e) =>
                          setCurrentApp({
                            ...currentApp,
                            email: e.target.value,
                          })
                        }
                        className="w-full py-3 bg-transparent text-xs font-bold dark:text-white outline-none"
                        placeholder="Email"
                        disabled={currentApp.status === "done"}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={currentApp.day}
                    onChange={(e) =>
                      setCurrentApp({
                        ...currentApp,
                        day: Number(e.target.value),
                      })
                    }
                    className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold dark:text-white border-none"
                    disabled={currentApp.status === "done"}
                  >
                    {DAYS.map((d, i) => (
                      <option key={d} value={i}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={currentApp.start}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, start: e.target.value })
                    }
                    className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold dark:text-white border-none"
                    disabled={currentApp.status === "done"}
                  />
                </div>

                <select
                  value={currentApp.barber}
                  onChange={(e) =>
                    setCurrentApp({ ...currentApp, barber: e.target.value })
                  }
                  className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold dark:text-white border-none"
                  disabled={currentApp.status === "done"}
                >
                  {team.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Servicios
                  </p>
                  {services.map((s) => (
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
                      className={`flex justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        currentApp.selectedServiceIds.includes(s.id)
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
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

                <div className="pt-4 border-t dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Total: {totalDuration}m
                    </span>
                    <span className="text-2xl font-black text-blue-600">
                      ${totalAmount}
                    </span>
                  </div>
                  {currentApp.status !== "done" && (
                    <button
                      type="submit"
                      className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl"
                    >
                      Guardar Turno
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <button
                  onClick={() => setShowPaymentSelector(false)}
                  className="text-[10px] font-black text-blue-600 uppercase"
                >
                  ← Volver
                </button>
                {PAYMENT_METHODS.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer ${
                      selectedMethod === m.id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-transparent bg-slate-50 dark:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          selectedMethod === m.id
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-slate-700 text-slate-400"
                        }`}
                      >
                        {m.icon}
                      </div>
                      <span className="text-xs font-black uppercase dark:text-white">
                        {m.name}
                      </span>
                    </div>
                    {selectedMethod === m.id && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </div>
                ))}
                <button
                  onClick={handleFinalizePayment}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl mt-4"
                >
                  Confirmar Pago de ${totalAmount}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
