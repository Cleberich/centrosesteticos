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

// Configuración inicial de medios de pago (Esto luego vendrá de tus Ajustes en la BD)
const PAYMENT_METHODS = [
  { id: "cash", name: "Efectivo", icon: <Banknote size={16} /> },
  { id: "transfer", name: "Transferencia", icon: <Receipt size={16} /> },
  { id: "mp", name: "Mercado Pago", icon: <Smartphone size={16} /> },
  { id: "pos", name: "POS / Tarjeta", icon: <CreditCard size={16} /> },
];

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false); // Nuevo estado
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

  // --- FUNCIÓN FINAL DE COBRO ---
  const handleFinalizePayment = async () => {
    const updatedApp = {
      ...currentApp,
      status: "done",
      total: totalAmount,
      paymentMethod: selectedMethod, // Guardamos cómo pagó
      paidAt: new Date().toISOString(),
    };

    const newList = appointments.map((a) =>
      a.id === currentApp.id ? updatedApp : a
    );
    setAppointments(newList);

    const docRef = doc(db, "barberias", user.uid);
    await updateDoc(docRef, { appointments: newList });

    setShowPaymentSelector(false);
    setIsDrawerOpen(false);
    alert(`Cobro realizado con ${selectedMethod.toUpperCase()}`);
  };

  const handleSave = async (e) => {
    e.preventDefault();
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

  if (loading)
    return (
      <div className="h-full flex items-center justify-center dark:bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      {/* HEADER Y CALENDARIO (Se mantienen igual que antes...) */}
      <header className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h1 className="text-xl font-black italic uppercase tracking-tighter dark:text-white">
          Agenda <span className="text-blue-600">Pro</span>
        </h1>
        <button
          onClick={() => {
            setCurrentApp({
              id: null,
              customer: "",
              barber: team[0]?.name,
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

      {/* GRID DE LA AGENDA */}
      <div className="flex-1 overflow-auto p-4">
        {/* Aquí iría el renderizado de las citas que ya tienes configurado */}
        <p className="text-[10px] text-slate-400 font-bold uppercase">
          Haz clic en una cita para editar o cobrar
        </p>
        <div className="flex gap-2 mt-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              onClick={() => {
                setCurrentApp(app);
                setIsDrawerOpen(true);
              }}
              className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
            >
              <p className="font-bold text-xs dark:text-white">
                {app.customer}
              </p>
              <p className="text-[10px] text-blue-600 font-bold">
                {app.status === "done" ? "✅ COBRADO" : "⏳ PENDIENTE"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DRAWER LATERAL */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => {
              setIsDrawerOpen(false);
              setShowPaymentSelector(false);
            }}
          />
          <div className="relative w-full max-w-[450px] bg-white dark:bg-slate-900 h-full flex flex-col p-8 overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic uppercase dark:text-white">
                {currentApp.id ? "Detalles" : "Nueva"}{" "}
                <span className="text-blue-600">Cita</span>
              </h2>
              <button onClick={() => setIsDrawerOpen(false)}>
                <X className="dark:text-white" />
              </button>
            </div>

            {!showPaymentSelector ? (
              /* VISTA DE EDICIÓN NORMAL */
              <div className="space-y-6">
                {currentApp.id && currentApp.status !== "done" && (
                  <button
                    onClick={() => setShowPaymentSelector(true)}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-500/20"
                  >
                    <CreditCard size={18} /> Proceder al Cobro
                  </button>
                )}

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Cliente
                  </label>
                  <input
                    value={currentApp.customer}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, customer: e.target.value })
                    }
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl dark:text-white font-bold border-none"
                  />

                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Barbero
                  </label>
                  <select
                    value={currentApp.barber}
                    onChange={(e) =>
                      setCurrentApp({ ...currentApp, barber: e.target.value })
                    }
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl dark:text-white font-bold border-none"
                  >
                    {team.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-6 border-t dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">
                    Total del Servicio
                  </p>
                  <p className="text-4xl font-black text-blue-600 mb-6">
                    ${totalAmount}
                  </p>
                  {currentApp.status !== "done" && (
                    <button
                      onClick={handleSave}
                      className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px]"
                    >
                      Guardar Cambios
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* VISTA DE SELECCIÓN DE PAGO (PASARELA) */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <button
                  onClick={() => setShowPaymentSelector(false)}
                  className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-2"
                >
                  ← Volver a detalles
                </button>

                <div>
                  <h3 className="text-lg font-black uppercase dark:text-white">
                    Selecciona Medio de Pago
                  </h3>
                  <p className="text-xs text-slate-400">
                    El total a cobrar es de{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      ${totalAmount}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                        selectedMethod === method.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10"
                          : "border-transparent bg-slate-50 dark:bg-slate-800 hover:bg-slate-100"
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
                        <span
                          className={`font-black uppercase text-[11px] tracking-widest ${
                            selectedMethod === method.id
                              ? "text-blue-600"
                              : "text-slate-500 dark:text-slate-300"
                          }`}
                        >
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
                  className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/40"
                >
                  Finalizar y Registrar Venta
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
