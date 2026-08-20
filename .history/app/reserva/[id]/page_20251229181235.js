"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  CheckCircle2,
  Loader2,
  Scissors,
  ChevronLeft,
  ChevronRight,
  User,
  Smartphone,
  Clock,
  Calendar as CalendarIcon,
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

  useEffect(() => {
    // 1. Generar opciones de fecha
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        full: d.toISOString().split("T")[0],
        dayName: d.toLocaleDateString("es-ES", { weekday: "short" }),
        dayNum: d.getDate(),
        // Ajuste para tu calendario: Lunes es 0
        calendarIdx: d.getDay() === 0 ? 6 : d.getDay() - 1,
      });
    }
    setDateOptions(dates);
    setSelectedDateObj(dates[0]);

    // 2. Traer datos de la barbería
    const fetchBarberia = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "barberias", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBarberia(data);
          // Pre-seleccionar primer servicio si existe
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
      current.setHours(8, 0, 0); // START_HOUR de tu calendario
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
    setIsSubmitting(true);

    try {
      const barberiaRef = doc(db, "barberias", id);

      // CREAMOS EL OBJETO LIMPIO (Sin imágenes ni datos circulares que causan error)
      const appointmentToSave = {
        id: Date.now(),
        customer: booking.customer,
        phone: booking.phone || "",
        email: booking.email || "",
        barber: booking.barber,
        start: booking.start,
        date: selectedDateObj.full,
        day: selectedDateObj.calendarIdx, // Crucial para tu vista de columnas
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
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar la cita. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="bg-white border-b border-slate-100 py-5 px-6 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex justify-center items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <img src={barberia?.logo} size={20} />
          </div>
          <h1 className="text-sm font-black uppercase tracking-tight">
            {barberia?.businessName}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {step === 1 && (
          <div className="max-w-md mx-auto space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-6">
              Selecciona Profesional
            </p>
            {barberia?.barbers?.map((b, i) => (
              <button
                key={i}
                onClick={() => {
                  setBooking({ ...booking, barber: b.name });
                  setStep(2);
                }}
                className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl hover:border-blue-500 transition-all shadow-sm group"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border-2 border-white overflow-hidden">
                    {b.imageUrl ? (
                      <img
                        src={b.imageUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      b.name[0]
                    )}
                  </div>
                  <p className="font-bold text-slate-700">{b.name}</p>
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-300 group-hover:text-blue-500"
                />
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={14} /> Cambiar Profesional
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Tus Datos
                  </p>
                  <input
                    placeholder="NOMBRE COMPLETO"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none uppercase"
                    onChange={(e) =>
                      setBooking({ ...booking, customer: e.target.value })
                    }
                  />
                  <input
                    placeholder="TELÉFONO"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                    onChange={(e) =>
                      setBooking({ ...booking, phone: e.target.value })
                    }
                  />

                  <div className="pt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Servicio
                    </p>
                    <select
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-xs font-bold uppercase outline-none cursor-pointer"
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
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {dateOptions.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDateObj(d)}
                      className={`flex flex-col items-center min-w-[60px] p-4 rounded-3xl transition-all ${
                        selectedDateObj?.full === d.full
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      <span className="text-[9px] font-black uppercase mb-1">
                        {d.dayName}
                      </span>
                      <span className="text-sm font-black">{d.dayNum}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setBooking({ ...booking, start: time })}
                        className={`py-3 rounded-2xl text-[11px] font-bold border transition-all ${
                          booking.start === time
                            ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                            : "bg-white border-slate-100 text-slate-500 hover:border-slate-800"
                        }`}
                      >
                        {time}
                      </button>
                    ))
                  ) : (
                    <p className="col-span-3 text-[10px] text-center text-slate-400 font-bold uppercase py-4">
                      Sin turnos disponibles
                    </p>
                  )}
                </div>

                <button
                  disabled={isSubmitting || !booking.start || !booking.customer}
                  onClick={handleConfirm}
                  className="w-full bg-blue-600 text-white font-black text-[11px] uppercase tracking-widest py-5 rounded-[2rem] hover:bg-blue-700 transition-all disabled:opacity-30 shadow-xl shadow-blue-500/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin mx-auto" size={20} />
                  ) : (
                    "Confirmar Cita"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto text-center py-20 animate-in zoom-in-95 duration-500">
            <div className="size-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              ¡Reserva Exitosa!
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase mt-2">
              Todo listo para el {selectedDateObj.full} a las {booking.start}hs
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-10 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
            >
              Hacer otra reserva
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
