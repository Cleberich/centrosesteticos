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
  Trash2,
  Phone,
  Mail,
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// ... (Constantes HOUR_HEIGHT, START_HOUR, DAYS, BARBER_COLORS, PAYMENT_METHODS se mantienen)

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

  // --- ESTADO ACTUALIZADO CON TELÉFONO Y MAIL ---
  const [currentApp, setCurrentApp] = useState({
    id: null,
    customer: "",
    phone: "", // Nuevo
    email: "", // Nuevo
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

  const handleDelete = async () => {
    if (!window.confirm("¿Liberar este turno?")) return;
    const newList = appointments.filter((a) => a.id !== currentApp.id);
    setAppointments(newList);
    await saveToFirebase(newList);
    setIsDrawerOpen(false);
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
      {/* ... (Header y Calendario se mantienen igual) ... */}
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
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest"
          >
            Nueva Cita
          </button>
        </div>
        {/* Filtros... */}
      </header>

      {/* GRID CALENDARIO (Se mantiene igual) */}
      <div className="flex-1 overflow-auto relative">
        {/* Renderizado de citas... */}
      </div>

      {/* DRAWER CON CAMPOS DE CONTACTO */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-[450px] bg-white dark:bg-slate-900 h-full flex flex-col p-8 overflow-y-auto animate-in slide-in-from-right shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic uppercase dark:text-white">
                {showPaymentSelector
                  ? "Cobrar"
                  : currentApp.id
                  ? "Editar"
                  : "Nuevo"}{" "}
                <span className="text-blue-600">Turno</span>
              </h2>
              <div className="flex items-center gap-2">
                {currentApp.id &&
                  currentApp.status !== "done" &&
                  !showPaymentSelector && (
                    <button
                      onClick={handleDelete}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-full"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full dark:text-white"
                >
                  <X size={20} />
                </button>
              </div>
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

                {/* --- SECCIÓN DATOS DEL CLIENTE --- */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">
                      Cliente
                    </label>
                    <input
                      disabled={currentApp.status === "done"}
                      value={currentApp.customer}
                      onChange={(e) =>
                        setCurrentApp({
                          ...currentApp,
                          customer: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white border-none outline-none"
                      placeholder="Nombre completo"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          disabled={currentApp.status === "done"}
                          type="tel"
                          value={currentApp.phone}
                          onChange={(e) =>
                            setCurrentApp({
                              ...currentApp,
                              phone: e.target.value,
                            })
                          }
                          className="w-full p-4 pl-10 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white border-none outline-none text-xs"
                          placeholder="Ej: 11 2345 6789"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">
                        Email
                      </label>
                      <div className="relative">
                        <Mail
                          size={14}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          disabled={currentApp.status === "done"}
                          type="email"
                          value={currentApp.email}
                          onChange={(e) =>
                            setCurrentApp({
                              ...currentApp,
                              email: e.target.value,
                            })
                          }
                          className="w-full p-4 pl-10 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white border-none outline-none text-xs"
                          placeholder="mail@ejemplo.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- SECCIÓN HORARIO Y BARBERO --- */}
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

                {/* SERVICIOS... */}
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
              /* SELECCIÓN DE PAGO (Pasarela)... */
              <div className="space-y-8 animate-in slide-in-from-bottom-4">
                {/* ...contenido de pago... */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
