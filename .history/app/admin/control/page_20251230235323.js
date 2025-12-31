// "use client";

// import React, { useState, useEffect } from "react";
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc,
//   Timestamp,
// } from "firebase/firestore";
// import {
//   ShieldCheck,
//   Search,
//   ExternalLink,
//   Loader2,
//   AlertOctagon,
//   CheckCircle2,
//   CreditCard,
//   Calendar,
//   Lock,
//   Edit2,
//   X,
//   Users,
//   BookmarkCheck,
// } from "lucide-react";

// export default function SuperAdminPage() {
//   const [user, setUser] = useState(null);
//   const [barberias, setBarberias] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [editingBarberia, setEditingBarberia] = useState(null);
//   const [newLastPayment, setNewLastPayment] = useState("");

//   const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

//   const convertToDate = (dateValue) => {
//     if (!dateValue) return null;
//     if (typeof dateValue.toDate === "function") return dateValue.toDate();
//     if (dateValue.seconds) return new Date(dateValue.seconds * 1000);
//     return new Date(dateValue);
//   };

//   const formatDate = (dateValue) => {
//     const date = convertToDate(dateValue);
//     if (!date || isNaN(date.getTime())) return "--/--/----";
//     return date.toLocaleDateString("es-ES", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const isPaymentValid = (lastPayment) => {
//     const date = convertToDate(lastPayment);
//     if (!date) return false;
//     const today = new Date();
//     const diffInDays = (today.getTime() - date.getTime()) / (1000 * 3600 * 24);
//     return diffInDays <= 30 && diffInDays >= 0;
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser && currentUser.email === ADMIN_EMAIL) {
//         setUser(currentUser);
//         setIsAuthorized(true);
//         await fetchBarberias();
//       } else {
//         setIsAuthorized(false);
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const fetchBarberias = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "barberias"));
//       const docs = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setBarberias(docs);
//     } catch (error) {
//       console.error("Error cargando barberías:", error);
//     }
//   };

//   const handleManualUpdate = async (e) => {
//     e.preventDefault();
//     if (!editingBarberia || !newLastPayment) return;

//     try {
//       const lastPayDate = new Date(newLastPayment);
//       const nextPayDate = new Date(lastPayDate);
//       nextPayDate.setDate(lastPayDate.getDate() + 30);

//       const docRef = doc(db, "barberias", editingBarberia.id);
//       await updateDoc(docRef, {
//         "plan.lastPayment": Timestamp.fromDate(lastPayDate),
//         "plan.nextPayment": Timestamp.fromDate(nextPayDate),
//         "plan.paymentStatus": "paid",
//       });

//       setEditingBarberia(null);
//       await fetchBarberias();
//       alert("Barbería actualizada correctamente");
//     } catch (error) {
//       alert("Error al actualizar");
//     }
//   };

//   const filteredBarberias = barberias.filter(
//     (b) =>
//       b.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       b.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center bg-[#0a0f1a]">
//         <Loader2 className="animate-spin text-blue-500" size={40} />
//       </div>
//     );

//   if (!isAuthorized)
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-[#0a0f1a] p-6 text-center">
//         <Lock className="text-red-500 mb-6" size={40} />
//         <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
//           Acceso Denegado
//         </h1>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#0a0f1a] text-slate-100 p-6 md:p-12 relative">
//       <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
//         <div>
//           <div className="flex items-center gap-2 mb-2">
//             <ShieldCheck className="text-blue-500" size={20} />
//             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
//               Super Admin Panel
//             </span>
//           </div>
//           <h1 className="text-4xl font-black uppercase tracking-tighter  text-white">
//             Gestión de <span className="text-blue-500">Barberias</span>
//           </h1>
//         </div>
//         <div className="relative group">
//           <Search
//             className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
//             size={18}
//           />
//           <input
//             placeholder="BUSCAR..."
//             className="bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-6 w-full md:w-80 text-xs font-bold outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 gap-4">
//           {/* HEADER DE TABLA */}
//           <div className="hidden md:grid grid-cols-7 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
//             <span>Barbería / Info</span>
//             <span>Estadísticas</span>
//             <span>Plan</span>
//             <span>Estado</span>
//             <span>Último Pago</span>
//             <span>Próximo Venc.</span>
//             <span className="text-right">Acciones</span>
//           </div>

//           {filteredBarberias.map((b) => {
//             const isPaid =
//               b.plan?.paymentStatus === "paid" ||
//               isPaymentValid(b.plan?.lastPayment);

//             // ACCESO A LOS ARRAYS: Contamos los barberos y las citas
//             const totalBarberos = Array.isArray(b.barbers)
//               ? b.barbers.length
//               : 0;
//             const totalCitas = Array.isArray(b.appointments)
//               ? b.appointments.length
//               : 0;

//             return (
//               <div
//                 key={b.id}
//                 className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-6 md:px-8 flex flex-col md:grid md:grid-cols-7 items-center gap-6 hover:border-blue-500/30 transition-all"
//               >
//                 {/* 1. Nombre e Imagen */}
//                 <div className="flex items-center gap-4 w-full truncate">
//                   <div className="size-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
//                     {b.logo ? (
//                       <img
//                         src={b.logo}
//                         className="w-full aspect-square rounded-lg object-cover"
//                       />
//                     ) : (
//                       <span className="font-black text-blue-500">
//                         {b.businessName?.[0]}
//                       </span>
//                     )}
//                   </div>
//                   <div className="truncate text-left">
//                     <p className="font-black uppercase text-xs text-white truncate">
//                       {b.businessName}
//                     </p>
//                     <p className="text-[9px] text-slate-500 font-bold truncate">
//                       {b.email}
//                     </p>
//                   </div>
//                 </div>

//                 {/* 2. Estadísticas desde los ARRAYS */}
//                 <div className="w-full flex gap-4">
//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">
//                       Barberos
//                     </span>
//                     <div className="flex items-center gap-1 text-xs font-black text-white">
//                       <Users size={12} className="text-blue-500" />{" "}
//                       {totalBarberos}
//                     </div>
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">
//                       Citas
//                     </span>
//                     <div className="flex items-center gap-1 text-xs font-black text-white">
//                       <BookmarkCheck size={12} className="text-emerald-500" />{" "}
//                       {totalCitas}
//                     </div>
//                   </div>
//                 </div>

//                 {/* 3. Plan */}
//                 <div className="w-full text-[10px] font-black uppercase text-blue-400">
//                   {b.plan?.type || "Básico"}
//                 </div>

//                 {/* 4. Estado de Pago */}
//                 <div className="w-full">
//                   <span
//                     className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
//                       isPaid
//                         ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
//                         : "text-amber-500 border-amber-500/20 bg-amber-500/5"
//                     }`}
//                   >
//                     {isPaid ? "ACTIVO" : "PENDIENTE"}
//                   </span>
//                 </div>

//                 {/* 5. Último Pago */}
//                 <div className="w-full text-[11px] font-bold text-slate-400">
//                   {formatDate(b.plan?.lastPayment)}
//                 </div>

//                 {/* 6. Próximo Pago */}
//                 <div className="w-full text-[11px] font-bold text-white">
//                   {formatDate(b.plan?.nextPayment)}
//                 </div>

//                 {/* 7. Botones */}
//                 <div className="flex justify-end w-full gap-2">
//                   <button
//                     onClick={() => {
//                       setEditingBarberia(b);
//                       setNewLastPayment("");
//                     }}
//                     className="p-3 bg-slate-800 border border-white/5 hover:border-blue-500 rounded-xl transition-all"
//                   >
//                     <Edit2 size={16} className="text-slate-400" />
//                   </button>
//                   <a
//                     href={`/reserva/${b.id}`}
//                     target="_blank"
//                     className="p-3 bg-slate-800 border border-white/5 hover:bg-blue-600 rounded-xl transition-all text-slate-400 hover:text-white"
//                   >
//                     <ExternalLink size={16} />
//                   </a>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </main>

//       {/* MODAL DE EDICIÓN MANUAL */}
//       {editingBarberia && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
//           <div
//             className="absolute inset-0 bg-black/80 backdrop-blur-sm"
//             onClick={() => setEditingBarberia(null)}
//           ></div>
//           <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 relative z-10 shadow-2xl animate-in zoom-in-95">
//             <button
//               onClick={() => setEditingBarberia(null)}
//               className="absolute right-6 top-6 text-slate-500 hover:text-white"
//             >
//               <X size={20} />
//             </button>
//             <h3 className="text-xl font-black uppercase italic mb-2 text-white">
//               Editar <span className="text-blue-500">Pago</span>
//             </h3>
//             <p className="text-slate-400 text-[10px] font-bold uppercase mb-6 tracking-widest">
//               {editingBarberia.businessName}
//             </p>
//             <form onSubmit={handleManualUpdate} className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">
//                   Fecha del último pago
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   className="w-full bg-slate-800 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 ring-blue-600 transition-all appearance-none"
//                   style={{ colorScheme: "dark" }}
//                   onChange={(e) => setNewLastPayment(e.target.value)}
//                 />
//                 <p className="text-[9px] text-blue-500/70 font-bold uppercase ml-1 tracking-tighter">
//                   * Actualiza automáticamente el vencimiento a +30 días.
//                 </p>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20"
//               >
//                 Guardar Cambios
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import {
  ShieldCheck,
  Search,
  ExternalLink,
  Loader2,
  Lock,
  Edit2,
  X,
  Users,
  BookmarkCheck,
  Clock,
  TrendingUp,
  DollarSign,
  Calendar,
  ChevronRight,
} from "lucide-react";

export default function SuperAdminPage() {
  const [user, setUser] = useState(null);
  const [barberias, setBarberias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingBarberia, setEditingBarberia] = useState(null);
  const [newLastPayment, setNewLastPayment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const convertToDate = (dateValue) => {
    if (!dateValue) return null;
    if (typeof dateValue.toDate === "function") return dateValue.toDate();
    if (dateValue.seconds) return new Date(dateValue.seconds * 1000);
    return new Date(dateValue);
  };

  const formatDate = (dateValue) => {
    const date = convertToDate(dateValue);
    if (!date || isNaN(date.getTime())) return "--/--/----";
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isPaymentValid = (lastPayment) => {
    const date = convertToDate(lastPayment);
    if (!date) return false;
    const today = new Date();
    const diffInDays = (today.getTime() - date.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 30 && diffInDays >= 0;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setUser(currentUser);
        setIsAuthorized(true);
        await fetchBarberias();
      } else {
        setIsAuthorized(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchBarberias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "barberias"));
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedDocs = docs.sort((a, b) => {
        const dateA = convertToDate(a.createdAt) || new Date(0);
        const dateB = convertToDate(b.createdAt) || new Date(0);
        return dateB - dateA;
      });

      setBarberias(sortedDocs);
    } catch (error) {
      console.error("Error cargando barberías:", error);
    }
  };

  const handleManualUpdate = async (e) => {
    e.preventDefault();
    if (!editingBarberia || !newLastPayment) return;

    setIsUpdating(true);
    try {
      const lastPayDate = new Date(newLastPayment);
      const nextPayDate = new Date(lastPayDate);
      nextPayDate.setDate(lastPayDate.getDate() + 30);

      const docRef = doc(db, "barberias", editingBarberia.id);
      await updateDoc(docRef, {
        "plan.lastPayment": Timestamp.fromDate(lastPayDate),
        "plan.nextPayment": Timestamp.fromDate(nextPayDate),
        "plan.paymentStatus": "paid",
      });

      setEditingBarberia(null);
      await fetchBarberias();
    } catch (error) {
      alert("Error al actualizar");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredBarberias = barberias.filter(
    (b) =>
      b.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  if (!isAuthorized)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0f1a] p-6 text-center">
        <Lock className="text-red-500 mb-6" size={40} />
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
          Acceso Denegado
        </h1>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-100 p-6 md:p-12 relative">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-blue-500" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              Super Admin Control
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Panel <span className="text-blue-500">Maestro</span>
          </h1>
          <p className="text-slate-500 text-[9px] font-black uppercase mt-1 tracking-widest">
            {barberias.length} locales conectados
          </p>
        </div>
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            placeholder="BUSCAR LOCAL..."
            className="bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-6 w-full md:w-80 text-xs font-bold outline-none focus:border-blue-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-3">
          {/* HEADER TABLA */}
          <div className="hidden md:grid grid-cols-7 px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
            <span className="col-span-2">Barbería / Registro</span>
            <span>Plan</span>
            <span>Estado Pago</span>
            <span>Último Pago</span>
            <span>Vencimiento</span>
            <span className="text-right pr-4">Gestión</span>
          </div>

          {filteredBarberias.map((b) => {
            const isPaid =
              b.plan?.paymentStatus === "paid" ||
              isPaymentValid(b.plan?.lastPayment);

            return (
              <div
                key={b.id}
                className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-5 md:px-8 flex flex-col md:grid md:grid-cols-7 items-center gap-6 hover:bg-slate-900/60 transition-all border-l-4 border-l-transparent hover:border-l-blue-500 group"
              >
                <div className="col-span-2 flex items-center gap-4 w-full">
                  <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-blue-500/50 transition-all overflow-hidden">
                    {b.logo ? (
                      <img
                        src={b.logo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-black text-blue-500">
                        {b.businessName?.[0]}
                      </span>
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-black uppercase text-xs text-white truncate leading-none mb-1.5">
                      {b.businessName}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase">
                      <Clock size={10} /> {formatDate(b.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="w-full text-[10px] font-black uppercase text-blue-400/80">
                  {b.plan?.type || "Básico"}
                </div>

                <div className="w-full">
                  <span
                    className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
                      isPaid
                        ? "text-emerald-500 bg-emerald-500/10"
                        : "text-amber-500 bg-amber-500/10"
                    }`}
                  >
                    {isPaid ? "Activo" : "Pendiente"}
                  </span>
                </div>

                <div className="w-full text-[11px] font-bold text-slate-500">
                  {formatDate(b.plan?.lastPayment)}
                </div>

                <div className="w-full text-[11px] font-bold text-slate-300">
                  {formatDate(b.plan?.nextPayment)}
                </div>

                <div className="flex justify-end w-full gap-2">
                  <button
                    onClick={() => {
                      setEditingBarberia(b);
                      setNewLastPayment("");
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all"
                  >
                    <Edit2 size={14} /> Gestionar
                  </button>
                  <a
                    href={`/reserva/${b.id}`}
                    target="_blank"
                    className="p-2.5 bg-slate-800 text-slate-500 hover:text-white rounded-xl transition-all"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL DE DETALLE Y ESTADÍSTICAS */}
      {editingBarberia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setEditingBarberia(null)}
          />

          <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[3rem] p-8 md:p-12 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => setEditingBarberia(null)}
              className="absolute right-8 top-8 text-slate-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <header className="mb-10 text-center md:text-left">
              <div className="size-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto md:mx-0 mb-6 border border-blue-500/20">
                {editingBarberia.logo ? (
                  <img
                    src={editingBarberia.logo}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <span className="text-3xl font-black text-blue-500">
                    {editingBarberia.businessName?.[0]}
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter leading-none mb-2">
                {editingBarberia.businessName}
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
                UID: {editingBarberia.id}
              </p>
            </header>

            {/* SECCIÓN DE ESTADÍSTICAS REALES */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              <div className="bg-slate-800/40 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <Users size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Barberos
                  </span>
                </div>
                <p className="text-3xl font-black text-white italic">
                  {Array.isArray(editingBarberia.barbers)
                    ? editingBarberia.barbers.length
                    : 0}
                </p>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                  <BookmarkCheck size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Citas Totales
                  </span>
                </div>
                <p className="text-3xl font-black text-white italic">
                  {Array.isArray(editingBarberia.appointments)
                    ? editingBarberia.appointments.length
                    : 0}
                </p>
              </div>

              <div className="col-span-2 md:col-span-1 bg-blue-600 p-6 rounded-3xl flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
                  Plan Actual
                </span>
                <p className="text-2xl font-black text-white uppercase italic mt-2">
                  {editingBarberia.plan?.type || "Básico"}
                </p>
              </div>
            </div>

            {/* ANALÍTICA RÁPIDA */}
            <div className="bg-slate-800/20 border border-white/5 p-8 rounded-[2.5rem] mb-10">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Rendimiento Histórico
                </h4>
                <TrendingUp size={16} className="text-blue-500" />
              </div>
              <div className="flex items-end gap-2 h-24 mb-4">
                {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-600/10 rounded-lg relative group"
                  >
                    <div
                      style={{ height: `${h}%` }}
                      className="bg-blue-600/40 group-hover:bg-blue-600 transition-all rounded-lg w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase">
                <span>Inicios</span>
                <span>Reciente</span>
              </div>
            </div>

            {/* GESTIÓN DE PAGO */}
            <div className="bg-white/5 p-8 rounded-[2.5rem]">
              <h4 className="text-xs font-black uppercase text-white mb-6 flex items-center gap-2 italic">
                <DollarSign size={16} className="text-emerald-500" /> Actualizar
                Ciclo de Pago
              </h4>
              <form onSubmit={handleManualUpdate} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">
                    Fecha del último pago recibido
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:ring-2 ring-blue-600 transition-all"
                    style={{ colorScheme: "dark" }}
                    onChange={(e) => setNewLastPayment(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-blue-900/40 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Actualizar Barbería"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
