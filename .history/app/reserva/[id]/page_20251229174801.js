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
  Star,
} from "lucide-react";

export default function PublicBookingPage() {
  const { id } = useParams();

  // Estados de la aplicación
  const [barberia, setBarberia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Estado del formulario de reserva
  const [booking, setBooking] = useState({
    customer: "",
    phone: "",
    barber: "",
    barberImage: "",
    start: "",
    service: "",
  });

  // 1. Cargar datos de la barbería desde Firestore
  useEffect(() => {
    const fetchBarberia = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "barberias", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBarberia(data);

          // Inicializar con el primer servicio disponible de la base de datos
          if (data.services && data.services.length > 0) {
            const firstService = data.services[0].name || data.services[0];
            setBooking((prev) => ({ ...prev, service: firstService }));
          }
        }
      } catch (error) {
        console.error("Error al cargar barbería:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBarberia();
  }, [id]);

  // 2. Generar horarios disponibles cuando se selecciona un barbero
  useEffect(() => {
    if (step === 2 && barberia) {
      generateAvailableSlots();
    }
  }, [step, booking.barber]);

  const generateAvailableSlots = () => {
    const startHour = 9;
    const endHour = 20;
    const interval = 30; // Minutos por turno

    let slots = [];
    let current = new Date();
    current.setHours(startHour, 0, 0);
    const end = new Date();
    end.setHours(endHour, 0, 0);

    // Filtrar citas ya ocupadas para el barbero y día actual
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

  // 3. Confirmar la reserva
  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!booking.start) return alert("Por favor, selecciona una hora.");

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

      // Redirigir a WhatsApp para notificación
      const cleanPhone = barberia.telefono?.replace(/\D/g, "");
      if (cleanPhone) {
        const msg = encodeURIComponent(
          `¡Hola! Acabo de reservar un turno:\n\n` +
            `👤 *Cliente:* ${booking.customer}\n` +
            `✂️ *Servicio:* ${booking.service}\n` +
            `💈 *Barbero:* ${booking.barber}\n` +
            `⏰ *Horario:* ${booking.start}hs\n\n` +
            `Confirmame si está todo OK. ¡Gracias!`
        );
        setTimeout(
          () =>
            window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank"),
          1000
        );
      }
    } catch (e) {
      console.error(e);
      alert("Hubo un error al procesar tu reserva.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <Loader2
            className="animate-spin text-blue-600 mb-2 mx-auto"
            size={40}
          />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Cargando Agenda...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-10">
      {/* HEADER: LOGO Y NOMBRE */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-12 pb-8 px-6 text-center shadow-sm">
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
          <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white italic leading-tight">
            {barberia?.businessName || "Barbería"}
          </h1>
          <div className="flex items-center gap-1.5 mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <MapPin size={12} className="text-blue-600" />
            {barberia?.direccion || "Montevideo, Uruguay"}
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto p-6 -mt-4">
        {/* PASO 1: SELECCIONAR BARBERO (USA imageUrl) */}
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
                  className="group flex items-center gap-5 p-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-transparent hover:border-blue-600 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
                >
                  <div className="size-20 rounded-[1.8rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-md shrink-0">
                    {b.imageUrl ? (
                      <img
                        src={b.imageUrl}
                        alt={b.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-2xl text-blue-600 bg-blue-50 uppercase">
                        {b.name[0]}
                      </div>
                    )}
                  </div>

                  <div className="text-left flex-1">
                    <p className="font-black uppercase text-base dark:text-white tracking-tight">
                      {b.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />{" "}
                        Disponible
                      </span>
                    </div>
                  </div>
                  <div className="mr-2 size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronLeft size={18} className="rotate-180" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASO 2: FORMULARIO Y SERVICIOS DINÁMICOS */}
        {step === 2 && (
          <form
            onSubmit={handleConfirm}
            className="space-y-6 animate-in slide-in-from-right-8 duration-500"
          >
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full hover:scale-105 transition-all"
            >
              <ChevronLeft size={14} /> Volver a Barberos
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
              {/* RESUMEN BARBERO */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
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
                    Barbero Seleccionado
                  </p>
                  <p className="text-sm font-black dark:text-white uppercase italic tracking-tighter">
                    {booking.barber}
                  </p>
                </div>
              </div>

              {/* INPUTS DE CLIENTE */}
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

                {/* SELECT DE SERVICIOS DINÁMICO */}
                <div className="relative">
                  <Scissors
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    required
                    value={booking.service}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 rounded-2xl pl-14 pr-10 py-5 font-black uppercase text-xs dark:text-white outline-none appearance-none cursor-pointer transition-all shadow-inner"
                    onChange={(e) =>
                      setBooking({ ...booking, service: e.target.value })
                    }
                  >
                    {barberia?.services?.map((svc, index) => (
                      <option key={index} value={svc.name || svc}>
                        {(svc.name || svc).toUpperCase()}{" "}
                        {svc.price ? `- $${svc.price}` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronLeft
                    size={16}
                    className="absolute right-5 top-1/2 -translate-y-1/2 -rotate-90 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* GRILLA DE HORARIOS */}
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
                    <div className="col-span-full p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl text-center border border-red-100">
                      <p className="text-[10px] font-black text-red-500 uppercase">
                        Sin turnos disponibles hoy
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

        {/* PASO 3: PANTALLA DE ÉXITO */}
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Instrucciones
              </p>
              <p className="text-[11px] font-bold dark:text-slate-300">
                Se ha abierto WhatsApp para que confirmes tu turno. Si no se
                abrió, contactanos manualmente.
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="mt-8 text-[10px] font-black uppercase text-blue-600 underline tracking-widest"
            >
              Hacer otra reserva
            </button>
          </div>
        )}
      </div>

      <footer className="mt-10 text-center opacity-30">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] dark:text-white">
          Barber Manager Pro
        </p>
      </footer>
    </div>
  );
}
