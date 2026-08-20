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
    start: "09:00",
    service: "",
    selectedServiceIds: [],
    duration: 30,
    day: 0,
  });

  // Función para formatear el teléfono mientras se escribe (09X XXX XXX)
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, ""); // Solo números
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    }
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
    for (let i = 0; i < 7; i++) {
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
        console.error("Error cargando barbería:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBarberia();
  }, [id]);

  useEffect(() => {
    if (step === 2 && barberia) {
      const slots = [];
      let current = new Date();
      current.setHours(8, 0, 0);
      const end = new Date();
      end.setHours(21, 0, 0);

      const occupied =
        barberia.appointments
          ?.filter(
            (a) =>
              a.barber === booking.barber &&
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
  }, [step, booking.barber, selectedDateObj, barberia]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!booking.customer || !booking.start) return alert("Faltan datos");
    // Validación mínima de largo de teléfono (09X XXX XXX tiene 11 caracteres con espacios)
    if (booking.phone.length < 11)
      return alert("El teléfono debe ser 09X XXX XXX");

    setIsSubmitting(true);
    try {
      const barberiaRef = doc(db, "barberias", id);
      const appointmentToSave = {
        id: Date.now(),
        customer: booking.customer,
        phone: booking.phone,
        email: booking.email || "",
        barber: booking.barber,
        start: booking.start,
        date: selectedDateObj.full,
        day: selectedDateObj.calendarIdx,
        duration: Number(booking.duration),
        selectedServiceIds: booking.selectedServiceIds,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      await updateDoc(barberiaRef, {
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
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-100 font-sans selection:bg-blue-500/30">
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-white/5 py-4 px-6 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-[2px]">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                {barberia?.logo ? (
                  <img
                    src={barberia.logo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Calendar className="text-blue-500" size={20} />
                )}
              </div>
            </div>
            <h1 className="text-sm font-black uppercase tracking-tighter">
              {barberia?.businessName}
            </h1>
          </div>
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              Reserva Online
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-10">
        {step === 1 && (
          <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                Elige tu <span className="text-blue-500">Barbero</span>
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                Profesionales disponibles
              </p>
            </div>
            <div className="space-y-3">
              {barberia?.barbers?.map((b, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setBooking({ ...booking, barber: b.name });
                    setStep(2);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/50 border border-white/5 rounded-3xl hover:border-blue-500/50 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all">
                      <img
                        src={
                          b.imageUrl ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.name}`
                        }
                        className="w-full h-full object-cover"
                        alt={b.name}
                      />
                    </div>
                    <p className="font-black uppercase text-sm tracking-tight">
                      {b.name}
                    </p>
                  </div>
                  <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
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
              className="flex items-center gap-2 text-[10px] font-black text-slate-500 mb-8 uppercase tracking-widest hover:text-blue-500 transition-colors"
            >
              <ChevronLeft size={16} /> Volver a barberos
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                      <User size={14} /> Tus Datos
                    </label>
                    <input
                      required
                      placeholder="NOMBRE Y APELLIDO"
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-xs font-bold focus:border-blue-500 outline-none uppercase placeholder:text-slate-600"
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
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-xs font-bold focus:border-blue-500 outline-none placeholder:text-slate-600"
                      onChange={handlePhoneChange}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                      <Briefcase size={14} /> Servicio
                    </label>
                    <select
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-xs font-bold uppercase outline-none cursor-pointer text-slate-300"
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
                      className={`flex flex-col items-center min-w-[65px] p-4 rounded-[1.5rem] border transition-all ${
                        selectedDateObj?.full === d.full
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg"
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
                  <label className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    <Clock size={14} /> Horarios
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
                  className="w-full bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-20 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Confirmar Reserva"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto text-center py-10 animate-in zoom-in-95 duration-700">
            <div className="size-24 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <CheckCircle2 className="text-blue-500 relative z-10" size={48} />
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20"></div>
            </div>

            <h2 className="text-3xl font-black uppercase tracking-tighter">
              ¡Reserva <span className="text-blue-500">Lista</span>!
            </h2>

            {/* Cuadro de Horario */}
            <div className="mt-6 p-6 bg-slate-900/50 border border-white/5 rounded-[2rem] space-y-2">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Te esperamos el
              </p>
              <p className="text-xl font-black text-white uppercase tracking-tight">
                {selectedDateObj.dayName} {selectedDateObj.dayNum} —{" "}
                {booking.start}HS
              </p>
            </div>

            {/* NUEVA SECCIÓN: DIRECCIÓN Y TELÉFONO DEL LOCAL */}
            <div className="mt-4 p-6 bg-slate-900/30 border border-white/5 rounded-[2rem] space-y-4">
              <div className="space-y-1">
                <p className="text-blue-500 text-[9px] font-black uppercase tracking-[0.2em]">
                  Dirección
                </p>
                <p className="text-sm font-bold text-slate-200">
                  {barberia?.direccion || "Dirección no disponible"}
                </p>
              </div>

              <div className="w-full h-[1px] bg-white/5"></div>

              <div className="space-y-1">
                <p className="text-blue-500 text-[9px] font-black uppercase tracking-[0.2em]">
                  Contacto de la Barbería
                </p>
                <p className="text-sm font-bold text-slate-200">
                  {barberia?.phone || "Teléfono no disponible"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              {/* Botón opcional para abrir ubicación en Maps si existe la dirección */}
              {barberia?.address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    barberia.address
                  )}`}
                  target="_blank"
                  className="w-full py-4 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-600/20 transition-all"
                >
                  Ver en Google Maps
                </a>
              )}

              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-slate-800 rounded-full text-[10px] font-black text-slate-300 uppercase tracking-widest hover:bg-slate-700 transition-all"
              >
                Hacer otra reserva
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
