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
//   arrayUnion,
// } from "firebase/firestore";
// import {
//   ShieldCheck,
//   Search,
//   Loader2,
//   Edit2,
//   Scissors,
//   Sparkles,
//   LayoutGrid,
//   X,
//   Trash2,
//   Globe,
//   Mail,
//   Calendar,
//   History,
//   CheckCircle2,
//   Zap,
// } from "lucide-react";

// export default function SuperAdminPage() {
//   const [user, setUser] = useState(null);
//   const [allBusinesses, setAllBusinesses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all");

//   const [editingItem, setEditingItem] = useState(null);
//   const [editForm, setEditForm] = useState({
//     businessName: "",
//     email: "",
//     planType: "Glow",
//     planPrice: "0",
//     planStatus: "inactive",
//   });
//   const [newLastPayment, setNewLastPayment] = useState("");
//   const [isUpdating, setIsUpdating] = useState(false);

//   const ADMIN_EMAIL = "cleberich@gmail.com";

//   // --- UTILIDADES ---
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

//   // --- LÓGICA DE SINCRONIZACIÓN MERCADO PAGO ---
//   // Esta función detecta si hay un pago automático de MP que no ha sido historizado
//   const syncAutomaticPayments = async (businesses) => {
//     const syncPromises = businesses.map(async (b) => {
//       const autoId = b.plan?.lastPaymentId; // ID que genera Mercado Pago
//       const history = b.paymentHistory || [];

//       // Si hay un ID de MP y NO existe ya en el historial, lo movemos
//       if (autoId && !history.some((pay) => pay.paymentId === String(autoId))) {
//         const docRef = doc(db, b.collectionName, b.id);
//         const newRecord = {
//           paymentId: String(autoId),
//           date: b.plan.lastPayment || Timestamp.now(),
//           amount: Number(b.plan.price) || 0,
//           planType: b.plan.type || "Standard",
//           registeredAt: new Date().toISOString(),
//           method: "mercadopago_auto",
//         };

//         await updateDoc(docRef, {
//           paymentHistory: arrayUnion(newRecord),
//           // No borramos lastPaymentId por si tu webhook lo usa,
//           // pero ya queda seguro en el historial.
//         });

//         // Actualizamos el objeto local para la vista actual
//         return { ...b, paymentHistory: [...history, newRecord] };
//       }
//       return b;
//     });
//     return Promise.all(syncPromises);
//   };

//   const fetchAllData = async () => {
//     try {
//       const [barberSnap, esteticaSnap] = await Promise.all([
//         getDocs(collection(db, "barberias")),
//         getDocs(collection(db, "centros_estetica")),
//       ]);

//       const barberDocs = barberSnap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         type: "barberia",
//         collectionName: "barberias",
//       }));

//       const esteticaDocs = esteticaSnap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         type: "estetica",
//         collectionName: "centros_estetica",
//       }));

//       let combined = [...barberDocs, ...esteticaDocs];

//       // Sincronizar pagos automáticos detectados
//       combined = await syncAutomaticPayments(combined);

//       setAllBusinesses(
//         combined.sort((a, b) => {
//           const dateA = a.createdAt?.seconds || 0;
//           const dateB = b.createdAt?.seconds || 0;
//           return dateB - dateA;
//         })
//       );
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (
//         currentUser?.email?.toLowerCase().trim() ===
//         ADMIN_EMAIL.toLowerCase().trim()
//       ) {
//         setUser(currentUser);
//         setIsAuthorized(true);
//         fetchAllData();
//       } else {
//         setIsAuthorized(false);
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleFullUpdate = async (e) => {
//     e.preventDefault();
//     if (!editingItem) return;
//     setIsUpdating(true);
//     try {
//       const docRef = doc(db, editingItem.collectionName, editingItem.id);
//       let updateData = {
//         businessName: editForm.businessName,
//         email: editForm.email,
//         "plan.type": editForm.planType,
//         "plan.price": Number(editForm.planPrice) || 0,
//         "plan.status": editForm.planStatus,
//         "plan.updatedAt": new Date().toISOString(),
//         "plan.updatedByAdmin": auth.currentUser.email,
//       };

//       if (newLastPayment) {
//         const lastPayDate = new Date(newLastPayment);
//         lastPayDate.setHours(12, 0, 0, 0);
//         const nextPayDate = new Date(lastPayDate);
//         nextPayDate.setDate(lastPayDate.getDate() + 30);
//         const expiresDate = new Date(nextPayDate);
//         expiresDate.setDate(expiresDate.getDate() + 7);

//         updateData["plan.lastPayment"] = Timestamp.fromDate(lastPayDate);
//         updateData["plan.nextPayment"] = Timestamp.fromDate(nextPayDate);
//         updateData["plan.expiresAt"] = expiresDate.toISOString().split("T")[0];
//         updateData["plan.paymentStatus"] = "paid";
//         updateData["plan.status"] = editForm.planStatus;

//         const paymentRecord = {
//           paymentId: `manual_${Math.random().toString(36).substring(2, 7)}`,
//           date: Timestamp.fromDate(lastPayDate),
//           amount: Number(editingItem.plan?.price) || 0,
//           planType: editForm.planType,
//           status: "approved",
//           registeredAt: new Date().toISOString(),
//           method: "manual_admin",
//         };

//         await updateDoc(docRef, {
//           ...updateData,
//           paymentHistory: arrayUnion(paymentRecord),
//         });
//       } else {
//         await updateDoc(docRef, updateData);
//       }
//       setEditingItem(null);
//       await fetchAllData();
//       alert("Sincronización completa.");
//     } catch (error) {
//       alert("Error al actualizar.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (!editingItem) return;
//     if (
//       window.confirm(`¿Eliminar definitivamente a ${editingItem.businessName}?`)
//     ) {
//       setIsUpdating(true);
//       await deleteDoc(doc(db, editingItem.collectionName, editingItem.id));
//       setEditingItem(null);
//       await fetchAllData();
//       alert("Eliminado.");
//       setIsUpdating(false);
//     }
//   };

//   const filteredData = allBusinesses.filter((b) => {
//     const matchesSearch =
//       b.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       b.email?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesType = filterType === "all" ? true : b.type === filterType;
//     return matchesSearch && matchesType;
//   });

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center bg-[#0a0f1a]">
//         <Loader2 className="animate-spin text-blue-500" size={40} />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#0a0f1a] text-slate-100 p-6 md:p-12">
//       <header className="max-w-7xl mx-auto mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
//         <div>
//           <div className="flex items-center gap-2 mb-3">
//             <ShieldCheck className="text-blue-500" size={24} />
//             <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500">
//               AppEstetica Master Control
//             </span>
//           </div>
//           <h1 className="text-5xl font-black uppercase tracking-tighter text-white italic">
//             Panel Maestro
//           </h1>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="bg-slate-900/80 p-1.5 rounded-[1.5rem] border border-white/5 flex">
//             {[
//               { id: "all", label: "Global", icon: <LayoutGrid size={14} /> },
//               {
//                 id: "barberia",
//                 label: "Barberías",
//                 icon: <Scissors size={14} />,
//               },
//               {
//                 id: "estetica",
//                 label: "Estética",
//                 icon: <Sparkles size={14} />,
//               },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setFilterType(tab.id)}
//                 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
//                   filterType === tab.id
//                     ? "bg-blue-600 text-white shadow-xl"
//                     : "text-slate-500 hover:text-slate-200"
//                 }`}
//               >
//                 {tab.icon} {tab.label}
//               </button>
//             ))}
//           </div>
//           <div className="relative">
//             <Search
//               className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
//               size={18}
//             />
//             <input
//               placeholder="BUSCAR..."
//               className="bg-slate-900/80 border border-white/5 rounded-[1.5rem] py-4 pl-14 pr-6 w-full sm:w-80 text-xs font-bold outline-none focus:border-blue-500"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto space-y-4">
//         {filteredData.map((b) => (
//           <div
//             key={b.id}
//             className={`group bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 md:px-10 flex flex-col md:grid md:grid-cols-10 items-center gap-6 hover:bg-slate-900/60 transition-all border-l-4 ${
//               b.type === "barberia"
//                 ? "hover:border-l-blue-600"
//                 : "hover:border-l-pink-500"
//             }`}
//           >
//             <div className="col-span-3 flex items-center gap-5 w-full">
//               <div
//                 className={`size-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 ${
//                   b.type === "barberia" ? "bg-blue-600/10" : "bg-pink-600/10"
//                 }`}
//               >
//                 {b.type === "barberia" ? (
//                   <Scissors size={20} className="text-blue-500" />
//                 ) : (
//                   <Sparkles size={20} className="text-pink-500" />
//                 )}
//               </div>
//               <div className="truncate">
//                 <p className="font-black uppercase text-sm text-white truncate mb-1">
//                   {b.businessName}
//                 </p>
//                 <div className="flex items-center gap-2">
//                   <span
//                     className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
//                       b.type === "barberia"
//                         ? "bg-blue-600 text-white"
//                         : "bg-pink-500 text-white"
//                     }`}
//                   >
//                     {b.type}
//                   </span>
//                   {b.plan?.lastPaymentId && (
//                     <span className="flex items-center gap-1 text-[8px] font-black text-amber-500 uppercase">
//                       <Zap size={8} /> MP Activo
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="col-span-2 w-full text-[11px] text-slate-500 truncate">
//               {b.email}
//             </div>
//             <div className="w-full text-[10px] font-black uppercase text-blue-400/80">
//               {b.plan?.type || "Standard"}
//             </div>
//             <div className="w-full">
//               <span
//                 className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${
//                   b.plan?.status === "active"
//                     ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/30"
//                     : "text-rose-500 bg-rose-500/10 border-rose-500/30"
//                 }`}
//               >
//                 {b.plan?.status === "active" ? "Activo" : "Inactivo"}
//               </span>
//             </div>
//             <div className="w-full text-xs font-black text-slate-200">
//               {formatDate(b.plan?.nextPayment)}
//             </div>
//             <div className="flex justify-end w-full col-span-2">
//               <button
//                 onClick={() => {
//                   setEditingItem(b);
//                     setEditForm({
//                       businessName: b.businessName || "",
//                       email: b.email || "",
//                       planType: b.plan?.type || "Glow",
//                       planPrice: String(b.plan?.price || 0),
//                       planStatus: b.plan?.status || "inactive",
//                     });
//                 }}
//                 className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white hover:bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
//               >
//                 <Edit2 size={14} /> Gestionar
//               </button>
//             </div>
//           </div>
//         ))}
//       </main>

//       {editingItem && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black/95 backdrop-blur-md"
//             onClick={() => setEditingItem(null)}
//           />
//           <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[3.5rem] p-10 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
//             <div className="flex justify-between items-start mb-10">
//               <h3 className="text-3xl font-black uppercase text-white tracking-tighter italic">
//                 Gestión AppEstetica
//               </h3>
//               <button
//                 onClick={() => setEditingItem(null)}
//                 className="text-slate-500 hover:text-white p-3 bg-white/5 rounded-full"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <form onSubmit={handleFullUpdate} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <input
//                   type="text"
//                   value={editForm.businessName}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, businessName: e.target.value })
//                   }
//                   className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-2 ring-blue-600"
//                   placeholder="Nombre"
//                 />
//                 <input
//                   type="email"
//                   value={editForm.email}
//                   onChange={(e) =>
//                     setEditForm({ ...editForm, email: e.target.value })
//                   }
//                   className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-2 ring-blue-600"
//                   placeholder="Email"
//                 />
//               </div>

//               <div className="p-6 bg-blue-600/5 border border-blue-600/10 rounded-[2rem]">
//                 <p className="text-[10px] font-black uppercase text-slate-500 mb-3 ml-2">
//                   Plan y estado de la cuenta
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
//                   <select
//                     value={editForm.planType}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, planType: e.target.value })
//                     }
//                     className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-black outline-none"
//                   >
//                     <option value="Inicial">Inicial</option>
//                     <option value="Starter">Starter</option>
//                     <option value="Profesional">Profesional</option>
//                     <option value="Business">Business</option>
//                   </select>
//                   <input
//                     type="number"
//                     min="0"
//                     value={editForm.planPrice}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, planPrice: e.target.value })
//                     }
//                     className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-black outline-none"
//                     placeholder="Precio UYU"
//                   />
//                   <select
//                     value={editForm.planStatus}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, planStatus: e.target.value })
//                     }
//                     className="bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-black outline-none"
//                   >
//                     <option value="active">Activo</option>
//                     <option value="inactive">Inactivo</option>
//                     <option value="expired">Vencido</option>
//                   </select>
//                 </div>
//                 <p className="text-[10px] font-black uppercase text-slate-500 mb-3 ml-2">
//                   Registrar Pago Manual
//                 </p>
//                 <input
//                   type="date"
//                   className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-black outline-none"
//                   style={{ colorScheme: "dark" }}
//                   onChange={(e) => setNewLastPayment(e.target.value)}
//                 />
//               </div>

//               {editingItem.paymentHistory?.length > 0 && (
//                 <div className="space-y-3">
//                   <p className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
//                     <History size={14} /> Historial Reciente
//                   </p>
//                   <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
//                     {editingItem.paymentHistory
//                       .slice(-3)
//                       .reverse()
//                       .map((pay, i) => (
//                         <div
//                           key={i}
//                           className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl shrink-0"
//                         >
//                           <p className="text-[10px] font-black text-emerald-500">
//                             {formatDate(pay.date)}
//                           </p>
//                           <p className="text-[8px] font-bold text-slate-500 uppercase">
//                             ${pay.amount} •{" "}
//                             {pay.method === "mercadopago_auto"
//                               ? "MP"
//                               : "Manual"}
//                           </p>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               )}

//               <div className="flex gap-4 pt-4">
//                 <button
//                   type="submit"
//                   disabled={isUpdating}
//                   className="flex-[3] py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-xs hover:bg-blue-500 transition-all shadow-xl"
//                 >
//                   {isUpdating ? "PROCESANDO..." : "Guardar Cambios"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleDeleteAccount}
//                   className="flex-1 py-5 bg-rose-600/10 text-rose-500 rounded-[1.5rem] hover:bg-rose-600 hover:text-white transition-all"
//                 >
//                   <Trash2 className="mx-auto" size={24} />
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
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
//   arrayUnion,
// } from "firebase/firestore";
// import {
//   ShieldCheck,
//   Search,
//   Loader2,
//   Edit2,
//   Scissors,
//   Sparkles,
//   LayoutGrid,
//   X,
//   Trash2,
//   History,
//   Zap,
// } from "lucide-react";

// export default function SuperAdminPage() {
//   const [user, setUser] = useState(null);
//   const [allBusinesses, setAllBusinesses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all");

//   const [editingItem, setEditingItem] = useState(null);
//   const [editForm, setEditForm] = useState({
//     businessName: "",
//     email: "",
//     planType: "Inicial",
//     planPrice: "0",
//     planStatus: "inactive",
//   });
//   const [newLastPayment, setNewLastPayment] = useState("");
//   const [isUpdating, setIsUpdating] = useState(false);

//   const ADMIN_EMAIL = "cleberich@gmail.com";

//   // --- UTILIDADES ---
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

//   // --- LÓGICA DE SINCRONIZACIÓN MERCADO PAGO ---
//   const syncAutomaticPayments = async (businesses) => {
//     const syncPromises = businesses.map(async (b) => {
//       const autoId = b.plan?.lastPaymentId;
//       const history = b.paymentHistory || [];

//       if (autoId && !history.some((pay) => pay.paymentId === String(autoId))) {
//         const docRef = doc(db, b.collectionName, b.id);
//         const newRecord = {
//           paymentId: String(autoId),
//           date: b.plan.lastPayment || Timestamp.now(),
//           amount: Number(b.plan.price) || 0,
//           planType: b.plan.type || "Inicial",
//           registeredAt: new Date().toISOString(),
//           method: "mercadopago_auto",
//         };

//         await updateDoc(docRef, {
//           paymentHistory: arrayUnion(newRecord),
//         });

//         return { ...b, paymentHistory: [...history, newRecord] };
//       }
//       return b;
//     });
//     return Promise.all(syncPromises);
//   };

//   const fetchAllData = async () => {
//     try {
//       const [barberSnap, esteticaSnap] = await Promise.all([
//         getDocs(collection(db, "barberias")),
//         getDocs(collection(db, "centros_estetica")),
//       ]);

//       const barberDocs = barberSnap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         type: "barberia",
//         collectionName: "barberias",
//       }));

//       const esteticaDocs = esteticaSnap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         type: "estetica",
//         collectionName: "centros_estetica",
//       }));

//       let combined = [...barberDocs, ...esteticaDocs];
//       combined = await syncAutomaticPayments(combined);

//       setAllBusinesses(
//         combined.sort((a, b) => {
//           const dateA = a.createdAt?.seconds || 0;
//           const dateB = b.createdAt?.seconds || 0;
//           return dateB - dateA;
//         }),
//       );
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (
//         currentUser?.email?.toLowerCase().trim() ===
//         ADMIN_EMAIL.toLowerCase().trim()
//       ) {
//         setUser(currentUser);
//         setIsAuthorized(true);
//         fetchAllData();
//       } else {
//         setIsAuthorized(false);
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleFullUpdate = async (e) => {
//     e.preventDefault();
//     if (!editingItem) return;
//     setIsUpdating(true);
//     try {
//       const docRef = doc(db, editingItem.collectionName, editingItem.id);
//       let updateData = {
//         businessName: editForm.businessName,
//         email: editForm.email,
//         "plan.type": editForm.planType,
//         "plan.price": Number(editForm.planPrice) || 0,
//         "plan.status": editForm.planStatus,
//         "plan.updatedAt": new Date().toISOString(),
//         "plan.updatedByAdmin": auth.currentUser.email,
//       };

//       if (newLastPayment) {
//         const lastPayDate = new Date(newLastPayment);
//         lastPayDate.setHours(12, 0, 0, 0);
//         const nextPayDate = new Date(lastPayDate);
//         nextPayDate.setDate(lastPayDate.getDate() + 30);
//         const expiresDate = new Date(nextPayDate);
//         expiresDate.setDate(expiresDate.getDate() + 7);

//         updateData["plan.lastPayment"] = Timestamp.fromDate(lastPayDate);
//         updateData["plan.nextPayment"] = Timestamp.fromDate(nextPayDate);
//         updateData["plan.expiresAt"] = expiresDate.toISOString().split("T")[0];
//         updateData["plan.paymentStatus"] = "paid";
//         updateData["plan.status"] = editForm.planStatus;

//         const paymentRecord = {
//           paymentId: `manual_${Math.random().toString(36).substring(2, 7)}`,
//           date: Timestamp.fromDate(lastPayDate),
//           amount: Number(editForm.planPrice) || 0,
//           planType: editForm.planType,
//           status: "approved",
//           registeredAt: new Date().toISOString(),
//           method: "manual_admin",
//         };

//         await updateDoc(docRef, {
//           ...updateData,
//           paymentHistory: arrayUnion(paymentRecord),
//         });
//       } else {
//         await updateDoc(docRef, updateData);
//       }
//       setEditingItem(null);
//       await fetchAllData();
//       alert("Sincronización completa.");
//     } catch (error) {
//       alert("Error al actualizar.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (!editingItem) return;
//     if (
//       window.confirm(`¿Eliminar definitivamente a ${editingItem.businessName}?`)
//     ) {
//       setIsUpdating(true);
//       await deleteDoc(doc(db, editingItem.collectionName, editingItem.id));
//       setEditingItem(null);
//       await fetchAllData();
//       alert("Eliminado.");
//       setIsUpdating(false);
//     }
//   };

//   const filteredData = allBusinesses.filter((b) => {
//     const matchesSearch =
//       b.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       b.email?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesType = filterType === "all" ? true : b.type === filterType;
//     return matchesSearch && matchesType;
//   });

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
//         <Loader2 className="animate-spin text-[#c084fc]" size={40} />
//       </div>
//     );

//   if (!isAuthorized)
//     return (
//       <div className="h-screen flex items-center justify-center bg-[#f8fafc] text-slate-800 font-bold">
//         Acceso no autorizado.
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-[#334155] font-sans antialiased p-6 md:p-12">
//       {/* HEADER PRINCIPAL */}
//       <header className="max-w-7xl mx-auto mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//         <div>
//           <div className="flex items-center gap-2 mb-2">
//             <div className="w-7 h-7 rounded-lg bg-[#e879f9]/20 flex items-center justify-center text-[#c084fc] font-bold text-sm">
//               +
//             </div>
//             <span className="text-xs font-bold uppercase tracking-wider text-[#a855f7]">
//               estetica integral • Master Control
//             </span>
//           </div>
//           <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
//             Panel Maestro
//           </h1>
//         </div>

//         {/* FILTROS Y BÚSQUEDA */}
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center">
//             {[
//               { id: "all", label: "Global", icon: <LayoutGrid size={14} /> },
//               {
//                 id: "barberia",
//                 label: "Barberías",
//                 icon: <Scissors size={14} />,
//               },
//               {
//                 id: "estetica",
//                 label: "Estética",
//                 icon: <Sparkles size={14} />,
//               },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setFilterType(tab.id)}
//                 className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
//                   filterType === tab.id
//                     ? "bg-gradient-to-r from-[#c084fc] to-[#e879f9] text-white shadow-xs"
//                     : "text-slate-500 hover:text-slate-800"
//                 }`}
//               >
//                 {tab.icon} {tab.label}
//               </button>
//             ))}
//           </div>

//           <div className="relative">
//             <Search
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//               size={16}
//             />
//             <input
//               placeholder="Buscar por centro o email..."
//               className="bg-white border border-slate-200/80 rounded-2xl py-2.5 pl-11 pr-4 w-full sm:w-72 text-xs font-medium outline-none focus:ring-2 focus:ring-[#c084fc]/30 focus:border-[#c084fc] transition-all placeholder:text-slate-400"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//       </header>

//       {/* LISTADO DE CUENTAS */}
//       <main className="max-w-7xl mx-auto space-y-3">
//         {filteredData.map((b) => (
//           <div
//             key={b.id}
//             className={`bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col md:grid md:grid-cols-10 items-center gap-4 hover:shadow-md transition-all border-l-4 ${
//               b.type === "barberia"
//                 ? "hover:border-l-slate-800"
//                 : "hover:border-l-[#c084fc]"
//             }`}
//           >
//             {/* NOMBRE Y ICONO */}
//             <div className="col-span-3 flex items-center gap-3.5 w-full">
//               <div
//                 className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
//                   b.type === "barberia"
//                     ? "bg-slate-100 border-slate-200 text-slate-700"
//                     : "bg-[#e879f9]/15 border-purple-200 text-[#c084fc]"
//                 }`}
//               >
//                 {b.type === "barberia" ? (
//                   <Scissors size={18} />
//                 ) : (
//                   <Sparkles size={18} />
//                 )}
//               </div>
//               <div className="truncate">
//                 <p className="font-bold text-xs text-slate-800 truncate">
//                   {b.businessName}
//                 </p>
//                 <div className="flex items-center gap-1.5 mt-0.5">
//                   <span
//                     className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
//                       b.type === "barberia"
//                         ? "bg-slate-200 text-slate-700"
//                         : "bg-[#e879f9]/20 text-[#a855f7]"
//                     }`}
//                   >
//                     {b.type}
//                   </span>
//                   {b.plan?.lastPaymentId && (
//                     <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
//                       <Zap size={10} /> MP Activo
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* EMAIL */}
//             <div className="col-span-2 w-full text-xs text-slate-500 font-medium truncate">
//               {b.email}
//             </div>

//             {/* PLAN */}
//             <div className="w-full text-xs font-bold text-[#a855f7]">
//               {b.plan?.type || "Inicial"}
//             </div>

//             {/* ESTADO */}
//             <div className="w-full">
//               <span
//                 className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
//                   b.plan?.status === "active"
//                     ? "text-[#10b981] bg-[#6ee7b7]/20 border-[#6ee7b7]/40"
//                     : "text-[#f87171] bg-[#fca5a5]/20 border-[#fca5a5]/40"
//                 }`}
//               >
//                 {b.plan?.status === "active" ? "Activo" : "Inactivo"}
//               </span>
//             </div>

//             {/* PRÓXIMO PAGO */}
//             <div className="w-full text-xs font-semibold text-slate-600">
//               {formatDate(b.plan?.nextPayment)}
//             </div>

//             {/* BOTÓN GESTIONAR */}
//             <div className="flex justify-end w-full col-span-2">
//               <button
//                 onClick={() => {
//                   setEditingItem(b);
//                   setEditForm({
//                     businessName: b.businessName || "",
//                     email: b.email || "",
//                     planType: b.plan?.type || "Inicial",
//                     planPrice: String(b.plan?.price || 0),
//                     planStatus: b.plan?.status || "inactive",
//                   });
//                 }}
//                 className="flex items-center gap-1.5 px-4 py-2 bg-[#6ee7b7] hover:bg-[#5eead4] text-slate-800 rounded-xl font-bold text-xs transition-all shadow-xs"
//               >
//                 <Edit2 size={13} />
//                 <span>Gestionar</span>
//               </button>
//             </div>
//           </div>
//         ))}
//       </main>

//       {/* MODAL DE GESTIÓN */}
//       {editingItem && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
//             onClick={() => setEditingItem(null)}
//           />
//           <div className="bg-white border border-slate-200/80 w-full max-w-xl rounded-3xl p-6 md:p-8 relative z-10 shadow-2xl space-y-6">
//             <div className="flex justify-between items-center pb-3 border-b border-slate-100">
//               <div className="flex items-center gap-2">
//                 <div className="w-7 h-7 rounded-lg bg-[#e879f9]/20 flex items-center justify-center text-[#c084fc] font-bold text-sm">
//                   +
//                 </div>
//                 <h3 className="text-lg font-bold text-slate-800 tracking-tight">
//                   Gestión del Centro
//                 </h3>
//               </div>
//               <button
//                 onClick={() => setEditingItem(null)}
//                 className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleFullUpdate} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-slate-600 ml-1">
//                     Nombre del Negocio
//                   </label>
//                   <input
//                     type="text"
//                     value={editForm.businessName}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, businessName: e.target.value })
//                     }
//                     className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl py-2.5 px-4 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#c084fc]/30 focus:border-[#c084fc] transition-all"
//                     placeholder="Nombre"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-slate-600 ml-1">
//                     Correo Electrónico
//                   </label>
//                   <input
//                     type="email"
//                     value={editForm.email}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, email: e.target.value })
//                     }
//                     className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl py-2.5 px-4 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#c084fc]/30 focus:border-[#c084fc] transition-all"
//                     placeholder="Email"
//                   />
//                 </div>
//               </div>

//               {/* SECCIÓN PLAN Y ESTADO */}
//               <div className="p-4 bg-[#f8fafc] border border-slate-200/80 rounded-2xl space-y-3">
//                 <p className="text-xs font-bold text-slate-700">
//                   Plan y Estado de la Cuenta
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                   <div>
//                     <label className="text-[10px] font-bold text-slate-400 block mb-1">
//                       Tipo de Plan
//                     </label>
//                     <select
//                       value={editForm.planType}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, planType: e.target.value })
//                       }
//                       className="w-full bg-white border border-slate-200/80 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none"
//                     >
//                       <option value="Inicial">Inicial</option>
//                       <option value="Pro Studio">Pro Studio</option>
//                       <option value="Estética Premium">Estética Premium</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="text-[10px] font-bold text-slate-400 block mb-1">
//                       Precio (UYU)
//                     </label>
//                     <input
//                       type="number"
//                       min="0"
//                       value={editForm.planPrice}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, planPrice: e.target.value })
//                       }
//                       className="w-full bg-white border border-slate-200/80 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none"
//                       placeholder="Precio"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-[10px] font-bold text-slate-400 block mb-1">
//                       Estado
//                     </label>
//                     <select
//                       value={editForm.planStatus}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, planStatus: e.target.value })
//                       }
//                       className="w-full bg-white border border-slate-200/80 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none"
//                     >
//                       <option value="active">Activo</option>
//                       <option value="inactive">Inactivo</option>
//                       <option value="expired">Vencido</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="pt-2 border-t border-slate-200/60">
//                   <label className="text-xs font-bold text-slate-700 block mb-1">
//                     Registrar Pago Manual
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full bg-white border border-slate-200/80 rounded-xl p-2.5 text-xs font-medium text-slate-800 outline-none"
//                     onChange={(e) => setNewLastPayment(e.target.value)}
//                   />
//                 </div>
//               </div>

//               {/* HISTORIAL */}
//               {editingItem.paymentHistory?.length > 0 && (
//                 <div className="space-y-2">
//                   <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
//                     <History size={14} className="text-[#a855f7]" /> Historial
//                     Reciente
//                   </p>
//                   <div className="flex gap-2 overflow-x-auto pb-1">
//                     {editingItem.paymentHistory
//                       .slice(-3)
//                       .reverse()
//                       .map((pay, i) => (
//                         <div
//                           key={i}
//                           className="bg-[#f8fafc] border border-slate-200/80 px-3 py-2 rounded-xl shrink-0 text-left"
//                         >
//                           <p className="text-xs font-bold text-[#10b981]">
//                             {formatDate(pay.date)}
//                           </p>
//                           <p className="text-[10px] font-medium text-slate-500">
//                             ${pay.amount} •{" "}
//                             {pay.method === "mercadopago_auto"
//                               ? "Mercado Pago"
//                               : "Manual"}
//                           </p>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               )}

//               {/* BOTONES */}
//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="submit"
//                   disabled={isUpdating}
//                   className="flex-1 py-3 bg-[#6ee7b7] hover:bg-[#5eead4] text-slate-800 rounded-2xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
//                 >
//                   {isUpdating ? (
//                     <Loader2
//                       className="animate-spin text-slate-800"
//                       size={16}
//                     />
//                   ) : (
//                     "Guardar Cambios"
//                   )}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleDeleteAccount}
//                   className="px-4 py-3 bg-[#fca5a5]/20 hover:bg-[#fca5a5]/40 text-[#f87171] rounded-2xl font-bold text-xs transition-all flex items-center justify-center"
//                 >
//                   <Trash2 size={18} />
//                 </button>
//               </div>
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
  deleteDoc,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import {
  ShieldCheck,
  Search,
  Loader2,
  Edit2,
  Scissors,
  Sparkles,
  LayoutGrid,
  X,
  Trash2,
  History,
  Zap,
  Users,
  Calendar,
  CreditCard,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";

export default function SuperAdminPage() {
  const [user, setUser] = useState(null);
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("businesses"); // 'businesses' | 'payments'

  // Métricas globales
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalAgendas: 0,
    totalRevenue: 0,
    totalPaymentsCount: 0,
  });

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    businessName: "",
    email: "",
    planType: "Inicial",
    planPrice: "0",
    planStatus: "inactive",
  });
  const [newLastPayment, setNewLastPayment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const ADMIN_EMAIL = "cleberich@gmail.com";

  // --- UTILIDADES ---
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

  const formatDateTime = (dateValue) => {
    const date = convertToDate(dateValue);
    if (!date || isNaN(date.getTime())) return "--/--/---- --:--";
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- LÓGICA DE SINCRONIZACIÓN MERCADO PAGO ---
  const syncAutomaticPayments = async (businesses) => {
    const syncPromises = businesses.map(async (b) => {
      const autoId = b.plan?.lastPaymentId;
      const history = b.paymentHistory || [];

      if (autoId && !history.some((pay) => pay.paymentId === String(autoId))) {
        const docRef = doc(db, b.collectionName, b.id);
        const newRecord = {
          paymentId: String(autoId),
          date: b.plan.lastPayment || Timestamp.now(),
          amount: Number(b.plan.price) || 0,
          planType: b.plan.type || "Inicial",
          registeredAt: new Date().toISOString(),
          method: "mercadopago_auto",
        };

        await updateDoc(docRef, {
          paymentHistory: arrayUnion(newRecord),
        });

        return { ...b, paymentHistory: [...history, newRecord] };
      }
      return b;
    });
    return Promise.all(syncPromises);
  };

  const fetchAllData = async () => {
    try {
      const [barberSnap, esteticaSnap] = await Promise.all([
        getDocs(collection(db, "barberias")),
        getDocs(collection(db, "centros_estetica")),
      ]);

      const barberDocs = barberSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "barberia",
        collectionName: "barberias",
      }));

      const esteticaDocs = esteticaSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "estetica",
        collectionName: "centros_estetica",
      }));

      let combined = [...barberDocs, ...esteticaDocs];
      combined = await syncAutomaticPayments(combined);

      // --- CÁLCULO DE AGENDAS/CITAS TOTALES ---
      // Intenta contar los documentos de la subcolección de agendas de cada negocio ('agendas', 'citas' o 'turnos')
      let totalAgendasCount = 0;
      for (const b of combined) {
        try {
          // Ajusta 'agendas' por el nombre exacto de tu subcolección en Firestore si difiere
          const agendaSnap = await getDocs(
            collection(db, b.collectionName, b.id, "agendas"),
          );
          totalAgendasCount += agendaSnap.size;
        } catch (err) {
          // En caso de que no exista la subcolección o falle
        }
      }

      // --- CÁLCULO DE METRICAS DE PAGOS ---
      let totalRevenue = 0;
      let totalPaymentsCount = 0;

      combined.forEach((b) => {
        if (Array.isArray(b.paymentHistory)) {
          totalPaymentsCount += b.paymentHistory.length;
          b.paymentHistory.forEach((p) => {
            totalRevenue += Number(p.amount) || 0;
          });
        }
      });

      setStats({
        totalBusinesses: combined.length,
        totalAgendas: totalAgendasCount,
        totalRevenue,
        totalPaymentsCount,
      });

      setAllBusinesses(
        combined.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        }),
      );
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (
        currentUser?.email?.toLowerCase().trim() ===
        ADMIN_EMAIL.toLowerCase().trim()
      ) {
        setUser(currentUser);
        setIsAuthorized(true);
        fetchAllData();
      } else {
        setIsAuthorized(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFullUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsUpdating(true);
    try {
      const docRef = doc(db, editingItem.collectionName, editingItem.id);
      let updateData = {
        businessName: editForm.businessName,
        email: editForm.email,
        "plan.type": editForm.planType,
        "plan.price": Number(editForm.planPrice) || 0,
        "plan.status": editForm.planStatus,
        "plan.updatedAt": new Date().toISOString(),
        "plan.updatedByAdmin": auth.currentUser.email,
      };

      if (newLastPayment) {
        const lastPayDate = new Date(newLastPayment);
        lastPayDate.setHours(12, 0, 0, 0);
        const nextPayDate = new Date(lastPayDate);
        nextPayDate.setDate(lastPayDate.getDate() + 30);
        const expiresDate = new Date(nextPayDate);
        expiresDate.setDate(expiresDate.getDate() + 7);

        updateData["plan.lastPayment"] = Timestamp.fromDate(lastPayDate);
        updateData["plan.nextPayment"] = Timestamp.fromDate(nextPayDate);
        updateData["plan.expiresAt"] = expiresDate.toISOString().split("T")[0];
        updateData["plan.paymentStatus"] = "paid";
        updateData["plan.status"] = editForm.planStatus;

        const paymentRecord = {
          paymentId: `manual_${Math.random().toString(36).substring(2, 7)}`,
          date: Timestamp.fromDate(lastPayDate),
          amount: Number(editForm.planPrice) || 0,
          planType: editForm.planType,
          status: "approved",
          registeredAt: new Date().toISOString(),
          method: "manual_admin",
        };

        await updateDoc(docRef, {
          ...updateData,
          paymentHistory: arrayUnion(paymentRecord),
        });
      } else {
        await updateDoc(docRef, updateData);
      }
      setEditingItem(null);
      await fetchAllData();
      alert("Sincronización completa.");
    } catch (error) {
      alert("Error al actualizar.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!editingItem) return;
    if (
      window.confirm(`¿Eliminar definitivamente a ${editingItem.businessName}?`)
    ) {
      setIsUpdating(true);
      await deleteDoc(doc(db, editingItem.collectionName, editingItem.id));
      setEditingItem(null);
      await fetchAllData();
      alert("Eliminado.");
      setIsUpdating(false);
    }
  };

  // Filtrado de Negocios
  const filteredData = allBusinesses.filter((b) => {
    const matchesSearch =
      b.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" ? true : b.type === filterType;
    return matchesSearch && matchesType;
  });

  // Consolidado de Todos los Pagos Realizados para el Tab de Pagos
  const allPayments = allBusinesses
    .flatMap((b) =>
      (b.paymentHistory || []).map((pay) => ({
        ...pay,
        businessName: b.businessName,
        email: b.email,
        type: b.type,
      })),
    )
    .sort((a, b) => {
      const dateA = convertToDate(a.date)?.getTime() || 0;
      const dateB = convertToDate(b.date)?.getTime() || 0;
      return dateB - dateA;
    });

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-[#c084fc]" size={40} />
      </div>
    );

  if (!isAuthorized)
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafc] text-slate-800 font-bold">
        Acceso no autorizado.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] font-sans antialiased p-6 md:p-12">
      {/* HEADER PRINCIPAL */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#e879f9]/20 flex items-center justify-center text-[#c084fc] font-bold text-sm">
              +
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#a855f7]">
              estetica integral • Master Control
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Panel Maestro
          </h1>
        </div>

        {/* NAVEGACIÓN PRINCIPAL */}
        <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("businesses")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "businesses"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users size={16} />
            Negocios y Usuarios
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "payments"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard size={16} />
            Historial de Pagos
          </button>
        </div>
      </header>

      {/* TARJETAS DE MÉTRICAS GLOBALES (KPI) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Negocios
            </p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
              {stats.totalBusinesses}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Agendas
            </p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
              {stats.totalAgendas}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#c084fc] flex items-center justify-center">
            <Calendar size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recaudación Total
            </p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
              ${stats.totalRevenue.toLocaleString("es-UY")} UYU
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pagos Registrados
            </p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
              {stats.totalPaymentsCount}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <CreditCard size={22} />
          </div>
        </div>
      </div>

      {/* VISTA 1: LISTADO DE NEGOCIOS Y USUARIOS */}
      {activeTab === "businesses" && (
        <main className="max-w-7xl mx-auto space-y-4">
          {/* BARRA DE BÚSQUEDA Y FILTROS */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3 rounded-2xl border border-slate-200/80 mb-4">
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: "all", label: "Global", icon: <LayoutGrid size={14} /> },
                {
                  id: "barberia",
                  label: "Barberías",
                  icon: <Scissors size={14} />,
                },
                {
                  id: "estetica",
                  label: "Estética",
                  icon: <Sparkles size={14} />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterType === tab.id
                      ? "bg-gradient-to-r from-[#c084fc] to-[#e879f9] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                placeholder="Buscar por centro o email..."
                className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl py-2 pl-11 pr-4 w-full text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#c084fc]/30 focus:border-[#c084fc] transition-all placeholder:text-slate-400"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* LISTADO */}
          {filteredData.map((b) => (
            <div
              key={b.id}
              className={`bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col md:grid md:grid-cols-10 items-center gap-4 hover:shadow-md transition-all border-l-4 ${
                b.type === "barberia"
                  ? "hover:border-l-slate-800"
                  : "hover:border-l-[#c084fc]"
              }`}
            >
              {/* NOMBRE Y ICONO */}
              <div className="col-span-3 flex items-center gap-3.5 w-full">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    b.type === "barberia"
                      ? "bg-slate-100 border-slate-200 text-slate-700"
                      : "bg-[#e879f9]/15 border-purple-200 text-[#c084fc]"
                  }`}
                >
                  {b.type === "barberia" ? (
                    <Scissors size={18} />
                  ) : (
                    <Sparkles size={18} />
                  )}
                </div>
                <div className="truncate">
                  <p className="font-bold text-xs text-slate-800 truncate">
                    {b.businessName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        b.type === "barberia"
                          ? "bg-slate-200 text-slate-700"
                          : "bg-[#e879f9]/20 text-[#a855f7]"
                      }`}
                    >
                      {b.type}
                    </span>
                    {b.plan?.lastPaymentId && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Zap size={10} /> MP Activo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* EMAIL */}
              <div className="col-span-2 w-full text-xs text-slate-500 font-medium truncate">
                {b.email}
              </div>

              {/* PLAN */}
              <div className="w-full text-xs font-bold text-[#a855f7]">
                {b.plan?.type || "Inicial"}
              </div>

              {/* ESTADO */}
              <div className="w-full">
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                    b.plan?.status === "active"
                      ? "text-[#10b981] bg-[#6ee7b7]/20 border-[#6ee7b7]/40"
                      : "text-[#f87171] bg-[#fca5a5]/20 border-[#fca5a5]/40"
                  }`}
                >
                  {b.plan?.status === "active" ? "Activo" : "Inactivo"}
                </span>
              </div>

              {/* PRÓXIMO PAGO */}
              <div className="w-full text-xs font-semibold text-slate-600">
                {formatDate(b.plan?.nextPayment)}
              </div>

              {/* BOTÓN GESTIONAR */}
              <div className="flex justify-end w-full col-span-2">
                <button
                  onClick={() => {
                    setEditingItem(b);
                    setEditForm({
                      businessName: b.businessName || "",
                      email: b.email || "",
                      planType: b.plan?.type || "Inicial",
                      planPrice: String(b.plan?.price || 0),
                      planStatus: b.plan?.status || "inactive",
                    });
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#6ee7b7] hover:bg-[#5eead4] text-slate-800 rounded-xl font-bold text-xs transition-all shadow-xs"
                >
                  <Edit2 size={13} />
                  <span>Gestionar</span>
                </button>
              </div>
            </div>
          ))}
        </main>
      )}

      {/* VISTA 2: HISTORIAL GLOBAL DE PAGOS */}
      {activeTab === "payments" && (
        <main className="max-w-7xl mx-auto bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Registro General de Transacciones
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Historial auditado de pagos aprobados y manuales en la
                plataforma.
              </p>
            </div>
            <span className="text-xs font-bold bg-purple-50 text-[#a855f7] px-3 py-1 rounded-full border border-purple-100">
              {allPayments.length} Pagos Totales
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Negocio / Usuario</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Método</th>
                  <th className="p-4">ID Transacción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-slate-400 font-medium"
                    >
                      No hay registros de pagos.
                    </td>
                  </tr>
                ) : (
                  allPayments.map((pay, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-4">
                        <p className="font-bold text-slate-800">
                          {pay.businessName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {pay.email}
                        </p>
                      </td>
                      <td className="p-4 font-medium text-slate-700">
                        {formatDateTime(pay.date)}
                      </td>
                      <td className="p-4 font-bold text-emerald-600">
                        ${pay.amount} UYU
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          {pay.planType || "Inicial"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-md text-[10px] ${
                            pay.method === "mercadopago_auto"
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-blue-50 text-blue-600 border border-blue-200"
                          }`}
                        >
                          {pay.method === "mercadopago_auto"
                            ? "Mercado Pago"
                            : "Manual Admin"}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[10px] text-slate-400">
                        {pay.paymentId}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {/* MODAL DE GESTIÓN DE CENTRO */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setEditingItem(null)}
          />
          <div className="bg-white border border-slate-200/80 w-full max-w-xl rounded-3xl p-6 md:p-8 relative z-10 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#e879f9]/20 flex items-center justify-center text-[#c084fc] font-bold text-sm">
                  +
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                  Gestión del Centro
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFullUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 ml-1">
                    Nombre del Negocio
                  </label>
                  <input
                    type="text"
                    value={editForm.businessName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, businessName: e.target.value })
                    }
                    className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl py-2.5 px-4 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#c084fc]/30 focus:border-[#c084fc] transition-all"
                    placeholder="Nombre"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 ml-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl py-2.5 px-4 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#c084fc]/30 focus:border-[#c084fc] transition-all"
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* SECCIÓN PLAN Y ESTADO */}
              <div className="p-4 bg-[#f8fafc] border border-slate-200/80 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-slate-700">
                  Plan y Estado de la Cuenta
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      Tipo de Plan
                    </label>
                    <select
                      value={editForm.planType}
                      onChange={(e) =>
                        setEditForm({ ...editForm, planType: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200/80 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none"
                    >
                      <option value="Inicial">Inicial</option>
                      <option value="Pro Studio">Pro Studio</option>
                      <option value="Estética Premium">Estética Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      Precio (UYU)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.planPrice}
                      onChange={(e) =>
                        setEditForm({ ...editForm, planPrice: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200/80 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none"
                      placeholder="Precio"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      Estado
                    </label>
                    <select
                      value={editForm.planStatus}
                      onChange={(e) =>
                        setEditForm({ ...editForm, planStatus: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200/80 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="expired">Vencido</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Registrar Pago Manual
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white border border-slate-200/80 rounded-xl p-2.5 text-xs font-medium text-slate-800 outline-none"
                    onChange={(e) => setNewLastPayment(e.target.value)}
                  />
                </div>
              </div>

              {/* HISTORIAL LOCAL DEL NEGOCIO */}
              {editingItem.paymentHistory?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <History size={14} className="text-[#a855f7]" /> Historial
                    Reciente
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {editingItem.paymentHistory
                      .slice(-3)
                      .reverse()
                      .map((pay, i) => (
                        <div
                          key={i}
                          className="bg-[#f8fafc] border border-slate-200/80 px-3 py-2 rounded-xl shrink-0 text-left"
                        >
                          <p className="text-xs font-bold text-[#10b981]">
                            {formatDate(pay.date)}
                          </p>
                          <p className="text-[10px] font-medium text-slate-500">
                            ${pay.amount} •{" "}
                            {pay.method === "mercadopago_auto"
                              ? "Mercado Pago"
                              : "Manual"}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* BOTONES DE ACCIÓN */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3 bg-[#6ee7b7] hover:bg-[#5eead4] text-slate-800 rounded-2xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <Loader2
                      className="animate-spin text-slate-800"
                      size={16}
                    />
                  ) : (
                    "Guardar Cambios"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-4 py-3 bg-[#fca5a5]/20 hover:bg-[#fca5a5]/40 text-[#f87171] rounded-2xl font-bold text-xs transition-all flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
