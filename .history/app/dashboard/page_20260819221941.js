// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Plus,
//   Clock,
//   UserPlus,
//   Star,
//   BellRing,
//   X,
//   Search,
//   ShieldCheck,
//   Loader2,
//   Phone,
//   MessageSquare,
//   Trash2,
//   CheckCircle2,
//   Zap,
//   Check,
//   CreditCard,
//   Banknote,
//   SmartphoneNfc,
//   Lock,
//   Sparkles,
//   Heart,
// } from "lucide-react";
// // Firebase
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// export default function DashboardPage() {
//   const router = useRouter();

//   // --- ESTADOS ---
//   const [esteticaData, setEsteticaData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [appointmentToComplete, setAppointmentToComplete] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sentMessages, setSentMessages] = useState([]);

//   // NUEVO: Estado para verificar si la estética está inactiva
//   const isPlanExpired = () => {
//     const expiresAt = esteticaData?.plan?.expiresAt;
//     if (!expiresAt) return false;
//     const expiration = expiresAt.toDate
//       ? expiresAt.toDate()
//       : new Date(expiresAt);
//     return !Number.isNaN(expiration.getTime()) && expiration <= new Date();
//   };

//   const isInactive =
//     esteticaData?.plan?.status === "inactive" ||
//     esteticaData?.plan?.status === "expired" ||
//     isPlanExpired();

//   const getTodayStr = () => new Date().toLocaleDateString("sv-SE");

//   // --- UTILIDADES ---
//   const formatUruguayPhone = (phone) => {
//     if (!phone) return "";
//     let clean = phone.replace(/\D/g, "");
//     if (clean.startsWith("0")) {
//       clean = "598" + clean.substring(1);
//     } else if (!clean.startsWith("598")) {
//       clean = "598" + clean;
//     }
//     return clean;
//   };

//   // --- 1. CARGA DE DATOS ---
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           // CAMBIO A COLECCIÓN centros_estetica
//           const docRef = doc(db, "centros_estetica", user.uid);
//           const docSnap = await getDoc(docRef);
//           if (docSnap.exists()) {
//             setEsteticaData(docSnap.data());
//           }
//         } catch (error) {
//           console.error("Error al cargar datos:", error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         router.push("/login");
//       }
//     });
//     return () => unsubscribe();
//   }, [router]);

//   // --- 2. ACCIONES DE CITA ---
//   const handleAddAppointment = async (e) => {
//     e.preventDefault();

//     if (isInactive) {
//       alert(
//         "Acceso restringido: Debes regularizar tu pago para agendar nuevas citas."
//       );
//       return;
//     }

//     const formData = new FormData(e.target);
//     const name = formData.get("clientName");
//     const phone = formData.get("clientPhone");
//     const time = formData.get("time");
//     const specialist = formData.get("specialistName");
//     const uid = auth.currentUser?.uid;

//     const newApp = {
//       id: Date.now().toString(),
//       customer: name,
//       phone: phone,
//       specialist: specialist,
//       service: "Tratamiento Estándar",
//       start: time,
//       date: getTodayStr(),
//       status: "pending",
//     };

//     try {
//       const esteticaRef = doc(db, "centros_estetica", uid);
//       const currentApps = esteticaData?.appointments || [];
//       const newList = [...currentApps, newApp];
//       await updateDoc(esteticaRef, { appointments: newList });
//       setEsteticaData((prev) => ({ ...prev, appointments: newList }));
//       setIsModalOpen(false);

//       if (phone) {
//         const formattedPhone = formatUruguayPhone(phone);
//         const bookingLink = `https://aura-estetica.vercel.app/reserva/${uid}`;
//         const msg = encodeURIComponent(
//           `Hola ${name}, confirmamos tu cita de belleza para hoy a las ${time}hs.\n\nRecuerda llegar 5 minutos antes. ¡Te esperamos! ✨`
//         );
//         window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
//       }
//     } catch (error) {
//       alert("Error al guardar la cita.");
//     }
//   };

//   const confirmPaymentAndComplete = async (paymentMethod) => {
//     if (!appointmentToComplete) return;
//     try {
//       const esteticaRef = doc(db, "centros_estetica", auth.currentUser.uid);
//       const currentApps = esteticaData?.appointments || [];
//       const newList = currentApps.map((app) =>
//         String(app.id) === String(appointmentToComplete.id)
//           ? {
//               ...app,
//               status: "done",
//               paymentMethod: paymentMethod,
//               paidAt: new Date().toISOString(),
//             }
//           : app
//       );
//       await updateDoc(esteticaRef, { appointments: newList });
//       setEsteticaData((prev) => ({ ...prev, appointments: newList }));
//       setAppointmentToComplete(null);
//     } catch (error) {
//       alert("Error al procesar el pago.");
//     }
//   };

//   const handleDeleteAppointment = async (appointmentId) => {
//     if (!window.confirm("¿Cancelar cita de belleza?")) return;
//     try {
//       const esteticaRef = doc(db, "centros_estetica", auth.currentUser.uid);
//       const newList = esteticaData.appointments.filter(
//         (app) => String(app.id) !== String(appointmentId)
//       );
//       await updateDoc(esteticaRef, { appointments: newList });
//       setEsteticaData((prev) => ({ ...prev, appointments: newList }));
//     } catch (error) {
//       alert("Error al eliminar.");
//     }
//   };

//   const handleSendReminder = (app) => {
//     if (!app.phone) return;
//     const formattedPhone = formatUruguayPhone(app.phone);
//     const msg = encodeURIComponent(
//       `Hola ${app.customer}, hoy tienes una cita reservada con nosotros a las ${app.start}hs. ¡Te esperamos para consentirte! 🌸✨`
//     );
//     window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
//   };

//   const { filteredAppointments, recallClients } = useMemo(() => {
//     const allApps = esteticaData?.appointments || [];
//     const hoyStr = getTodayStr();

//     const today = allApps.filter(
//       (app) => app.status === "pending" && app.date === hoyStr
//     );

//     const lastVisits = {};
//     allApps.forEach((app) => {
//       if (app.status === "done" && app.phone) {
//         const appDate = new Date(app.date);
//         if (!lastVisits[app.phone] || appDate > lastVisits[app.phone].date) {
//           lastVisits[app.phone] = {
//             id: app.id,
//             name: app.customer,
//             date: appDate,
//             phone: app.phone,
//           };
//         }
//       }
//     });

//     const limitDate = new Date();
//     limitDate.setDate(limitDate.getDate() - 25); // Ciclo de belleza suele ser más largo (25 días)
//     const recall = Object.values(lastVisits).filter(
//       (client) => client.date < limitDate
//     );

//     const filtered = today
//       .filter((app) =>
//         (app.customer || "").toLowerCase().includes(searchQuery.toLowerCase())
//       )
//       .sort((a, b) => (a.start || "").localeCompare(b.start || ""));

//     return { filteredAppointments: filtered, recallClients: recall };
//   }, [esteticaData, searchQuery]);

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
//         <Loader2 className="animate-spin text-pink-500" />
//       </div>
//     );

//   const team = esteticaData?.specialists || [];

//   return (
//     <div className="flex flex-col min-h-screen pb-24 bg-[#FDF8FA] dark:bg-slate-950 font-sans">
//       <header className="flex-none bg-white dark:bg-slate-900 border-b border-pink-100 dark:border-slate-800 p-4 md:px-8 md:py-6">
//         <div className="flex flex-col md:flex-row items-center gap-4 max-w-7xl mx-auto">
//           <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-3 md:py-2 rounded-2xl w-full md:max-w-md transition-all focus-within:ring-2 focus-within:ring-pink-500/20">
//             <Search size={18} className="text-slate-400 shrink-0" />
//             <input
//               type="text"
//               placeholder="Buscar paciente o cliente..."
//               className="bg-transparent border-none outline-none ml-3 text-sm w-full dark:text-white placeholder:text-slate-500 font-medium"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <button
//             onClick={() => {
//               if (isInactive) {
//                 alert(
//                   "🚫 Tu cuenta está inactiva. Regulariza tu situación para agendar."
//                 );
//               } else {
//                 setIsModalOpen(true);
//               }
//             }}
//             className={`w-full md:w-auto px-8 py-4 md:py-3 rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
//               isInactive
//                 ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed grayscale"
//                 : "bg-pink-500 hover:bg-pink-600 active:scale-95 text-white shadow-lg shadow-pink-500/25"
//             }`}
//           >
//             {isInactive ? <Lock size={18} /> : <Plus size={18} />}
//             Nueva Cita
//           </button>
//         </div>
//       </header>

//       <div className="flex-1 overflow-y-auto p-8 space-y-8">
//         {isInactive && (
//           <div className="bg-rose-500/10 border-2 border-dashed border-rose-500/30 p-4 rounded-3xl flex items-center gap-4">
//             <div className="bg-rose-500 text-white p-2 rounded-xl">
//               <ShieldCheck size={20} />
//             </div>
//             <div>
//               <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest">
//                 Cuenta Suspendida
//               </p>
//               <p className="text-[9px] font-bold text-rose-500/80 uppercase">
//                 Regulariza el pago para continuar agendando.
//               </p>
//             </div>
//           </div>
//         )}

//         <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             title="Hoy"
//             value={filteredAppointments.length.toString()}
//             change="Tratamientos"
//             icon={<Clock size={16} />}
//             color="pink"
//           />
//           <StatCard
//             title="Recall"
//             value={recallClients.length.toString()}
//             change="Reactivar"
//             icon={<Zap size={16} />}
//             color="amber"
//           />
//           <StatCard
//             title="Staff"
//             value={team.length.toString()}
//             change="Especialistas"
//             icon={<UserPlus size={16} />}
//             color="violet"
//           />
//           <StatCard
//             title="Total"
//             value={esteticaData?.appointments
//               ?.filter((a) => a.status === "done")
//               .length.toString()}
//             change="Completados"
//             icon={<Star size={16} />}
//             color="emerald"
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
//               <Sparkles size={14} className="text-pink-500" /> Agenda de Belleza
//             </h3>
//             <div className="grid gap-3">
//               {filteredAppointments.length > 0 ? (
//                 filteredAppointments.map((app) => (
//                   <AppointmentItem
//                     key={app.id}
//                     app={app}
//                     onDelete={() => handleDeleteAppointment(app.id)}
//                     onComplete={() => setAppointmentToComplete(app)}
//                     onReminder={() => handleSendReminder(app)}
//                   />
//                 ))
//               ) : (
//                 <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-pink-100 dark:border-slate-800">
//                   <p className="text-xs font-bold text-slate-300 uppercase">
//                     Sin citas para hoy
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="space-y-6">
//             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
//               <Heart size={14} className="text-pink-500" /> Fidelización
//             </h3>
//             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 space-y-4 border border-pink-50 dark:border-slate-800 shadow-sm">
//               {recallClients.length > 0 ? (
//                 recallClients.slice(0, 5).map((client) => {
//                   const isSent = sentMessages.includes(client.id);
//                   return (
//                     <div
//                       key={client.id}
//                       className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
//                         isSent
//                           ? "opacity-30 grayscale"
//                           : "bg-pink-50/30 dark:bg-slate-800/50"
//                       }`}
//                     >
//                       <div className="truncate pr-2">
//                         <p className="text-[11px] font-black uppercase dark:text-white truncate">
//                           {client.name}
//                         </p>
//                         <p className="text-[8px] font-bold text-pink-500 uppercase">
//                           Última sesión: {client.date.toLocaleDateString()}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => {
//                           const formatted = formatUruguayPhone(client.phone);
//                           const msg = encodeURIComponent(
//                             `¡Hola ${client.name}! ✨ Hace tiempo que no nos vemos en AppEstetica. ¿Te gustaría agendar una sesión de mimos? 🌸`
//                           );
//                           window.open(
//                             `https://wa.me/${formatted}?text=${msg}`,
//                             "_blank"
//                           );
//                           setSentMessages([...sentMessages, client.id]);
//                         }}
//                         className={`p-2.5 rounded-xl ${
//                           isSent
//                             ? "bg-slate-200"
//                             : "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
//                         }`}
//                       >
//                         {isSent ? (
//                           <Check size={14} />
//                         ) : (
//                           <MessageSquare size={14} />
//                         )}
//                       </button>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <p className="text-[9px] font-bold text-slate-400 uppercase text-center py-2">
//                   Todos tus clientes están al día
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MODAL DE PAGO */}
//       {appointmentToComplete && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
//           <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800">
//             <div className="text-center mb-8">
//               <div className="bg-emerald-100 dark:bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
//                 <CheckCircle2 size={32} />
//               </div>
//               <h3 className="text-xl font-black uppercase dark:text-white">
//                 Finalizar Sesión
//               </h3>
//               <p className="text-slate-500 text-xs font-bold uppercase mt-1">
//                 Cobro de servicio
//               </p>
//             </div>
//             <div className="grid gap-3">
//               {[
//                 {
//                   id: "cash",
//                   icon: <Banknote />,
//                   label: "Efectivo",
//                   color: "hover:bg-emerald-600",
//                 },
//                 {
//                   id: "transfer",
//                   icon: <SmartphoneNfc />,
//                   label: "Transferencia",
//                   color: "hover:bg-blue-600",
//                 },
//                 {
//                   id: "mp",
//                   icon: <CreditCard />,
//                   label: "Mercado Pago",
//                   color: "hover:bg-sky-500",
//                 },
//                 {
//                   id: "pos",
//                   icon: <CreditCard />,
//                   label: "POS / Tarjeta",
//                   color: "hover:bg-slate-600",
//                 },
//               ].map((method) => (
//                 <button
//                   key={method.id}
//                   onClick={() => confirmPaymentAndComplete(method.id)}
//                   className={`flex items-center gap-4 w-full p-4 bg-slate-50 dark:bg-slate-800 ${method.color} hover:text-white rounded-2xl transition-all group`}
//                 >
//                   {method.icon}
//                   <span className="font-black uppercase text-xs tracking-widest">
//                     {method.label}
//                   </span>
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={() => setAppointmentToComplete(null)}
//               className="w-full mt-6 text-slate-400 font-bold uppercase text-[10px] tracking-widest"
//             >
//               Cancelar
//             </button>
//           </div>
//         </div>
//       )}

//       {/* MODAL NUEVA RESERVA */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
//           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
//             <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-pink-50/50 dark:bg-slate-800/50">
//               <h3 className="font-black uppercase tracking-widest italic dark:text-white text-xs">
//                             Nueva Cita AppEstetica
//               </h3>
//               <button onClick={() => setIsModalOpen(false)}>
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleAddAppointment} className="p-8 space-y-4">
//               <input
//                 required
//                 name="clientName"
//                 className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white text-sm"
//                 placeholder="Nombre de la paciente"
//               />
//               <input
//                 required
//                 name="clientPhone"
//                 className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white text-sm"
//                 placeholder="WhatsApp (Ej: 099 123 456)"
//               />
//               <div className="grid grid-cols-2 gap-4">
//                 <input
//                   required
//                   name="time"
//                   type="time"
//                   className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
//                 />
//                 <select
//                   name="specialistName"
//                   className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white text-xs"
//                 >
//                   {team.map((s) => (
//                     <option key={s.id} value={s.name}>
//                       {s.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-pink-500 text-white font-black uppercase py-5 rounded-2xl shadow-xl hover:bg-pink-600 transition-all tracking-[0.2em] text-xs"
//               >
//                 Agendar Cita
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function StatCard({ title, value, change, icon, color }) {
//   const colors = {
//     emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
//     pink: "text-pink-500 bg-pink-50 dark:bg-pink-500/10",
//     violet: "text-violet-500 bg-violet-50 dark:bg-violet-500/10",
//     amber: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
//   };
//   return (
//     <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-pink-50 dark:border-slate-800 shadow-sm">
//       <div className="flex justify-between items-start mb-4">
//         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
//           {title}
//         </span>
//         <div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div>
//       </div>
//       <h4 className="text-3xl font-black dark:text-white tracking-tighter">
//         {value}
//       </h4>
//       <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
//         {change}
//       </p>
//     </div>
//   );
// }

// function AppointmentItem({ app, onDelete, onComplete, onReminder }) {
//   return (
//     <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5 bg-white dark:bg-slate-900 border border-pink-50 dark:border-slate-800 rounded-[1.8rem] hover:border-pink-500 transition-all shadow-sm">
//       <div className="flex items-center gap-4 flex-1 min-w-0">
//         <div className="bg-pink-500 text-white px-4 py-3 rounded-2xl min-w-[70px] md:min-w-[80px] text-center shadow-lg shadow-pink-500/10">
//           <span className="text-xs font-black">{app.start}</span>
//         </div>
//         <div className="flex-1 min-w-0">
//           <h5 className="font-black text-sm uppercase dark:text-white truncate tracking-tight">
//             {app.customer}
//           </h5>
//           <div className="flex flex-wrap items-center gap-2 mt-1">
//             <p className="text-[10px] font-bold text-slate-400 uppercase">
//               Especialista:{" "}
//               <span className="text-pink-500">{app.specialist}</span>
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="flex items-center justify-between md:justify-end gap-2 pt-3 md:pt-0 border-t md:border-none border-slate-50 dark:border-slate-800">
//         {app.phone && (
//           <button
//             onClick={onReminder}
//             className="flex-1 md:flex-none flex justify-center p-3 bg-pink-50 dark:bg-pink-500/10 text-pink-600 rounded-xl hover:bg-pink-500 hover:text-white transition-all"
//           >
//             <MessageSquare size={16} strokeWidth={2.5} />
//           </button>
//         )}
//         <button
//           onClick={onComplete}
//           className="flex-1 md:flex-none flex justify-center p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
//         >
//           <CheckCircle2 size={16} strokeWidth={2.5} />
//         </button>
//         <button
//           onClick={onDelete}
//           className="flex-1 md:flex-none flex justify-center p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
//         >
//           <Trash2 size={16} strokeWidth={2.5} />
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Clock,
  UserPlus,
  Star,
  X,
  Search,
  ShieldCheck,
  Loader2,
  MessageSquare,
  Trash2,
  CheckCircle2,
  Zap,
  Check,
  CreditCard,
  Banknote,
  SmartphoneNfc,
  Lock,
  Sparkles,
  Heart,
  LayoutDashboard,
  Users,
  Calendar as CalendarIcon,
  Scissors,
  CreditCard as PaymentsIcon,
  LogOut,
  Sparkle,
} from "lucide-react";
// Firebase Integración (v9+)
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EsteticaCRM() {
  const router = useRouter();

  // --- ESTADOS PRINCIPALES ---
  const [esteticaData, setEsteticaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToComplete, setAppointmentToComplete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Control de estado de cuenta / suscripción
  const isPlanExpired = () => {
    const expiresAt = esteticaData?.plan?.expiresAt;
    if (!expiresAt) return false;
    const expiration = expiresAt.toDate
      ? expiresAt.toDate()
      : new Date(expiresAt);
    return !Number.isNaN(expiration.getTime()) && expiration <= new Date();
  };

  const isInactive =
    esteticaData?.plan?.status === "inactive" ||
    esteticaData?.plan?.status === "expired" ||
    isPlanExpired();

  const getTodayStr = () => new Date().toLocaleDateString("sv-SE");

  const formatUruguayPhone = (phone) => {
    if (!phone) return "";
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = "598" + clean.substring(1);
    } else if (!clean.startsWith("598")) {
      clean = "598" + clean;
    }
    return clean;
  };

  // --- 1. SINCRO FIREBASE ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "centros_estetica", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setEsteticaData(docSnap.data());
          }
        } catch (error) {
          console.error("Error al cargar CRM:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // --- 2. ACCIONES CRM ---
  const handleAddAppointment = async (e) => {
    e.preventDefault();

    if (isInactive) {
      alert(
        "Acceso suspendido: Regulariza la cuota para agendar nuevos turnos.",
      );
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = formData.get("clientName");
    const phone = formData.get("clientPhone");
    const time = formData.get("time");
    const specialist = formData.get("specialistName");
    const serviceCategory = formData.get("serviceCategory");
    const uid = auth.currentUser?.uid;

    const newApp = {
      id: Date.now().toString(),
      customer: name,
      phone: phone,
      specialist: specialist,
      serviceCategory: serviceCategory || "Pestañas",
      start: time,
      date: getTodayStr(),
      status: "pending",
    };

    try {
      if (!uid) return;
      const esteticaRef = doc(db, "centros_estetica", uid);
      const currentApps = esteticaData?.appointments || [];
      const newList = [...currentApps, newApp];
      await updateDoc(esteticaRef, { appointments: newList });
      setEsteticaData((prev) => ({ ...prev, appointments: newList }));
      setIsModalOpen(false);

      if (phone) {
        const formattedPhone = formatUruguayPhone(phone);
        const msg = encodeURIComponent(
          `¡Hola ${name}! Confirmamos tu reserva de ${serviceCategory} para hoy a las ${time}hs. ✨ ¡Te esperamos!`,
        );
        window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
      }
    } catch (error) {
      alert("Error al guardar la reserva.");
    }
  };

  const confirmPaymentAndComplete = async (paymentMethod) => {
    if (!appointmentToComplete || !auth.currentUser) return;
    try {
      const esteticaRef = doc(db, "centros_estetica", auth.currentUser.uid);
      const currentApps = esteticaData?.appointments || [];
      const newList = currentApps.map((app) =>
        String(app.id) === String(appointmentToComplete.id)
          ? {
              ...app,
              status: "done",
              paymentMethod: paymentMethod,
              paidAt: new Date().toISOString(),
            }
          : app,
      );
      await updateDoc(esteticaRef, { appointments: newList });
      setEsteticaData((prev) => ({ ...prev, appointments: newList }));
      setAppointmentToComplete(null);
    } catch (error) {
      alert("Error al procesar el cobro.");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("¿Deseas cancelar esta cita?")) return;
    if (!auth.currentUser) return;
    try {
      const esteticaRef = doc(db, "centros_estetica", auth.currentUser.uid);
      const newList = esteticaData.appointments.filter(
        (app) => String(app.id) !== String(appointmentId),
      );
      await updateDoc(esteticaRef, { appointments: newList });
      setEsteticaData((prev) => ({ ...prev, appointments: newList }));
    } catch (error) {
      alert("Error al cancelar.");
    }
  };

  const handleSendReminder = (app) => {
    if (!app.phone) return;
    const formattedPhone = formatUruguayPhone(app.phone);
    const msg = encodeURIComponent(
      `Hola ${app.customer}, te recordamos tu turno de ${app.serviceCategory || "estética"} hoy a las ${app.start}hs 🌸✨`,
    );
    window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
  };

  // --- MEMO DE FILTROS & RETOQUES ---
  const { filteredAppointments, recallClients } = useMemo(() => {
    const allApps = esteticaData?.appointments || [];
    const hoyStr = getTodayStr();

    const today = allApps.filter(
      (app) => app.status === "pending" && app.date === hoyStr,
    );

    const lastVisits = {};
    allApps.forEach((app) => {
      if (app.status === "done" && app.phone) {
        const appDate = new Date(app.date);
        if (!lastVisits[app.phone] || appDate > lastVisits[app.phone].date) {
          lastVisits[app.phone] = {
            id: app.id,
            name: app.customer,
            date: appDate,
            phone: app.phone,
            service: app.serviceCategory || "Tratamiento",
          };
        }
      }
    });

    // Retoque automático a los 21 días (Ciclo recomendado para Pestañas / Soft Gel)
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 21);
    const recall = Object.values(lastVisits).filter(
      (client) => client.date < limitDate,
    );

    const filtered = today
      .filter((app) => {
        const matchesSearch = (app.customer || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCat =
          selectedCategory === "Todos" ||
          app.serviceCategory === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => (a.start || "").localeCompare(b.start || ""));

    return { filteredAppointments: filtered, recallClients: recall };
  }, [esteticaData, searchQuery, selectedCategory]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="animate-spin text-[#67C3A5]" size={36} />
      </div>
    );

  const team = esteticaData?.specialists || [
    { id: "1", name: "Valentina (Pestañas)" },
    { id: "2", name: "Camila (Manicuría)" },
    { id: "3", name: "Sofía (Peluquería)" },
  ];

  const categories = [
    "Todos",
    "Pestañas",
    "Manicuría",
    "Peluquería",
    "Estética",
  ];

  return (
    <div className="flex h-screen bg-[#FAF8F5] text-slate-700 font-sans overflow-hidden">
      {/* ÁREA CENTRAL DE TRABAJO */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* BARRA SUPERIOR */}
        <header className="px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="flex items-center bg-white border border-slate-200/80 rounded-full px-4 py-2.5 w-full shadow-sm focus-within:border-[#67C3A5] transition-all">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar cliente, tratamiento o especialista..."
                className="bg-transparent border-none outline-none ml-2 text-xs w-full text-slate-700 placeholder:text-slate-400 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-slate-200 mx-1" />

            <div className="flex items-center gap-3 pl-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {esteticaData?.name || "Anahera Studio"}
                </p>
                <span className="text-[10px] text-slate-400">
                  Administradora
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-8 space-y-8 max-w-7xl">
          {isInactive && (
            <div className="bg-[#FFF0ED] border border-[#FFC2B4] p-4 rounded-2xl flex items-center gap-4 text-rose-700">
              <ShieldCheck size={20} />
              <div className="text-xs">
                <p className="font-bold uppercase tracking-wider">
                  Plan Inactivo
                </p>
                <p className="text-slate-600">
                  Actualiza el método de pago para seguir reservando sesiones.
                </p>
              </div>
            </div>
          )}

          {/* TARJETAS MÉTRICAS (Menta / Salmón) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Turnos Hoy"
              value={filteredAppointments.length.toString()}
              badge="En agenda"
              icon={<Clock size={18} className="text-[#67C3A5]" />}
              bgColor="bg-[#E2F5ED]"
            />
            <StatCard
              title="Recall Retoques"
              value={recallClients.length.toString()}
              badge="WhatsApp"
              icon={<Zap size={18} className="text-[#F89B88]" />}
              bgColor="bg-[#FFF0ED]"
            />
            <StatCard
              title="Especialistas"
              value={team.length.toString()}
              badge="En Turno"
              icon={<UserPlus size={18} className="text-slate-600" />}
              bgColor="bg-slate-100"
            />
            <StatCard
              title="Atendidos"
              value={
                esteticaData?.appointments
                  ?.filter((a) => a.status === "done")
                  .length.toString() || "0"
              }
              badge="Este mes"
              icon={<Star size={18} className="text-amber-500" />}
              bgColor="bg-amber-50"
            />
          </div>

          {/* FILTRO CATEGORÍAS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* LISTA Y RETOQUES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles size={16} className="text-[#67C3A5]" /> Agenda del
                  Día
                </h3>
                <span className="text-xs text-slate-400 font-medium capitalize">
                  {new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>

              <div className="space-y-3">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((app) => (
                    <AppointmentRow
                      key={app.id}
                      app={app}
                      onDelete={() => handleDeleteAppointment(app.id)}
                      onComplete={() => setAppointmentToComplete(app)}
                      onReminder={() => handleSendReminder(app)}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-xs font-semibold text-slate-400">
                      Sin turnos pendientes para la categoría seleccionada
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* FIDELIZACIÓN (RECALL) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Heart size={16} className="text-[#F89B88]" /> Alerta de
                Retoques
              </h3>

              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
                {recallClients.length > 0 ? (
                  recallClients.slice(0, 5).map((client) => {
                    const isSent = sentMessages.includes(client.id);
                    return (
                      <div
                        key={client.id}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          isSent
                            ? "bg-slate-50 border-transparent opacity-40"
                            : "bg-[#FFF0ED]/40 border-[#FDE2E4]"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {client.name}
                          </p>
                          <p className="text-[10px] text-[#F89B88] font-medium">
                            {client.service} ({client.date.toLocaleDateString()}
                            )
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const formatted = formatUruguayPhone(client.phone);
                            const msg = encodeURIComponent(
                              `¡Hola ${client.name}! ✨ Pasaron 3 semanas desde tu última sesión de ${client.service}. ¿Te reservamos un lugar para el retoque? 💅🌸`,
                            );
                            window.open(
                              `https://wa.me/${formatted}?text=${msg}`,
                              "_blank",
                            );
                            setSentMessages([...sentMessages, client.id]);
                          }}
                          className={`p-2 rounded-xl transition-all ${
                            isSent
                              ? "bg-slate-200 text-slate-500"
                              : "bg-[#F89B88] hover:bg-[#e78875] text-white shadow-sm"
                          }`}
                        >
                          {isSent ? (
                            <Check size={14} />
                          ) : (
                            <MessageSquare size={14} />
                          )}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 font-medium text-center py-4">
                    Todas tus clientas tienen sus mantenimientos al día ✨
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL COBRO / PAGO */}
      {appointmentToComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-slate-100">
            <div className="text-center mb-6">
              <div className="bg-[#E2F5ED] text-[#42B18C] w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Cerrar Servicio
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Clienta: {appointmentToComplete.customer}
              </p>
            </div>

            <div className="grid gap-2.5">
              {[
                { id: "cash", icon: <Banknote size={16} />, label: "Efectivo" },
                {
                  id: "transfer",
                  icon: <SmartphoneNfc size={16} />,
                  label: "Transferencia",
                },
                {
                  id: "mp",
                  icon: <CreditCard size={16} />,
                  label: "Mercado Pago",
                },
                {
                  id: "pos",
                  icon: <CreditCard size={16} />,
                  label: "POS / Tarjeta",
                },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => confirmPaymentAndComplete(m.id)}
                  className="flex items-center gap-3 w-full p-3.5 bg-slate-50 hover:bg-[#E2F5ED] hover:text-[#2E8B6E] rounded-2xl text-xs font-bold text-slate-700 transition-all"
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setAppointmentToComplete(null)}
              className="w-full mt-4 text-slate-400 hover:text-slate-600 font-medium text-xs py-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL NUEVO TURNO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#FAF8F5]">
              <h3 className="font-bold text-slate-800 text-sm">Nueva Cita</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Nombre de la Clienta
                </label>
                <input
                  required
                  name="clientName"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#67C3A5]"
                  placeholder="Ej. Martina Gómez"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  WhatsApp (con código de país)
                </label>
                <input
                  required
                  name="clientPhone"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#67C3A5]"
                  placeholder="099 123 456"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Servicio
                  </label>
                  <select
                    name="serviceCategory"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#67C3A5]"
                  >
                    <option value="Pestañas">Pestañas</option>
                    <option value="Manicuría">Manicuría</option>
                    <option value="Peluquería">Peluquería</option>
                    <option value="Estética">Estética</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Hora
                  </label>
                  <input
                    required
                    name="time"
                    type="time"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#67C3A5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Especialista / Profesional
                </label>
                <select
                  name="specialistName"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#67C3A5]"
                >
                  {team.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#67C3A5] hover:bg-[#52B293] text-white font-bold py-3.5 rounded-2xl shadow-md transition-all text-xs tracking-wider mt-2"
              >
                Confirmar Cita
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUBCOMPONENTES ---

function NavItem({ icon, label, active = false }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
        active
          ? "bg-[#E2F5ED] text-[#2E8B6E]"
          : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function StatCard({ title, value, badge, icon, bgColor }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <h4 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          {value}
        </h4>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md inline-block">
          {badge}
        </span>
      </div>
      <div className={`p-3.5 rounded-2xl ${bgColor}`}>{icon}</div>
    </div>
  );
}

function AppointmentRow({ app, onDelete, onComplete, onReminder }) {
  const categoryColors = {
    Pestañas: "bg-[#FFF0ED] text-[#F89B88]",
    Manicuría: "bg-[#E2F5ED] text-[#2E8B6E]",
    Peluquería: "bg-[#EBF3FE] text-[#3B82F6]",
    Estética: "bg-purple-50 text-purple-600",
  };

  const badgeStyle =
    categoryColors[app.serviceCategory] || "bg-slate-100 text-slate-600";

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-3xl hover:border-slate-200 transition-all shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-[#E2F5ED] text-[#2E8B6E] px-3.5 py-2.5 rounded-2xl font-extrabold text-xs shrink-0">
          {app.start}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h5 className="font-bold text-xs text-slate-800">{app.customer}</h5>
            <span
              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${badgeStyle}`}
            >
              {app.serviceCategory || "Especialidad"}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            Especialista:{" "}
            <span className="text-slate-600 font-semibold">
              {app.specialist}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {app.phone && (
          <button
            onClick={onReminder}
            title="Aviso por WhatsApp"
            className="p-2 text-slate-400 hover:text-[#2E8B6E] hover:bg-[#E2F5ED] rounded-xl transition-all"
          >
            <MessageSquare size={16} />
          </button>
        )}
        <button
          onClick={onComplete}
          title="Marcar completado y cobrar"
          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
        >
          <CheckCircle2 size={16} />
        </button>
        <button
          onClick={onDelete}
          title="Cancelar cita"
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
