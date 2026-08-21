// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   X,
//   Loader2,
//   Banknote,
//   Smartphone,
//   Receipt,
//   CreditCard,
//   Check,
//   Plus,
//   Phone,
//   Sparkles,
//   ChevronLeft,
//   ChevronRight,
//   Filter,
// } from "lucide-react";
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// const HOUR_HEIGHT = 80;
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

// // Paleta estilo Byutie (Salmón pastel, Menta pastel, Gris cálido, Rosa pastel)
// const SPECIALIST_COLORS = [
//   {
//     bg: "bg-[#FFE4E6]",
//     text: "text-[#9F1239]",
//     badge: "bg-[#FECDD3] text-[#9F1239]",
//     accent: "bg-[#F43F5E]",
//   },
//   {
//     bg: "bg-[#DCFCE7]",
//     text: "text-[#166534]",
//     badge: "bg-[#BBF7D0] text-[#166534]",
//     accent: "bg-[#22C55E]",
//   },
//   {
//     bg: "bg-[#F1F5F9]",
//     text: "text-[#334155]",
//     badge: "bg-[#E2E8F0] text-[#334155]",
//     accent: "bg-[#64748B]",
//   },
//   {
//     bg: "bg-[#FFEDD5]",
//     text: "text-[#9A3412]",
//     badge: "bg-[#FED7AA] text-[#9A3412]",
//     accent: "bg-[#F97316]",
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

//   const [currentApp, setCurrentApp] = useState({
//     id: null,
//     customer: "",
//     phone: "",
//     specialist: "",
//     start: "09:00",
//     day: 0,
//     status: "pending",
//     selectedServiceIds: [],
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
//         }
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const specialistColorMap = useMemo(() => {
//     const map = {};
//     team.forEach(
//       (s, i) => (map[s.name] = SPECIALIST_COLORS[i % SPECIALIST_COLORS.length]),
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
//           (svc) => String(svc.id) === String(id),
//         );
//         return {
//           totalAmount: acc.totalAmount + (Number(s?.price) || 0),
//           totalDuration: acc.totalDuration + (Number(s?.time) || 60),
//         };
//       },
//       { totalAmount: 0, totalDuration: 0 },
//     );
//   }, [currentApp.selectedServiceIds, availableServices]);

//   const handleSave = async (e) => {
//     if (e) e.preventDefault();
//     if (!currentApp.customer) return alert("Ingresa el nombre del paciente");
//     const today = new Date();
//     const targetDate = new Date(today);
//     targetDate.setDate(
//       today.getDate() +
//         (currentApp.day - (today.getDay() === 0 ? 6 : today.getDay() - 1)),
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
//       (a) => String(a.id) === String(currentApp.id),
//     )
//       ? appointments.map((a) =>
//           String(a.id) === String(currentApp.id) ? appData : a,
//         )
//       : [...appointments, appData];

//     await updateDoc(doc(db, "centros_estetica", user.uid), {
//       appointments: newList,
//     });
//     setAppointments(newList);
//     setIsDrawerOpen(false);
//   };

//   const handlePayment = async () => {
//     if (!currentApp?.id || !user) return;

//     try {
//       const paidAt = new Date().toISOString();
//       const paidAppointment = {
//         ...currentApp,
//         total: totalAmount,
//         duration: totalDuration,
//         status: "done",
//         paymentMethod: selectedMethod,
//         paidAt,
//       };
//       const updatedAppointments = appointments.map((appointment) =>
//         String(appointment.id) === String(currentApp.id)
//           ? paidAppointment
//           : appointment,
//       );

//       await updateDoc(doc(db, "centros_estetica", user.uid), {
//         appointments: updatedAppointments,
//       });
//       setAppointments(updatedAppointments);
//       setCurrentApp(paidAppointment);
//       setShowPaymentSelector(false);
//       setIsDrawerOpen(false);
//     } catch (error) {
//       console.error("Error registrando el cobro:", error);
//       alert("No se pudo registrar el cobro.");
//     }
//   };

//   const getTimeTop = (t) => {
//     const [h, m] = t.split(":").map(Number);
//     return (h + m / 60 - START_HOUR) * HOUR_HEIGHT;
//   };

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center bg-[#FAF8F5]">
//         <Loader2 className="animate-spin text-[#4ADE80]" size={36} />
//       </div>
//     );

//   return (
//     <div className="flex flex-col h-full bg-[#FAF8F5] p-4 lg:p-6 text-slate-700 font-sans antialiased overflow-hidden">
//       {/* HEADER DE LA AGENDA */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
//             Surgery Schedule
//           </h1>
//           <p className="text-xs text-slate-400 mt-0.5">
//             Gestión e historial de turnos para tratamientos y especialidades.
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="flex items-center bg-white border border-slate-200/80 rounded-xl px-2 py-1 shadow-xs">
//             <button className="p-1.5 text-slate-400 hover:text-slate-700">
//               <ChevronLeft size={16} />
//             </button>
//             <span className="text-xs font-semibold text-slate-700 px-3">
//               Septiembre 2026
//             </span>
//             <button className="p-1.5 text-slate-400 hover:text-slate-700">
//               <ChevronRight size={16} />
//             </button>
//           </div>

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
//             className="inline-flex items-center gap-2 bg-[#d87cef] hover:bg-[#ce4eee] text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-colors shadow-xs shrink-0"
//           >
//             <Plus size={16} />
//             <span>Nueva Cita</span>
//           </button>
//         </div>
//       </div>

//       {/* FILTROS POR ESPECIALISTA / TRATAMIENTO */}
//       <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
//         <button
//           onClick={() => setViewFilter("all")}
//           className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
//             viewFilter === "all"
//               ? "bg-[#15803D] text-white shadow-xs"
//               : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
//           }`}
//         >
//           {viewFilter === "all" && <Check size={12} />}
//           <span>Todos</span>
//         </button>
//         {team.map((s) => {
//           const active = viewFilter === s.name;
//           return (
//             <button
//               key={s.id}
//               onClick={() => setViewFilter(s.name)}
//               className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
//                 active
//                   ? "bg-[#15803D] text-white shadow-xs"
//                   : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
//               }`}
//             >
//               {active && <Check size={12} />}
//               <span>{s.name}</span>
//             </button>
//           );
//         })}
//       </div>

//       {/* CONTENEDOR DEL CALENDARIO */}
//       <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
//         {/* Cabecera de días */}
//         <div className="grid grid-cols-8 border-b border-slate-100 bg-[#FAF8F5]/50 text-slate-500 font-semibold text-xs">
//           <div className="p-3 text-center border-r border-slate-100 text-[11px] text-slate-400">
//             GMT-3
//           </div>
//           {DAYS.map((d, index) => (
//             <div
//               key={d}
//               className="py-3 text-center border-r border-slate-100 last:border-r-0"
//             >
//               <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">
//                 {d.substring(0, 3)}
//               </span>
//               <span className="text-sm font-extrabold text-slate-800">
//                 {18 + index}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Grilla de horas */}
//         <div className="flex-1 overflow-y-auto relative">
//           <div
//             className="grid grid-cols-8 relative"
//             style={{ height: 12 * HOUR_HEIGHT }}
//           >
//             {/* Columna de Horas */}
//             <div className="border-r border-slate-100 bg-[#FAF8F5]/30">
//               {Array.from({ length: 12 }).map((_, i) => (
//                 <div
//                   key={i}
//                   style={{ height: HOUR_HEIGHT }}
//                   className="text-[11px] font-semibold text-slate-400 text-center pt-2"
//                 >
//                   {(i + START_HOUR).toString().padStart(2, "0")}:00
//                 </div>
//               ))}
//             </div>

//             {/* Columnas de los Días */}
//             {DAYS.map((_, colIdx) => (
//               <div
//                 key={colIdx}
//                 className="border-r border-slate-100 last:border-r-0 relative"
//               >
//                 {Array.from({ length: 12 }).map((_, rowIdx) => (
//                   <div
//                     key={rowIdx}
//                     style={{ height: HOUR_HEIGHT }}
//                     className="border-b border-slate-100/70"
//                   />
//                 ))}
//               </div>
//             ))}

//             {/* Render de Tarjetas de Citas */}
//             {filteredAppointments.map((app) => {
//               const colors =
//                 specialistColorMap[app.specialist] || SPECIALIST_COLORS[0];
//               const topPos = getTimeTop(app.start);
//               const heightPos =
//                 ((Number(app.duration) || 60) / 60) * HOUR_HEIGHT - 6;

//               return (
//                 <div
//                   key={app.id}
//                   onClick={() => {
//                     setCurrentApp(app);
//                     setShowPaymentSelector(false);
//                     setIsDrawerOpen(true);
//                   }}
//                   className={`absolute rounded-2xl p-2.5 transition-all cursor-pointer shadow-2xs hover:shadow-md border border-white/50 flex flex-col justify-between ${colors.bg} ${colors.text}`}
//                   style={{
//                     top: topPos + 3,
//                     height: Math.max(heightPos, 50),
//                     left: `calc(${(app.day + 1) * 12.5}% + 3px)`,
//                     width: "calc(12.5% - 6px)",
//                   }}
//                 >
//                   <div>
//                     <div className="flex items-center justify-between gap-1 mb-1">
//                       <span
//                         className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${colors.badge}`}
//                       >
//                         {app.start}
//                       </span>
//                     </div>
//                     <p className="text-xs font-extrabold truncate leading-tight">
//                       {app.customer}
//                     </p>
//                     <p className="text-[10px] opacity-80 truncate font-medium">
//                       {app.specialist}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* DRAWER LATERAL / ESTILO BYUTIE */}
//       {isDrawerOpen && (
//         <div className="fixed inset-0 z-50 flex justify-end">
//           <div
//             className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity"
//             onClick={() => setIsDrawerOpen(false)}
//           />
//           <div className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
//             <div className="flex justify-between items-center pb-4 border-b border-slate-200/80 mb-6">
//               <div>
//                 <h2 className="text-lg font-extrabold text-slate-800">
//                   {showPaymentSelector ? "Cobro de Cita" : "Detalles de Cita"}
//                 </h2>
//                 <p className="text-xs text-slate-400">
//                   Gestión del paciente y servicios asociados.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsDrawerOpen(false)}
//                 className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {!showPaymentSelector ? (
//               <form onSubmit={handleSave} className="space-y-4 flex-1">
//                 {currentApp.id && currentApp.status !== "done" && (
//                   <button
//                     type="button"
//                     onClick={() => setShowPaymentSelector(true)}
//                     className="w-full py-2.5 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] font-bold text-xs rounded-xl transition-colors shadow-xs mb-2"
//                   >
//                     Confirmar y Procesar Pago
//                   </button>
//                 )}

//                 <div>
//                   <label className="text-[11px] font-bold text-slate-500 block mb-1">
//                     Paciente
//                   </label>
//                   <input
//                     required
//                     value={currentApp.customer}
//                     onChange={(e) =>
//                       setCurrentApp({
//                         ...currentApp,
//                         customer: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#4ADE80]"
//                     placeholder="Nombre completo"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-[11px] font-bold text-slate-500 block mb-1">
//                     Teléfono / WhatsApp
//                   </label>
//                   <div className="relative">
//                     <Phone
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                       size={14}
//                     />
//                     <input
//                       value={currentApp.phone}
//                       onChange={(e) =>
//                         setCurrentApp({
//                           ...currentApp,
//                           phone: e.target.value,
//                         })
//                       }
//                       className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#4ADE80]"
//                       placeholder="09X XXX XXX"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="text-[11px] font-bold text-slate-500 block mb-1">
//                       Día
//                     </label>
//                     <select
//                       value={currentApp.day}
//                       onChange={(e) =>
//                         setCurrentApp({
//                           ...currentApp,
//                           day: parseInt(e.target.value),
//                         })
//                       }
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#4ADE80]"
//                     >
//                       {DAYS.map((d, i) => (
//                         <option key={i} value={i}>
//                           {d}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-[11px] font-bold text-slate-500 block mb-1">
//                       Hora
//                     </label>
//                     <input
//                       type="time"
//                       value={currentApp.start}
//                       onChange={(e) =>
//                         setCurrentApp({
//                           ...currentApp,
//                           start: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#4ADE80]"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-[11px] font-bold text-slate-500 block mb-1">
//                     Especialista
//                   </label>
//                   <select
//                     value={currentApp.specialist}
//                     onChange={(e) =>
//                       setCurrentApp({
//                         ...currentApp,
//                         specialist: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#4ADE80]"
//                   >
//                     {team.map((s) => (
//                       <option key={s.id} value={s.name}>
//                         {s.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-[11px] font-bold text-slate-500 block mb-1.5">
//                     Tratamientos
//                   </label>
//                   <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
//                     {availableServices.map((s) => {
//                       const isSelected =
//                         currentApp.selectedServiceIds?.includes(s.id);
//                       return (
//                         <div
//                           key={s.id}
//                           onClick={() => {
//                             if (currentApp.status !== "done") {
//                               const currentIds =
//                                 currentApp.selectedServiceIds || [];
//                               setCurrentApp((prev) => ({
//                                 ...prev,
//                                 selectedServiceIds: isSelected
//                                   ? currentIds.filter((id) => id !== s.id)
//                                   : [...currentIds, s.id],
//                               }));
//                             }
//                           }}
//                           className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
//                             isSelected
//                               ? "border-[#4ADE80] bg-[#DCFCE7]/40"
//                               : "border-slate-200/80 bg-white hover:bg-slate-50"
//                           }`}
//                         >
//                           <div className="flex items-center gap-2">
//                             <div
//                               className={`w-4 h-4 rounded-md flex items-center justify-center border ${
//                                 isSelected
//                                   ? "bg-[#15803D] border-[#15803D] text-white"
//                                   : "border-slate-300 bg-white"
//                               }`}
//                             >
//                               {isSelected && <Check size={10} />}
//                             </div>
//                             <span className="text-xs font-semibold text-slate-700">
//                               {s.name}
//                             </span>
//                           </div>
//                           <span className="text-xs font-bold text-slate-800">
//                             ${s.price}
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </form>
//             ) : (
//               <div className="space-y-3 flex-1">
//                 <button
//                   onClick={() => setShowPaymentSelector(false)}
//                   className="text-xs font-bold text-slate-400 hover:text-slate-700 mb-2"
//                 >
//                   ← Volver a los detalles
//                 </button>
//                 <div className="space-y-2">
//                   {PAYMENT_METHODS.map((m) => (
//                     <button
//                       key={m.id}
//                       onClick={() => setSelectedMethod(m.id)}
//                       className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
//                         selectedMethod === m.id
//                           ? "border-[#4ADE80] bg-[#DCFCE7]/40 text-[#15803D]"
//                           : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 rounded-lg bg-slate-100">
//                           {m.icon}
//                         </div>
//                         <span className="text-xs font-bold">{m.name}</span>
//                       </div>
//                       {selectedMethod === m.id && <Check size={16} />}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* TOTAL Y ACCIÓN */}
//             <div className="pt-4 border-t border-slate-200/80 mt-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <span className="text-[10px] font-bold text-slate-400 uppercase">
//                     Duración
//                   </span>
//                   <p className="text-xs font-bold text-slate-700">
//                     {totalDuration} min
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-[10px] font-bold text-slate-400 uppercase">
//                     Monto Total
//                   </span>
//                   <p className="text-2xl font-extrabold text-slate-800">
//                     ${totalAmount}
//                   </p>
//                 </div>
//               </div>

//               {!showPaymentSelector ? (
//                 <button
//                   onClick={handleSave}
//                   className="w-full py-3 bg-[#4ADE80] hover:bg-[#22C55E] text-slate-900 font-bold text-xs rounded-xl transition-colors shadow-xs"
//                 >
//                   Guardar Cita
//                 </button>
//               ) : (
//                 <button
//                   onClick={handlePayment}
//                   className="w-full py-3 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
//                 >
//                   Finalizar Cobro (${totalAmount})
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
  Loader2,
  Banknote,
  Smartphone,
  Receipt,
  CreditCard,
  Check,
  Plus,
  Phone,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
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

// Helper para obtener el Lunes de la semana dada una fecha
function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

// Helper para formatear 'YYYY-MM-DD' en hora local
function formatDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const SPECIALIST_COLORS = [
  {
    bg: "bg-[#FFE4E6]",
    text: "text-[#9F1239]",
    badge: "bg-[#FECDD3] text-[#9F1239]",
    border: "border-[#FDA4AF]",
    activeFilter: "bg-[#F43F5E] text-white border-[#F43F5E]",
  },
  {
    bg: "bg-[#DCFCE7]",
    text: "text-[#166534]",
    badge: "bg-[#BBF7D0] text-[#166534]",
    border: "border-[#86EFAC]",
    activeFilter: "bg-[#15803D] text-white border-[#15803D]",
  },
  {
    bg: "bg-[#F3E8FF]",
    text: "text-[#6B21A8]",
    badge: "bg-[#E9D5FF] text-[#6B21A8]",
    border: "border-[#D8B4FE]",
    activeFilter: "bg-[#9333EA] text-white border-[#9333EA]",
  },
  {
    bg: "bg-[#FFEDD5]",
    text: "text-[#9A3412]",
    badge: "bg-[#FED7AA] text-[#9A3412]",
    border: "border-[#FDBA74]",
    activeFilter: "bg-[#EA580C] text-white border-[#EA580C]",
  },
  {
    bg: "bg-[#E0F2FE]",
    text: "text-[#075985]",
    badge: "bg-[#BAE6FD] text-[#075985]",
    border: "border-[#7DD3FC]",
    activeFilter: "bg-[#0284C7] text-white border-[#0284C7]",
  },
  {
    bg: "bg-[#FEF9C3]",
    text: "text-[#854D0E]",
    badge: "bg-[#FEF08A] text-[#854D0E]",
    border: "border-[#FDE047]",
    activeFilter: "bg-[#CA8A04] text-white border-[#CA8A04]",
  },
];

const PAYMENT_METHODS = [
  { id: "cash", name: "Efectivo", icon: <Banknote size={16} /> },
  { id: "transfer", name: "Transferencia", icon: <Receipt size={16} /> },
  { id: "mp", name: "Mercado Pago", icon: <Smartphone size={16} /> },
  { id: "pos", name: "POS / Tarjeta", icon: <CreditCard size={16} /> },
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

  // Estado de la semana seleccionada en la vista principal
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getMonday(new Date()),
  );

  const [currentApp, setCurrentApp] = useState({
    id: null,
    customer: "",
    phone: "",
    specialist: "",
    start: "09:00",
    status: "pending",
    selectedServiceIds: [],
    date: formatDateISO(new Date()),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "centros_estetica", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
            setTeam((data.specialists || []).filter((specialist) => specialist.active !== false));
          setAvailableServices(data.services || []);
          setAppointments(data.appointments || []);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Generar los 7 días de la semana activa
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentWeekStart]);

  // Rango ISO de la semana en vista
  const currentWeekISORange = useMemo(() => {
    return weekDays.map((d) => formatDateISO(d));
  }, [weekDays]);

  // Texto de Mes/Año en la cabecera
  const monthYearLabel = useMemo(() => {
    const endOfWeek = weekDays[6];
    const startMonth = currentWeekStart.toLocaleDateString("es-ES", {
      month: "long",
    });
    const endMonth = endOfWeek.toLocaleDateString("es-ES", {
      month: "long",
    });
    const year = currentWeekStart.getFullYear();

    if (startMonth === endMonth) {
      return `${
        startMonth.charAt(0).toUpperCase() + startMonth.slice(1)
      } ${year}`;
    }
    return `${startMonth.slice(0, 3)} - ${endMonth.slice(0, 3)} ${year}`;
  }, [currentWeekStart, weekDays]);

  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const handleToday = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  const specialistColorMap = useMemo(() => {
    const map = {};
    team.forEach((s, i) => {
      map[s.name] = SPECIALIST_COLORS[i % SPECIALIST_COLORS.length];
    });
    return map;
  }, [team]);

  // Filtrar citas que pertenecen a la semana en pantalla
  const visibleAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const matchesWeek = app.date
        ? currentWeekISORange.includes(app.date)
        : true;
      const matchesFilter =
        viewFilter === "all" ? true : app.specialist === viewFilter;
      return matchesWeek && matchesFilter;
    });
  }, [appointments, currentWeekISORange, viewFilter]);

  const { totalAmount, totalDuration } = useMemo(() => {
    if (!currentApp.selectedServiceIds?.length)
      return { totalAmount: 0, totalDuration: 0 };
    return currentApp.selectedServiceIds.reduce(
      (acc, id) => {
        const s = availableServices.find(
          (svc) => String(svc.id) === String(id),
        );
        const specialist = team.find(
          (item) => item.name === currentApp.specialist,
        );
        const specialistPrice = s?.specialistPrices?.[specialist?.id];
        const specialistTime = s?.specialistTimes?.[specialist?.id];
        return {
          totalAmount:
            acc.totalAmount + (Number(specialistPrice) || Number(s?.price) || 0),
          totalDuration:
            acc.totalDuration + (Number(specialistTime) || Number(s?.time) || 60),
        };
      },
      { totalAmount: 0, totalDuration: 0 },
    );
  }, [currentApp.selectedServiceIds, currentApp.specialist, availableServices, team]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!currentApp.customer) return alert("Ingresa el nombre del paciente");
    if (!currentApp.date) return alert("Selecciona una fecha para la cita");

    // Convertir la fecha ingresada para saber el día de la semana (0: Lunes, 6: Domingo)
    const [y, m, d] = currentApp.date.split("-").map(Number);
    const selectedDate = new Date(y, m - 1, d);
    const dayIndex =
      selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1;

    const appData = {
      ...currentApp,
      id: currentApp.id || Math.random().toString(36).substring(2, 15),
      day: dayIndex,
      total: totalAmount,
      duration: totalDuration,
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

    // Mover automáticamente el calendario a la semana de la cita guardada
    setCurrentWeekStart(getMonday(selectedDate));
    setIsDrawerOpen(false);
  };

  const handlePayment = async () => {
    if (!currentApp?.id || !user) return;

    try {
      const paidAt = new Date().toISOString();
      const paidAppointment = {
        ...currentApp,
        total: totalAmount,
        duration: totalDuration,
        status: "done",
        paymentMethod: selectedMethod,
        paidAt,
      };
      const updatedAppointments = appointments.map((appointment) =>
        String(appointment.id) === String(currentApp.id)
          ? paidAppointment
          : appointment,
      );

      await updateDoc(doc(db, "centros_estetica", user.uid), {
        appointments: updatedAppointments,
      });
      setAppointments(updatedAppointments);
      setCurrentApp(paidAppointment);
      setShowPaymentSelector(false);
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error registrando el cobro:", error);
      alert("No se pudo registrar el cobro.");
    }
  };

  const getTimeTop = (t) => {
    const [h, m] = t.split(":").map(Number);
    return (h + m / 60 - START_HOUR) * HOUR_HEIGHT;
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="animate-spin text-[#4ADE80]" size={36} />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] p-4 lg:p-6 text-slate-700 font-sans antialiased overflow-hidden">
      {/* HEADER DE LA AGENDA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Surgery Schedule
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestión e historial de turnos para tratamientos y especialidades.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* NAVEGACIÓN ENTRE SEMANAS Y BOTÓN HOY */}
          <div className="flex items-center gap-1 bg-white border border-slate-200/80 rounded-xl px-2 py-1 shadow-xs">
            <button
              onClick={handlePrevWeek}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Semana anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hoy
            </button>

            <span className="text-xs font-semibold text-slate-700 px-2 min-w-[130px] text-center">
              {monthYearLabel}
            </span>

            <button
              onClick={handleNextWeek}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Semana siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => {
              setCurrentApp({
                id: null,
                customer: "",
                phone: "",
                specialist: team[0]?.name || "",
                start: "09:00",
                status: "pending",
                selectedServiceIds: [],
                date: formatDateISO(new Date()),
              });
              setShowPaymentSelector(false);
              setIsDrawerOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-[#d87cef] hover:bg-[#ce4eee] text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-colors shadow-xs shrink-0"
          >
            <Plus size={16} />
            <span>Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* FILTROS POR ESPECIALISTA */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
        <button
          onClick={() => setViewFilter("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
            viewFilter === "all"
              ? "bg-[#15803D] text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {viewFilter === "all" && <Check size={12} />}
          <span>Todos</span>
        </button>

        {team.map((s) => {
          const active = viewFilter === s.name;
          const colors = specialistColorMap[s.name] || SPECIALIST_COLORS[0];

          return (
            <button
              key={s.id || s.name}
              onClick={() => setViewFilter(s.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                active
                  ? colors.activeFilter
                  : `${colors.bg} ${colors.text} ${colors.border} hover:opacity-90`
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  active ? "bg-white" : colors.badge.split(" ")[0]
                }`}
              />
              <span>{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENEDOR DEL CALENDARIO */}
      <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
        {/* Cabecera de días con número dinámico */}
        <div className="grid grid-cols-8 border-b border-slate-100 bg-[#FAF8F5]/50 text-slate-500 font-semibold text-xs">
          <div className="p-3 text-center border-r border-slate-100 text-[11px] text-slate-400">
            GMT-3
          </div>
          {weekDays.map((dateObj, index) => {
            const isToday =
              formatDateISO(dateObj) === formatDateISO(new Date());

            return (
              <div
                key={index}
                className={`py-3 text-center border-r border-slate-100 last:border-r-0 ${
                  isToday ? "bg-[#DCFCE7]/40" : ""
                }`}
              >
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  {DAYS[index].substring(0, 3)}
                </span>
                <span
                  className={`text-sm font-extrabold inline-block px-2 py-0.5 rounded-full ${
                    isToday ? "bg-[#15803D] text-white" : "text-slate-800"
                  }`}
                >
                  {dateObj.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Grilla de horas */}
        <div className="flex-1 overflow-y-auto relative">
          <div
            className="grid grid-cols-8 relative"
            style={{ height: 12 * HOUR_HEIGHT }}
          >
            {/* Columna de Horas */}
            <div className="border-r border-slate-100 bg-[#FAF8F5]/30">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  style={{ height: HOUR_HEIGHT }}
                  className="text-[11px] font-semibold text-slate-400 text-center pt-2"
                >
                  {(i + START_HOUR).toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Columnas de los Días */}
            {DAYS.map((_, colIdx) => (
              <div
                key={colIdx}
                className="border-r border-slate-100 last:border-r-0 relative"
              >
                {Array.from({ length: 12 }).map((_, rowIdx) => (
                  <div
                    key={rowIdx}
                    style={{ height: HOUR_HEIGHT }}
                    className="border-b border-slate-100/70"
                  />
                ))}
              </div>
            ))}

            {/* Render de Citas Visibles */}
            {visibleAppointments.map((app) => {
              const colors =
                specialistColorMap[app.specialist] || SPECIALIST_COLORS[0];
              const topPos = getTimeTop(app.start);
              const heightPos =
                ((Number(app.duration) || 60) / 60) * HOUR_HEIGHT - 6;

              let dayIndex = app.day;
              if (app.date) {
                const idx = currentWeekISORange.indexOf(app.date);
                if (idx !== -1) dayIndex = idx;
              }

              return (
                <div
                  key={app.id}
                  onClick={() => {
                    setCurrentApp(app);
                    setShowPaymentSelector(false);
                    setIsDrawerOpen(true);
                  }}
                  className={`absolute rounded-2xl p-2.5 transition-all cursor-pointer shadow-2xs hover:shadow-md border flex flex-col justify-between ${colors.bg} ${colors.text} ${colors.border}`}
                  style={{
                    top: topPos + 3,
                    height: Math.max(heightPos, 50),
                    left: `calc(${(dayIndex + 1) * 12.5}% + 3px)`,
                    width: "calc(12.5% - 6px)",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${colors.badge}`}
                      >
                        {app.start}
                      </span>
                    </div>
                    <p className="text-xs font-extrabold truncate leading-tight">
                      {app.customer}
                    </p>
                    <p className="text-[10px] opacity-90 truncate font-bold mt-0.5">
                      {app.specialist}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DRAWER LATERAL */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200/80 mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800">
                  {showPaymentSelector ? "Cobro de Cita" : "Detalles de Cita"}
                </h2>
                <p className="text-xs text-slate-400">
                  Gestión del paciente y servicios asociados.
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50"
              >
                <X size={18} />
              </button>
            </div>

            {!showPaymentSelector ? (
              <form onSubmit={handleSave} className="space-y-4 flex-1">
                {currentApp.id && currentApp.status !== "done" && (
                  <button
                    type="button"
                    onClick={() => setShowPaymentSelector(true)}
                    className="w-full py-2.5 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] font-bold text-xs rounded-xl transition-colors shadow-xs mb-2"
                  >
                    Confirmar y Procesar Pago
                  </button>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Paciente
                  </label>
                  <input
                    required
                    value={currentApp.customer}
                    onChange={(e) =>
                      setCurrentApp({
                        ...currentApp,
                        customer: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#4ADE80]"
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={14}
                    />
                    <input
                      value={currentApp.phone}
                      onChange={(e) =>
                        setCurrentApp({
                          ...currentApp,
                          phone: e.target.value,
                        })
                      }
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#4ADE80]"
                      placeholder="09X XXX XXX"
                    />
                  </div>
                </div>

                {/* SELECTOR DE FECHA COMPLETA Y HORA */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Fecha de Cita
                    </label>
                    <div className="relative">
                      <CalendarIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={14}
                      />
                      <input
                        type="date"
                        required
                        value={currentApp.date}
                        onChange={(e) =>
                          setCurrentApp({
                            ...currentApp,
                            date: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-2 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#4ADE80]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Hora
                    </label>
                    <input
                      type="time"
                      required
                      value={currentApp.start}
                      onChange={(e) =>
                        setCurrentApp({
                          ...currentApp,
                          start: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#4ADE80]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
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
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#4ADE80]"
                  >
                    {team.map((s) => (
                      <option key={s.id || s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1.5">
                    Tratamientos
                  </label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
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
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "border-[#4ADE80] bg-[#DCFCE7]/40"
                              : "border-slate-200/80 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                                isSelected
                                  ? "bg-[#15803D] border-[#15803D] text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check size={10} />}
                            </div>
                            <span className="text-xs font-semibold text-slate-700">
                              {s.name}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            ${s.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-3 flex-1">
                <button
                  onClick={() => setShowPaymentSelector(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 mb-2"
                >
                  ← Volver a los detalles
                </button>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                        selectedMethod === m.id
                          ? "border-[#4ADE80] bg-[#DCFCE7]/40 text-[#15803D]"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100">
                          {m.icon}
                        </div>
                        <span className="text-xs font-bold">{m.name}</span>
                      </div>
                      {selectedMethod === m.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TOTAL Y ACCIÓN */}
            <div className="pt-4 border-t border-slate-200/80 mt-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Duración
                  </span>
                  <p className="text-xs font-bold text-slate-700">
                    {totalDuration} min
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Monto Total
                  </span>
                  <p className="text-2xl font-extrabold text-slate-800">
                    ${totalAmount}
                  </p>
                </div>
              </div>

              {!showPaymentSelector ? (
                <button
                  onClick={handleSave}
                  className="w-full py-3 bg-[#4ADE80] hover:bg-[#22C55E] text-slate-900 font-bold text-xs rounded-xl transition-colors shadow-xs"
                >
                  Guardar Cita
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  className="w-full py-3 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
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
