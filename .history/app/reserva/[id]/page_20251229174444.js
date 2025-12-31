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
  Info,
  UserCircle, // Icono de respaldo para barbero
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
    barberImage: "", // Guardamos la imagen para el paso final
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Preparando Agenda...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* HEADER DE LA BARBERÍA */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-12 pb-8 px-6 text-center shadow-sm">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <div className="size-24 rounded-[2rem] bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-2xl overflow-hidden mb-6 group transition-transform hover:scale-105">
            {barberia?.logo ? (
              <img
                src={barberia.logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-blue-600">
                <Scissors size={32} />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white italic">
            {barberia?.businessName}
          </h1>
          <p className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
            <MapPin size={12} className="text-blue-600" />{" "}
            {barberia?.direccion || "Uruguay"}
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-6 -mt-4">
        {/* PASO 1: SELECCIÓN DE BARBERO CON FOTO */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">
                Selecciona Profesional
              </h3>
              <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">
                Paso 1/2
              </span>
            </div>

            <div className="grid gap-4">
              {barberia?.barbers?.length > 0 ? (
                barberia.barbers.map((b, idx) => (
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
                    className="group flex items-center gap-5 p-5 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-transparent hover:border-blue-600 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
                  >
                    {/* FOTO DEL BARBERO */}
                    <div className="size-20 rounded-3xl overflow-hidden bg-blue-50 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-md shrink-0">
                      {b.image ? (
                        <img
                          src={b.imageUrl}
                          alt={b.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-2xl text-blue-600 uppercase">
                          {b.name[0]}
                        </div>
                      )}
                    </div>

                    <div className="text-left flex-1">
                      <p className="font-black uppercase text-base dark:text-white tracking-tight">
                        {b.name}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1 mt-1">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                        Disponible
                      </p>
                    </div>
                    <ChevronLeft
                      size={20}
                      className="rotate-180 text-slate-300 group-hover:text-blue-600 translate-x-0 group-hover:translate-x-1 transition-all"
                    />
                  </button>
                ))
              ) : (
                <div className="text-center p-10 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    No hay barberos registrados
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PASO 2: FORMULARIO */}
        {step === 2 && (
          <form
            onSubmit={handleConfirm}
            className="space-y-6 animate-in slide-in-from-right-8 duration-500 pb-20"
          >
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full hover:scale-105 transition-all"
            >
              <ChevronLeft size={14} /> Cambiar Profesional
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
              {/* MINI PERFIL DEL BARBERO SELECCIONADO */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                <div className="size-12 rounded-2xl overflow-hidden border border-white dark:border-slate-700 shrink-0">
                  {booking.barberImage ? (
                    <img
                      src={booking.barberImage}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-xs font-black">
                      {booking.barber[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Barbero Seleccionado
                  </p>
                  <p className="text-sm font-black dark:text-white uppercase italic tracking-tighter">
                    {booking.barber}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    placeholder="TU NOMBRE COMPLETO"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 rounded-2xl pl-14 pr-6 py-5 font-black uppercase text-xs dark:text-white outline-none transition-all shadow-inner"
                    onChange={(e) =>
                      setBooking({ ...booking, customer: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <Smartphone
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    type="tel"
                    placeholder="WHATSAPP (SIN EL 0)"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 rounded-2xl pl-14 pr-6 py-5 font-black uppercase text-xs dark:text-white outline-none transition-all shadow-inner"
                    onChange={(e) =>
                      setBooking({ ...booking, phone: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <Scissors
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 rounded-2xl pl-14 pr-6 py-5 font-black uppercase text-xs dark:text-white outline-none appearance-none cursor-pointer"
                    onChange={(e) =>
                      setBooking({ ...booking, service: e.target.value })
                    }
                  >
                    <option>Corte General</option>
                    <option>Corte + Barba</option>
                    <option>Barba</option>
                    <option>Corte Niño</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 px-2">
                  <Clock size={14} className="text-blue-600" /> Horarios
                  Disponibles
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setBooking({ ...booking, start: time })}
                        className={`py-4 rounded-2xl font-black text-xs transition-all border-2 ${
                          booking.start === time
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/40 scale-95"
                            : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-600"
                        }`}
                      >
                        {time}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 text-center">
                      <p className="text-[10px] font-black text-red-500 uppercase">
                        Sin turnos para hoy
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                disabled={isSubmitting || !booking.start}
                type="submit"
                className="w-full bg-blue-600 text-white font-black uppercase py-6 rounded-[2rem] shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 text-[11px] tracking-[0.2em] flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Finalizar Reserva"
                )}
              </button>
            </div>
          </form>
        )}

        {/* PASO 3: ÉXITO */}
        {step === 3 && (
          <div className="animate-in zoom-in-95 duration-500 text-center py-16 px-8 bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-2xl mt-10">
            <div className="size-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black uppercase dark:text-white tracking-tighter italic">
              ¡Reserva Exitosa!
            </h2>
            <p className="text-slate-500 font-bold text-sm mt-4 uppercase tracking-tight max-w-[250px] mx-auto">
              Te esperamos a las{" "}
              <span className="text-blue-600 font-black">
                {booking.start}hs
              </span>{" "}
              con {booking.barber}.
            </p>
            <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
              <p className="text-[11px] font-bold dark:text-slate-300 uppercase">
                Revisa tu WhatsApp para la confirmación.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
