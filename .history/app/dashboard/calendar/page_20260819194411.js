// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   X,
//   CheckCircle2,
//   Loader2,
//   Clock,
//   Banknote,
//   Smartphone,
//   Receipt,
//   CreditCard,
//   Check,
//   Trash2,
//   Plus,
//   AlertOctagon,
//   Phone,
//   Sparkles,
//   Flower2,
// } from "lucide-react";
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// const HOUR_HEIGHT = 95;
// const START_HOUR = 8;
// const DAYS = [
//   "Lunes",
//   "Martes",
//   "Miércoles",
//   "Jueves",
//   "Viernes",
//   "Sábado",
//   "Domingo",
// ];

// const SPECIALIST_COLORS = [
//   {
//     bg: "bg-white",
//     border: "border-slate-300",
//     accent: "bg-pink-600",
//     tab: "bg-pink-600",
//   },
//   {
//     bg: "bg-white",
//     border: "border-slate-300",
//     accent: "bg-purple-600",
//     tab: "bg-purple-600",
//   },
//   {
//     bg: "bg-white",
//     border: "border-slate-300",
//     accent: "bg-indigo-600",
//     tab: "bg-indigo-600",
//   },
//   {
//     bg: "bg-white",
//     border: "border-slate-300",
//     accent: "bg-rose-600",
//     tab: "bg-rose-600",
//   },
// ];

// const PAYMENT_METHODS = [
//   { id: "cash", name: "Efectivo", icon: <Banknote size={16} /> },
//   { id: "transfer", name: "Transferencia", icon: <Receipt size={16} /> },
//   { id: "mp", name: "Mercado Pago", icon: <Smartphone size={16} /> },
//   { id: "pos", name: "POS / Tarjeta", icon: <CreditCard size={16} /> },
// ];

// export default function CalendarPage() {
//   const [loading, setLoading] = useState(true);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [showPaymentSelector, setShowPaymentSelector] = useState(false);
//   const [selectedMethod, setSelectedMethod] = useState("cash");
//   const [user, setUser] = useState(null);
//   const [team, setTeam] = useState([]);
//   const [availableServices, setAvailableServices] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [viewFilter, setViewFilter] = useState("all");
//   const [isInactive, setIsInactive] = useState(false);

//   const [currentApp, setCurrentApp] = useState({
//     id: null,
//     customer: "",
//     phone: "",
//     specialist: "",
//     start: "09:00",
//     day: 0,
//     status: "pending",
//     selectedServiceIds: [], // <--- MUY IMPORTANTE ESTA LÍNEA
//   });

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         const docRef = doc(db, "centros_estetica", currentUser.uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setTeam(data.specialists || []);
//           setAvailableServices(data.services || []);
//           setAppointments(data.appointments || []);
//           const expiresAt = data.plan?.expiresAt;
//           const expiration = expiresAt?.toDate
//             ? expiresAt.toDate()
//             : expiresAt
//               ? new Date(expiresAt)
//               : null;
//           setIsInactive(
//             data.plan?.status === "inactive" ||
//               data.plan?.status === "expired" ||
//               (expiration && expiration <= new Date())
//           );
//         }
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const specialistColorMap = useMemo(() => {
//     const map = {};
//     team.forEach(
//       (s, i) => (map[s.name] = SPECIALIST_COLORS[i % SPECIALIST_COLORS.length])
//     );
//     return map;
//   }, [team]);

//   const filteredAppointments = useMemo(() => {
//     if (viewFilter === "all") return appointments;
//     return appointments.filter((app) => app.specialist === viewFilter);
//   }, [appointments, viewFilter]);

//   const { totalAmount, totalDuration } = useMemo(() => {
//     if (!currentApp.selectedServiceIds?.length)
//       return { totalAmount: 0, totalDuration: 0 };
//     return currentApp.selectedServiceIds.reduce(
//       (acc, id) => {
//         const s = availableServices.find(
//           (svc) => String(svc.id) === String(id)
//         );
//         return {
//           totalAmount: acc.totalAmount + (Number(s?.price) || 0),
//           totalDuration: acc.totalDuration + (Number(s?.time) || 60),
//         };
//       },
//       { totalAmount: 0, totalDuration: 0 }
//     );
//   }, [currentApp.selectedServiceIds, availableServices]);

//   const handleSave = async (e) => {
//     e.preventDefault();
//     if (!currentApp.customer) return alert("Nombre obligatorio");
//     const today = new Date();
//     const targetDate = new Date(today);
//     targetDate.setDate(
//       today.getDate() +
//         (currentApp.day - (today.getDay() === 0 ? 6 : today.getDay() - 1))
//     );

//     const appData = {
//       ...currentApp,
//       id: currentApp.id || Math.random().toString(36).substring(2, 15),
//       total: totalAmount,
//       duration: totalDuration,
//       date: targetDate.toLocaleDateString("sv-SE"),
//       createdAt: currentApp.createdAt || new Date().toISOString(),
//     };

//     const newList = appointments.some(
//       (a) => String(a.id) === String(currentApp.id)
//     )
//       ? appointments.map((a) =>
//           String(a.id) === String(currentApp.id) ? appData : a
//         )
//       : [...appointments, appData];

//     await updateDoc(doc(db, "centros_estetica", user.uid), {
//       appointments: newList,
//     });
//     setAppointments(newList);
//     setIsDrawerOpen(false);
//   };

//   const getTimeTop = (t) => {
//     const [h, m] = t.split(":").map(Number);
//     return (h + m / 60 - START_HOUR) * HOUR_HEIGHT;
//   };

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center bg-white">
//         <Loader2 className="animate-spin text-pink-500" size={40} />
//       </div>
//     );

//   return (
//     <div className="flex flex-col h-full bg-white dark:bg-slate-900  font-sans text-slate-900">
//       {/* HEADER */}
//       <header className="px-8 py-5 border-b-2 border-slate-100 sticky top-0 bg-white dark:bg-slate-900  z-40">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl dark:text-white text-slate-900 font-black uppercase  tracking-tighter">
//             Agenda <span className="text-pink-600">Web</span>
//           </h1>
//           <button
//             onClick={() => {
//               setCurrentApp({
//                 id: null,
//                 customer: "",
//                 phone: "",
//                 specialist: team[0]?.name || "",
//                 start: "09:00",
//                 day: 0,
//                 status: "pending",
//                 selectedServiceIds: [],
//               });
//               setShowPaymentSelector(false);
//               setIsDrawerOpen(true);
//             }}
//             className="dark:bg-pink-600 bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg"
//           >
//             + Nueva Cita
//           </button>
//         </div>
//         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
//           <button
//             onClick={() => setViewFilter("all")}
//             className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
//               viewFilter === "all"
//                 ? "bg-pink-600 text-white"
//                 : "bg-slate-100 text-slate-500"
//             }`}
//           >
//             Todos
//           </button>
//           {team.map((s) => (
//             <button
//               key={s.id}
//               onClick={() => setViewFilter(s.name)}
//               className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
//                 viewFilter === s.name
//                   ? `${specialistColorMap[s.name]?.tab} text-white`
//                   : "bg-slate-100 text-slate-500"
//               }`}
//             >
//               {s.name}
//             </button>
//           ))}
//         </div>
//       </header>

//       {/* CALENDARIO */}
//       <div className="flex-1 w-full overflow-auto bg-white dark:bg-slate-900 ">
//         <div className="w-full h-full flex flex-col">
//           <div className="flex border-b-2 border-slate-200 dark:border-slate-700 sticky top-0 z-20">
//             <div className="w-20 border-r-2 border-slate-200 dark:border-slate-700" />
//             <div className="flex-1 grid grid-cols-7 divide-x-2 divide-slate-100 dark:divide-slate-800 uppercase text-[11px] font-black text-slate-900">
//               {DAYS.map((d) => (
//                 <div
//                   key={d}
//                   className="py-4 text-center bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300"
//                 >
//                   {d}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div
//             className="flex relative flex-1"
//             style={{ height: 13 * HOUR_HEIGHT }}
//           >
//             <div className="w-20 border-r-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[12px] font-black text-slate-400 text-center">
//               {Array.from({ length: 13 }).map((_, i) => (
//                 <div key={i} style={{ height: HOUR_HEIGHT }} className="pt-2">
//                   {(i + START_HOUR).toString().padStart(2, "0")}:00
//                 </div>
//               ))}
//             </div>
//             <div className="flex-1 grid grid-cols-7 divide-x-2 divide-slate-200 relative  bg-white dark:bg-slate-800 ">
//               {Array.from({ length: 13 * 7 }).map((_, idx) => (
//                 <div
//                   key={idx}
//                   className="border-b border-slate-100 dark:border-slate-700"
//                   style={{ height: HOUR_HEIGHT }}
//                 />
//               ))}
//               {filteredAppointments.map((app) => {
//                 const colors =
//                   specialistColorMap[app.specialist] || SPECIALIST_COLORS[0];
//                 return (
//                   <div
//                     key={app.id}
//                     onClick={() => {
//                       setCurrentApp(app);
//                       setShowPaymentSelector(false);
//                       setIsDrawerOpen(true);
//                     }}
//                     className={`absolute left-1 right-1 rounded-lg border-2 shadow-sm cursor-pointer z-10 overflow-hidden flex bg-white ${colors.border}`}
//                     style={{
//                       top: getTimeTop(app.start) + 2,
//                       height:
//                         ((Number(app.duration) || 60) / 60) * HOUR_HEIGHT - 4,
//                       gridColumnStart: app.day + 1,
//                       gridColumnEnd: app.day + 2,
//                     }}
//                   >
//                     <div className={`w-1.5 shrink-0 ${colors.accent}`} />
//                     <div className="p-2 overflow-hidden">
//                       <p className="text-[11px] font-black uppercase text-slate-900 leading-tight truncate">
//                         {app.customer}
//                       </p>
//                       <p className="text-[9px] font-bold text-slate-400 mt-0.5">
//                         {app.start}hs • {app.duration}m
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* DRAWER */}
//       {isDrawerOpen && (
//         <div className="fixed inset-0 z-[100] flex justify-end">
//           <div
//             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
//             onClick={() => setIsDrawerOpen(false)}
//           />
//           <div className="relative w-full md:max-w-[480px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col p-8 animate-in slide-in-from-right duration-300">
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-xl font-black uppercase text-slate-900 dark:text-slate-100">
//                 {showPaymentSelector ? "Cobrar" : "Detalles"}{" "}
//                 <span className="text-pink-600">Web</span>
//               </h2>
//               <button
//                 onClick={() => setIsDrawerOpen(false)}
//                 className="p-2 bg-slate-100 rounded-lg text-slate-500 hover:text-red-500 transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto pb-32">
//               {!showPaymentSelector ? (
//                 <form onSubmit={handleSave} className="space-y-6">
//                   {currentApp.id && currentApp.status !== "done" && (
//                     <button
//                       type="button"
//                       onClick={() => setShowPaymentSelector(true)}
//                       className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 mb-4 transition-all hover:scale-[1.02]"
//                     >
//                       Confirmar y Cobrar
//                     </button>
//                   )}

//                   <div className="space-y-4">
//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                         Clienta
//                       </label>
//                       <input
//                         required
//                         value={currentApp.customer}
//                         onChange={(e) =>
//                           setCurrentApp({
//                             ...currentApp,
//                             customer: e.target.value,
//                           })
//                         }
//                         className="w-full p-4 bg-slate-100 border-2 border-transparent focus:border-slate-900 rounded-xl font-bold outline-none uppercase text-sm"
//                         placeholder="VALENTINA GÓMEZ"
//                       />
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                         WhatsApp
//                       </label>
//                       <div className="relative">
//                         <Phone
//                           className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                           size={16}
//                         />
//                         <input
//                           value={currentApp.phone}
//                           onChange={(e) =>
//                             setCurrentApp({
//                               ...currentApp,
//                               phone: e.target.value,
//                             })
//                           }
//                           className="w-full pl-12 pr-4 py-4 bg-slate-100 border-2 border-transparent focus:border-slate-900 rounded-xl font-bold outline-none text-sm"
//                           placeholder="09X XXX XXX"
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-1.5">
//                         <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                           Día
//                         </label>
//                         <select
//                           value={currentApp.day}
//                           onChange={(e) =>
//                             setCurrentApp({
//                               ...currentApp,
//                               day: parseInt(e.target.value),
//                             })
//                           }
//                           className="w-full p-4 bg-slate-100 rounded-xl font-bold outline-none text-sm uppercase"
//                         >
//                           {DAYS.map((d, i) => (
//                             <option key={i} value={i}>
//                               {d}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="space-y-1.5">
//                         <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                           Hora
//                         </label>
//                         <input
//                           type="time"
//                           value={currentApp.start}
//                           onChange={(e) =>
//                             setCurrentApp({
//                               ...currentApp,
//                               start: e.target.value,
//                             })
//                           }
//                           className="w-full p-4 bg-slate-100 rounded-xl font-bold outline-none text-sm"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-1.5">
//                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                         Especialista
//                       </label>
//                       <select
//                         value={currentApp.specialist}
//                         onChange={(e) =>
//                           setCurrentApp({
//                             ...currentApp,
//                             specialist: e.target.value,
//                           })
//                         }
//                         className="w-full p-4 bg-slate-100 rounded-xl font-bold outline-none text-sm uppercase"
//                       >
//                         {team.map((s) => (
//                           <option key={s.id} value={s.name}>
//                             {s.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="space-y-3 pt-2">
//                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex justify-between">
//                         <span>Tratamientos</span>
//                         {currentApp.selectedServiceIds?.length === 0 && (
//                           <span className="text-rose-500 animate-pulse">
//                             Selección obligatoria
//                           </span>
//                         )}
//                       </label>

//                       <div className="grid gap-2">
//                         {availableServices.map((s) => {
//                           const isSelected =
//                             currentApp.selectedServiceIds?.includes(s.id);
//                           return (
//                             <div
//                               key={s.id}
//                               onClick={() => {
//                                 if (currentApp.status !== "done") {
//                                   const currentIds =
//                                     currentApp.selectedServiceIds || [];
//                                   setCurrentApp((prev) => ({
//                                     ...prev,
//                                     selectedServiceIds: isSelected
//                                       ? currentIds.filter((id) => id !== s.id)
//                                       : [...currentIds, s.id],
//                                   }));
//                                 }
//                               }}
//                               className={`p-4 rounded-2xl border-2 flex justify-between items-center cursor-pointer transition-all group ${
//                                 isSelected
//                                   ? "border-pink-500 bg-pink-50 shadow-sm"
//                                   : "border-transparent bg-slate-50 hover:bg-slate-100"
//                               }`}
//                             >
//                               <div className="flex items-center gap-3">
//                                 {/* Icono de Checkbox Estético */}
//                                 <div
//                                   className={`size-5 rounded-lg border-2 flex items-center justify-center transition-all ${
//                                     isSelected
//                                       ? "bg-pink-500 border-pink-500 shadow-lg shadow-pink-500/20"
//                                       : "bg-white border-slate-200"
//                                   }`}
//                                 >
//                                   {isSelected && (
//                                     <Check
//                                       size={14}
//                                       className="text-white"
//                                       strokeWidth={4}
//                                     />
//                                   )}
//                                 </div>
//                                 <span
//                                   className={`text-[11px] font-black uppercase tracking-tight ${
//                                     isSelected
//                                       ? "text-pink-700"
//                                       : "text-slate-700"
//                                   }`}
//                                 >
//                                   {s.name}
//                                 </span>
//                               </div>

//                               <span
//                                 className={`text-xs font-black ${
//                                   isSelected
//                                     ? "text-pink-600"
//                                     : "text-slate-400"
//                                 }`}
//                               >
//                                 ${s.price}
//                               </span>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               ) : (
//                 <div className="space-y-6">
//                   <button
//                     onClick={() => setShowPaymentSelector(false)}
//                     className="text-[10px] font-black uppercase text-slate-400 mb-4 hover:text-pink-600"
//                   >
//                     ← Volver
//                   </button>
//                   <div className="grid gap-3">
//                     {PAYMENT_METHODS.map((m) => (
//                       <button
//                         key={m.id}
//                         onClick={() => setSelectedMethod(m.id)}
//                         className={`p-6 rounded-[2rem] border-2 flex justify-between items-center transition-all ${
//                           selectedMethod === m.id
//                             ? "border-pink-500 bg-pink-50"
//                             : "border-slate-100 bg-white"
//                         }`}
//                       >
//                         <div className="flex items-center gap-5">
//                           <div
//                             className={`p-4 rounded-2xl ${
//                               selectedMethod === m.id
//                                 ? "bg-pink-500 text-white"
//                                 : "bg-slate-100 text-slate-400"
//                             }`}
//                           >
//                             {m.icon}
//                           </div>
//                           <span className="font-black text-xs uppercase tracking-widest">
//                             {m.name}
//                           </span>
//                         </div>
//                         {selectedMethod === m.id && (
//                           <div className="size-6 bg-pink-500 rounded-full flex items-center justify-center text-white">
//                             <Check size={14} strokeWidth={4} />
//                           </div>
//                         )}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* TOTAL FIJO ABAJO */}
//             <div className="relative bottom-0 left-0 right-0 pt-2 ">
//               <div className="flex justify-between items-end mb-6">
//                 <div>
//                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
//                     Duración
//                   </p>
//                   <p className="text-sm font-bold text-slate-700">
//                     {totalDuration} min
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
//                     Costo Total
//                   </p>
//                   <p className="text-4xl font-black text-pink-500 tracking-tighter">
//                     ${totalAmount}
//                   </p>
//                 </div>
//               </div>
//               {!showPaymentSelector ? (
//                 <button
//                   onClick={handleSave}
//                   className="w-full py-5 bg-slate-900 dark:bg-pink-700 text-white rounded-full font-black uppercase tracking-[0.2em] shadow-xl hover:bg-pink-600 transition-all"
//                 >
//                   Guardar Agenda
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => alert("Cita finalizada")}
//                   className="w-full py-5 bg-pink-500 text-white rounded-full font-black uppercase tracking-[0.2em] shadow-xl"
//                 >
//                   Finalizar $${totalAmount}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Clock,
  Banknote,
  Smartphone,
  Receipt,
  CreditCard,
  Check,
  Plus,
  Phone,
  User,
  Calendar as CalendarIcon,
  Sparkles,
  ChevronRight,
  Search,
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const HOUR_HEIGHT = 80;
const START_HOUR = 8;
const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const SPECIALIST_COLORS = [
  {
    bg: "bg-emerald-50/80",
    border: "border-emerald-200/60",
    text: "text-emerald-800",
    pill: "bg-emerald-500",
    accent: "bg-emerald-400",
  },
  {
    bg: "bg-rose-50/80",
    border: "border-rose-200/60",
    text: "text-rose-800",
    pill: "bg-rose-500",
    accent: "bg-rose-400",
  },
  {
    bg: "bg-amber-50/80",
    border: "border-amber-200/60",
    text: "text-amber-800",
    pill: "bg-amber-500",
    accent: "bg-amber-400",
  },
  {
    bg: "bg-sky-50/80",
    border: "border-sky-200/60",
    text: "text-sky-800",
    pill: "bg-sky-500",
    accent: "bg-sky-400",
  },
];

const PAYMENT_METHODS = [
  { id: "cash", name: "Efectivo", icon: <Banknote size={18} /> },
  { id: "transfer", name: "Transferencia", icon: <Receipt size={18} /> },
  { id: "mp", name: "Mercado Pago", icon: <Smartphone size={18} /> },
  { id: "pos", name: "POS / Tarjeta", icon: <CreditCard size={18} /> },
];

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("cash");
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [viewFilter, setViewFilter] = useState("all");

  const [currentApp, setCurrentApp] = useState({
    id: null,
    customer: "",
    phone: "",
    specialist: "",
    start: "09:00",
    day: 0,
    status: "pending",
    selectedServiceIds: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "centros_estetica", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTeam(data.specialists || []);
          setAvailableServices(data.services || []);
          setAppointments(data.appointments || []);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const specialistColorMap = useMemo(() => {
    const map = {};
    team.forEach(
      (s, i) => (map[s.name] = SPECIALIST_COLORS[i % SPECIALIST_COLORS.length]),
    );
    return map;
  }, [team]);

  const filteredAppointments = useMemo(() => {
    if (viewFilter === "all") return appointments;
    return appointments.filter((app) => app.specialist === viewFilter);
  }, [appointments, viewFilter]);

  const { totalAmount, totalDuration } = useMemo(() => {
    if (!currentApp.selectedServiceIds?.length)
      return { totalAmount: 0, totalDuration: 0 };
    return currentApp.selectedServiceIds.reduce(
      (acc, id) => {
        const s = availableServices.find(
          (svc) => String(svc.id) === String(id),
        );
        return {
          totalAmount: acc.totalAmount + (Number(s?.price) || 0),
          totalDuration: acc.totalDuration + (Number(s?.time) || 60),
        };
      },
      { totalAmount: 0, totalDuration: 0 },
    );
  }, [currentApp.selectedServiceIds, availableServices]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!currentApp.customer) return alert("Nombre obligatorio");
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(
      today.getDate() +
        (currentApp.day - (today.getDay() === 0 ? 6 : today.getDay() - 1)),
    );

    const appData = {
      ...currentApp,
      id: currentApp.id || Math.random().toString(36).substring(2, 15),
      total: totalAmount,
      duration: totalDuration,
      date: targetDate.toLocaleDateString("sv-SE"),
      createdAt: currentApp.createdAt || new Date().toISOString(),
    };

    const newList = appointments.some(
      (a) => String(a.id) === String(currentApp.id),
    )
      ? appointments.map((a) =>
          String(a.id) === String(currentApp.id) ? appData : a,
        )
      : [...appointments, appData];

    await updateDoc(doc(db, "centros_estetica", user.uid), {
      appointments: newList,
    });
    setAppointments(newList);
    setIsDrawerOpen(false);
  };

  const getTimeTop = (t) => {
    const [h, m] = t.split(":").map(Number);
    return (h + m / 60 - START_HOUR) * HOUR_HEIGHT;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-400">
            Cargando agenda...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased overflow-hidden">
      {/* HEADER TIPO DASHBOARD */}
      <header className="px-8 py-5 bg-white border-b border-slate-100 flex flex-col gap-4 sticky top-0 z-30 shadow-sm/50">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-emerald-600 uppercase">
              Gestión Estética
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Agenda de Turnos
            </h1>
          </div>

          <button
            onClick={() => {
              setCurrentApp({
                id: null,
                customer: "",
                phone: "",
                specialist: team[0]?.name || "",
                start: "09:00",
                day: 0,
                status: "pending",
                selectedServiceIds: [],
              });
              setShowPaymentSelector(false);
              setIsDrawerOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium text-xs shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Plus size={16} />
            <span>Nueva Cita</span>
          </button>
        </div>

        {/* FILTROS DE ESPECIALISTAS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setViewFilter("all")}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              viewFilter === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Todos
          </button>
          {team.map((s) => {
            const isSelected = viewFilter === s.name;
            return (
              <button
                key={s.id}
                onClick={() => setViewFilter(s.name)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : "bg-emerald-400"}`}
                />
                {s.name}
              </button>
            );
          })}
        </div>
      </header>

      {/* CALENDARIO CONTENEDOR */}
      <div className="flex-1 overflow-auto bg-[#F8FAFC] p-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full min-w-[900px]">
          {/* DIAS DE LA SEMANA */}
          <div className="flex border-b border-slate-100 bg-slate-50/50 sticky top-0 z-20">
            <div className="w-16 shrink-0 border-r border-slate-100 py-3 text-center text-[11px] font-semibold text-slate-400">
              Hora
            </div>
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 text-xs font-medium text-slate-600">
              {DAYS.map((d, i) => (
                <div key={d} className="py-3 text-center">
                  <span className="block text-slate-900 font-semibold">
                    {d}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* GRID DE HORARIOS */}
          <div
            className="flex relative flex-1"
            style={{ height: 13 * HOUR_HEIGHT }}
          >
            {/* COLUMNA HORAS */}
            <div className="w-16 shrink-0 border-r border-slate-100 bg-white text-[11px] text-slate-400 text-center select-none">
              {Array.from({ length: 13 }).map((_, i) => (
                <div
                  key={i}
                  style={{ height: HOUR_HEIGHT }}
                  className="pt-2 font-medium"
                >
                  {(i + START_HOUR).toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* GRILLA Y EVENTOS */}
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 relative bg-white">
              {Array.from({ length: 13 * 7 }).map((_, idx) => (
                <div
                  key={idx}
                  className="border-b border-slate-100/60"
                  style={{ height: HOUR_HEIGHT }}
                />
              ))}

              {filteredAppointments.map((app) => {
                const colors =
                  specialistColorMap[app.specialist] || SPECIALIST_COLORS[0];
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      setCurrentApp(app);
                      setShowPaymentSelector(false);
                      setIsDrawerOpen(true);
                    }}
                    className={`absolute left-1 right-1 rounded-xl border p-2.5 shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 z-10 flex flex-col justify-between overflow-hidden ${colors.bg} ${colors.border}`}
                    style={{
                      top: getTimeTop(app.start) + 2,
                      height:
                        ((Number(app.duration) || 60) / 60) * HOUR_HEIGHT - 4,
                      gridColumnStart: app.day + 1,
                      gridColumnEnd: app.day + 2,
                    }}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p
                        className={`text-xs font-semibold truncate ${colors.text}`}
                      >
                        {app.customer}
                      </p>
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.pill}`}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                      <Clock size={12} className="opacity-60" />
                      <span>{app.start} hs</span>
                      <span>•</span>
                      <span>{app.duration}m</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER MODAL */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* CABECERA DRAWER */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {showPaymentSelector
                    ? "Cobrar Cita"
                    : currentApp.id
                      ? "Detalles de la Cita"
                      : "Nueva Cita"}
                </h2>
                <p className="text-xs text-slate-400">
                  Complete la información del paciente
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* CONTENIDO DRAWER */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!showPaymentSelector ? (
                <form
                  id="appointment-form"
                  onSubmit={handleSave}
                  className="space-y-4"
                >
                  {currentApp.id && currentApp.status !== "done" && (
                    <button
                      type="button"
                      onClick={() => setShowPaymentSelector(true)}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-xs tracking-wide shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={16} />
                      <span>Confirmar y Cobrar</span>
                    </button>
                  )}

                  {/* PACIENTE */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">
                      Paciente / Cliente
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        required
                        value={currentApp.customer}
                        onChange={(e) =>
                          setCurrentApp({
                            ...currentApp,
                            customer: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all"
                        placeholder="ej. Valentina Gómez"
                      />
                    </div>
                  </div>

                  {/* WHATSAPP */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">
                      Teléfono / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        value={currentApp.phone}
                        onChange={(e) =>
                          setCurrentApp({
                            ...currentApp,
                            phone: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all"
                        placeholder="099 123 456"
                      />
                    </div>
                  </div>

                  {/* DIA Y HORA */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600">
                        Día
                      </label>
                      <select
                        value={currentApp.day}
                        onChange={(e) =>
                          setCurrentApp({
                            ...currentApp,
                            day: parseInt(e.target.value),
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all"
                      >
                        {DAYS.map((d, i) => (
                          <option key={i} value={i}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600">
                        Hora
                      </label>
                      <input
                        type="time"
                        value={currentApp.start}
                        onChange={(e) =>
                          setCurrentApp({
                            ...currentApp,
                            start: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* ESPECIALISTA */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">
                      Especialista
                    </label>
                    <select
                      value={currentApp.specialist}
                      onChange={(e) =>
                        setCurrentApp({
                          ...currentApp,
                          specialist: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all"
                    >
                      {team.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* TRATAMIENTOS */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-medium text-slate-600 flex justify-between items-center">
                      <span>Tratamientos</span>
                      {currentApp.selectedServiceIds?.length === 0 && (
                        <span className="text-[10px] text-rose-500 font-normal">
                          Requerido
                        </span>
                      )}
                    </label>

                    <div className="space-y-2">
                      {availableServices.map((s) => {
                        const isSelected =
                          currentApp.selectedServiceIds?.includes(s.id);
                        return (
                          <div
                            key={s.id}
                            onClick={() => {
                              if (currentApp.status !== "done") {
                                const currentIds =
                                  currentApp.selectedServiceIds || [];
                                setCurrentApp((prev) => ({
                                  ...prev,
                                  selectedServiceIds: isSelected
                                    ? currentIds.filter((id) => id !== s.id)
                                    : [...currentIds, s.id],
                                }));
                              }
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-50/40 text-emerald-900 shadow-2xs"
                                : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/60 text-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                  isSelected
                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                    : "border-slate-300 bg-white"
                                }`}
                              >
                                {isSelected && (
                                  <Check size={12} strokeWidth={3} />
                                )}
                              </div>
                              <span className="text-xs font-medium">
                                {s.name}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-slate-500">
                              ${s.price}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowPaymentSelector(false)}
                    className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    ← Volver a detalles
                  </button>

                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id)}
                        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                          selectedMethod === m.id
                            ? "border-emerald-500 bg-emerald-50/30 text-emerald-900"
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              selectedMethod === m.id
                                ? "bg-emerald-500 text-white"
                                : "bg-white text-slate-400 border border-slate-100"
                            }`}
                          >
                            {m.icon}
                          </div>
                          <span className="text-xs font-semibold">
                            {m.name}
                          </span>
                        </div>
                        {selectedMethod === m.id && (
                          <Check
                            size={16}
                            className="text-emerald-500"
                            strokeWidth={3}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER DEL DRAWER CON RESUMEN DE PAGO */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  Duración Estimada
                </span>
                <span className="font-semibold text-slate-700">
                  {totalDuration} min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Monto Total
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  ${totalAmount}
                </span>
              </div>

              {!showPaymentSelector ? (
                <button
                  type="submit"
                  form="appointment-form"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-xs tracking-wide shadow-sm transition-all"
                >
                  Guardar Cita
                </button>
              ) : (
                <button
                  onClick={() => alert("Cita cobrada con éxito")}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-xs tracking-wide shadow-sm transition-all"
                >
                  Finalizar Cobro (${totalAmount})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
