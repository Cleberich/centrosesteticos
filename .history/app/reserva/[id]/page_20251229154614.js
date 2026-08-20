"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  Scissors,
  CheckCircle2,
  Loader2,
  Calendar,
  MapPin,
  ChevronLeft,
  Clock,
  User,
} from "lucide-react";

export default function PublicBookingPage() {
  const { id } = useParams();
  const [barberia, setBarberia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  const [booking, setBooking] = useState({
    customer: "",
    phone: "",
    barber: "",
    start: "",
    service: "Corte General",
  });

  // 1. Cargar datos y generar horas
  useEffect(() => {
    const fetchBarberia = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "barberias", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBarberia(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBarberia();
  }, [id]);

  // 2. Lógica de disponibilidad de horas
  useEffect(() => {
    if (step === 2 && barberia) {
      generateAvailableSlots();
    }
  }, [step, booking.barber]);

  const generateAvailableSlots = () => {
    // Definimos rango (esto podría venir de barberia.config si lo tienes)
    const startHour = 9;
    const endHour = 20;
    const interval = 30; // minutos entre turnos

    let slots = [];
    let current = new Date();
    current.setHours(startHour, 0, 0);

    const end = new Date();
    end.setHours(endHour, 0, 0);

    // Obtener horas ya ocupadas hoy para el barbero seleccionado
    const occupiedTimes =
      barberia.appointments
        ?.filter(
          (app) => app.barber === booking.barber && app.status !== "cancelled"
        )
        .map((app) => app.start) || [];

    while (current < end) {
      const timeString = current.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      // Solo agregar si no está ocupada
      if (!occupiedTimes.includes(timeString)) {
        slots.push(timeString);
      }
      current.setMinutes(current.getMinutes() + interval);
    }
    setAvailableSlots(slots);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!booking.start) return alert("Selecciona una hora");

    setIsSubmitting(true);
    try {
      const barberiaRef = doc(db, "barberias", id);
      const newAppointment = {
        ...booking,
        id: Date.now(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await updateDoc(barberiaRef, {
        appointments: arrayUnion(newAppointment),
      });

      setStep(3);

      // Notificación WhatsApp
      const cleanPhone = barberia.telefono?.replace(/\D/g, "");
      if (cleanPhone) {
        const msg = encodeURIComponent(
          `Nuevo Turno: ${booking.customer} - ${booking.service} con ${booking.barber} a las ${booking.start}hs`
        );
        setTimeout(
          () =>
            window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank"),
          1500
        );
      }
    } catch (e) {
      alert("Error al reservar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        {/* PASO 1: SELECCIÓN DE BARBERO */}
        {step === 1 && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white">
                {barberia.businessName}
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 text-blue-600">
                Elige tu barbero
              </p>
            </div>
            <div className="grid gap-3">
              {barberia.barbers?.map((b, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setBooking({ ...booking, barber: b.name });
                    setStep(2);
                  }}
                  className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-blue-600 transition-all shadow-sm"
                >
                  <div className="size-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-400">
                    {b.name[0]}
                  </div>
                  <div className="text-left">
                    <p className="font-black uppercase text-sm dark:text-white">
                      {b.name}
                    </p>
                    <p className="text-[9px] font-bold text-emerald-500 uppercase">
                      Disponible
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASO 2: FORMULARIO Y HORAS DISPONIBLES */}
        {step === 2 && (
          <form
            onSubmit={handleConfirm}
            className="animate-in slide-in-from-right-8 duration-300 space-y-6"
          >
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"
            >
              <ChevronLeft size={16} /> Volver
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <input
                required
                placeholder="Tu Nombre"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 font-bold dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all"
                onChange={(e) =>
                  setBooking({ ...booking, customer: e.target.value })
                }
              />

              <input
                required
                type="tel"
                placeholder="WhatsApp"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 font-bold dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all"
                onChange={(e) =>
                  setBooking({ ...booking, phone: e.target.value })
                }
              />

              <select
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 font-bold dark:text-white appearance-none"
                onChange={(e) =>
                  setBooking({ ...booking, service: e.target.value })
                }
              >
                <option>Corte General</option>
                <option>Barba</option>
                <option>Corte + Barba</option>
              </select>

              <div className="pt-4">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 ml-2 tracking-widest flex items-center gap-2">
                  <Clock size={12} /> Horas Disponibles para {booking.barber}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setBooking({ ...booking, start: time })}
                        className={`py-3 rounded-xl font-black text-xs transition-all ${
                          booking.start === time
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-95"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {time}
                      </button>
                    ))
                  ) : (
                    <p className="col-span-3 text-center text-[10px] font-bold text-red-500 uppercase">
                      No hay más turnos hoy
                    </p>
                  )}
                </div>
              </div>

              <button
                disabled={isSubmitting || !booking.start}
                type="submit"
                className="w-full bg-blue-600 text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all mt-6 disabled:opacity-50 text-xs tracking-widest"
              >
                {isSubmitting ? "Agendando..." : "Confirmar Turno"}
              </button>
            </div>
          </form>
        )}

        {/* PASO 3: ÉXITO */}
        {step === 3 && (
          <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
            <CheckCircle2 size={60} className="text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase dark:text-white tracking-tighter">
              ¡Listo, {booking.customer}!
            </h2>
            <p className="text-slate-500 font-bold text-sm mt-4 uppercase">
              Turno confirmado a las{" "}
              <span className="text-blue-600">{booking.start}hs</span>
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase mt-8 tracking-widest">
              Abriendo WhatsApp...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
