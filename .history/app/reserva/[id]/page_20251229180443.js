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
  Calendar as CalendarIcon,
  ChevronRight,
} from "lucide-react";

export default function PublicBookingPage() {
  const { id } = useParams();
  const [barberia, setBarberia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDateObj, setSelectedDateObj] = useState(null);
  const [dateOptions, setDateOptions] = useState([]);

  const [booking, setBooking] = useState({
    customer: "",
    phone: "",
    email: "",
    barber: "",
    barberImage: "",
    start: "",
    service: "",
    selectedServiceIds: [], // Compatible con tu Calendar
    duration: 30,
    day: 0, // Índice para tu calendario (0-6)
  });

  useEffect(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        full: d.toISOString().split("T")[0],
        dayName: d.toLocaleDateString("es-ES", { weekday: "short" }),
        dayNum: d.getDate(),
        // Convertimos el día de JS (Dom=0) al tuyo (Lun=0)
        calendarIdx: d.getDay() === 0 ? 6 : d.getDay() - 1,
      });
    }
    setDateOptions(dates);
    setSelectedDateObj(dates[0]);

    const fetchBarberia = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "barberias", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBarberia(data);
          if (data.services?.length > 0) {
            const s = data.services[0];
            setBooking((prev) => ({
              ...prev,
              service: s.name,
              selectedServiceIds: [s.id],
              duration: Number(s.time) || 30,
            }));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBarberia();
  }, [id]);

  useEffect(() => {
    if (step === 2 && barberia) generateAvailableSlots();
  }, [step, booking.barber, selectedDateObj]);

  const generateAvailableSlots = () => {
    const slots = [];
    let current = new Date();
    current.setHours(8, 0, 0); // Empieza a las 8 como tu calendario
    const end = new Date();
    end.setHours(20, 0, 0);

    const occupied =
      barberia.appointments
        ?.filter(
          (a) =>
            a.barber === booking.barber &&
            a.date === selectedDateObj.full &&
            a.status !== "cancelled"
        )
        .map((a) => a.start) || [];

    while (current < end) {
      const time = current.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      if (!occupied.includes(time)) slots.push(time);
      current.setMinutes(current.getMinutes() + 30);
    }
    setAvailableSlots(slots);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!booking.start) return;
    setIsSubmitting(true);

    try {
      const barberiaRef = doc(db, "barberias", id);
      const newApp = {
        ...booking,
        id: Date.now(),
        date: selectedDateObj.full,
        day: selectedDateObj.calendarIdx, // El índice que usa tu CalendarPage
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await updateDoc(barberiaRef, { appointments: arrayUnion(newApp) });
      setStep(3);

      const msg = encodeURIComponent(
        `Turno: ${booking.customer}\nServicio: ${booking.service}\nFecha: ${selectedDateObj.full}\nHora: ${booking.start}`
      );
      window.open(`https://wa.me/${barberia.telefono}?text=${msg}`, "_blank");
    } catch (e) {
      alert("Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 font-sans antialiased">
      {/* HEADER COMPACTO */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="size-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
            <Scissors size={18} />
          </div>
          <h1 className="text-sm font-black uppercase tracking-tight">
            {barberia?.businessName}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {step === 1 && (
          <div className="max-w-md mx-auto space-y-3 pt-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-6">
              Selecciona Profesional
            </p>
            {barberia?.barbers?.map((b, i) => (
              <button
                key={i}
                onClick={() => {
                  setBooking({
                    ...booking,
                    barber: b.name,
                    barberImage: b.imageUrl,
                  });
                  setStep(2);
                }}
                className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-600 transition-all shadow-sm group"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full overflow-hidden border-2 border-slate-50">
                    <img
                      src={b.imageUrl || "/api/placeholder/150/150"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600">
                    {b.name}
                  </p>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in duration-500">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest"
            >
              <ChevronLeft size={14} /> Volver
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* FORMULARIO */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={booking.barberImage}
                    className="size-10 rounded-full object-cover"
                  />
                  <p className="text-xs font-black uppercase">
                    {booking.barber}
                  </p>
                </div>

                <div className="space-y-3">
                  <input
                    placeholder="TU NOMBRE"
                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 px-4 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none uppercase"
                    onChange={(e) =>
                      setBooking({ ...booking, customer: e.target.value })
                    }
                  />

                  <input
                    placeholder="TELÉFONO"
                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 px-4 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                    onChange={(e) =>
                      setBooking({ ...booking, phone: e.target.value })
                    }
                  />

                  <select
                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 px-4 text-xs font-bold uppercase outline-none appearance-none cursor-pointer"
                    onChange={(e) => {
                      const svc = barberia.services.find(
                        (s) => s.name === e.target.value
                      );
                      setBooking({
                        ...booking,
                        service: e.target.value,
                        selectedServiceIds: [svc.id],
                        duration: Number(svc.time),
                      });
                    }}
                  >
                    {barberia?.services?.map((s, i) => (
                      <option key={i} value={s.name}>
                        {s.name} - ${s.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CALENDARIO Y HORA */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {dateOptions.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDateObj(d)}
                      className={`flex flex-col items-center min-w-[55px] p-3 rounded-2xl transition-all ${
                        selectedDateObj?.full === d.full
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      <span className="text-[9px] font-black uppercase">
                        {d.dayName}
                      </span>
                      <span className="text-sm font-black">{d.dayNum}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setBooking({ ...booking, start: time })}
                      className={`py-2.5 rounded-xl text-[10px] font-black border transition-all ${
                        booking.start === time
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "bg-white border-slate-100 text-slate-500 hover:border-slate-400"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                <button
                  disabled={isSubmitting || !booking.start || !booking.customer}
                  onClick={handleConfirm}
                  className="w-full bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-20 shadow-xl shadow-blue-500/20"
                >
                  {isSubmitting ? "Procesando..." : "Confirmar Cita"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto text-center py-20">
            <CheckCircle2 className="text-emerald-500 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              ¡Reservado!
            </h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-2">
              Te esperamos el {selectedDateObj.full} a las {booking.start}hs
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
