"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Calendar,
  Clock,
  Briefcase,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function PublicBookingPage() {
  const { id } = useParams();
  const [estetica, setEstetica] = useState(null);
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
    specialist: "", // Cambiado de barber
    start: "09:00",
    service: "",
    selectedServiceIds: [],
    duration: 60,
    day: 0,
  });

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7)
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(
      3,
      6
    )} ${phoneNumber.slice(6, 9)}`;
  };

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setBooking({ ...booking, phone: formattedValue });
  };

  useEffect(() => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      // Extendí a 14 días para estética
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        full: d.toISOString().split("T")[0],
        dayName: d.toLocaleDateString("es-ES", { weekday: "short" }),
        dayNum: d.getDate(),
        calendarIdx: d.getDay() === 0 ? 6 : d.getDay() - 1,
      });
    }
    setDateOptions(dates);
    setSelectedDateObj(dates[0]);

    const fetchEstetica = async () => {
      if (!id) return;
      try {
        // CAMBIO DE COLECCIÓN A centros_estetica
        const docRef = doc(db, "centros_estetica", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEstetica(data);
          if (data.services?.length > 0) {
            const s = data.services[0];
            setBooking((prev) => ({
              ...prev,
              service: s.name,
              selectedServiceIds: [s.id],
              duration: Number(s.time) || 60,
            }));
          }
        }
      } catch (e) {
        console.error("Error cargando centro de estética:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchEstetica();
  }, [id]);

  useEffect(() => {
    if (step === 2 && estetica) {
      const slots = [];
      let current = new Date();
      current.setHours(9, 0, 0); // Estética suele empezar a las 9
      const end = new Date();
      end.setHours(20, 0, 0);

      const occupied =
        estetica.appointments
          ?.filter(
            (a) =>
              a.specialist === booking.specialist &&
              a.date === selectedDateObj?.full &&
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
    }
  }, [step, booking.specialist, selectedDateObj, estetica]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!booking.customer || !booking.start) return alert("Faltan datos");
    if (booking.phone.length < 11)
      return alert("El teléfono debe ser 09X XXX XXX");

    setIsSubmitting(true);
    try {
      const esteticaRef = doc(db, "centros_estetica", id);
      const appointmentToSave = {
        id: Date.now(),
        customer: booking.customer,
        phone: booking.phone,
        email: booking.email || "",
        specialist: booking.specialist,
        start: booking.start,
        date: selectedDateObj.full,
        day: selectedDateObj.calendarIdx,
        duration: Number(booking.duration),
        selectedServiceIds: booking.selectedServiceIds,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      await updateDoc(esteticaRef, {
        appointments: arrayUnion(appointmentToSave),
      });
      setStep(3);
    } catch (error) {
      alert("Error al guardar la cita.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-pink-500" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f0a0c] text-slate-100 font-sans selection:bg-pink-500/30">
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-white/5 py-4 px-6 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 p-[2px]">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                {estetica?.logo ? (
                  <img
                    src={estetica.logo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Sparkles className="text-pink-500" size={20} />
                )}
              </div>
            </div>
            <h1 className="text-sm font-black uppercase tracking-widest italic">
              {estetica?.businessName}
            </h1>
          </div>
          <div className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">
              Cita Online
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-10">
        {step === 1 && (
          <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                Tu <span className="text-pink-500">Especialista</span>
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                Selecciona con quién deseas atenderte
              </p>
            </div>
            <div className="space-y-3">
              {estetica?.specialists?.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setBooking({ ...booking, specialist: s.name });
                    setStep(2);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/50 border border-white/5 rounded-3xl hover:border-pink-500/50 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-full bg-slate-800 border border-white/10 overflow-hidden ring-2 ring-transparent group-hover:ring-pink-500/30 transition-all">
                      <img
                        src={
                          s.imageUrl ||
                          `https://api.dicebear.com/7.x/adventurer/svg?seed=${s.name}`
                        }
                        className="w-full h-full object-cover"
                        alt={s.name}
                      />
                    </div>
                    <p className="font-black uppercase text-sm tracking-tight">
                      {s.name}
                    </p>
                  </div>
                  <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-pink-500 transition-colors">
                    <ChevronRight size={18} className="text-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-[10px] font-black text-slate-500 mb-8 uppercase tracking-widest hover:text-pink-500 transition-colors"
            >
              <ChevronLeft size={16} /> Volver a especialistas
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest">
                      <User size={14} /> Información Personal
                    </label>
                    <input
                      required
                      placeholder="NOMBRE COMPLETO"
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-xs font-bold focus:border-pink-500 outline-none uppercase placeholder:text-slate-600"
                      onChange={(e) =>
                        setBooking({ ...booking, customer: e.target.value })
                      }
                    />
                    <input
                      required
                      type="tel"
                      value={booking.phone}
                      placeholder="09X XXX XXX"
                      maxLength={11}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-xs font-bold focus:border-pink-500 outline-none placeholder:text-slate-600"
                      onChange={handlePhoneChange}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest">
                      <Briefcase size={14} /> Tratamiento
                    </label>
                    <select
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-xs font-bold uppercase outline-none cursor-pointer text-slate-300"
                      onChange={(e) => {
                        const svc = estetica.services.find(
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
                      {estetica?.services?.map((s, i) => (
                        <option key={i} value={s.name} className="bg-slate-900">
                          {s.name} — ${s.price}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                  {dateOptions.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDateObj(d)}
                      className={`flex flex-col items-center min-w-[65px] p-4 rounded-3xl border transition-all ${
                        selectedDateObj?.full === d.full
                          ? "bg-pink-600 border-pink-500 text-white shadow-lg"
                          : "bg-slate-800/50 border-white/5 text-slate-500"
                      }`}
                    >
                      <span className="text-[8px] font-black uppercase mb-1">
                        {d.dayName}
                      </span>
                      <span className="text-base font-black">{d.dayNum}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest">
                    <Clock size={14} /> Horarios Disponibles
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() =>
                            setBooking({ ...booking, start: time })
                          }
                          className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
                            booking.start === time
                              ? "bg-white text-slate-950"
                              : "bg-slate-800/30 border-white/5 text-slate-400"
                          }`}
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <p className="col-span-3 text-center text-[10px] text-slate-500 uppercase py-4">
                        Sin turnos
                      </p>
                    )}
                  </div>
                </div>

                <button
                  disabled={
                    isSubmitting ||
                    !booking.start ||
                    !booking.customer ||
                    booking.phone.length < 11
                  }
                  onClick={handleConfirm}
                  className="w-full bg-pink-600 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-pink-500 transition-all disabled:opacity-20 shadow-xl shadow-pink-600/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Confirmar Cita"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto text-center py-10 animate-in zoom-in-95 duration-700">
            <div className="size-24 bg-pink-500/10 border border-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <CheckCircle2 className="text-pink-500 relative z-10" size={48} />
              <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20"></div>
            </div>

            <h2 className="text-3xl font-black uppercase tracking-tighter italic">
              ¡Cita <span className="text-pink-500">Confirmada</span>!
            </h2>

            <div className="mt-6 p-6 bg-slate-900/50 border border-white/5 rounded-[2rem] space-y-2">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Tu tratamiento es el
              </p>
              <p className="text-xl font-black text-white uppercase tracking-tight">
                {selectedDateObj.dayName} {selectedDateObj.dayNum} —{" "}
                {booking.start}HS
              </p>
            </div>

            <div className="mt-4 p-6 bg-slate-900/30 border border-white/5 rounded-[2rem] space-y-4 text-left">
              <div className="space-y-1 text-center">
                <p className="text-pink-500 text-[9px] font-black uppercase tracking-[0.2em]">
                  Dirección del Centro
                </p>
                <p className="text-sm font-bold text-slate-200">
                  {estetica?.direccion || "Dirección no disponible"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              {(estetica?.mapsLink || estetica?.direccion) && (
                <a
                  href={
                    estetica?.mapsLink
                      ? estetica.mapsLink
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          estetica.direccion
                        )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-pink-600/20 border border-pink-500/20 rounded-full text-[10px] font-black text-pink-400 uppercase tracking-widest hover:bg-pink-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <MapPin size={14} /> Cómo llegar
                </a>
              )}
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-slate-800 rounded-full text-[10px] font-black text-slate-300 uppercase tracking-widest hover:bg-slate-700 transition-all"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
