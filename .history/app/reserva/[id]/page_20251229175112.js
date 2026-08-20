"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  ChevronLeft,
  Clock,
  User,
  Scissors,
  Smartphone,
  CalendarCheck2,
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
    service: "",
  });

  useEffect(() => {
    const fetchBarberia = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "barberias", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBarberia(data);

          if (data.services && data.services.length > 0) {
            const firstService = data.services[0].name || data.services[0];
            setBooking((prev) => ({ ...prev, service: firstService }));
          }
        }
      } catch (error) {
        console.error("Error:", error);
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

      let barberPhone = barberia.telefono?.replace(/\D/g, "");
      if (barberPhone.startsWith("0")) {
        barberPhone = "598" + barberPhone.substring(1);
      } else if (!barberPhone.startsWith("598")) {
        barberPhone = "598" + barberPhone;
      }

      if (barberPhone) {
        const msg = encodeURIComponent(
          `¡Hola! Reservé un turno:\n👤 *Cliente:* ${booking.customer}\n✂️ *Servicio:* ${booking.service}\n💈 *Barbero:* ${booking.barber}\n⏰ *Horario:* ${booking.start}hs`
        );
        setTimeout(
          () =>
            window.open(`https://wa.me/${barberPhone}?text=${msg}`, "_blank"),
          1000
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-20">
      {/* HEADER DINÁMICO */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-16 pb-12 px-6 text-center shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="size-28 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-2xl overflow-hidden mb-6 transition-transform hover:rotate-3">
            {barberia?.logo ? (
              <img
                src={barberia.logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-blue-600">
                <Scissors size={40} />
              </div>
            )}
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white italic">
            {barberia?.businessName}
          </h1>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <MapPin size={14} className="text-blue-600" />{" "}
            {barberia?.direccion || "Montevideo, Uruguay"}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 mt-4">
        {/* PASO 1: SELECCIÓN DE BARBERO */}
        {step === 1 && (
          <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center">
              <h3 className="text-sm font-black uppercase text-blue-600 tracking-[0.2em] mb-2">
                Paso 1
              </h3>
              <p className="text-2xl font-black dark:text-white uppercase italic">
                ¿Con quién te quieres atender?
              </p>
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
                  className="group flex items-center gap-6 p-5 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-transparent hover:border-blue-600 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1"
                >
                  <div className="size-24 rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shrink-0 shadow-lg">
                    {b.imageUrl ? (
                      <img
                        src={b.imageUrl}
                        alt={b.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-3xl text-blue-600 uppercase">
                        {b.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-black uppercase text-xl dark:text-white tracking-tight">
                      {b.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        Disponible hoy
                      </span>
                    </div>
                  </div>
                  <div className="mr-4 size-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronLeft size={24} className="rotate-180" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASO 2: DISEÑO DE 2 COLUMNAS (Responsive) */}
        {step === 2 && (
          <form
            onSubmit={handleConfirm}
            className="animate-in fade-in zoom-in-95 duration-500"
          >
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mb-8 flex items-center gap-2 text-[11px] font-black uppercase text-slate-500 bg-white dark:bg-slate-900 px-6 py-3 rounded-full shadow-md hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={16} /> Volver a selección de barberos
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* COLUMNA IZQUIERDA: PERFIL Y DATOS (4/12) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col items-center text-center pb-8 border-b border-slate-100 dark:border-slate-800 mb-8">
                    <div className="size-32 rounded-[2.5rem] overflow-hidden border-4 border-blue-50 dark:border-slate-700 shadow-2xl mb-4">
                      {booking.barberImage ? (
                        <img
                          src={booking.barberImage}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-4xl font-black">
                          {booking.barber[0]}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">
                      Tu Profesional
                    </p>
                    <h2 className="text-3xl font-black dark:text-white uppercase italic tracking-tighter">
                      {booking.barber}
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div className="relative group">
                      <User
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                        size={20}
                      />
                      <input
                        required
                        placeholder="TU NOMBRE"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 rounded-[1.5rem] pl-16 pr-6 py-5 font-black uppercase text-xs dark:text-white outline-none transition-all shadow-inner"
                        onChange={(e) =>
                          setBooking({ ...booking, customer: e.target.value })
                        }
                      />
                    </div>

                    <div className="relative group">
                      <Smartphone
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                        size={20}
                      />
                      <input
                        required
                        type="tel"
                        placeholder="TELÉFONO (09X...)"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 rounded-[1.5rem] pl-16 pr-6 py-5 font-black uppercase text-xs dark:text-white outline-none transition-all shadow-inner"
                        onChange={(e) =>
                          setBooking({ ...booking, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="relative group">
                      <Scissors
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                        size={20}
                      />
                      <select
                        required
                        value={booking.service}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 rounded-[1.5rem] pl-16 pr-12 py-5 font-black uppercase text-xs dark:text-white outline-none appearance-none cursor-pointer shadow-inner"
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
                        size={18}
                        className="absolute right-6 top-1/2 -translate-y-1/2 -rotate-90 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA: HORARIOS (7/12) */}
              <div className="lg:col-span-7">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 lg:p-12 shadow-2xl border border-slate-100 dark:border-slate-800 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/30">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black dark:text-white uppercase italic tracking-tight leading-none">
                        Selecciona la Hora
                      </h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        Horarios disponibles para hoy
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() =>
                            setBooking({ ...booking, start: time })
                          }
                          className={`py-5 rounded-[1.5rem] font-black text-sm transition-all border-2 ${
                            booking.start === time
                              ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/40 scale-95"
                              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-600 hover:scale-[1.02]"
                          }`}
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <CalendarCheck2
                          className="mx-auto text-slate-300 mb-3"
                          size={40}
                        />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          No hay turnos libres hoy
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-10">
                    <button
                      disabled={isSubmitting || !booking.start}
                      type="submit"
                      className="w-full bg-blue-600 text-white font-black uppercase py-7 rounded-[2rem] shadow-2xl shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 text-[13px] tracking-[0.3em] flex items-center justify-center gap-4"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        "Confirmar Mi Turno"
                      )}
                    </button>
                    <p className="text-center mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Se abrirá WhatsApp para la confirmación
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* PASO 3: ÉXITO */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-700 text-center py-20 px-10 bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl border border-slate-100 dark:border-slate-800 mt-10">
            <div className="size-32 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
              <CheckCircle2 size={64} className="text-emerald-500" />
            </div>
            <h2 className="text-5xl font-black uppercase dark:text-white tracking-tighter italic leading-none">
              ¡Listo!
            </h2>
            <p className="text-slate-500 font-bold text-lg mt-6 uppercase tracking-tight">
              Te agendamos para las{" "}
              <span className="text-blue-600 font-black underline decoration-4 underline-offset-4">
                {booking.start}hs
              </span>
            </p>
            <div className="mt-12 flex items-center justify-center gap-4 bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
              <div className="size-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img
                  src={booking.barberImage}
                  className="w-full h-full object-cover"
                  alt="Barbero"
                />
              </div>
              <p className="text-xs font-black dark:text-white uppercase tracking-widest">
                Con {booking.barber}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
