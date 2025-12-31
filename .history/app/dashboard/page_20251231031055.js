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
// } from "lucide-react";
// // Firebase
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// export default function DashboardPage() {
//   const router = useRouter();

//   // --- ESTADOS ---
//   const [barberiaData, setBarberiaData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [appointmentToComplete, setAppointmentToComplete] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sentMessages, setSentMessages] = useState([]);

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
//           const docRef = doc(db, "barberias", user.uid);
//           const docSnap = await getDoc(docRef);
//           if (docSnap.exists()) {
//             setBarberiaData(docSnap.data());
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
//     const formData = new FormData(e.target);
//     const name = formData.get("clientName");
//     const phone = formData.get("clientPhone");
//     const time = formData.get("time");
//     const uid = auth.currentUser?.uid;

//     const newApp = {
//       id: Date.now().toString(),
//       customer: name,
//       phone: phone,
//       barber: formData.get("barberName"),
//       service: "Servicio Rápido",
//       start: time,
//       date: getTodayStr(),
//       status: "pending",
//     };

//     try {
//       const barberiaRef = doc(db, "barberias", uid);
//       const currentApps = barberiaData?.appointments || [];
//       const newList = [...currentApps, newApp];
//       await updateDoc(barberiaRef, { appointments: newList });
//       setBarberiaData((prev) => ({ ...prev, appointments: newList }));
//       setIsModalOpen(false);

//       if (phone) {
//         const formattedPhone = formatUruguayPhone(phone);
//         const bookingLink = `https://barberias.vercel.app/reserva/${uid}`;
//         const msg = encodeURIComponent(
//           `Hola ${name}, confirmamos tu turno para hoy a las ${time}.\n\nReserva tu próximo turno aquí: ${bookingLink}`
//         );
//         window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
//       }
//     } catch (error) {
//       alert("Error al guardar.");
//     }
//   };

//   const confirmPaymentAndComplete = async (paymentMethod) => {
//     if (!appointmentToComplete) return;
//     try {
//       const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
//       const currentApps = barberiaData?.appointments || [];
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
//       await updateDoc(barberiaRef, { appointments: newList });
//       setBarberiaData((prev) => ({ ...prev, appointments: newList }));
//       setAppointmentToComplete(null);
//     } catch (error) {
//       alert("Error al procesar el pago.");
//     }
//   };

//   const handleDeleteAppointment = async (appointmentId) => {
//     if (!window.confirm("¿Eliminar reserva?")) return;
//     try {
//       const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
//       const newList = barberiaData.appointments.filter(
//         (app) => String(app.id) !== String(appointmentId)
//       );
//       await updateDoc(barberiaRef, { appointments: newList });
//       setBarberiaData((prev) => ({ ...prev, appointments: newList }));
//     } catch (error) {
//       alert("Error al eliminar.");
//     }
//   };

//   // --- NUEVA LÓGICA: RECORDATORIO DE CITA HOY ---
//   const handleSendReminder = (app) => {
//     if (!app.phone) return;
//     const formattedPhone = formatUruguayPhone(app.phone);
//     const msg = encodeURIComponent(
//       `Hola ${app.customer}, hoy te esperamos en la barbería a las ${app.start}. Tu turno ya está reservado. ¡Nos vemos! 💪💈`
//     );
//     window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
//   };

//   // --- 3. FILTRADO Y RECALL ---
//   const { filteredAppointments, recallClients } = useMemo(() => {
//     const allApps = barberiaData?.appointments || [];
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
//     limitDate.setDate(limitDate.getDate() - 20);
//     const recall = Object.values(lastVisits).filter(
//       (client) => client.date < limitDate
//     );

//     const filtered = today
//       .filter((app) =>
//         (app.customer || "").toLowerCase().includes(searchQuery.toLowerCase())
//       )
//       .sort((a, b) => (a.start || "").localeCompare(b.start || ""));

//     return { filteredAppointments: filtered, recallClients: recall };
//   }, [barberiaData, searchQuery]);

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
//         <Loader2 className="animate-spin text-blue-600" />
//       </div>
//     );

//   const team = barberiaData?.barbers || [];

//   return (
//     <div className="flex flex-col min-h-screen pb-24 bg-slate-50 dark:bg-slate-950">
//       <header className="flex-none bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 md:px-8 md:py-6">
//         <div className="flex flex-col md:flex-row items-center gap-4 max-w-7xl mx-auto">
//           {/* Contenedor del Buscador */}
//           <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-3 md:py-2 rounded-2xl w-full md:max-w-md transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
//             <Search size={18} className="text-slate-400 shrink-0" />
//             <input
//               type="text"
//               placeholder="Buscar cliente..."
//               className="bg-transparent border-none outline-none ml-3 text-sm w-full dark:text-white placeholder:text-slate-500 font-medium"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           {/* Botón: En mobile es ancho completo, en desktop es automático */}
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-8 py-4 md:py-3 rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
//           >
//             <Plus size={18} className="md:hidden" />{" "}
//             {/* Icono extra solo en mobile */}
//             Nueva Reserva
//           </button>
//         </div>
//       </header>

//       <div className="flex-1 overflow-y-auto p-8 space-y-8">
//         <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             title="Hoy"
//             value={filteredAppointments.length.toString()}
//             change="Pendientes"
//             icon={<Clock size={16} />}
//             color="blue"
//           />
//           <StatCard
//             title="Recall"
//             value={recallClients.length.toString()}
//             change="Inactivos"
//             icon={<Zap size={16} />}
//             color="amber"
//           />
//           <StatCard
//             title="Staff"
//             value={team.length.toString()}
//             change="Barberos"
//             icon={<UserPlus size={16} />}
//             color="violet"
//           />
//           <StatCard
//             title="Total"
//             value={barberiaData?.appointments
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
//               <BellRing size={14} className="text-blue-600" /> Agenda de hoy
//             </h3>
//             <div className="grid gap-3">
//               {filteredAppointments.length > 0 ? (
//                 filteredAppointments.map((app) => (
//                   <AppointmentItem
//                     key={app.id}
//                     app={app}
//                     onDelete={() => handleDeleteAppointment(app.id)}
//                     onComplete={() => setAppointmentToComplete(app)}
//                     onReminder={() => handleSendReminder(app)} // Nueva acción
//                   />
//                 ))
//               ) : (
//                 <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
//                   <p className="text-xs font-bold text-slate-400 uppercase">
//                     No hay citas para hoy
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="space-y-6">
//             {/* SMART RECALL */}
//             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
//               <Zap size={14} className="text-amber-500" /> Marketing automático
//             </h3>
//             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
//               {recallClients.length > 0 ? (
//                 recallClients.slice(0, 5).map((client) => {
//                   const isSent = sentMessages.includes(client.id);
//                   return (
//                     <div
//                       key={client.id}
//                       className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
//                         isSent
//                           ? "opacity-30 grayscale"
//                           : "bg-slate-50 dark:bg-slate-800/50 shadow-sm"
//                       }`}
//                     >
//                       <div className="truncate pr-2">
//                         <p className="text-[11px] font-black uppercase dark:text-white truncate">
//                           {client.name}
//                         </p>
//                         <p className="text-[8px] font-bold text-amber-500 uppercase tracking-tighter">
//                           Vino el: {client.date.toLocaleDateString()}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => {
//                           const formatted = formatUruguayPhone(client.phone);
//                           const bookingLink = `https://barberias.vercel.app/reserva/${auth.currentUser?.uid}`;
//                           const msg = encodeURIComponent(
//                             `¡Hola ${client.name}!💈 Te extrañamos en la barbería. ¿Reservamos un lugar?\n\nAgendate aquí: ${bookingLink}`
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
//                             : "bg-emerald-500 text-white shadow-lg"
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
//                   Todos tus clientes han vuelto
//                 </p>
//               )}
//             </div>

//             {/* STAFF / BARBEROS */}
//             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
//               Staff Activo
//             </h3>
//             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
//               {team.length > 0 ? (
//                 team.map((barber, idx) => (
//                   <div key={idx} className="flex items-center gap-3">
//                     <div className="size-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center font-black text-blue-600 text-xs uppercase overflow-hidden">
//                       {barber.imageUrl ? (
//                         <img
//                           src={barber.imageUrl}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         barber.name.charAt(0)
//                       )}
//                     </div>

//                     <div className="flex-1">
//                       <p className="text-xs font-black uppercase dark:text-white leading-tight">
//                         {barber.name}
//                       </p>
//                       <p className="text-[8px] font-black uppercase text-emerald-500">
//                         En línea
//                       </p>
//                     </div>
//                     <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-[9px] font-bold text-slate-400 uppercase text-center py-2">
//                   No hay staff configurado
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MODAL DE PAGO CON TUS MEDIOS ORIGINALES */}
//       {appointmentToComplete && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
//           <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800">
//             <div className="text-center mb-8">
//               <div className="bg-emerald-100 dark:bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
//                 <CheckCircle2 size={32} />
//               </div>
//               <h3 className="text-xl font-black uppercase dark:text-white">
//                 Finalizar Cita
//               </h3>
//               <p className="text-slate-500 text-xs font-bold uppercase mt-1">
//                 Método de pago
//               </p>
//             </div>

//             <div className="grid gap-3">
//               <button
//                 onClick={() => confirmPaymentAndComplete("cash")}
//                 className="flex items-center gap-4 w-full p-4 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all group"
//               >
//                 <Banknote size={20} />
//                 <span className="font-black uppercase text-xs tracking-widest">
//                   Efectivo
//                 </span>
//               </button>
//               <button
//                 onClick={() => confirmPaymentAndComplete("transfer")}
//                 className="flex items-center gap-4 w-full p-4 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded-2xl transition-all group"
//               >
//                 <SmartphoneNfc size={20} />
//                 <span className="font-black uppercase text-xs tracking-widest">
//                   Transferencia
//                 </span>
//               </button>
//               <button
//                 onClick={() => confirmPaymentAndComplete("mp")}
//                 className="flex items-center gap-4 w-full p-4 bg-slate-50 dark:bg-slate-800 hover:bg-violet-600 hover:text-white rounded-2xl transition-all group"
//               >
//                 <CreditCard size={20} />
//                 <span className="font-black uppercase text-xs tracking-widest">
//                   Mercado Pago
//                 </span>
//               </button>
//               <button
//                 onClick={() => confirmPaymentAndComplete("pos")}
//                 className="flex items-center gap-4 w-full p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-600 hover:text-white rounded-2xl transition-all group"
//               >
//                 <CreditCard size={20} />
//                 <span className="font-black uppercase text-xs tracking-widest">
//                   POS / Tarjeta
//                 </span>
//               </button>
//             </div>
//             <button
//               onClick={() => setAppointmentToComplete(null)}
//               className="w-full mt-6 text-slate-400 font-bold uppercase text-[10px] tracking-widest"
//             >
//               Cerrar
//             </button>
//           </div>
//         </div>
//       )}

//       {/* MODAL NUEVA RESERVA */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
//           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
//             <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
//               <h3 className="font-black uppercase tracking-tight dark:text-white text-sm">
//                 Nueva Reserva
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
//                 placeholder="Nombre del cliente"
//               />
//               <input
//                 required
//                 name="clientPhone"
//                 className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white text-sm"
//                 placeholder="Teléfono"
//               />
//               <div className="grid grid-cols-2 gap-4">
//                 <input
//                   required
//                   name="time"
//                   type="time"
//                   className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
//                 />
//                 <select
//                   name="barberName"
//                   className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white text-xs"
//                 >
//                   {team.map((b) => (
//                     <option key={b.id} value={b.name}>
//                       {b.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white font-black uppercase py-5 rounded-2xl shadow-xl hover:bg-blue-700 transition-all tracking-widest text-xs"
//               >
//                 Agendar y Notificar
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Subcomponentes
// function StatCard({ title, value, change, icon, color }) {
//   const colors = {
//     emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
//     blue: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
//     violet: "text-violet-500 bg-violet-50 dark:bg-violet-500/10",
//     amber: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
//   };
//   return (
//     <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
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
//     <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.8rem] hover:border-blue-500 transition-all shadow-sm">
//       {/* Contenedor Superior: Hora e Info (En mobile se alinean horizontal) */}
//       <div className="flex items-center gap-4 flex-1 min-w-0">
//         {/* Hora */}
//         <div className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-3 rounded-2xl min-w-[70px] md:min-w-[80px] text-center shadow-inner">
//           <span className="text-xs font-black">{app.start}</span>
//         </div>

//         {/* Info del Cliente */}
//         <div className="flex-1 min-w-0">
//           <h5 className="font-black text-sm uppercase dark:text-white truncate leading-tight">
//             {app.customer}
//           </h5>
//           <div className="flex flex-wrap items-center gap-2 mt-1">
//             <p className="text-[10px] font-bold text-slate-400 uppercase">
//               Con <span className="text-blue-500">{app.barber}</span>
//             </p>
//             {app.phone && (
//               <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/20">
//                 {app.phone}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Acciones: En mobile abajo y ancho completo, en desktop a la derecha */}
//       <div className="flex items-center justify-between md:justify-end gap-2 pt-3 md:pt-0 border-t md:border-none border-slate-100 dark:border-slate-800">
//         {app.phone && (
//           <button
//             onClick={onReminder}
//             className="flex-1 md:flex-none flex justify-center p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
//             title="Recordar"
//           >
//             <MessageSquare size={16} strokeWidth={2.5} />
//           </button>
//         )}
//         <button
//           onClick={onComplete}
//           className="flex-1 md:flex-none flex justify-center p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
//         >
//           <CheckCircle2 size={16} strokeWidth={2.5} />
//         </button>
//         <button
//           onClick={onDelete}
//           className="flex-1 md:flex-none flex justify-center p-3 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
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
  BellRing,
  X,
  Search,
  ShieldCheck,
  Loader2,
  Phone,
  MessageSquare,
  Trash2,
  CheckCircle2,
  Zap,
  Check,
  CreditCard,
  Banknote,
  SmartphoneNfc,
  Lock, // Icono para el bloqueo
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function DashboardPage() {
  const router = useRouter();

  // --- ESTADOS ---
  const [barberiaData, setBarberiaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToComplete, setAppointmentToComplete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sentMessages, setSentMessages] = useState([]);

  // NUEVO: Estado para verificar si la barbería está inactiva
  const isInactive = barberiaData?.plan?.status === "inactive";

  const getTodayStr = () => new Date().toLocaleDateString("sv-SE");

  // --- UTILIDADES ---
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

  // --- 1. CARGA DE DATOS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "barberias", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBarberiaData(docSnap.data());
          }
        } catch (error) {
          console.error("Error al cargar datos:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // --- 2. ACCIONES DE CITA ---
  const handleAddAppointment = async (e) => {
    e.preventDefault();

    // BLOQUEO DE SEGURIDAD
    if (isInactive) {
      alert(
        "Acceso restringido: Debes regularizar tu pago para agendar nuevas citas."
      );
      return;
    }

    const formData = new FormData(e.target);
    const name = formData.get("clientName");
    const phone = formData.get("clientPhone");
    const time = formData.get("time");
    const uid = auth.currentUser?.uid;

    const newApp = {
      id: Date.now().toString(),
      customer: name,
      phone: phone,
      barber: formData.get("barberName"),
      service: "Servicio Rápido",
      start: time,
      date: getTodayStr(),
      status: "pending",
    };

    try {
      const barberiaRef = doc(db, "barberias", uid);
      const currentApps = barberiaData?.appointments || [];
      const newList = [...currentApps, newApp];
      await updateDoc(barberiaRef, { appointments: newList });
      setBarberiaData((prev) => ({ ...prev, appointments: newList }));
      setIsModalOpen(false);

      if (phone) {
        const formattedPhone = formatUruguayPhone(phone);
        const bookingLink = `https://barberias.vercel.app/reserva/${uid}`;
        const msg = encodeURIComponent(
          `Hola ${name}, confirmamos tu turno para hoy a las ${time}.\n\nReserva tu próximo turno aquí: ${bookingLink}`
        );
        window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
      }
    } catch (error) {
      alert("Error al guardar.");
    }
  };

  const confirmPaymentAndComplete = async (paymentMethod) => {
    if (!appointmentToComplete) return;
    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      const currentApps = barberiaData?.appointments || [];
      const newList = currentApps.map((app) =>
        String(app.id) === String(appointmentToComplete.id)
          ? {
              ...app,
              status: "done",
              paymentMethod: paymentMethod,
              paidAt: new Date().toISOString(),
            }
          : app
      );
      await updateDoc(barberiaRef, { appointments: newList });
      setBarberiaData((prev) => ({ ...prev, appointments: newList }));
      setAppointmentToComplete(null);
    } catch (error) {
      alert("Error al procesar el pago.");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("¿Eliminar reserva?")) return;
    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      const newList = barberiaData.appointments.filter(
        (app) => String(app.id) !== String(appointmentId)
      );
      await updateDoc(barberiaRef, { appointments: newList });
      setBarberiaData((prev) => ({ ...prev, appointments: newList }));
    } catch (error) {
      alert("Error al eliminar.");
    }
  };

  const handleSendReminder = (app) => {
    if (!app.phone) return;
    const formattedPhone = formatUruguayPhone(app.phone);
    const msg = encodeURIComponent(
      `Hola ${app.customer}, hoy te esperamos en la barbería a las ${app.start}. Tu turno ya está reservado. ¡Nos vemos! 💪💈`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
  };

  const { filteredAppointments, recallClients } = useMemo(() => {
    const allApps = barberiaData?.appointments || [];
    const hoyStr = getTodayStr();

    const today = allApps.filter(
      (app) => app.status === "pending" && app.date === hoyStr
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
          };
        }
      }
    });

    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 20);
    const recall = Object.values(lastVisits).filter(
      (client) => client.date < limitDate
    );

    const filtered = today
      .filter((app) =>
        (app.customer || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => (a.start || "").localeCompare(b.start || ""));

    return { filteredAppointments: filtered, recallClients: recall };
  }, [barberiaData, searchQuery]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  const team = barberiaData?.barbers || [];

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-slate-50 dark:bg-slate-950">
      <header className="flex-none bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 md:px-8 md:py-6">
        <div className="flex flex-col md:flex-row items-center gap-4 max-w-7xl mx-auto">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-3 md:py-2 rounded-2xl w-full md:max-w-md transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="bg-transparent border-none outline-none ml-3 text-sm w-full dark:text-white placeholder:text-slate-500 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* BOTÓN CON LÓGICA DE BLOQUEO */}
          <button
            onClick={() => {
              if (isInactive) {
                alert(
                  "🚫 Tu cuenta está inactiva. Regulariza tu situación en Ajustes para agendar nuevas citas."
                );
              } else {
                setIsModalOpen(true);
              }
            }}
            className={`w-full md:w-auto px-8 py-4 md:py-3 rounded-2xl font-black text-[11px] md:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isInactive
                ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed grayscale"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg shadow-blue-500/25"
            }`}
          >
            {isInactive ? (
              <Lock size={18} />
            ) : (
              <Plus size={18} className="md:hidden" />
            )}
            Nueva Reserva
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* BANNER DE AVISO SI ESTÁ INACTIVO */}
        {isInactive && (
          <div className="bg-red-500/10 border-2 border-dashed border-red-500/30 p-4 rounded-3xl flex items-center gap-4 animate-pulse">
            <div className="bg-red-500 text-white p-2 rounded-xl">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-red-600 tracking-widest">
                Cuenta Suspendida
              </p>
              <p className="text-[9px] font-bold text-red-500/80 uppercase">
                No puedes agregar nuevas citas hasta que se registre el pago.
              </p>
            </div>
          </div>
        )}

        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Hoy"
            value={filteredAppointments.length.toString()}
            change="Pendientes"
            icon={<Clock size={16} />}
            color="blue"
          />
          <StatCard
            title="Recall"
            value={recallClients.length.toString()}
            change="Inactivos"
            icon={<Zap size={16} />}
            color="amber"
          />
          <StatCard
            title="Staff"
            value={team.length.toString()}
            change="Barberos"
            icon={<UserPlus size={16} />}
            color="violet"
          />
          <StatCard
            title="Total"
            value={barberiaData?.appointments
              ?.filter((a) => a.status === "done")
              .length.toString()}
            change="Completados"
            icon={<Star size={16} />}
            color="emerald"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <BellRing size={14} className="text-blue-600" /> Agenda de hoy
            </h3>
            <div className="grid gap-3">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => (
                  <AppointmentItem
                    key={app.id}
                    app={app}
                    onDelete={() => handleDeleteAppointment(app.id)}
                    onComplete={() => setAppointmentToComplete(app)}
                    onReminder={() => handleSendReminder(app)}
                  />
                ))
              ) : (
                <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    No hay citas para hoy
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> Marketing automático
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
              {recallClients.length > 0 ? (
                recallClients.slice(0, 5).map((client) => {
                  const isSent = sentMessages.includes(client.id);
                  return (
                    <div
                      key={client.id}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                        isSent
                          ? "opacity-30 grayscale"
                          : "bg-slate-50 dark:bg-slate-800/50 shadow-sm"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="text-[11px] font-black uppercase dark:text-white truncate">
                          {client.name}
                        </p>
                        <p className="text-[8px] font-bold text-amber-500 uppercase tracking-tighter">
                          Vino el: {client.date.toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const formatted = formatUruguayPhone(client.phone);
                          const bookingLink = `https://barberias.vercel.app/reserva/${auth.currentUser?.uid}`;
                          const msg = encodeURIComponent(
                            `¡Hola ${client.name}!💈 Te extrañamos en la barbería. ¿Reservamos un lugar?\n\nAgendate aquí: ${bookingLink}`
                          );
                          window.open(
                            `https://wa.me/${formatted}?text=${msg}`,
                            "_blank"
                          );
                          setSentMessages([...sentMessages, client.id]);
                        }}
                        className={`p-2.5 rounded-xl ${
                          isSent
                            ? "bg-slate-200"
                            : "bg-emerald-500 text-white shadow-lg"
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
                <p className="text-[9px] font-bold text-slate-400 uppercase text-center py-2">
                  Todos tus clientes han vuelto
                </p>
              )}
            </div>

            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Staff Activo
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
              {team.length > 0 ? (
                team.map((barber, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center font-black text-blue-600 text-xs uppercase overflow-hidden">
                      {barber.imageUrl ? (
                        <img
                          src={barber.imageUrl}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        barber.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase dark:text-white leading-tight">
                        {barber.name}
                      </p>
                      <p className="text-[8px] font-black uppercase text-emerald-500">
                        En línea
                      </p>
                    </div>
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
                ))
              ) : (
                <p className="text-[9px] font-bold text-slate-400 uppercase text-center py-2">
                  No hay staff configurado
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE PAGO */}
      {appointmentToComplete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800">
            <div className="text-center mb-8">
              <div className="bg-emerald-100 dark:bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black uppercase dark:text-white">
                Finalizar Cita
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase mt-1">
                Método de pago
              </p>
            </div>
            <div className="grid gap-3">
              <button
                onClick={() => confirmPaymentAndComplete("cash")}
                className="flex items-center gap-4 w-full p-4 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all group"
              >
                <Banknote size={20} />
                <span className="font-black uppercase text-xs tracking-widest">
                  Efectivo
                </span>
              </button>
              <button
                onClick={() => confirmPaymentAndComplete("transfer")}
                className="flex items-center gap-4 w-full p-4 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded-2xl transition-all group"
              >
                <SmartphoneNfc size={20} />
                <span className="font-black uppercase text-xs tracking-widest">
                  Transferencia
                </span>
              </button>
              <button
                onClick={() => confirmPaymentAndComplete("mp")}
                className="flex items-center gap-4 w-full p-4 bg-slate-50 dark:bg-slate-800 hover:bg-violet-600 hover:text-white rounded-2xl transition-all group"
              >
                <CreditCard size={20} />
                <span className="font-black uppercase text-xs tracking-widest">
                  Mercado Pago
                </span>
              </button>
              <button
                onClick={() => confirmPaymentAndComplete("pos")}
                className="flex items-center gap-4 w-full p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-600 hover:text-white rounded-2xl transition-all group"
              >
                <CreditCard size={20} />
                <span className="font-black uppercase text-xs tracking-widest">
                  POS / Tarjeta
                </span>
              </button>
            </div>
            <button
              onClick={() => setAppointmentToComplete(null)}
              className="w-full mt-6 text-slate-400 font-bold uppercase text-[10px] tracking-widest"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL NUEVA RESERVA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-black uppercase tracking-tight dark:text-white text-sm">
                Nueva Reserva
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-8 space-y-4">
              <input
                required
                name="clientName"
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white text-sm"
                placeholder="Nombre del cliente"
              />
              <input
                required
                name="clientPhone"
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white text-sm"
                placeholder="Teléfono"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="time"
                  type="time"
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
                />
                <select
                  name="barberName"
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white text-xs"
                >
                  {team.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-black uppercase py-5 rounded-2xl shadow-xl hover:bg-blue-700 transition-all tracking-widest text-xs"
              >
                Agendar y Notificar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponentes
function StatCard({ title, value, change, icon, color }) {
  const colors = {
    emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
    violet: "text-violet-500 bg-violet-50 dark:bg-violet-500/10",
    amber: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div>
      </div>
      <h4 className="text-3xl font-black dark:text-white tracking-tighter">
        {value}
      </h4>
      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
        {change}
      </p>
    </div>
  );
}

function AppointmentItem({ app, onDelete, onComplete, onReminder }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.8rem] hover:border-blue-500 transition-all shadow-sm">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-3 rounded-2xl min-w-[70px] md:min-w-[80px] text-center shadow-inner">
          <span className="text-xs font-black">{app.start}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-black text-sm uppercase dark:text-white truncate leading-tight">
            {app.customer}
          </h5>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Con <span className="text-blue-500">{app.barber}</span>
            </p>
            {app.phone && (
              <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                {app.phone}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between md:justify-end gap-2 pt-3 md:pt-0 border-t md:border-none border-slate-100 dark:border-slate-800">
        {app.phone && (
          <button
            onClick={onReminder}
            className="flex-1 md:flex-none flex justify-center p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            title="Recordar"
          >
            <MessageSquare size={16} strokeWidth={2.5} />
          </button>
        )}
        <button
          onClick={onComplete}
          className="flex-1 md:flex-none flex justify-center p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
        >
          <CheckCircle2 size={16} strokeWidth={2.5} />
        </button>
        <button
          onClick={onDelete}
          className="flex-1 md:flex-none flex justify-center p-3 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
        >
          <Trash2 size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
