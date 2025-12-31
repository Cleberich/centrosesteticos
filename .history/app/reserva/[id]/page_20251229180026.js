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

  // Manejo de Fechas (Próximos 7 días)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateOptions, setDateOptions] = useState([]);

  const [booking, setBooking] = useState({
    customer: "",
    phone: "",
    barber: "",
    barberImage: "",
    start: "",
    service: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    // Generar opciones de fecha (hoy + 6 días)
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        full: d.toISOString().split("T")[0],
        dayName: d.toLocaleDateString("es-ES", { weekday: "short" }),
        dayNum: d.getDate(),
      });
    }
    setDateOptions(dates);

    const fetchBarberia = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "barberias", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBarberia(data);
          if (data.services?.length > 0) {
            setBooking((prev) => ({
              ...prev,
              service: data.services[0].name || data.services[0],
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
  }, [step, booking.barber, selectedDate]);

  const generateAvailableSlots = () => {
    const slots = [];
    let current = new Date();
    current.setHours(9, 0, 0);
    const end = new Date();
    end.setHours(20, 0, 0);

    // Filtrar ocupados por barbero Y por la fecha seleccionada
    const occupied =
      barberia.appointments
        ?.filter(
          (a) =>
            a.barber === booking.barber &&
            a.date === selectedDate &&
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
        date: selectedDate, // Guardamos la fecha elegida
        id: Date.now(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      await updateDoc(barberiaRef, { appointments: arrayUnion(newApp) });
      setStep(3);

      let phone = barberia.telefono?.replace(/\D/g, "");
      if (phone.startsWith("0")) phone = "598" + phone.substring(1);
      else if (!phone.startsWith("598")) phone = "598" + phone;

      const msg = encodeURIComponent(
        `Turno Reservado:\n👤 ${booking.customer}\n📅 Fecha: ${selectedDate}\n✂️ ${booking.service}\n💈 ${booking.barber}\n⏰ ${booking.start}hs`
      );
      setTimeout(
        () => window.open(`https://wa.me/${phone}?text=${msg}`, "_blank"),
        1000
      );
    } catch (e) {
      alert("Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" size={30} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="size-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
            {barberia?.logo ? (
              <img
                src={barberia.logo}
                className="w-full h-full object-cover"
                alt="logo"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                <Scissors size={18} />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              {barberia?.businessName}
            </h1>
            <p className="text-[10px] text-slate-500 flex items-center gap-1 uppercase font-bold tracking-tighter">
              <MapPin size={10} /> {barberia?.direccion}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8">
        {step === 1 && (
          <div className="max-w-xl mx-auto space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 text-center">
              Selecciona un barbero
            </h2>
            <div className="grid grid-cols-1 gap-3">
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
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full overflow-hidden border border-slate-100">
                      {b.imageUrl ? (
                        <img
                          src={b.imageUrl}
                          className="w-full h-full object-cover"
                          alt={b.name}
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                          {b.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-800">
                        {b.name}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                        Disponible
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-slate-300 group-hover:text-blue-500"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in duration-500">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mb-6 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              <ChevronLeft size={14} /> Cambiar profesional
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="size-12 rounded-xl overflow-hidden border border-slate-100">
                      {booking.barberImage ? (
                        <img
                          src={booking.barberImage}
                          className="w-full h-full object-cover"
                          alt="barber"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                          {booking.barber[0]}
                        </div>
                      )}
                    </div>
                    <h3 className="text-md font-bold text-slate-800">
                      {booking.barber}
                    </h3>
                  </div>

                  <form className="space-y-3">
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={14}
                      />
                      <input
                        required
                        placeholder="TU NOMBRE"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-xs font-bold outline-none focus:border-blue-500 transition-all uppercase"
                        onChange={(e) =>
                          setBooking({ ...booking, customer: e.target.value })
                        }
                      />
                    </div>

                    <div className="relative">
                      <Smartphone
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={14}
                      />
                      <input
                        required
                        type="tel"
                        placeholder="TELÉFONO"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-xs font-bold outline-none focus:border-blue-500 transition-all"
                        onChange={(e) =>
                          setBooking({ ...booking, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="relative">
                      <Scissors
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={14}
                      />
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-8 text-[11px] font-bold uppercase outline-none focus:border-blue-500 appearance-none transition-all cursor-pointer"
                        onChange={(e) =>
                          setBooking({ ...booking, service: e.target.value })
                        }
                      >
                        {barberia?.services?.map((s, i) => (
                          <option key={i} value={s.name || s}>
                            {s.name || s} {s.price ? `($${s.price})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
                  {/* SELECTOR DE FECHAS */}
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <CalendarIcon size={12} className="text-blue-500" />{" "}
                      Selecciona el día
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {dateOptions.map((d, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedDate(d.full)}
                          className={`flex flex-col items-center justify-center min-w-[60px] p-3 rounded-xl border transition-all ${
                            selectedDate === d.full
                              ? "bg-slate-900 border-slate-900 text-white shadow-md"
                              : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          <span className="text-[9px] font-bold uppercase tracking-tighter">
                            {d.dayName}
                          </span>
                          <span className="text-sm font-black">{d.dayNum}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SELECTOR DE HORARIOS */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Clock size={12} className="text-blue-500" /> Horarios
                      disponibles
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-6">
                      {availableSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() =>
                            setBooking({ ...booking, start: time })
                          }
                          className={`py-2.5 rounded-lg text-xs font-bold transition-all border ${
                            booking.start === time
                              ? "bg-blue-600 border-blue-600 text-white shadow-md"
                              : "bg-white border-slate-100 text-slate-600 hover:border-slate-800"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={
                      isSubmitting || !booking.start || !booking.customer
                    }
                    onClick={handleConfirm}
                    className="mt-auto w-full bg-blue-600 text-white font-bold text-[11px] uppercase tracking-widest py-4 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-30 shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Confirmar Mi Turno"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto text-center py-10 px-6 animate-in zoom-in-95 duration-500">
            <div className="size-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-emerald-500" size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
              ¡Reserva Exitosa!
            </h2>
            <p className="text-slate-500 text-xs mb-8 font-medium">
              Te esperamos el {selectedDate} a las {booking.start}hs.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest"
            >
              Hacer otra reserva
            </button>
          </div>
        )}
      </main>

      <footer className="py-10 text-center opacity-30">
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.5em]">
          Barber Manager
        </p>
      </footer>
    </div>
  );
}
