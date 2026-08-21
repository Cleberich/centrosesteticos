// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { db } from "@/services/firebase";
// import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
// import {
//   CheckCircle2,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   Phone,
//   Calendar,
//   Clock,
//   Briefcase,
//   MapPin,
//   Sparkles,
// } from "lucide-react";

// export default function PublicBookingPage() {
//   const { id } = useParams();
//   const [estetica, setEstetica] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [step, setStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [selectedDateObj, setSelectedDateObj] = useState(null);
//   const [dateOptions, setDateOptions] = useState([]);

//   const [booking, setBooking] = useState({
//     customer: "",
//     phone: "",
//     email: "",
//     specialist: "", // Cambiado de barber
//     start: "09:00",
//     service: "",
//     selectedServiceIds: [],
//     duration: 60,
//     day: 0,
//   });

//   const formatPhoneNumber = (value) => {
//     if (!value) return value;
//     const phoneNumber = value.replace(/[^\d]/g, "");
//     const phoneNumberLength = phoneNumber.length;
//     if (phoneNumberLength < 4) return phoneNumber;
//     if (phoneNumberLength < 7)
//       return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
//     return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(
//       3,
//       6
//     )} ${phoneNumber.slice(6, 9)}`;
//   };

//   const handlePhoneChange = (e) => {
//     const formattedValue = formatPhoneNumber(e.target.value);
//     setBooking({ ...booking, phone: formattedValue });
//   };

//   useEffect(() => {
//     const dates = [];
//     for (let i = 0; i < 14; i++) {
//       // Extendí a 14 días para estética
//       const d = new Date();
//       d.setDate(d.getDate() + i);
//       dates.push({
//         full: d.toISOString().split("T")[0],
//         dayName: d.toLocaleDateString("es-ES", { weekday: "short" }),
//         dayNum: d.getDate(),
//         calendarIdx: d.getDay() === 0 ? 6 : d.getDay() - 1,
//       });
//     }
//     setDateOptions(dates);
//     setSelectedDateObj(dates[0]);

//     const fetchEstetica = async () => {
//       if (!id) return;
//       try {
//         // CAMBIO DE COLECCIÓN A centros_estetica
//         const docRef = doc(db, "centros_estetica", id);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setEstetica(data);
//           if (data.services?.length > 0) {
//             const s = data.services[0];
//             setBooking((prev) => ({
//               ...prev,
//               service: s.name,
//               selectedServiceIds: [s.id],
//               duration: Number(s.time) || 60,
//             }));
//           }
//         }
//       } catch (e) {
//         console.error("Error cargando centro de estética:", e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEstetica();
//   }, [id]);

//   useEffect(() => {
//     if (step === 2 && estetica) {
//       const slots = [];
//       let current = new Date();
//       current.setHours(9, 0, 0); // Estética suele empezar a las 9
//       const end = new Date();
//       end.setHours(20, 0, 0);

//       const occupied =
//         estetica.appointments
//           ?.filter(
//             (a) =>
//               a.specialist === booking.specialist &&
//               a.date === selectedDateObj?.full &&
//               a.status !== "cancelled"
//           )
//           .map((a) => a.start) || [];

//       while (current < end) {
//         const time = current.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: false,
//         });
//         if (!occupied.includes(time)) slots.push(time);
//         current.setMinutes(current.getMinutes() + 30);
//       }
//       setAvailableSlots(slots);
//     }
//   }, [step, booking.specialist, selectedDateObj, estetica]);

//   const handleConfirm = async (e) => {
//     e.preventDefault();
//     if (!booking.customer || !booking.start) return alert("Faltan datos");
//     if (booking.phone.length < 11)
//       return alert("El teléfono debe ser 09X XXX XXX");

//     setIsSubmitting(true);
//     try {
//       const esteticaRef = doc(db, "centros_estetica", id);
//       const appointmentToSave = {
//         id: Date.now(),
//         customer: booking.customer,
//         phone: booking.phone,
//         email: booking.email || "",
//         specialist: booking.specialist,
//         start: booking.start,
//         date: selectedDateObj.full,
//         day: selectedDateObj.calendarIdx,
//         duration: Number(booking.duration),
//         selectedServiceIds: booking.selectedServiceIds,
//         status: "pending",
//         createdAt: new Date().toISOString(),
//       };
//       await updateDoc(esteticaRef, {
//         appointments: arrayUnion(appointmentToSave),
//       });
//       setStep(3);
//     } catch (error) {
//       alert("Error al guardar la cita.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center bg-slate-950">
//         <Loader2 className="animate-spin text-pink-500" size={40} />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#0f0a0c] text-slate-100 font-sans selection:bg-pink-500/30">
//       <header className="bg-slate-900/50 backdrop-blur-md border-b border-white/5 py-4 px-6 sticky top-0 z-20">
//         <div className="max-w-4xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="size-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 p-[2px]">
//               <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
//                 {estetica?.logo ? (
//                   <img
//                     src={estetica.logo}
//                     alt="Logo"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <Sparkles className="text-pink-500" size={20} />
//                 )}
//               </div>
//             </div>
//             <h1 className="text-sm font-black uppercase tracking-widest italic">
//               {estetica?.businessName}
//             </h1>
//           </div>
//           <div className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full">
//             <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">
//               Cita Online
//             </span>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto p-6 md:p-10">
//         {step === 1 && (
//           <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="text-center space-y-2">
//               <h2 className="text-2xl font-black uppercase tracking-tighter">
//                 Tu <span className="text-pink-500">Especialista</span>
//               </h2>
//               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
//                 Selecciona con quién deseas atenderte
//               </p>
//             </div>
//             <div className="space-y-3">
//               {estetica?.specialists?.map((s, i) => (
//                 <button
//                   key={i}
//                   onClick={() => {
//                     setBooking({ ...booking, specialist: s.name });
//                     setStep(2);
//                   }}
//                   className="w-full flex items-center justify-between p-4 bg-slate-900/50 border border-white/5 rounded-3xl hover:border-pink-500/50 hover:bg-slate-800/50 transition-all group"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="size-14 rounded-full bg-slate-800 border border-white/10 overflow-hidden ring-2 ring-transparent group-hover:ring-pink-500/30 transition-all">
//                       <img
//                         src={
//                           s.imageUrl ||
//                           `https://api.dicebear.com/7.x/adventurer/svg?seed=${s.name}`
//                         }
//                         className="w-full h-full object-cover"
//                         alt={s.name}
//                       />
//                     </div>
//                     <p className="font-black uppercase text-sm tracking-tight">
//                       {s.name}
//                     </p>
//                   </div>
//                   <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-pink-500 transition-colors">
//                     <ChevronRight size={18} className="text-white" />
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="animate-in fade-in zoom-in-95 duration-500">
//             <button
//               onClick={() => setStep(1)}
//               className="flex items-center gap-2 text-[10px] font-black text-slate-500 mb-8 uppercase tracking-widest hover:text-pink-500 transition-colors"
//             >
//               <ChevronLeft size={16} /> Volver a especialistas
//             </button>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               <div className="space-y-6">
//                 <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
//                   <div className="space-y-4">
//                     <label className="flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest">
//                       <User size={14} /> Información Personal
//                     </label>
//                     <input
//                       required
//                       placeholder="NOMBRE COMPLETO"
//                       className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-xs font-bold focus:border-pink-500 outline-none uppercase placeholder:text-slate-600"
//                       onChange={(e) =>
//                         setBooking({ ...booking, customer: e.target.value })
//                       }
//                     />
//                     <input
//                       required
//                       type="tel"
//                       value={booking.phone}
//                       placeholder="09X XXX XXX"
//                       maxLength={11}
//                       className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-xs font-bold focus:border-pink-500 outline-none placeholder:text-slate-600"
//                       onChange={handlePhoneChange}
//                     />
//                   </div>

//                   <div className="space-y-4">
//                     <label className="flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest">
//                       <Briefcase size={14} /> Tratamiento
//                     </label>
//                     <select
//                       className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-xs font-bold uppercase outline-none cursor-pointer text-slate-300"
//                       onChange={(e) => {
//                         const svc = estetica.services.find(
//                           (s) => s.name === e.target.value
//                         );
//                         setBooking({
//                           ...booking,
//                           service: e.target.value,
//                           selectedServiceIds: [svc.id],
//                           duration: Number(svc.time),
//                         });
//                       }}
//                     >
//                       {estetica?.services?.map((s, i) => (
//                         <option key={i} value={s.name} className="bg-slate-900">
//                           {s.name} — ${s.price}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 space-y-8">
//                 <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
//                   {dateOptions.map((d, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setSelectedDateObj(d)}
//                       className={`flex flex-col items-center min-w-[65px] p-4 rounded-3xl border transition-all ${
//                         selectedDateObj?.full === d.full
//                           ? "bg-pink-600 border-pink-500 text-white shadow-lg"
//                           : "bg-slate-800/50 border-white/5 text-slate-500"
//                       }`}
//                     >
//                       <span className="text-[8px] font-black uppercase mb-1">
//                         {d.dayName}
//                       </span>
//                       <span className="text-base font-black">{d.dayNum}</span>
//                     </button>
//                   ))}
//                 </div>

//                 <div className="space-y-4">
//                   <label className="flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest">
//                     <Clock size={14} /> Horarios Disponibles
//                   </label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {availableSlots.length > 0 ? (
//                       availableSlots.map((time) => (
//                         <button
//                           key={time}
//                           onClick={() =>
//                             setBooking({ ...booking, start: time })
//                           }
//                           className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${
//                             booking.start === time
//                               ? "bg-white text-slate-950"
//                               : "bg-slate-800/30 border-white/5 text-slate-400"
//                           }`}
//                         >
//                           {time}
//                         </button>
//                       ))
//                     ) : (
//                       <p className="col-span-3 text-center text-[10px] text-slate-500 uppercase py-4">
//                         Sin turnos
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <button
//                   disabled={
//                     isSubmitting ||
//                     !booking.start ||
//                     !booking.customer ||
//                     booking.phone.length < 11
//                   }
//                   onClick={handleConfirm}
//                   className="w-full bg-pink-600 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-pink-500 transition-all disabled:opacity-20 shadow-xl shadow-pink-600/20 flex items-center justify-center gap-2"
//                 >
//                   {isSubmitting ? (
//                     <Loader2 className="animate-spin" size={20} />
//                   ) : (
//                     "Confirmar Cita"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="max-w-md mx-auto text-center py-10 animate-in zoom-in-95 duration-700">
//             <div className="size-24 bg-pink-500/10 border border-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
//               <CheckCircle2 className="text-pink-500 relative z-10" size={48} />
//               <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20"></div>
//             </div>

//             <h2 className="text-3xl font-black uppercase tracking-tighter italic">
//               ¡Cita <span className="text-pink-500">Confirmada</span>!
//             </h2>

//             <div className="mt-6 p-6 bg-slate-900/50 border border-white/5 rounded-[2rem] space-y-2">
//               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
//                 Tu tratamiento es el
//               </p>
//               <p className="text-xl font-black text-white uppercase tracking-tight">
//                 {selectedDateObj.dayName} {selectedDateObj.dayNum} —{" "}
//                 {booking.start}HS
//               </p>
//             </div>

//             <div className="mt-4 p-6 bg-slate-900/30 border border-white/5 rounded-[2rem] space-y-4 text-left">
//               <div className="space-y-1 text-center">
//                 <p className="text-pink-500 text-[9px] font-black uppercase tracking-[0.2em]">
//                   Dirección del Centro
//                 </p>
//                 <p className="text-sm font-bold text-slate-200">
//                   {estetica?.direccion || "Dirección no disponible"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-col gap-3 mt-8">
//               {(estetica?.mapsLink || estetica?.direccion) && (
//                 <a
//                   href={
//                     estetica?.mapsLink
//                       ? estetica.mapsLink
//                       : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//                           estetica.direccion
//                         )}`
//                   }
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="w-full py-4 bg-pink-600/20 border border-pink-500/20 rounded-full text-[10px] font-black text-pink-400 uppercase tracking-widest hover:bg-pink-600/30 transition-all flex items-center justify-center gap-2"
//                 >
//                   <MapPin size={14} /> Cómo llegar
//                 </a>
//               )}
//               <button
//                 onClick={() => window.location.reload()}
//                 className="w-full py-4 bg-slate-800 rounded-full text-[10px] font-black text-slate-300 uppercase tracking-widest hover:bg-slate-700 transition-all"
//               >
//                 Volver al inicio
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import emailjs from "@emailjs/browser";
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
  Scissors,
  Sparkle,
  Eye,
  Check,
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
  const bookingEmailService =
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_bm0xbov";
  const bookingEmailTemplate =
    process.env.NEXT_PUBLIC_EMAILJS_BOOKING_TEMPLATE_ID || "template_vzfzz0m";
  const bookingEmailPublicKey =
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "QQV_D_IXpW03jTg8X";
  const specialistLimits = {
    Inicial: 1,
    Starter: 1,
    Profesional: 3,
    Business: 5,
  };

  const [booking, setBooking] = useState({
    customer: "",
    phone: "",
    email: "",
    specialist: "",
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
      6,
    )} ${phoneNumber.slice(6, 9)}`;
  };

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setBooking({ ...booking, phone: formattedValue });
  };

  const getServiceValue = (service, field) => {
    const specialist = estetica?.specialists?.find(
      (item) => item.name === booking.specialist,
    );
    const specialistValues =
      field === "price" ? service?.specialistPrices : service?.specialistTimes;
    return Number(specialistValues?.[specialist?.id]) || Number(service?.[field]) || 0;
  };

  const isServiceAvailable = (service) => {
    if (!service.specialistIds?.length) return true;
    const specialist = estetica?.specialists?.find(
      (item) => item.name === booking.specialist,
    );
    return service.specialistIds.includes(specialist?.id);
  };

  const getSpecialistsForService = (service) =>
    (estetica?.specialists || []).filter(
      (specialist) =>
        !service?.specialistIds?.length ||
        service.specialistIds.includes(specialist.id),
    );

  useEffect(() => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
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
        const docRef = doc(db, "centros_estetica", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEstetica({
            ...data,
            specialists: (data.specialists || []).filter(
              (specialist, index) =>
                index < (specialistLimits[data.plan?.type] || 1),
            ),
          });
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
      current.setHours(9, 0, 0);
      const end = new Date();
      end.setHours(20, 0, 0);

      const occupied =
        estetica.appointments
          ?.filter(
            (a) =>
              a.specialist === booking.specialist &&
              a.date === selectedDateObj?.full &&
              a.status !== "cancelled",
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
    const customerEmail = booking.email.trim();
    if (!customerEmail) {
      return alert("Ingresa tu email para recibir la confirmación");
    }

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

      try {
        await emailjs.send(
          bookingEmailService,
          bookingEmailTemplate,
          {
            to_email: customerEmail,
            user_email: customerEmail,
            recipient_email: customerEmail,
            email: customerEmail,
            to_name: booking.customer,
            reply_to: customerEmail,
            customer_name: booking.customer,
            customer: booking.customer,
            business_name: estetica.businessName,
            specialist: booking.specialist,
            service: booking.service,
            appointment_date: selectedDateObj.full,
            date: selectedDateObj.full,
            appointment_time: booking.start,
            time: booking.start,
            phone: booking.phone,
          },
          bookingEmailPublicKey,
        );
      } catch (emailError) {
        console.error("Error enviando confirmación de reserva:", emailError);
        alert(
          "La reserva se guardó, pero no pudimos enviar el email de confirmación.",
        );
      }

      setStep(3);
    } catch (error) {
      alert("Error al guardar la cita.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF6F4]">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FBF8F6] text-slate-700 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-800">
      {/* HEADER TIPO BYUTIE */}
      <header className="bg-white/80 backdrop-blur-md border-b border-rose-100/60 py-4 px-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center p-0.5 overflow-hidden shadow-sm">
              {estetica?.logo ? (
                <img
                  src={estetica.logo}
                  alt="Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Sparkles className="text-emerald-500" size={20} />
              )}
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 tracking-tight">
                {estetica?.businessName || "Byutie Salon"}
              </h1>
            </div>
          </div>
          <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold text-emerald-700 tracking-wide">
              Reserva Online
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-10">
        {/* PASO 1: SELECCIONAR SERVICIO */}
        {step === 1 && (
          <div className="max-w-lg mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <span className="px-4 py-1.5 bg-rose-100/60 text-rose-700 text-xs font-extrabold rounded-full inline-block">
                Paso 1 de 2
              </span>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                ¿Qué servicio quieres reservar?
              </h2>
              <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto">
                Primero selecciona el tratamiento y luego te mostraremos quiénes lo realizan.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {estetica?.services?.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setBooking({
                      ...booking,
                      service: service.name,
                      selectedServiceIds: [service.id],
                      specialist: "",
                    });
                    setStep(2);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-white border border-rose-100/70 rounded-3xl hover:border-emerald-300 hover:shadow-md transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-rose-50 border border-rose-100 overflow-hidden ring-2 ring-transparent group-hover:ring-emerald-300 transition-all shrink-0">
                      <img
                        src={
                          `https://api.dicebear.com/7.x/shapes/svg?seed=${service.name}`
                        }
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">
                        {service.name}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                        {service.category || "Servicio de estética"}
                      </p>
                    </div>
                  </div>
                  <div className="size-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-emerald-400 group-hover:text-white transition-all text-slate-400">
                    <ChevronRight size={18} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASO 2: DATOS Y FECHA */}
        {step === 2 && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-2xl border border-rose-100/60 shadow-sm w-fit"
            >
              <ChevronLeft size={16} /> Cambiar Servicio ({booking.service})
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* FORMULARIO */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2rem] border border-rose-100/60 shadow-sm space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      <User size={15} className="text-emerald-500" /> Especialista
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {getSpecialistsForService(
                        estetica?.services?.find(
                          (service) => service.id === booking.selectedServiceIds?.[0],
                        ),
                      ).map((specialist) => (
                        <button
                          key={specialist.id}
                          type="button"
                          onClick={() => {
                            const service = estetica.services.find(
                              (item) => item.id === booking.selectedServiceIds?.[0],
                            );
                            setBooking({
                              ...booking,
                              specialist: specialist.name,
                              duration: getServiceValue(service, "time"),
                            });
                          }}
                          className={`flex items-center justify-between rounded-2xl border p-3 text-left text-xs font-semibold transition-colors ${booking.specialist === specialist.name ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-300"}`}
                        >
                          <span>{specialist.name}</span>
                          {booking.specialist === specialist.name && <CheckCircle2 size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      <User size={15} className="text-emerald-500" /> Datos
                      Personales
                    </label>
                    <input
                      required
                      placeholder="Nombre Completo"
                      className="w-full bg-slate-50/60 border border-slate-200/80 rounded-2xl py-3.5 px-4 text-xs font-semibold text-slate-800 focus:border-emerald-400 focus:bg-white outline-none placeholder:text-slate-400 transition-all"
                      onChange={(e) =>
                        setBooking({ ...booking, customer: e.target.value })
                      }
                    />
                    <input
                      required
                      type="tel"
                      value={booking.phone}
                      placeholder="Teléfono / WhatsApp (09X XXX XXX)"
                      maxLength={11}
                      className="w-full bg-slate-50/60 border border-slate-200/80 rounded-2xl py-3.5 px-4 text-xs font-semibold text-slate-800 focus:border-emerald-400 focus:bg-white outline-none placeholder:text-slate-400 transition-all"
                      onChange={handlePhoneChange}
                    />
                    <input
                      required
                      type="email"
                      value={booking.email}
                      placeholder="Email para recibir la confirmación"
                      className="w-full bg-slate-50/60 border border-slate-200/80 rounded-2xl py-3.5 px-4 text-xs font-semibold text-slate-800 focus:border-emerald-400 focus:bg-white outline-none placeholder:text-slate-400 transition-all"
                      onChange={(e) =>
                        setBooking({ ...booking, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      <Briefcase size={15} className="text-emerald-500" />{" "}
                      Servicio / Tratamiento
                    </label>
                    <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 px-4 py-3 text-xs font-semibold text-emerald-800">
                      {booking.service}
                    </div>
                  </div>
                </div>
              </div>

              {/* DÍAS Y HORARIOS */}
              <div className="bg-white p-8 rounded-[2rem] border border-rose-100/60 shadow-sm space-y-6">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Calendar size={15} className="text-rose-400" /> Selecciona
                  Día
                </label>

                <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide">
                  {dateOptions.map((d, i) => {
                    const isSelected = selectedDateObj?.full === d.full;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedDateObj(d)}
                        className={`flex flex-col items-center min-w-[60px] p-3 rounded-2xl border transition-all ${
                          isSelected
                            ? "bg-emerald-400 border-emerald-400 text-white shadow-md shadow-emerald-400/20"
                            : "bg-slate-50/70 border-slate-100 text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-[10px] font-extrabold uppercase tracking-wider mb-1">
                          {d.dayName}
                        </span>
                        <span className="text-base font-extrabold">
                          {d.dayNum}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <Clock size={15} className="text-emerald-500" /> Horarios
                    Disponibles
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((time) => {
                        const isSelected = booking.start === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              setBooking({ ...booking, start: time })
                            }
                            className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                              isSelected
                                ? "bg-slate-800 border-slate-800 text-white shadow-sm"
                                : "bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })
                    ) : (
                      <p className="col-span-3 text-center text-xs text-slate-400 font-medium py-6">
                        Sin turnos libres para esta fecha
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
                  className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-2xl transition-all disabled:opacity-40 shadow-lg shadow-emerald-400/20 flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Confirmar Cita"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PASO 3: CONFIRMACIÓN */}
        {step === 3 && (
          <div className="max-w-md mx-auto text-center py-6 animate-in zoom-in-95 duration-700 space-y-6">
            <div className="size-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner text-emerald-500">
              <CheckCircle2 size={42} />
            </div>

            <div>
              <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold inline-block mb-2">
                ¡Reserva Exitosa!
              </span>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Tu Cita está Confirmada
              </h2>
            </div>

            <div className="p-6 bg-white border border-rose-100/60 rounded-[2rem] shadow-sm space-y-2 text-center">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Detalles del Turno
              </p>
              <p className="text-lg font-extrabold text-slate-800 uppercase">
                {selectedDateObj.dayName} {selectedDateObj.dayNum} —{" "}
                {booking.start} HS
              </p>
              <p className="text-xs font-semibold text-emerald-600 pt-1">
                Atendido por: {booking.specialist}
              </p>
            </div>

            <div className="p-6 bg-rose-50/50 border border-rose-100/60 rounded-[2rem] space-y-2 text-center">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Ubicación del Local
              </p>
              <p className="text-xs font-bold text-slate-700">
                {estetica?.direccion || "Dirección no especificada"}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              {(estetica?.mapsLink || estetica?.direccion) && (
                <a
                  href={
                    estetica?.mapsLink
                      ? estetica.mapsLink
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          estetica.direccion,
                        )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-slate-800 text-white rounded-2xl text-xs font-bold tracking-wider hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  <MapPin size={16} /> Cómo llegar
                </a>
              )}
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3.5 bg-white border border-rose-100/80 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Reservar otra cita
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
