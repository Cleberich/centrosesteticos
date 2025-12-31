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
//   const [searchQuery, setSearchQuery] = useState("");

//   // Obtener fecha de hoy en formato YYYY-MM-DD
//   const getTodayStr = () => new Date().toLocaleDateString("sv-SE");

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

//   // --- 2. LÓGICA DE AGREGAR CITA ---
//   const handleAddAppointment = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const name = formData.get("clientName");
//     const phone = formData.get("clientPhone");
//     const time = formData.get("time");

//     const newApp = {
//       id: Date.now().toString(),
//       customer: name,
//       phone: phone,
//       email: formData.get("clientEmail") || "",
//       barber: formData.get("barberName"),
//       selectedServiceIds: [],
//       service: "Servicio Rápido",
//       start: time,
//       date: getTodayStr(), // ASIGNA LA FECHA DE HOY
//       day: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
//       status: "pending",
//       duration: 30,
//     };

//     try {
//       const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
//       const currentApps = barberiaData?.appointments || [];
//       const newList = [...currentApps, newApp];

//       await updateDoc(barberiaRef, { appointments: newList });
//       setBarberiaData((prev) => ({ ...prev, appointments: newList }));
//       setIsModalOpen(false);

//       if (phone) {
//         const cleanPhone = phone.replace(/\D/g, "");
//         const msg = encodeURIComponent(
//           `Hola ${name}, confirmamos tu turno para hoy a las ${time}. ¡Te esperamos!`
//         );
//         window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
//       }
//     } catch (error) {
//       alert("Error al guardar la cita.");
//     }
//   };

//   // --- 3. LÓGICA DE ELIMINAR CITA ---
//   const handleDeleteAppointment = async (appointmentId) => {
//     if (!window.confirm("¿Estás seguro de que deseas eliminar esta reserva?"))
//       return;

//     try {
//       const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
//       const currentApps = barberiaData?.appointments || [];
//       const newList = currentApps.filter(
//         (app) => String(app.id) !== String(appointmentId)
//       );

//       await updateDoc(barberiaRef, { appointments: newList });
//       setBarberiaData((prev) => ({ ...prev, appointments: newList }));
//     } catch (error) {
//       alert("Error al eliminar la reserva.");
//     }
//   };

//   const { filteredAppointments, activeTodayCount } = useMemo(() => {
//     const allApps = barberiaData?.appointments || [];
//     const hoy = new Date();
//     const hoyStr = hoy.toLocaleDateString("sv-SE"); // "2025-12-30"
//     const hoyIndex = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1; // Lunes=0, Martes=1...

//     const todayPending = allApps.filter((app) => {
//       if (app.status !== "pending") return false;

//       // REGLA 1: Si tiene fecha (date), comparamos por fecha
//       if (app.date) {
//         return app.date.substring(0, 10) === hoyStr;
//       }

//       // REGLA 2: Si no tiene fecha (viejas de Calendar), usamos el índice del día
//       // Esto hará que las citas viejas aparezcan cada martes
//       return app.day === hoyIndex;
//     });

//     const filtered = todayPending
//       .filter((app) =>
//         (app.customer || "").toLowerCase().includes(searchQuery.toLowerCase())
//       )
//       .sort((a, b) => (a.start || "").localeCompare(b.start || ""));

//     return {
//       filteredAppointments: filtered,
//       activeTodayCount: todayPending.length,
//     };
//   }, [barberiaData, searchQuery]);
//   // --- LÓGICA DE FILTRADO PARA UNIFICAR CALENDAR Y DASHBOARD ---

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
//         <Loader2 className="text-blue-600 animate-spin" size={40} />
//       </div>
//     );

//   const team = barberiaData?.barbers || [];

//   return (
//     <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
//       <header className="flex-none flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
//         <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl w-full max-w-md border border-transparent focus-within:border-blue-500 transition-all">
//           <Search size={18} className="text-slate-400" />
//           <input
//             type="text"
//             placeholder="Buscar cliente de hoy..."
//             className="bg-transparent border-none outline-none ml-3 text-sm w-full dark:text-white font-medium"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-all font-black text-xs uppercase tracking-widest ml-4"
//         >
//           <Plus size={18} /> Nueva Reserva
//         </button>
//       </header>

//       <div className="flex-1 overflow-y-auto p-8 space-y-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             title="Pendientes Hoy"
//             value={activeTodayCount.toString()}
//             change={getTodayStr()}
//             icon={<Clock size={16} />}
//             color="blue"
//           />
//           <StatCard
//             title="Suscripción"
//             value={barberiaData?.plan?.type || "Gratis"}
//             change={
//               barberiaData?.plan?.status === "active" ? "ACTIVO" : "PENDIENTE"
//             }
//             icon={<ShieldCheck size={16} />}
//             color="emerald"
//           />
//           <StatCard
//             title="Staff"
//             value={team.length.toString()}
//             change="Barberos"
//             icon={<UserPlus size={16} />}
//             color="violet"
//           />
//           <StatCard
//             title="Servicios"
//             value={barberiaData?.services?.length || "0"}
//             change="Activos"
//             icon={<Star size={16} />}
//             color="amber"
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 ml-2">
//               <BellRing size={14} className="text-blue-600" /> Próximas citas de
//               hoy
//             </h3>

//             <div className="grid gap-3">
//               {filteredAppointments.length > 0 ? (
//                 filteredAppointments.map((app) => (
//                   <AppointmentItem
//                     key={app.id}
//                     app={app}
//                     onDelete={() => handleDeleteAppointment(app.id)}
//                   />
//                 ))
//               ) : (
//                 <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
//                   <p className="text-slate-500 font-bold text-sm">
//                     No hay citas pendientes para hoy
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="space-y-6">
//             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
//               Staff en línea
//             </h3>
//             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
//               {team.length > 0 ? (
//                 team.map((barber, idx) => (
//                   <StaffItem
//                     key={idx}
//                     name={barber.name}
//                     imageUrl={barber.imageUrl}
//                     status={barber.active ? "En turno" : "Fuera"}
//                   />
//                 ))
//               ) : (
//                 <p className="text-[10px] font-bold text-slate-400 text-center py-4">
//                   Sin personal configurado
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
//           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
//             <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
//               <h3 className="font-black uppercase tracking-tight dark:text-white">
//                 Agendado Rápido
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full dark:text-white"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleAddAppointment} className="p-8 space-y-4">
//               <input
//                 required
//                 name="clientName"
//                 className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
//                 placeholder="Nombre del Cliente"
//               />
//               <div className="grid grid-cols-2 gap-3">
//                 <input
//                   required
//                   name="clientPhone"
//                   type="tel"
//                   className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white text-sm"
//                   placeholder="Teléfono"
//                 />
//                 <input
//                   name="clientEmail"
//                   type="email"
//                   className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white text-sm"
//                   placeholder="Email (Opcional)"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <input
//                   required
//                   name="time"
//                   type="time"
//                   className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
//                 />
//                 <select
//                   name="barberName"
//                   className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
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
//                 className="w-full bg-blue-600 text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all mt-4 tracking-widest text-xs"
//               >
//                 Confirmar y Avisar WhatsApp
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // --- SUBCOMPONENTES ---

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
//       <h4 className="text-3xl font-black uppercase dark:text-white tracking-tighter">
//         {value}
//       </h4>
//       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//         {change}
//       </p>
//     </div>
//   );
// }

// function AppointmentItem({ app, onDelete }) {
//   const { customer, phone, service, barber, start } = app;
//   const cleanPhone = phone ? phone.replace(/\D/g, "") : "";
//   const wsMessage = encodeURIComponent(
//     `Hola ${customer}, confirmamos tu turno para hoy a las ${start}. ¡Te esperamos!`
//   );

//   return (
//     <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.8rem] hover:border-blue-500 transition-all shadow-sm">
//       <div className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-3 rounded-2xl min-w-[80px] text-center shadow-inner">
//         <span className="text-xs font-black">{start}</span>
//       </div>
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2">
//           <h5 className="font-black text-sm uppercase dark:text-white leading-none truncate">
//             {customer}
//           </h5>
//           {phone && (
//             <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-lg whitespace-nowrap">
//               {phone}
//             </span>
//           )}
//         </div>
//         <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 truncate">
//           {service || "Corte"} con{" "}
//           <span className="text-green-500">{barber}</span>
//         </p>
//       </div>
//       <div className="flex items-center gap-2">
//         {phone && (
//           <>
//             <a
//               href={`tel:${cleanPhone}`}
//               className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
//             >
//               <Phone size={16} strokeWidth={3} />
//             </a>
//             <a
//               href={`https://wa.me/${cleanPhone}?text=${wsMessage}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
//             >
//               <MessageSquare size={16} strokeWidth={3} />
//             </a>
//           </>
//         )}
//         <button
//           onClick={onDelete}
//           className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
//         >
//           <Trash2 size={16} strokeWidth={3} />
//         </button>
//       </div>
//     </div>
//   );
// }

// function StaffItem({ name, status, imageUrl }) {
//   return (
//     <div className="flex items-center gap-3 p-2">
//       <div className="size-10 rounded-2xl overflow-hidden bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm">
//         {imageUrl ? (
//           <img
//             src={imageUrl}
//             alt={name}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <span className="font-black text-blue-600 uppercase text-xs">
//             {name.charAt(0)}
//           </span>
//         )}
//       </div>
//       <div className="flex-1">
//         <p className="text-xs font-black uppercase dark:text-white leading-tight">
//           {name}
//         </p>
//         <p
//           className={`text-[8px] font-black uppercase tracking-tighter ${
//             status === "En turno" ? "text-emerald-500" : "text-slate-400"
//           }`}
//         >
//           {status}
//         </p>
//       </div>
//       {status === "En turno" && (
//         <div className="size-2 rounded-full bg-emerald-500 shadow-lg animate-pulse"></div>
//       )}
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
  Award,
  TrendingUp,
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
  const [searchQuery, setSearchQuery] = useState("");

  const getTodayStr = () => new Date().toLocaleDateString("sv-SE");

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

  // --- 2. LÓGICA DE AGREGAR CITA ---
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("clientName");
    const phone = formData.get("clientPhone");
    const time = formData.get("time");

    const newApp = {
      id: Date.now().toString(),
      customer: name,
      phone: phone,
      email: formData.get("clientEmail") || "",
      barber: formData.get("barberName"),
      selectedServiceIds: [],
      service: "Servicio Rápido",
      start: time,
      date: getTodayStr(),
      day: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
      status: "pending",
      duration: 30,
    };

    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      const currentApps = barberiaData?.appointments || [];
      const newList = [...currentApps, newApp];

      await updateDoc(barberiaRef, { appointments: newList });
      setBarberiaData((prev) => ({ ...prev, appointments: newList }));
      setIsModalOpen(false);

      if (phone) {
        const cleanPhone = phone.replace(/\D/g, "");
        const msg = encodeURIComponent(
          `Hola ${name}, confirmamos tu turno para hoy a las ${time}. ¡Te esperamos!`
        );
        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
      }
    } catch (error) {
      alert("Error al guardar la cita.");
    }
  };

  // --- 3. LÓGICA DE COMPLETAR CITA (Ajustado a status: "done") ---
  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      const currentApps = barberiaData?.appointments || [];
      const newList = currentApps.map((app) =>
        String(app.id) === String(appointmentId)
          ? { ...app, status: "done", paidAt: new Date().toISOString() }
          : app
      );

      await updateDoc(barberiaRef, { appointments: newList });
      setBarberiaData((prev) => ({ ...prev, appointments: newList }));
    } catch (error) {
      alert("Error al finalizar la cita.");
    }
  };

  // --- 4. LÓGICA DE ELIMINAR CITA ---
  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta reserva?"))
      return;
    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      const currentApps = barberiaData?.appointments || [];
      const newList = currentApps.filter(
        (app) => String(app.id) !== String(appointmentId)
      );
      await updateDoc(barberiaRef, { appointments: newList });
      setBarberiaData((prev) => ({ ...prev, appointments: newList }));
    } catch (error) {
      alert("Error al eliminar la reserva.");
    }
  };

  // --- 5. INTELIGENCIA DE MARKETING (Basado en tu estructura) ---
  const { filteredAppointments, activeTodayCount, recallClients } =
    useMemo(() => {
      const allApps = barberiaData?.appointments || [];
      const hoyStr = getTodayStr();

      // Filtro para la lista principal (Hoy)
      const todayPending = allApps.filter(
        (app) => app.status === "pending" && app.date === hoyStr
      );

      // LÓGICA SMART RECALL (20 días de inactividad)
      const lastVisits = {};
      allApps.forEach((app) => {
        // Usamos "done" que es tu status de completado
        if (app.status === "done" && app.phone) {
          const appDate = new Date(app.date);
          if (!lastVisits[app.phone] || appDate > lastVisits[app.phone].date) {
            lastVisits[app.phone] = {
              name: app.customer,
              date: appDate,
              phone: app.phone,
            };
          }
        }
      });

      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - 20);

      const recall = Object.values(lastVisits)
        .filter((client) => client.date < limitDate)
        .sort((a, b) => b.date - a.date); // Los más antiguos primero

      const filtered = todayPending
        .filter((app) =>
          (app.customer || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => (a.start || "").localeCompare(b.start || ""));

      return {
        filteredAppointments: filtered,
        activeTodayCount: todayPending.length,
        recallClients: recall,
      };
    }, [barberiaData, searchQuery]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="text-blue-600 animate-spin" size={40} />
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl w-full max-w-md border border-transparent focus-within:border-blue-500 transition-all">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar cliente de hoy..."
            className="bg-transparent border-none outline-none ml-3 text-sm w-full dark:text-white font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-all font-black text-xs uppercase tracking-widest ml-4"
        >
          <Plus size={18} /> Nueva Reserva
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Pendientes Hoy"
            value={activeTodayCount.toString()}
            change="Citas"
            icon={<Clock size={16} />}
            color="blue"
          />
          <StatCard
            title="Smart Recall"
            value={recallClients.length.toString()}
            change="Clientes inactivos"
            icon={<Zap size={16} />}
            color="amber"
          />
          <StatCard
            title="Suscripción"
            value={barberiaData?.plan?.type || "Básica"}
            change="Estado Activo"
            icon={<ShieldCheck size={16} />}
            color="emerald"
          />
          <StatCard
            title="Staff"
            value={barberiaData?.barbers?.length.toString() || "0"}
            change="Barberos"
            icon={<UserPlus size={16} />}
            color="violet"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 ml-2">
              <BellRing size={14} className="text-blue-600" /> Agenda del día
            </h3>

            <div className="grid gap-3">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => (
                  <AppointmentItem
                    key={app.id}
                    app={app}
                    onDelete={() => handleDeleteAppointment(app.id)}
                    onComplete={() => handleCompleteAppointment(app.id)}
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 font-bold text-sm">
                    No hay citas para hoy
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR DE MARKETING */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> Smart Recall
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-tighter">
                Clientes que no vuelven hace +20 días:
              </p>
              {recallClients.length > 0 ? (
                recallClients.slice(0, 5).map((client, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl"
                  >
                    <div className="truncate pr-2">
                      <p className="text-[11px] font-black uppercase dark:text-white truncate">
                        {client.name}
                      </p>
                      <p className="text-[8px] font-bold text-amber-500 uppercase tracking-tighter">
                        Vino el: {client.date.toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${client.phone.replace(
                        /\D/g,
                        ""
                      )}?text=${encodeURIComponent(
                        `¡Hola ${client.name}! Notamos que hace tiempo no pasas por la barbería. ¿Te gustaría agendar un lugar para esta semana?`
                      )}`}
                      target="_blank"
                      className="p-2.5 bg-emerald-500 text-white rounded-xl hover:scale-110 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <MessageSquare size={14} />
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-[10px] font-bold text-slate-400 text-center py-4 uppercase">
                  Base de clientes al día
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL SIMPLIFICADO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-black uppercase tracking-tight dark:text-white">
                Nueva Cita Rápida
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="dark:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-8 space-y-4">
              <input
                required
                name="clientName"
                className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 py-4 font-bold dark:text-white"
                placeholder="Nombre"
              />
              <input
                required
                name="clientPhone"
                className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 py-4 font-bold dark:text-white"
                placeholder="Celular"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="time"
                  type="time"
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 py-4 font-bold dark:text-white"
                />
                <select
                  name="barberName"
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-5 py-4 font-bold dark:text-white"
                >
                  {barberiaData?.barbers?.map((b) => (
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

function StatCard({ title, value, change, icon, color }) {
  const colors = {
    emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
    violet: "text-violet-500 bg-violet-50 dark:bg-violet-500/10",
    amber: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div>
      </div>
      <h4 className="text-3xl font-black dark:text-white tracking-tighter">
        {value}
      </h4>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
        {change}
      </p>
    </div>
  );
}

function AppointmentItem({ app, onDelete, onComplete }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.8rem] hover:border-blue-500 transition-all shadow-sm">
      <div className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-3 rounded-2xl min-w-[80px] text-center">
        <span className="text-xs font-black">{app.start}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="font-black text-sm uppercase dark:text-white truncate">
          {app.customer}
        </h5>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 truncate">
          {app.service} con <span className="text-blue-500">{app.barber}</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onComplete}
          title="Marcar como realizado"
          className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
        >
          <CheckCircle2 size={16} strokeWidth={3} />
        </button>
        <button
          onClick={onDelete}
          className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
        >
          <Trash2 size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
