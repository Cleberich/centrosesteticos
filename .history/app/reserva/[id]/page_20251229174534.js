"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  CheckCircle2,
  Loader2,
  Calendar,
  MapPin,
  ChevronLeft,
  Clock,
  User,
  Scissors,
  Smartphone,
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
    barberImage: "",
    start: "",
    service: "Corte General",
  });

  useEffect(() => {
    const fetchBarberia = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "barberias", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBarberia(docSnap.data());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBarberia();
  }, [id]);

  useEffect(() => {
    if (step === 2 && barberia) {
      generateAvailableSlots();
    }
  }, [step, booking.barber]);

  const generateAvailableSlots = () => {
    const startHour = 9;
    const endHour = 20;
    const interval = 30;
    let slots = [];
    let current = new Date();
    current.setHours(startHour, 0, 0);
    const end = new Date();
    end.setHours(endHour, 0, 0);

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
      const cleanPhone = barberia.telefono?.replace(/\D/g, "");
      if (cleanPhone) {
        const msg = encodeURIComponent(
          `¡Hola! Reservé un turno:\n👤 *Nombre:* ${booking.customer}\n✂️ *Servicio:* ${booking.service}\n💈 *Barbero:* ${booking.barber}\n⏰ *Hora:* ${booking.start}hs`
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
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* HEADER BARBERÍA */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-10 pb-6 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <div className="size-20 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-xl overflow-hidden mx-auto mb-4">
            {barberia?.logo ? (
              <img
                src={barberia.logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-blue-600">
                <Scissors size={28} />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter dark:text-white italic">
            {barberia?.businessName}
          </h1>
          <p className="flex items-center justify-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">
            <MapPin size={10} className="text-blue-600" />{" "}
            {barberia?.direccion || "Uruguay"}
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-6">
        {/* PASO 1: SELECCIÓN DE BARBERO CON FOTO REAL (imageUrl) */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2">
              Selecciona tu Barbero
            </h3>

            <div className="grid gap-4">
              {barberia?.barbers?.map((b, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setBooking({
                      ...booking,
                      barber: b.name,
                      barberImage: b.imageUrl,
                    });
                    setStep(2);
                  }}
                  className="group flex items-center gap-5 p-4 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-transparent hover:border-blue-600 transition-all shadow-lg shadow-slate-200/40 dark:shadow-none"
                >
                  {/* FOTO DEL BARBERO USANDO imageUrl */}
                  <div className="size-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shrink-0 shadow-sm">
                    {b.imageUrl ? (
                      <img
                        src={b.imageUrl}
                        alt={b.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-black text-xl">
                        {b.name[0]}
                      </div>
                    )}
                  </div>

                  <div className="text-left flex-1">
                    <p className="font-black uppercase text-base dark:text-white tracking-tight">
                      {b.name}
                    </p>
                    <p className="text-[9px] font-bold text-emerald-500 uppercase flex items-center gap-1 mt-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                      Disponible para hoy
                    </p>
                  </div>
                  <div className="size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronLeft size={16} className="rotate-180" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASO 2: FORMULARIO Y HORARIOS */}
        {step === 2 && (
          <form
            onSubmit={handleConfirm}
            className="space-y-6 animate-in slide-in-from-right-8 duration-500"
          >
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-[9px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full"
            >
              <ChevronLeft size={14} /> Volver a barberos
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
              {/* MINI CARD DEL BARBERO SELECCIONADO */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="size-14 rounded-xl overflow-hidden border-2 border-white dark:border-slate-600 shrink-0">
                  {booking.barberImage ? (
                    <img
                      src={booking.barberImage}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-black">
                      {booking.barber[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    Barbero
                  </p>
                  <p className="text-sm font-black dark:text-white uppercase italic">
                    {booking.barber}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  required
                  placeholder="TU NOMBRE"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-5 py-4 font-black uppercase text-[11px] dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all"
                  onChange={(e) =>
                    setBooking({ ...booking, customer: e.target.value })
                  }
                />

                <input
                  required
                  type="tel"
                  placeholder="WHATSAPP"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-5 py-4 font-black uppercase text-[11px] dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all"
                  onChange={(e) =>
                    setBooking({ ...booking, phone: e.target.value })
                  }
                />

                <select
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-5 py-4 font-black uppercase text-[11px] dark:text-white outline-none"
                  onChange={(e) =>
                    setBooking({ ...booking, service: e.target.value })
                  }
                >
                  <option>Corte General</option>
                  <option>Corte + Barba</option>
                  <option>Barba</option>
                </select>
              </div>

              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <Clock size={12} className="text-blue-600" /> Horarios
                  Disponibles
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setBooking({ ...booking, start: time })}
                      className={`py-3.5 rounded-xl font-black text-[11px] transition-all ${
                        booking.start === time
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-95"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={isSubmitting || !booking.start}
                type="submit"
                className="w-full bg-blue-600 text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 text-[11px] tracking-widest"
              >
                {isSubmitting ? "AGENDANDO..." : "CONFIRMAR TURNO"}
              </button>
            </div>
          </form>
        )}

        {/* PASO 3: ÉXITO */}
        {step === 3 && (
          <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
            <CheckCircle2 size={50} className="text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black uppercase dark:text-white tracking-tighter">
              ¡Reserva Lista!
            </h2>
            <p className="text-slate-500 font-bold text-xs mt-4 uppercase">
              Nos vemos a las{" "}
              <span className="text-blue-600">{booking.start}hs</span> con{" "}
              {booking.barber}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
