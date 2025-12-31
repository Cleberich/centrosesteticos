"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  Clock,
  User,
  Scissors,
  CheckCircle2,
  Loader2,
  Calendar,
  MapPin,
  ChevronLeft,
} from "lucide-react";

export default function PublicBookingPage() {
  const { id } = useParams();
  const [barberia, setBarberia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Selección de Staff, 2: Formulario, 3: Éxito
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [booking, setBooking] = useState({
    customer: "",
    phone: "",
    barber: "",
    start: "",
    service: "Corte General",
  });

  // --- 1. CARGAR DATOS DE LA BARBERÍA ---
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
        console.error("Error al cargar la barbería:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBarberia();
  }, [id]);

  // --- 2. PROCESAR RESERVA ---
  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!booking.start || !booking.customer || !booking.phone) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setIsSubmitting(true);
    try {
      const barberiaRef = doc(db, "barberias", id);

      const newAppointment = {
        id: Date.now(),
        customer: booking.customer,
        phone: booking.phone,
        barber: booking.barber,
        service: booking.service,
        start: booking.start,
        status: "pending",
        day: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
        createdAt: new Date().toISOString(),
      };

      // Guardar en Firebase
      await updateDoc(barberiaRef, {
        appointments: arrayUnion(newAppointment),
      });

      setStep(3);

      // Redirección a WhatsApp para notificar al barbero
      const cleanPhone = barberia.telefono?.replace(/\D/g, "");
      if (cleanPhone) {
        const msg = encodeURIComponent(
          `¡Hola! Acabo de agendar un turno online:\n\n` +
            `👤 Cliente: ${booking.customer}\n` +
            `✂️ Servicio: ${booking.service}\n` +
            `🧔 Barbero: ${booking.barber}\n` +
            `⏰ Hora: ${booking.start}hs\n\n` +
            `¡Nos vemos pronto!`
        );

        setTimeout(() => {
          window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
        }, 2000);
      }
    } catch (error) {
      console.error("Error al agendar:", error);
      alert("Hubo un problema al guardar tu reserva. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Cargando agenda...
        </p>
      </div>
    );
  }

  if (!barberia) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div>
          <h1 className="text-2xl font-black uppercase text-slate-300">
            Agenda no disponible
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-2 uppercase">
            El link es incorrecto o la barbería ya no acepta reservas online.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-20 transition-colors">
      <div className="max-w-xl mx-auto px-4 pt-10">
        {/* HEADER DE LA BARBERÍA */}
        <div className="text-center mb-10">
          <div className="size-20 bg-slate-900 dark:bg-blue-600 rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white shadow-2xl shadow-blue-500/20">
            <Scissors size={32} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white leading-none">
            {barberia.businessName}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4 text-slate-400">
            <MapPin size={14} />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              {barberia.direccion || "Ubicación no especificada"}
            </p>
          </div>
        </div>

        {/* PASO 1: SELECCIÓN DE BARBERO */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                Paso 1: Elige Profesional
              </span>
            </div>
            <div className="grid gap-3">
              {barberia.barbers && barberia.barbers.length > 0 ? (
                barberia.barbers.map((b, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setBooking({ ...booking, barber: b.name });
                      setStep(2);
                    }}
                    className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-blue-600 transition-all text-left shadow-sm active:scale-95"
                  >
                    <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      {b.imageUrl ? (
                        <img
                          src={b.imageUrl}
                          alt={b.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <User className="text-slate-400" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-black uppercase text-sm dark:text-white group-hover:text-blue-600 transition-colors">
                        {b.name}
                      </p>
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                        <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                        Disponible Hoy
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-center py-10 text-slate-400 font-bold uppercase text-xs">
                  No hay profesionales disponibles en este momento.
                </p>
              )}
            </div>
          </div>
        )}

        {/* PASO 2: FORMULARIO DE RESERVA */}
        {step === 2 && (
          <form
            onSubmit={handleConfirm}
            className="animate-in fade-in slide-in-from-right-4 duration-500 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="size-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Detalles del Turno
              </h3>
              <div className="size-10" /> {/* Spacer */}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                  Nombre Completo
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 font-bold dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all"
                  onChange={(e) =>
                    setBooking({ ...booking, customer: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                  WhatsApp
                </label>
                <input
                  required
                  type="tel"
                  placeholder="Tu celular para avisarte"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 font-bold dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all"
                  onChange={(e) =>
                    setBooking({ ...booking, phone: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                    Hora
                  </label>
                  <input
                    required
                    type="time"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 font-bold dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all"
                    onChange={(e) =>
                      setBooking({ ...booking, start: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                    Servicio
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 font-bold dark:text-white appearance-none outline-none focus:ring-2 ring-blue-500 transition-all"
                      onChange={(e) =>
                        setBooking({ ...booking, service: e.target.value })
                      }
                    >
                      <option value="Corte General">Corte General</option>
                      <option value="Corte y Barba">Corte y Barba</option>
                      <option value="Perfilado de Barba">
                        Perfilado de Barba
                      </option>
                      <option value="Corte Kids">Corte Kids</option>
                      <option value="Color / Reflejos">Color / Reflejos</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all mt-6 tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Procesando...
                </>
              ) : (
                "Confirmar Mi Turno"
              )}
            </button>
            <p className="text-[8px] font-black text-slate-400 text-center uppercase tracking-tighter">
              Al confirmar, te redirigiremos a WhatsApp para notificar a la
              barbería.
            </p>
          </form>
        )}

        {/* PASO 3: ÉXITO */}
        {step === 3 && (
          <div className="text-center p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="size-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-black uppercase dark:text-white tracking-tighter leading-tight">
              ¡Turno Confirmado!
            </h2>
            <p className="text-slate-500 font-bold text-sm mt-4 uppercase">
              Agendado con{" "}
              <span className="text-blue-600">{booking.barber}</span> a las{" "}
              <span className="text-blue-600">{booking.start}hs</span>.
            </p>

            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
              <div className="flex flex-col items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Te esperamos en:
                </p>
                <p className="font-black text-xs dark:text-white uppercase text-center">
                  {barberia.direccion}
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <div className="flex items-center justify-center gap-2 text-blue-500 animate-pulse">
                <Loader2 size={14} className="animate-spin" />
                <p className="text-[9px] font-black uppercase tracking-widest">
                  Abriendo WhatsApp...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-12 text-center">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
            Power by <span className="text-blue-600">BarberPro</span> System
          </p>
        </div>
      </div>
    </div>
  );
}
