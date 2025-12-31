// "use client";

// import React, { useState, useEffect } from "react";
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc,
//   deleteDoc,
//   Timestamp,
// } from "firebase/firestore";
// import {
//   ShieldCheck,
//   Search,
//   ExternalLink,
//   Loader2,
//   Lock,
//   Edit2,
//   X,
//   Users,
//   BookmarkCheck,
//   Clock,
//   TrendingUp,
//   DollarSign,
//   Trash2,
//   AlertTriangle,
//   Globe, // Nuevo icono para el link
// } from "lucide-react";

// export default function SuperAdminPage() {
//   const [user, setUser] = useState(null);
//   const [barberias, setBarberias] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [editingBarberia, setEditingBarberia] = useState(null);
//   const [newLastPayment, setNewLastPayment] = useState("");
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

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
//       const sortedDocs = docs.sort(
//         (a, b) =>
//           (convertToDate(b.createdAt) || 0) - (convertToDate(a.createdAt) || 0)
//       );
//       setBarberias(sortedDocs);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleDeleteBarberia = async (id, name) => {
//     const confirmName = window.prompt(
//       `Para eliminar "${name}", escribe ELIMINAR abajo.`
//     );
//     if (confirmName !== "ELIMINAR") return;

//     setIsDeleting(true);
//     try {
//       await deleteDoc(doc(db, "barberias", id));
//       alert(
//         `Barbería "${name}" eliminada. Recuerda borrar el UID en Auth: ${id}`
//       );
//       setEditingBarberia(null);
//       await fetchBarberias();
//     } catch (error) {
//       alert("Error al eliminar.");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleManualUpdate = async (e) => {
//     e.preventDefault();
//     if (!editingBarberia || !newLastPayment) return;
//     setIsUpdating(true);
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
//     } catch (error) {
//       alert("Error al actualizar");
//     } finally {
//       setIsUpdating(false);
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

//   return (
//     <div className="min-h-screen bg-[#0a0f1a] text-slate-100 p-6 md:p-12 relative">
//       <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
//         <div>
//           <div className="flex items-center gap-2 mb-2">
//             <ShieldCheck className="text-blue-500" size={20} />
//             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
//               Super Admin Control
//             </span>
//           </div>
//           <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
//             Panel <span className="text-blue-500">Maestro</span>
//           </h1>
//         </div>
//         <div className="relative group">
//           <Search
//             className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
//             size={18}
//           />
//           <input
//             placeholder="BUSCAR LOCAL..."
//             className="bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-6 w-full md:w-80 text-xs font-bold outline-none focus:border-blue-500"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 gap-3">
//           <div className="hidden md:grid grid-cols-8 px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
//             <span className="col-span-2">Barbería / Registro</span>
//             <span>Plan</span>
//             <span>Estado Pago</span>
//             <span>Vencimiento</span>
//             <span className="text-right col-span-2 pr-4">Acciones</span>
//           </div>

//           {filteredBarberias.map((b) => {
//             const isPaid =
//               b.plan?.paymentStatus === "paid" ||
//               isPaymentValid(b.plan?.lastPayment);
//             return (
//               <div
//                 key={b.id}
//                 className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-5 md:px-8 flex flex-col md:grid md:grid-cols-8 items-center gap-6 hover:bg-slate-900/60 transition-all border-l-4 border-l-transparent hover:border-l-blue-500 group"
//               >
//                 <div className="col-span-2 flex items-center gap-4 w-full">
//                   <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
//                     {b.logo ? (
//                       <img
//                         src={b.logo}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <span className="font-black text-blue-500">
//                         {b.businessName?.[0]}
//                       </span>
//                     )}
//                   </div>
//                   <div className="truncate">
//                     <p className="font-black uppercase text-xs text-white truncate leading-none mb-1.5">
//                       {b.businessName}
//                     </p>
//                     <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase">
//                       <Clock size={10} /> {formatDate(b.createdAt)}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="w-full text-[10px] font-black uppercase text-blue-400/80">
//                   {b.plan?.type || "Básico"}
//                 </div>
//                 <div className="w-full">
//                   <span
//                     className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
//                       isPaid
//                         ? "text-emerald-500 bg-emerald-500/10"
//                         : "text-amber-500 bg-amber-500/10"
//                     }`}
//                   >
//                     {isPaid ? "Activo" : "Pendiente"}
//                   </span>
//                 </div>
//                 <div className="w-full text-[11px] font-bold text-slate-300 col-span-2">
//                   {formatDate(b.plan?.nextPayment)}
//                 </div>

//                 {/* BOTONES ACCIÓN EN TABLA */}
//                 <div className="flex justify-end w-full gap-2 col-span-2">
//                   <a
//                     href={`/reserva/${b.id}`}
//                     target="_blank"
//                     className="p-2.5 bg-slate-800 text-slate-500 hover:text-white rounded-xl transition-all"
//                     title="Ver página de reserva"
//                   >
//                     <ExternalLink size={16} />
//                   </a>
//                   <button
//                     onClick={() => {
//                       setEditingBarberia(b);
//                       setNewLastPayment("");
//                     }}
//                     className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all"
//                   >
//                     <Edit2 size={14} /> Gestionar
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </main>

//       {/* MODAL DE DETALLE, ESTADÍSTICAS Y ELIMINACIÓN */}
//       {editingBarberia && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black/95 backdrop-blur-md"
//             onClick={() => setEditingBarberia(null)}
//           />
//           <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[3rem] p-8 md:p-12 relative z-10 shadow-2xl overflow-y-auto max-h-[95vh] animate-in slide-in-from-bottom-4 transition-all">
//             <div className="flex justify-between items-start mb-10">
//               <div className="flex items-center gap-4">
//                 <div className="size-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 overflow-hidden">
//                   {editingBarberia.logo ? (
//                     <img
//                       src={editingBarberia.logo}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="text-2xl font-black text-blue-500">
//                       {editingBarberia.businessName?.[0]}
//                     </span>
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-black uppercase italic text-white tracking-tighter leading-none mb-1">
//                     {editingBarberia.businessName}
//                   </h3>
//                   <div className="flex items-center gap-2">
//                     <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">
//                       {editingBarberia.email}
//                     </p>
//                     <a
//                       href={`/reserva/${editingBarberia.id}`}
//                       target="_blank"
//                       className="text-blue-500 hover:underline text-[9px] font-black uppercase flex items-center gap-1"
//                     >
//                       Ver Web <ExternalLink size={10} />
//                     </a>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setEditingBarberia(null)}
//                 className="p-2 text-slate-500 hover:text-white"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* ESTADÍSTICAS */}
//             <div className="grid grid-cols-2 gap-4 mb-8">
//               <div className="bg-slate-800/40 p-6 rounded-3xl border border-white/5">
//                 <div className="flex items-center gap-2 text-blue-500 mb-2">
//                   <Users size={16} />
//                   <span className="text-[10px] font-black uppercase tracking-widest">
//                     Barberos
//                   </span>
//                 </div>
//                 <p className="text-2xl font-black text-white italic">
//                   {editingBarberia.barbers?.length || 0}
//                 </p>
//               </div>
//               <div className="bg-slate-800/40 p-6 rounded-3xl border border-white/5">
//                 <div className="flex items-center gap-2 text-emerald-500 mb-2">
//                   <BookmarkCheck size={16} />
//                   <span className="text-[10px] font-black uppercase tracking-widest">
//                     Citas Totales
//                   </span>
//                 </div>
//                 <p className="text-2xl font-black text-white italic">
//                   {editingBarberia.appointments?.length || 0}
//                 </p>
//               </div>
//             </div>

//             {/* GESTIÓN DE PAGO */}
//             <div className="bg-white/5 p-8 rounded-[2.5rem] mb-8">
//               <h4 className="text-xs font-black uppercase text-white mb-6 italic flex items-center gap-2">
//                 <DollarSign size={16} className="text-emerald-500" /> Ciclo de
//                 Facturación
//               </h4>
//               <form onSubmit={handleManualUpdate} className="space-y-6">
//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black uppercase text-slate-500 ml-1">
//                     Fecha del último pago
//                   </label>
//                   <input
//                     type="date"
//                     required
//                     className="w-full bg-slate-900 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:ring-2 ring-blue-600 transition-all"
//                     style={{ colorScheme: "dark" }}
//                     onChange={(e) => setNewLastPayment(e.target.value)}
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={isUpdating}
//                   className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
//                 >
//                   {isUpdating ? (
//                     <Loader2 className="animate-spin mx-auto" size={20} />
//                   ) : (
//                     "Actualizar Pago"
//                   )}
//                 </button>
//               </form>
//             </div>

//             {/* ELIMINAR */}
//             <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[2.5rem]">
//               <div className="flex items-center gap-3 text-red-500 mb-4">
//                 <AlertTriangle size={20} />
//                 <h4 className="text-xs font-black uppercase tracking-widest">
//                   Zona Crítica
//                 </h4>
//               </div>
//               <button
//                 onClick={() =>
//                   handleDeleteBarberia(
//                     editingBarberia.id,
//                     editingBarberia.businessName
//                   )
//                 }
//                 disabled={isDeleting}
//                 className="w-full py-4 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border border-red-500/20"
//               >
//                 {isDeleting
//                   ? "Eliminando..."
//                   : "Eliminar Barbería por Completo"}
//               </button>
//             </div>
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
  deleteDoc,
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
  DollarSign,
  AlertTriangle,
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
  const [isDeleting, setIsDeleting] = useState(false);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // --- UTILIDADES DE FECHA ---
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

  // --- LÓGICA DE VERIFICACIÓN DE VENCIMIENTO ---
  const checkAndSyncStatus = async (docs) => {
    const now = new Date();

    const updates = docs.map(async (b) => {
      const nextPayDate = convertToDate(b.plan?.nextPayment);

      // Si existe fecha de próximo pago y esa fecha ya pasó (es menor a "ahora")
      // Y el estatus todavía figura como "active" o "paid"
      if (nextPayDate && nextPayDate < now && b.plan?.status === "active") {
        const docRef = doc(db, "barberias", b.id);

        const updateData = {
          "plan.status": "inactive",
          "plan.paymentStatus": "unpaid",
          "plan.updatedAt": now.toISOString().split("T")[0], // Formato YYYY-MM-DD
        };

        await updateDoc(docRef, updateData);

        // Retornamos el objeto actualizado para no tener que recargar la página
        return {
          ...b,
          plan: { ...b.plan, status: "inactive", paymentStatus: "unpaid" },
        };
      }
      return b;
    });

    return Promise.all(updates);
  };

  const fetchBarberias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "barberias"));
      let docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Ejecutar sincronización automática de vencidos
      docs = await checkAndSyncStatus(docs);

      const sortedDocs = docs.sort(
        (a, b) =>
          (convertToDate(b.createdAt) || 0) - (convertToDate(a.createdAt) || 0)
      );
      setBarberias(sortedDocs);
    } catch (error) {
      console.error("Error:", error);
    }
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

  // --- ACTUALIZACIÓN MANUAL DE PAGO ---
  const handleManualUpdate = async (e) => {
    e.preventDefault();
    if (!editingBarberia || !newLastPayment) return;
    setIsUpdating(true);
    try {
      const lastPayDate = new Date(newLastPayment);
      lastPayDate.setHours(12, 0, 0, 0);

      const nextPayDate = new Date(lastPayDate);
      nextPayDate.setDate(lastPayDate.getDate() + 30);

      const expiresDate = new Date(nextPayDate);
      expiresDate.setDate(expiresDate.getDate() + 7); // Cortesía de 7 días extra

      const docRef = doc(db, "barberias", editingBarberia.id);
      await updateDoc(docRef, {
        "plan.lastPayment": Timestamp.fromDate(lastPayDate),
        "plan.nextPayment": Timestamp.fromDate(nextPayDate),
        "plan.expiresAt": expiresDate.toISOString().split("T")[0],
        "plan.paymentStatus": "paid",
        "plan.status": "active",
        "plan.updatedAt": new Date().toISOString().split("T")[0],
      });

      setEditingBarberia(null);
      await fetchBarberias();
      alert("Barbería activada y pago registrado.");
    } catch (error) {
      alert("Error al actualizar.");
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

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-100 p-6 md:p-12">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-blue-500" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              Super Admin
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Panel Maestro
          </h1>
        </div>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            placeholder="BUSCAR BARBERÍA..."
            className="bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-6 w-full md:w-80 text-xs font-bold outline-none focus:border-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-3">
          {/* TABLA HEADER */}
          <div className="hidden md:grid grid-cols-8 px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
            <span className="col-span-2">Negocio</span>
            <span>Plan</span>
            <span>Estado</span>
            <span>Vencimiento</span>
            <span className="text-right col-span-2 pr-4">Acciones</span>
          </div>

          {filteredBarberias.map((b) => {
            const isActuallyActive = b.plan?.status === "active";

            return (
              <div
                key={b.id}
                className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-5 md:px-8 flex flex-col md:grid md:grid-cols-8 items-center gap-6 hover:bg-slate-900/60 transition-all border-l-4 border-l-transparent hover:border-l-blue-500"
              >
                <div className="col-span-2 flex items-center gap-4 w-full">
                  <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/5">
                    {b.logo ? (
                      <img
                        src={b.logo}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <span className="font-black text-blue-500">
                        {b.businessName?.[0]}
                      </span>
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-black uppercase text-xs text-white truncate leading-none mb-1">
                      {b.businessName}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold">
                      {b.email}
                    </p>
                  </div>
                </div>

                <div className="w-full text-[10px] font-black uppercase text-blue-400/80">
                  {b.plan?.type}
                </div>

                <div className="w-full">
                  <span
                    className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                      isActuallyActive
                        ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                        : "text-red-500 bg-red-500/10 border-red-500/20"
                    }`}
                  >
                    {isActuallyActive ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <div className="w-full text-[11px] font-bold text-slate-300">
                  {formatDate(b.plan?.nextPayment)}
                </div>

                <div className="flex justify-end w-full gap-2 col-span-2">
                  <button
                    onClick={() => {
                      setEditingBarberia(b);
                      setNewLastPayment("");
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl font-black text-[9px] uppercase transition-all"
                  >
                    <Edit2 size={14} /> Gestionar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL GESTIÓN */}
      {editingBarberia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            onClick={() => setEditingBarberia(null)}
          />
          <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[3rem] p-8 relative z-10">
            <h3 className="text-2xl font-black uppercase text-white mb-6">
              Gestionar Suscripción
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs font-bold uppercase p-4 bg-white/5 rounded-2xl">
                <span className="text-slate-500">Estado Actual:</span>
                <span
                  className={
                    editingBarberia.plan?.status === "active"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }
                >
                  {editingBarberia.plan?.status === "active"
                    ? "ACTIVO"
                    : "INACTIVO"}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase p-4 bg-white/5 rounded-2xl">
                <span className="text-slate-500">Último Pago:</span>
                <span className="text-white">
                  {formatDate(editingBarberia.plan?.lastPayment)}
                </span>
              </div>
            </div>

            <form onSubmit={handleManualUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">
                  Fecha de Nuevo Pago
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:ring-2 ring-blue-600"
                  style={{ colorScheme: "dark" }}
                  onChange={(e) => setNewLastPayment(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all"
              >
                {isUpdating ? "PROCESANDO..." : "ACTIVAR 30 DÍAS"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
