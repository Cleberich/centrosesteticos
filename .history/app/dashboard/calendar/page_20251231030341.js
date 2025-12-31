// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   X,
//   CheckCircle2,
//   Loader2,
//   Clock,
//   Users,
//   CreditCard,
//   Banknote,
//   Smartphone,
//   Receipt,
//   Check,
//   Trash2,
//   Phone,
//   Mail,
//   Plus,
//   ChevronRight,
// } from "lucide-react";
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// // --- CONFIGURACIÓN DE LÍMITES POR PLAN ---
// const PLAN_LIMITS = {
//   Inicial: 20,
//   Basico: 150,
//   Profesional: 600,
//   Elite: Infinity,
// };

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

// const BARBER_COLORS = [
//   {
//     bg: "bg-blue-600",
//     border: "border-blue-400",
//     text: "text-white",
//     tab: "bg-blue-600",
//   },
//   {
//     bg: "bg-emerald-600",
//     border: "border-emerald-400",
//     text: "text-white",
//     tab: "bg-emerald-600",
//   },
//   {
//     bg: "bg-purple-600",
//     border: "border-purple-400",
//     text: "text-white",
//     tab: "bg-purple-600",
//   },
//   {
//     bg: "bg-amber-600",
//     border: "border-amber-400",
//     text: "text-white",
//     tab: "bg-amber-600",
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

//   // Estados de Plan y Uso
//   const [businessPlan, setBusinessPlan] = useState("Inicial");
//   const [monthlyUsage, setMonthlyUsage] = useState(0);

//   const [currentApp, setCurrentApp] = useState({
//     id: null,
//     customer: "",
//     phone: "",
//     email: "",
//     barber: "",
//     start: "09:00",
//     day: 0,
//     status: "pending",
//     selectedServiceIds: [],
//   });

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         const docRef = doc(db, "barberias", currentUser.uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setTeam(data.barbers || []);
//           setAvailableServices(data.services || []);
//           setAppointments(data.appointments || []);

//           // Cargar Plan y Calcular Uso Mensual (Histórico)
//           const planType = data.plan?.type || "Inicial";
//           setBusinessPlan(planType);

//           const currentMonth = new Date().getMonth();
//           const currentYear = new Date().getFullYear();

//           const history = data.usageHistory || [];
//           const count = history.filter((item) => {
//             const date = new Date(item.createdAt);
//             return (
//               date.getMonth() === currentMonth &&
//               date.getFullYear() === currentYear
//             );
//           }).length;

//           setMonthlyUsage(count);
//         }
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const barberColorMap = useMemo(() => {
//     const map = {};
//     team.forEach((barber, index) => {
//       map[barber.name] = BARBER_COLORS[index % BARBER_COLORS.length];
//     });
//     return map;
//   }, [team]);

//   const filteredAppointments = useMemo(() => {
//     if (viewFilter === "all") return appointments;
//     return appointments.filter((app) => app.barber === viewFilter);
//   }, [appointments, viewFilter]);

//   const { totalAmount, totalDuration } = useMemo(() => {
//     if (
//       !currentApp.selectedServiceIds ||
//       currentApp.selectedServiceIds.length === 0
//     ) {
//       return { totalAmount: 0, totalDuration: 0 };
//     }
//     return currentApp.selectedServiceIds.reduce(
//       (acc, id) => {
//         const service = availableServices.find(
//           (s) => String(s.id) === String(id)
//         );
//         return {
//           totalAmount: acc.totalAmount + (Number(service?.price) || 0),
//           totalDuration: acc.totalDuration + (Number(service?.time) || 30),
//         };
//       },
//       { totalAmount: 0, totalDuration: 0 }
//     );
//   }, [currentApp.selectedServiceIds, availableServices]);

//   const saveToFirebase = async (newList) => {
//     const docRef = doc(db, "barberias", user.uid);
//     await updateDoc(docRef, { appointments: newList });
//   };

//   const handleDelete = async () => {
//     if (
//       !window.confirm("¿Liberar este turno? El cupo mensual no se restaurará.")
//     )
//       return;
//     const newList = appointments.filter(
//       (a) => String(a.id) !== String(currentApp.id)
//     );
//     setAppointments(newList);
//     await saveToFirebase(newList);
//     setIsDrawerOpen(false);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     if (!currentApp.customer) return alert("Falta el nombre del cliente");

//     const isNew = !currentApp.id;

//     // VALIDACIÓN DE LÍMITE DE PLAN
//     if (isNew) {
//       const limit = PLAN_LIMITS[businessPlan];
//       if (monthlyUsage >= limit) {
//         return alert(
//           `Límite alcanzado: Tu plan ${businessPlan} permite ${limit} citas al mes. Por favor, sube de plan para continuar.`
//         );
//       }
//     }

//     const today = new Date();
//     const currentDay = today.getDay() === 0 ? 6 : today.getDay() - 1;
//     const diff = currentApp.day - currentDay;
//     const targetDate = new Date(today);
//     targetDate.setDate(today.getDate() + diff);
//     const dateStr = targetDate.toLocaleDateString("sv-SE");

//     const newId = currentApp.id || Math.random().toString(36).substring(2, 15);
//     const creationTime = currentApp.createdAt || new Date().toISOString();

//     const appData = {
//       ...currentApp,
//       id: newId,
//       total: totalAmount,
//       duration: totalDuration,
//       date: dateStr,
//       createdAt: creationTime,
//       selectedServiceIds: currentApp.selectedServiceIds,
//     };

//     let newList = appointments.some(
//       (a) => String(a.id) === String(currentApp.id)
//     )
//       ? appointments.map((a) =>
//           String(a.id) === String(currentApp.id) ? appData : a
//         )
//       : [...appointments, appData];

//     try {
//       const docRef = doc(db, "barberias", user.uid);

//       if (isNew) {
//         // Guardamos la cita y el registro histórico imborrable
//         await updateDoc(docRef, {
//           appointments: newList,
//           usageHistory: arrayUnion({
//             id: newId,
//             createdAt: creationTime,
//             customer: appData.customer,
//           }),
//         });
//         setMonthlyUsage((prev) => prev + 1);
//       } else {
//         await updateDoc(docRef, { appointments: newList });
//       }

//       setAppointments(newList);
//       setIsDrawerOpen(false);
//     } catch (error) {
//       alert("Error al guardar: " + error.message);
//     }
//   };

//   const handleFinalizePayment = async () => {
//     const updatedApp = {
//       ...currentApp,
//       status: "done",
//       total: totalAmount,
//       paymentMethod: selectedMethod,
//       paidAt: new Date().toISOString(),
//     };
//     const newList = appointments.map((a) =>
//       String(a.id) === String(currentApp.id) ? updatedApp : a
//     );
//     setAppointments(newList);
//     await saveToFirebase(newList);
//     setShowPaymentSelector(false);
//     setIsDrawerOpen(false);
//   };

//   const getTimeTop = (timeStr) => {
//     if (!timeStr) return 0;
//     const [hours, minutes] = timeStr.split(":").map(Number);
//     return (hours + minutes / 60 - START_HOUR) * HOUR_HEIGHT;
//   };

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center dark:bg-[#0a0f1a]">
//         <Loader2 className="animate-spin text-blue-600" />
//       </div>
//     );

//   return (
//     <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
//       <header className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0a0f1a] z-30">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex flex-col">
//             <h1 className="text-lg md:text-xl font-black italic uppercase tracking-tighter dark:text-white leading-tight">
//               Agenda{" "}
//               <span className="text-blue-600">
//                 {viewFilter === "all" ? "General" : viewFilter}
//               </span>
//             </h1>
//             {/* INDICADOR DE USO DEL PLAN */}
//             <div className="flex items-center gap-2 mt-1">
//               <div className="w-20 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
//                 <div
//                   className={`h-full ${
//                     monthlyUsage / PLAN_LIMITS[businessPlan] > 0.9
//                       ? "bg-rose-500"
//                       : "bg-blue-600"
//                   }`}
//                   style={{
//                     width: `${Math.min(
//                       (monthlyUsage / PLAN_LIMITS[businessPlan]) * 100,
//                       100
//                     )}%`,
//                   }}
//                 />
//               </div>
//               <span className="text-[8px] font-black uppercase text-slate-400">
//                 Uso: {monthlyUsage}/
//                 {PLAN_LIMITS[businessPlan] === Infinity
//                   ? "∞"
//                   : PLAN_LIMITS[businessPlan]}
//               </span>
//             </div>
//           </div>

//           <button
//             onClick={() => {
//               setCurrentApp({
//                 id: null,
//                 customer: "",
//                 phone: "",
//                 email: "",
//                 barber: team[0]?.name || "",
//                 start: "09:00",
//                 day: 0,
//                 status: "pending",
//                 selectedServiceIds: [],
//               });
//               setShowPaymentSelector(false);
//               setIsDrawerOpen(true);
//             }}
//             className="bg-blue-600 text-white p-3 md:px-6 md:py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2"
//           >
//             <Plus size={16} />{" "}
//             <span className="hidden md:inline">Nueva Cita</span>
//           </button>
//         </div>

//         <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
//           <button
//             onClick={() => setViewFilter("all")}
//             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all ${
//               viewFilter === "all"
//                 ? "bg-slate-900 text-white"
//                 : "bg-slate-100 text-slate-400 dark:bg-slate-800"
//             }`}
//           >
//             <Users size={14} className="inline mr-2" /> Todos
//           </button>
//           {team.map((barber) => (
//             <button
//               key={barber.id}
//               onClick={() => setViewFilter(barber.name)}
//               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all ${
//                 viewFilter === barber.name
//                   ? `${barberColorMap[barber.name]?.tab} text-white`
//                   : "bg-slate-100 text-slate-400 dark:bg-slate-800"
//               }`}
//             >
//               {barber.name}
//             </button>
//           ))}
//         </div>
//       </header>

//       {/* CALENDARIO */}
//       <div className="flex-1 overflow-auto relative scrollbar-hide">
//         <div className="min-w-[1000px] md:min-w-full h-full flex flex-col">
//           <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#0a0f1a] z-20">
//             <div className="w-16 md:w-20 shrink-0 border-r border-slate-100 dark:border-slate-800" />
//             <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 uppercase text-[9px] md:text-[10px] font-black text-slate-400">
//               {DAYS.map((d) => (
//                 <div key={d} className="py-4 text-center">
//                   {d}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div
//             className="flex relative flex-1"
//             style={{ height: 13 * HOUR_HEIGHT }}
//           >
//             <div className="w-16 md:w-20 shrink-0 border-r border-slate-100 dark:border-slate-800 text-[9px] md:text-[10px] font-bold text-slate-300 text-center bg-white/50 dark:bg-[#0a0f1a]/50">
//               {Array.from({ length: 13 }).map((_, i) => (
//                 <div key={i} style={{ height: HOUR_HEIGHT }} className="pt-2">
//                   {(i + START_HOUR).toString().padStart(2, "0")}:00
//                 </div>
//               ))}
//             </div>
//             <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative">
//               {Array.from({ length: 13 * 7 }).map((_, idx) => (
//                 <div
//                   key={idx}
//                   className="border-b border-slate-50 dark:border-slate-800/40"
//                   style={{ height: HOUR_HEIGHT }}
//                 />
//               ))}
//               {filteredAppointments.map((app) => (
//                 <div
//                   key={app.id}
//                   onClick={() => {
//                     setCurrentApp({
//                       ...app,
//                       selectedServiceIds: app.selectedServiceIds || [],
//                     });
//                     setShowPaymentSelector(false);
//                     setIsDrawerOpen(true);
//                   }}
//                   className={`absolute left-0.5 right-0.5 md:left-1 md:right-1 rounded-lg border-l-4 p-1.5 z-10 shadow-md cursor-pointer transition-all active:scale-95 ${
//                     app.status === "done"
//                       ? "bg-slate-100 border-slate-300 text-slate-400 grayscale opacity-40"
//                       : `${barberColorMap[app.barber]?.bg} ${
//                           barberColorMap[app.barber]?.border
//                         } text-white`
//                   }`}
//                   style={{
//                     top: getTimeTop(app.start),
//                     height: (app.duration / 60) * HOUR_HEIGHT - 2,
//                     gridColumnStart: app.day + 1,
//                     gridColumnEnd: app.day + 2,
//                   }}
//                 >
//                   <p className="text-[9px] md:text-[10px] font-black uppercase italic truncate">
//                     {app.customer}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* DRAWER */}
//       {isDrawerOpen && (
//         <div className="fixed inset-0 z-[100] flex justify-end items-end md:items-stretch">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
//             onClick={() => setIsDrawerOpen(false)}
//           />
//           <div className="relative  w-full md:max-w-[450px] bg-white dark:bg-slate-900 h-[93vh] md:h-full rounded-t-[2.5rem] md:rounded-none flex flex-col p-6 md:p-8 overflow-y-auto">
//             <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6 md:hidden" />

//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-black uppercase dark:text-white">
//                 {showPaymentSelector
//                   ? "Cobrar"
//                   : currentApp.id
//                   ? "Editar Turno"
//                   : "Nueva Cita"}
//               </h2>
//               <div className="flex gap-2">
//                 {currentApp.id &&
//                   currentApp.status !== "done" &&
//                   !showPaymentSelector && (
//                     <button
//                       onClick={handleDelete}
//                       className="p-3 text-rose-500"
//                     >
//                       <Trash2 size={20} />
//                     </button>
//                   )}
//                 <button
//                   onClick={() => setIsDrawerOpen(false)}
//                   className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {!showPaymentSelector ? (
//               <form onSubmit={handleSave} className="space-y-5 pb-10">
//                 {currentApp.id && currentApp.status !== "done" && (
//                   <button
//                     type="button"
//                     onClick={() => setShowPaymentSelector(true)}
//                     className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase shadow-lg"
//                   >
//                     Proceder al Cobro
//                   </button>
//                 )}

//                 <div className="space-y-4">
//                   <div className="space-y-1">
//                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                       Cliente
//                     </label>
//                     <input
//                       value={currentApp.customer}
//                       onChange={(e) =>
//                         setCurrentApp({
//                           ...currentApp,
//                           customer: e.target.value,
//                         })
//                       }
//                       className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none border border-transparent focus:border-blue-500"
//                       placeholder="Nombre completo"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-1">
//                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                         Día
//                       </label>
//                       <select
//                         value={currentApp.day}
//                         onChange={(e) =>
//                           setCurrentApp({
//                             ...currentApp,
//                             day: parseInt(e.target.value),
//                           })
//                         }
//                         className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none"
//                       >
//                         {DAYS.map((d, i) => (
//                           <option key={d} value={i}>
//                             {d}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="space-y-1 w-32">
//                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                         Hora
//                       </label>
//                       <input
//                         type="time"
//                         value={currentApp.start}
//                         onChange={(e) =>
//                           setCurrentApp({
//                             ...currentApp,
//                             start: e.target.value,
//                           })
//                         }
//                         className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-1">
//                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                       Barbero
//                     </label>
//                     <select
//                       value={currentApp.barber}
//                       onChange={(e) =>
//                         setCurrentApp({ ...currentApp, barber: e.target.value })
//                       }
//                       className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none"
//                     >
//                       {team.map((b) => (
//                         <option key={b.id} value={b.name}>
//                           {b.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="space-y-3">
//                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
//                       Servicios
//                     </label>
//                     <div className="grid gap-2">
//                       {availableServices.map((s) => (
//                         <div
//                           key={s.id}
//                           onClick={() => {
//                             if (currentApp.status !== "done")
//                               setCurrentApp((prev) => ({
//                                 ...prev,
//                                 selectedServiceIds:
//                                   prev.selectedServiceIds.includes(s.id)
//                                     ? prev.selectedServiceIds.filter(
//                                         (id) => id !== s.id
//                                       )
//                                     : [...prev.selectedServiceIds, s.id],
//                               }));
//                           }}
//                           className={`p-4 rounded-2xl border-2 flex justify-between items-center cursor-pointer transition-all ${
//                             currentApp.selectedServiceIds.includes(s.id)
//                               ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10"
//                               : "border-transparent bg-slate-50 dark:bg-slate-800"
//                           }`}
//                         >
//                           <span className="text-xs font-bold dark:text-slate-200">
//                             {s.name}
//                           </span>
//                           <span className="text-xs font-black text-blue-600">
//                             ${s.price}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="sticky bottom-0 bg-white dark:bg-slate-900 pt-4 border-t dark:border-slate-800 mt-4">
//                   <div className="flex justify-between items-center mb-4">
//                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
//                       {totalDuration} min
//                     </p>
//                     <p className="text-3xl font-black text-blue-600 tracking-tighter">
//                       ${totalAmount}
//                     </p>
//                   </div>
//                   {currentApp.status !== "done" && (
//                     <button
//                       type="submit"
//                       className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-xs tracking-widest"
//                     >
//                       Guardar Turno
//                     </button>
//                   )}
//                 </div>
//               </form>
//             ) : (
//               <div className="space-y-5">
//                 <button
//                   onClick={() => setShowPaymentSelector(false)}
//                   className="text-[10px] font-black uppercase text-blue-600 tracking-widest"
//                 >
//                   ← Volver
//                 </button>
//                 <div className="grid gap-3">
//                   {PAYMENT_METHODS.map((m) => (
//                     <div
//                       key={m.id}
//                       onClick={() => setSelectedMethod(m.id)}
//                       className={`p-5 rounded-[2rem] border-2 flex justify-between items-center cursor-pointer ${
//                         selectedMethod === m.id
//                           ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10"
//                           : "border-transparent bg-slate-50 dark:bg-slate-800"
//                       }`}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl text-blue-600">
//                           {m.icon}
//                         </div>
//                         <span className="font-black text-xs uppercase dark:text-white tracking-tight">
//                           {m.name}
//                         </span>
//                       </div>
//                       <div
//                         className={`size-6 rounded-full border-2 flex items-center justify-center ${
//                           selectedMethod === m.id
//                             ? "bg-blue-600 border-blue-600 text-white"
//                             : "border-slate-300"
//                         }`}
//                       >
//                         {selectedMethod === m.id && (
//                           <Check size={14} strokeWidth={4} />
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   onClick={handleFinalizePayment}
//                   className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase text-xs shadow-2xl mt-6 tracking-widest"
//                 >
//                   Finalizar Cobro de ${totalAmount}
//                 </button>
//               </div>
//             )}
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
  CheckCircle2,
  Loader2,
  Clock,
  Users,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt,
  Check,
  Trash2,
  Phone,
  Mail,
  Plus,
  ChevronRight,
  AlertOctagon, // Icono para el bloqueo
  Lock,
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// --- CONFIGURACIÓN DE LÍMITES POR PLAN ---
const PLAN_LIMITS = {
  Inicial: 20,
  Basico: 150,
  Profesional: 600,
  Elite: Infinity,
};

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

const BARBER_COLORS = [
  {
    bg: "bg-blue-600",
    border: "border-blue-400",
    text: "text-white",
    tab: "bg-blue-600",
  },
  {
    bg: "bg-emerald-600",
    border: "border-emerald-400",
    text: "text-white",
    tab: "bg-emerald-600",
  },
  {
    bg: "bg-purple-600",
    border: "border-purple-400",
    text: "text-white",
    tab: "bg-purple-600",
  },
  {
    bg: "bg-amber-600",
    border: "border-amber-400",
    text: "text-white",
    tab: "bg-amber-600",
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

  // Estados de Plan, Uso y BLOQUEO
  const [businessPlan, setBusinessPlan] = useState("Inicial");
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const [isInactive, setIsInactive] = useState(false); // <--- ESTADO DE BLOQUEO

  const [currentApp, setCurrentApp] = useState({
    id: null,
    customer: "",
    phone: "",
    email: "",
    barber: "",
    start: "09:00",
    day: 0,
    status: "pending",
    selectedServiceIds: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "barberias", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTeam(data.barbers || []);
          setAvailableServices(data.services || []);
          setAppointments(data.appointments || []);

          // CARGAR STATUS DE PAGO
          const status = data.plan?.status || "active";
          setIsInactive(status === "inactive");

          const planType = data.plan?.type || "Inicial";
          setBusinessPlan(planType);

          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          const history = data.usageHistory || [];
          const count = history.filter((item) => {
            const date = new Date(item.createdAt);
            return (
              date.getMonth() === currentMonth &&
              date.getFullYear() === currentYear
            );
          }).length;

          setMonthlyUsage(count);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const barberColorMap = useMemo(() => {
    const map = {};
    team.forEach((barber, index) => {
      map[barber.name] = BARBER_COLORS[index % BARBER_COLORS.length];
    });
    return map;
  }, [team]);

  const filteredAppointments = useMemo(() => {
    if (viewFilter === "all") return appointments;
    return appointments.filter((app) => app.barber === viewFilter);
  }, [appointments, viewFilter]);

  const { totalAmount, totalDuration } = useMemo(() => {
    if (
      !currentApp.selectedServiceIds ||
      currentApp.selectedServiceIds.length === 0
    ) {
      return { totalAmount: 0, totalDuration: 0 };
    }
    return currentApp.selectedServiceIds.reduce(
      (acc, id) => {
        const service = availableServices.find(
          (s) => String(s.id) === String(id)
        );
        return {
          totalAmount: acc.totalAmount + (Number(service?.price) || 0),
          totalDuration: acc.totalDuration + (Number(service?.time) || 30),
        };
      },
      { totalAmount: 0, totalDuration: 0 }
    );
  }, [currentApp.selectedServiceIds, availableServices]);

  const saveToFirebase = async (newList) => {
    const docRef = doc(db, "barberias", user.uid);
    await updateDoc(docRef, { appointments: newList });
  };

  const handleDelete = async () => {
    if (isInactive) return; // Bloqueo extra
    if (!window.confirm("¿Liberar este turno?")) return;
    const newList = appointments.filter(
      (a) => String(a.id) !== String(currentApp.id)
    );
    setAppointments(newList);
    await saveToFirebase(newList);
    setIsDrawerOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // BLOQUEO POR INACTIVIDAD
    if (isInactive) {
      alert(
        "Tu cuenta está inactiva por falta de pago. Regulariza tu situación para agendar."
      );
      return;
    }

    if (!currentApp.customer) return alert("Falta el nombre del cliente");

    const isNew = !currentApp.id;

    // VALIDACIÓN DE LÍMITE DE PLAN
    if (isNew) {
      const limit = PLAN_LIMITS[businessPlan];
      if (monthlyUsage >= limit) {
        return alert(
          `Límite alcanzado: Tu plan ${businessPlan} permite ${limit} citas. Sube de plan para continuar.`
        );
      }
    }

    const today = new Date();
    const currentDay = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const diff = currentApp.day - currentDay;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    const dateStr = targetDate.toLocaleDateString("sv-SE");

    const newId = currentApp.id || Math.random().toString(36).substring(2, 15);
    const creationTime = currentApp.createdAt || new Date().toISOString();

    const appData = {
      ...currentApp,
      id: newId,
      total: totalAmount,
      duration: totalDuration,
      date: dateStr,
      createdAt: creationTime,
      selectedServiceIds: currentApp.selectedServiceIds,
    };

    let newList = appointments.some(
      (a) => String(a.id) === String(currentApp.id)
    )
      ? appointments.map((a) =>
          String(a.id) === String(currentApp.id) ? appData : a
        )
      : [...appointments, appData];

    try {
      const docRef = doc(db, "barberias", user.uid);
      if (isNew) {
        await updateDoc(docRef, {
          appointments: newList,
          usageHistory: arrayUnion({
            id: newId,
            createdAt: creationTime,
            customer: appData.customer,
          }),
        });
        setMonthlyUsage((prev) => prev + 1);
      } else {
        await updateDoc(docRef, { appointments: newList });
      }
      setAppointments(newList);
      setIsDrawerOpen(false);
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  const handleFinalizePayment = async () => {
    if (isInactive) return;
    const updatedApp = {
      ...currentApp,
      status: "done",
      total: totalAmount,
      paymentMethod: selectedMethod,
      paidAt: new Date().toISOString(),
    };
    const newList = appointments.map((a) =>
      String(a.id) === String(currentApp.id) ? updatedApp : a
    );
    setAppointments(newList);
    await saveToFirebase(newList);
    setShowPaymentSelector(false);
    setIsDrawerOpen(false);
  };

  const getTimeTop = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return (hours + minutes / 60 - START_HOUR) * HOUR_HEIGHT;
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center dark:bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a] relative">
      {/* BLOQUEO VISUAL SI ESTÁ INACTIVO */}
      {isInactive && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl border border-red-500/20 animate-in zoom-in-95 duration-300">
            <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertOctagon size={40} />
            </div>
            <h2 className="text-2xl font-black uppercase text-slate-900 dark:text-white leading-tight">
              Sistema <span className="text-red-500">Suspendido</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase leading-relaxed">
              Tu suscripción ha vencido. Regulariza tu pago en la sección de
              ajustes para seguir utilizando la agenda.
            </p>
            <button
              onClick={() => {
                window.location.href = "/dashboard/settings#planes";
                // Esto fuerza al navegador a re-evaluar la posición del ancla
                setTimeout(() => {
                  const el = document.getElementById("planes");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="mt-8 w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20"
            >
              Ir a Ajustes / Pagar
            </button>
          </div>
        </div>
      )}

      <header className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0a0f1a] z-30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-black italic uppercase tracking-tighter dark:text-white leading-tight">
              Agenda{" "}
              <span className="text-blue-600">
                {viewFilter === "all" ? "General" : viewFilter}
              </span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-20 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    monthlyUsage / PLAN_LIMITS[businessPlan] > 0.9
                      ? "bg-rose-500"
                      : "bg-blue-600"
                  }`}
                  style={{
                    width: `${Math.min(
                      (monthlyUsage / PLAN_LIMITS[businessPlan]) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-[8px] font-black uppercase text-slate-400">
                Uso: {monthlyUsage}/
                {PLAN_LIMITS[businessPlan] === Infinity
                  ? "∞"
                  : PLAN_LIMITS[businessPlan]}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (isInactive) return; // No abre si está inactivo
              setCurrentApp({
                id: null,
                customer: "",
                phone: "",
                email: "",
                barber: team[0]?.name || "",
                start: "09:00",
                day: 0,
                status: "pending",
                selectedServiceIds: [],
              });
              setShowPaymentSelector(false);
              setIsDrawerOpen(true);
            }}
            className={`${
              isInactive
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-50"
                : "bg-blue-600 text-white shadow-lg"
            } p-3 md:px-6 md:py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2`}
          >
            {isInactive ? <Lock size={16} /> : <Plus size={16} />}
            <span className="hidden md:inline">Nueva Cita</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <button
            onClick={() => setViewFilter("all")}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all ${
              viewFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-400 dark:bg-slate-800"
            }`}
          >
            <Users size={14} className="inline mr-2" /> Todos
          </button>
          {team.map((barber) => (
            <button
              key={barber.id}
              onClick={() => setViewFilter(barber.name)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all ${
                viewFilter === barber.name
                  ? `${barberColorMap[barber.name]?.tab} text-white`
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800"
              }`}
            >
              {barber.name}
            </button>
          ))}
        </div>
      </header>

      {/* CALENDARIO */}
      <div
        className={`flex-1 overflow-auto relative scrollbar-hide ${
          isInactive ? "pointer-events-none opacity-40 grayscale" : ""
        }`}
      >
        <div className="min-w-[1000px] md:min-w-full h-full flex flex-col">
          <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#0a0f1a] z-20">
            <div className="w-16 md:w-20 shrink-0 border-r border-slate-100 dark:border-slate-800" />
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 uppercase text-[9px] md:text-[10px] font-black text-slate-400">
              {DAYS.map((d) => (
                <div key={d} className="py-4 text-center">
                  {d}
                </div>
              ))}
            </div>
          </div>
          <div
            className="flex relative flex-1"
            style={{ height: 13 * HOUR_HEIGHT }}
          >
            <div className="w-16 md:w-20 shrink-0 border-r border-slate-100 dark:border-slate-800 text-[9px] md:text-[10px] font-bold text-slate-300 text-center">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} style={{ height: HOUR_HEIGHT }} className="pt-2">
                  {(i + START_HOUR).toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 relative">
              {Array.from({ length: 13 * 7 }).map((_, idx) => (
                <div
                  key={idx}
                  className="border-b border-slate-50 dark:border-slate-800/40"
                  style={{ height: HOUR_HEIGHT }}
                />
              ))}
              {filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    if (isInactive) return;
                    setCurrentApp({
                      ...app,
                      selectedServiceIds: app.selectedServiceIds || [],
                    });
                    setShowPaymentSelector(false);
                    setIsDrawerOpen(true);
                  }}
                  className={`absolute left-0.5 right-0.5 md:left-1 md:right-1 rounded-lg border-l-4 p-1.5 z-10 shadow-md cursor-pointer transition-all active:scale-95 ${
                    app.status === "done"
                      ? "bg-slate-100 border-slate-300 text-slate-400 grayscale opacity-40"
                      : `${barberColorMap[app.barber]?.bg} ${
                          barberColorMap[app.barber]?.border
                        } text-white`
                  }`}
                  style={{
                    top: getTimeTop(app.start),
                    // AGREGAMOS UN FALLBACK: Si app.duration no existe, usamos 30 min por defecto
                    height:
                      ((Number(app.duration) || 30) / 60) * HOUR_HEIGHT - 2,
                    gridColumnStart: app.day + 1,
                    gridColumnEnd: app.day + 2,
                  }}
                >
                  <p className="text-[9px] md:text-[10px] font-black uppercase italic truncate">
                    {app.customer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end items-end md:items-stretch">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full md:max-w-[450px] bg-white dark:bg-slate-900 h-[93vh] md:h-full rounded-t-[2.5rem] md:rounded-none flex flex-col p-6 md:p-8 overflow-y-auto">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6 md:hidden" />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase dark:text-white">
                {showPaymentSelector
                  ? "Cobrar"
                  : currentApp.id
                  ? "Editar Turno"
                  : "Nueva Cita"}
              </h2>
              <div className="flex gap-2">
                {currentApp.id &&
                  currentApp.status !== "done" &&
                  !showPaymentSelector && (
                    <button
                      onClick={handleDelete}
                      className="p-3 text-rose-500"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {!showPaymentSelector ? (
              <form onSubmit={handleSave} className="space-y-5 pb-10">
                {currentApp.id && currentApp.status !== "done" && (
                  <button
                    type="button"
                    onClick={() => setShowPaymentSelector(true)}
                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase shadow-lg"
                  >
                    Proceder al Cobro
                  </button>
                )}
                {/* CAMPOS DEL FORMULARIO */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Cliente
                    </label>
                    <input
                      value={currentApp.customer}
                      onChange={(e) =>
                        setCurrentApp({
                          ...currentApp,
                          customer: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none border border-transparent focus:border-blue-500"
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
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
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none"
                      >
                        {DAYS.map((d, i) => (
                          <option key={d} value={i}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1 w-32">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
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
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Barbero
                    </label>
                    <select
                      value={currentApp.barber}
                      onChange={(e) =>
                        setCurrentApp({ ...currentApp, barber: e.target.value })
                      }
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none"
                    >
                      {team.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Servicios
                    </label>
                    <div className="grid gap-2">
                      {availableServices.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            if (currentApp.status !== "done")
                              setCurrentApp((prev) => ({
                                ...prev,
                                selectedServiceIds:
                                  prev.selectedServiceIds.includes(s.id)
                                    ? prev.selectedServiceIds.filter(
                                        (id) => id !== s.id
                                      )
                                    : [...prev.selectedServiceIds, s.id],
                              }));
                          }}
                          className={`p-4 rounded-2xl border-2 flex justify-between items-center cursor-pointer transition-all ${
                            currentApp.selectedServiceIds.includes(s.id)
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10"
                              : "border-transparent bg-slate-50 dark:bg-slate-800"
                          }`}
                        >
                          <span className="text-xs font-bold dark:text-slate-200">
                            {s.name}
                          </span>
                          <span className="text-xs font-black text-blue-600">
                            ${s.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white dark:bg-slate-900 pt-4 border-t dark:border-slate-800 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      {totalDuration} min
                    </p>
                    <p className="text-3xl font-black text-blue-600 tracking-tighter">
                      ${totalAmount}
                    </p>
                  </div>
                  {currentApp.status !== "done" && (
                    <button
                      type="submit"
                      className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-xs tracking-widest"
                    >
                      Guardar Turno
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <button
                  onClick={() => setShowPaymentSelector(false)}
                  className="text-[10px] font-black uppercase text-blue-600 tracking-widest"
                >
                  ← Volver
                </button>
                <div className="grid gap-3">
                  {PAYMENT_METHODS.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`p-5 rounded-[2rem] border-2 flex justify-between items-center cursor-pointer ${
                        selectedMethod === m.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10"
                          : "border-transparent bg-slate-50 dark:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl text-blue-600">
                          {m.icon}
                        </div>
                        <span className="font-black text-xs uppercase dark:text-white tracking-tight">
                          {m.name}
                        </span>
                      </div>
                      <div
                        className={`size-6 rounded-full border-2 flex items-center justify-center ${
                          selectedMethod === m.id
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {selectedMethod === m.id && (
                          <Check size={14} strokeWidth={4} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleFinalizePayment}
                  className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase text-xs shadow-2xl mt-6 tracking-widest"
                >
                  Finalizar Cobro de ${totalAmount}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
