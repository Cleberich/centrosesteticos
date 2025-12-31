// "use client";

// import React, { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   Save,
//   ShieldCheck,
//   Loader2,
//   LogOut,
//   Store,
//   Camera,
//   Calendar,
//   ExternalLink,
//   MessageSquare,
//   Lock,
//   Unlock,
//   Eye,
//   EyeOff,
//   X,
//   CheckCircle2,
//   Zap,
//   Star,
//   Crown,
// } from "lucide-react";
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// function SettingsContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [isPaying, setIsPaying] = useState(null);
//   const [barberiaData, setBarberiaData] = useState(null);

//   // Estados de Seguridad
//   const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
//   const [verificationPin, setVerificationPin] = useState("");
//   const [pinError, setPinError] = useState(false);
//   const [isSavingSecurity, setIsSavingSecurity] = useState(false);

//   const planes = [
//     {
//       id: "Basico",
//       name: "Básico",
//       price: 690,
//       icon: <Zap size={20} />,
//       features: ["1 Barbero", "150 reservas/mes"],
//     },
//     {
//       id: "Profesional",
//       name: "Profesional",
//       price: 1290,
//       icon: <Star size={20} />,
//       features: ["3 Barberos", "600 reservas/mes", "Estadísticas"],
//     },
//     {
//       id: "Elite",
//       name: "Elite",
//       price: 1900,
//       icon: <Crown size={20} />,
//       features: [
//         "Barberos Ilimitados",
//         "Reservas Ilimitadas",
//         "Estadísticas",
//         "Marketing",
//       ],
//     },
//   ];

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const docRef = doc(db, "barberias", user.uid);
//           const docSnap = await getDoc(docRef);
//           if (docSnap.exists()) {
//             setBarberiaData(docSnap.data());
//             const status = searchParams.get("status");
//             const planId = searchParams.get("plan");
//             if (status === "approved" && planId) {
//               await actualizarPlanPostPago(
//                 user.uid,
//                 planId,
//                 searchParams.get("payment_id")
//               );
//             }
//           }
//         } catch (error) {
//           console.error(error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         router.push("/login");
//       }
//     });
//     return () => unsubscribe();
//   }, [router, searchParams]);

//   const actualizarPlanPostPago = async (uid, planId, paymentId) => {
//     try {
//       const ref = doc(db, "barberias", uid);
//       const ahora = new Date();
//       const vencimiento = new Date();
//       vencimiento.setDate(ahora.getDate() + 30);
//       await updateDoc(ref, {
//         "plan.type": planId,
//         "plan.status": "active",
//         "plan.lastPaymentId": paymentId || "n/a",
//         "plan.updatedAt": ahora.toISOString().split("T")[0],
//         "plan.expiresAt": vencimiento.toISOString().split("T")[0],
//       });
//       const updatedSnap = await getDoc(ref);
//       setBarberiaData(updatedSnap.data());
//       router.replace("/dashboard/settings");
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const handlePayment = async (plan) => {
//     if (plan.price === 0) return;
//     setIsPaying(plan.id);
//     try {
//       const res = await fetch("/api/checkout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           planId: plan.id,
//           planName: plan.name,
//           price: plan.price,
//           userId: auth.currentUser.uid,
//         }),
//       });
//       const data = await res.json();
//       if (data.url) window.location.href = data.url;
//     } catch (e) {
//       alert("Error de conexión");
//     } finally {
//       setIsPaying(null);
//     }
//   };

//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && file.size <= 1000000) {
//       const reader = new FileReader();
//       reader.onloadend = () =>
//         setBarberiaData({ ...barberiaData, logo: reader.result });
//       reader.readAsDataURL(file);
//     }
//   };

//   // --- TOGGLE DE PROTECCIÓN ---
//   const handleTogglePinProtection = () => {
//     if (barberiaData?.useAccountingPin) {
//       setIsVerifyModalOpen(true);
//     } else {
//       // Si se activa, solo cambiamos el estado local; el usuario deberá poner un PIN y guardar abajo
//       setBarberiaData({ ...barberiaData, useAccountingPin: true });
//     }
//   };

//   // --- CONFIRMAR DESACTIVACIÓN Y GUARDAR AL INSTANTE ---
//   const confirmDeactivationAndSave = async (e) => {
//     e.preventDefault();
//     if (verificationPin === barberiaData?.adminPin) {
//       setIsSavingSecurity(true);
//       try {
//         const ref = doc(db, "barberias", auth.currentUser.uid);
//         const updatedData = { ...barberiaData, useAccountingPin: false };

//         await updateDoc(ref, updatedData); // Guardado inmediato en Firebase

//         setBarberiaData(updatedData);
//         setIsVerifyModalOpen(false);
//         setVerificationPin("");
//         setPinError(false);
//         alert("Protección desactivada y cambios guardados correctamente.");
//       } catch (error) {
//         alert("Error al guardar en la base de datos.");
//       } finally {
//         setIsSavingSecurity(false);
//       }
//     } else {
//       setPinError(true);
//       setVerificationPin("");
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     if (
//       barberiaData?.useAccountingPin &&
//       (!barberiaData?.adminPin || barberiaData.adminPin.length < 4)
//     ) {
//       alert("El PIN debe ser de 4 dígitos");
//       return;
//     }
//     setSaving(true);
//     try {
//       const ref = doc(db, "barberias", auth.currentUser.uid);
//       await updateDoc(ref, barberiaData);
//       alert("Ajustes guardados con éxito");
//     } catch (e) {
//       alert("Error al guardar");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const daysLeft = () => {
//     if (!barberiaData?.plan?.expiresAt) return 0;
//     const diff = new Date(barberiaData.plan.expiresAt) - new Date();
//     return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
//   };

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
//         <Loader2 className="animate-spin text-blue-600" size={40} />
//       </div>
//     );

//   return (
//     <div className="min-h-screen overflow-scroll bg-slate-50 dark:bg-slate-950 p-6 md:p-12 pb-32 font-sans transition-colors">
//       <div className="max-w-5xl mx-auto space-y-10">
//         <header className="flex justify-between items-end">
//           <div>
//             <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter ">
//               Ajustes
//             </h1>
//             <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
//               Configuración de Barbería
//             </p>
//           </div>
//           <button
//             onClick={() => signOut(auth)}
//             className="bg-red-500/10 text-red-500 hover:bg-red-500 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all hover:text-white"
//           >
//             Cerrar Sesión
//           </button>
//         </header>

//         {/* LOGO */}
//         <section className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
//           <div className="relative group">
//             <div className="size-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-xl transition-transform">
//               {barberiaData?.logo ? (
//                 <img
//                   src={barberiaData.logo}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-slate-400">
//                   <Store size={40} />
//                 </div>
//               )}
//             </div>
//             <label className="absolute bottom-0 right-0 bg-blue-600 p-3 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
//               <Camera size={20} />
//               <input
//                 type="file"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleLogoUpload}
//               />
//             </label>
//           </div>
//           <div className="text-center md:text-left">
//             <h3 className="text-xl font-black dark:text-white uppercase  tracking-tight">
//               Imagen del Negocio
//             </h3>
//             <p className="text-slate-500 text-xs font-bold uppercase mt-1 tracking-widest">
//               Se verá en tu link público
//             </p>
//           </div>
//         </section>

//         {/* PROTECCIÓN PIN */}
//         <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h3 className="flex items-center gap-2 font-black uppercase text-xs text-yellow-500 tracking-widest ">
//                 <ShieldCheck size={18} /> Seguridad de Finanzas
//               </h3>
//               <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
//                 Bloquea la sección de contabilidad a tus barberos con un PIN
//               </p>
//             </div>
//             <div
//               onClick={handleTogglePinProtection}
//               className={`w-14 h-8 rounded-full flex items-center px-1 cursor-pointer transition-all ${
//                 barberiaData?.useAccountingPin
//                   ? "bg-emerald-500 justify-end"
//                   : "bg-slate-300 dark:bg-slate-700 justify-start"
//               }`}
//             >
//               <div className="size-6 bg-white rounded-full shadow-md" />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//             <div className="space-y-4">
//               <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
//                 <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
//                   {barberiaData?.useAccountingPin ? (
//                     <Lock size={20} />
//                   ) : (
//                     <Unlock size={20} />
//                   )}
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-black uppercase text-slate-400">
//                     Protección
//                   </p>
//                   <p className="text-xs font-black dark:text-white uppercase">
//                     {barberiaData?.useAccountingPin
//                       ? "Activada"
//                       : "Desactivada"}
//                   </p>
//                 </div>
//               </div>

//               {barberiaData?.useAccountingPin && (
//                 <div className="space-y-2">
//                   <input
//                     type="password"
//                     maxLength={4}
//                     autoComplete="new-password"
//                     placeholder="Establecer PIN"
//                     value={barberiaData?.adminPin || ""}
//                     onChange={(e) =>
//                       setBarberiaData({
//                         ...barberiaData,
//                         adminPin: e.target.value.replace(/\D/g, ""),
//                       })
//                     }
//                     className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-blue-500/30 rounded-2xl py-4 px-6 text-center text-xl font-black tracking-[.5em] text-blue-600 dark:text-blue-400 outline-none focus:border-blue-500"
//                   />
//                   <p className="text-[9px] text-center font-black text-slate-400 uppercase tracking-widest">
//                     El PIN se mantiene oculto por seguridad
//                   </p>
//                 </div>
//               )}
//             </div>
//             <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border dark:border-slate-700">
//               <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed uppercase">
//                 Al activar el PIN, restringes el acceso a los datos de
//                 recaudación. Para apagar esta función, el sistema solicitará el
//                 código actual y guardará los cambios automáticamente.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* MODAL DE VERIFICACIÓN Y GUARDADO AUTOMÁTICO */}
//         {isVerifyModalOpen && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
//             <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 border dark:border-slate-800 text-center">
//               <div className="size-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
//                 <Lock size={32} />
//               </div>
//               <h3 className="text-xl font-black uppercase dark:text-white tracking-tight ">
//                 Desactivar PIN
//               </h3>
//               <p className="text-slate-500 text-[10px] font-bold uppercase mt-1 mb-6">
//                 Ingresa el código actual para desbloquear y guardar
//               </p>

//               <form onSubmit={confirmDeactivationAndSave} className="space-y-4">
//                 <input
//                   type="password"
//                   maxLength={4}
//                   autoFocus
//                   required
//                   value={verificationPin}
//                   onChange={(e) =>
//                     setVerificationPin(e.target.value.replace(/\D/g, ""))
//                   }
//                   placeholder="****"
//                   className={`w-full bg-slate-100 dark:bg-slate-800 border-2 ${
//                     pinError ? "border-red-500" : "border-transparent"
//                   } rounded-2xl py-4 px-6 text-center text-2xl font-black tracking-[1em] dark:text-white outline-none focus:border-red-500`}
//                 />
//                 {pinError && (
//                   <p className="text-red-500 text-[9px] font-black uppercase">
//                     PIN Incorrecto
//                   </p>
//                 )}

//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     disabled={isSavingSecurity}
//                     onClick={() => {
//                       setIsVerifyModalOpen(false);
//                       setPinError(false);
//                       setVerificationPin("");
//                     }}
//                     className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 rounded-xl font-black text-[10px] uppercase dark:text-white"
//                   >
//                     Cancelar
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isSavingSecurity}
//                     className="flex-1 py-4 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-red-500/20 flex items-center justify-center"
//                   >
//                     {isSavingSecurity ? (
//                       <Loader2 className="animate-spin" size={16} />
//                     ) : (
//                       "Desbloquear"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* LINK AGENDA */}
//         <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
//           <h3 className="flex items-center gap-2 font-black uppercase text-xs text-blue-600 mb-4 tracking-widest ">
//             <Calendar size={16} /> Link de Reserva Público
//           </h3>
//           <div className="flex flex-col md:flex-row gap-3">
//             <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl font-bold text-xs truncate border dark:border-slate-700 text-blue-500">{`https://barberias.vercel.app/reserva/${auth.currentUser?.uid}`}</div>
//             <div className="flex flex-wrap md:flex-nowrap gap-2">
//               <button
//                 type="button"
//                 onClick={() => {
//                   navigator.clipboard.writeText(
//                     `https://barberias.vercel.app/reserva/${auth.currentUser?.uid}`
//                   );
//                   alert("Copiado");
//                 }}
//                 className="flex-1 md:flex-none bg-slate-900 dark:bg-slate-800 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest"
//               >
//                 Copiar
//               </button>
//               <button
//                 type="button"
//                 onClick={() =>
//                   window.open(
//                     `https://barberias.vercel.app/reserva/${auth.currentUser?.uid}`,
//                     "_blank"
//                   )
//                 }
//                 className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20"
//               >
//                 <ExternalLink size={16} /> Ver
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   const msg = encodeURIComponent(
//                     `¡Hola! Ya puedes agendar tu turno online aquí: https://barberias.vercel.app/reserva/${auth.currentUser?.uid}`
//                   );
//                   window.open(`https://wa.me/?text=${msg}`, "_blank");
//                 }}
//                 className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg"
//               >
//                 <MessageSquare size={16} /> WhatsApp
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* PLANES */}
//         <section className="space-y-6">
//           <div className="flex justify-between items-center px-2">
//             <h3 className="font-black uppercase text-xs text-slate-400 tracking-widest ">
//               Suscripción
//             </h3>
//             <div
//               className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
//                 daysLeft() > 0
//                   ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
//                   : "bg-red-500/10 text-red-500 border-red-500/20"
//               }`}
//             >
//               {daysLeft()} Días Restantes
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {planes.map((p) => {
//               const isCurrent = barberiaData?.plan?.type === p.id;
//               return (
//                 <div
//                   key={p.id}
//                   className={`p-8 rounded-[2.5rem] border-2 transition-all ${
//                     isCurrent
//                       ? "border-blue-600 bg-blue-50/10"
//                       : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
//                   }`}
//                 >
//                   <div className="mb-4 text-blue-600">{p.icon}</div>
//                   <h4 className="font-black dark:text-white uppercase ">
//                     {p.name}
//                   </h4>
//                   <p className="text-2xl font-black text-blue-600 mb-4">
//                     ${p.price}
//                   </p>
//                   <ul className="text-[10px] font-bold text-slate-500 space-y-2 mb-8 uppercase">
//                     {p.features.map((f, i) => (
//                       <li key={i} className="flex items-center gap-2">
//                         <CheckCircle2 size={12} className="text-emerald-500" />{" "}
//                         {f}
//                       </li>
//                     ))}
//                   </ul>
//                   {isCurrent ? (
//                     <div className="text-center py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
//                       Activo
//                     </div>
//                   ) : (
//                     <button
//                       type="button"
//                       onClick={() => handlePayment(p)}
//                       className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest"
//                     >
//                       {isPaying === p.id ? "..." : "Elegir"}
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* DATOS COMERCIALES */}
//         <form onSubmit={handleSave} className="space-y-6">
//           <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-3">
//               <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
//                 Nombre del Local
//               </label>
//               <input
//                 value={barberiaData?.businessName || ""}
//                 onChange={(e) =>
//                   setBarberiaData({
//                     ...barberiaData,
//                     businessName: e.target.value,
//                   })
//                 }
//                 className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none border dark:border-slate-700"
//               />
//             </div>
//             <div className="space-y-3">
//               <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
//                 WhatsApp Comercial
//               </label>
//               <input
//                 value={barberiaData?.telefono || ""}
//                 onChange={(e) =>
//                   setBarberiaData({ ...barberiaData, telefono: e.target.value })
//                 }
//                 className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none border dark:border-slate-700"
//               />
//             </div>
//             <div className="md:col-span-2 space-y-3">
//               <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
//                 Dirección de la Barbería
//               </label>
//               <input
//                 value={barberiaData?.direccion || ""}
//                 onChange={(e) =>
//                   setBarberiaData({
//                     ...barberiaData,
//                     direccion: e.target.value,
//                   })
//                 }
//                 className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none border dark:border-slate-700"
//               />
//             </div>
//           </section>

//           <button
//             type="submit"
//             className="fixed bottom-8 right-8 bg-blue-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl z-50 flex items-center gap-3 active:scale-95 transition-all"
//           >
//             {saving ? (
//               <Loader2 className="animate-spin" size={20} />
//             ) : (
//               <Save size={20} />
//             )}
//             {saving ? "Guardando..." : "Guardar Ajustes"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default function SettingsPage() {
//   return (
//     <Suspense fallback={<div className="h-screen bg-slate-950" />}>
//       <SettingsContent />
//     </Suspense>
//   );
// }
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  ShieldCheck,
  Loader2,
  Store,
  Camera,
  Calendar,
  ExternalLink,
  MessageSquare,
  Lock,
  Unlock,
  CheckCircle2,
  Zap,
  Star,
  Crown,
  MapPin,
  Navigation,
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPaying, setIsPaying] = useState(null);
  const [barberiaData, setBarberiaData] = useState(null);

  // Estados de Seguridad
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verificationPin, setVerificationPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  const planes = [
    {
      id: "Basico",
      name: "Básico",
      price: 690,
      icon: <Zap size={20} />,
      features: ["1 Barbero", "150 reservas/mes"],
    },
    {
      id: "Profesional",
      name: "Profesional",
      price: 1290,
      icon: <Star size={20} />,
      features: ["3 Barberos", "600 reservas/mes", "Estadísticas"],
    },
    {
      id: "Elite",
      name: "Elite",
      price: 1900,
      icon: <Crown size={20} />,
      features: [
        "Barberos Ilimitados",
        "Reservas Ilimitadas",
        "Estadísticas",
        "Marketing",
      ],
    },
  ];

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
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSearchAddress = () => {
    if (!barberiaData?.direccion) {
      alert("Escribe una dirección primero");
      return;
    }
    const query = encodeURIComponent(barberiaData.direccion);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1000000) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setBarberiaData({ ...barberiaData, logo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleTogglePinProtection = () => {
    if (barberiaData?.useAccountingPin) {
      setIsVerifyModalOpen(true);
    } else {
      setBarberiaData({ ...barberiaData, useAccountingPin: true });
    }
  };

  const confirmDeactivationAndSave = async (e) => {
    e.preventDefault();
    if (verificationPin === barberiaData?.adminPin) {
      setIsSavingSecurity(true);
      try {
        const ref = doc(db, "barberias", auth.currentUser.uid);
        const updatedData = { ...barberiaData, useAccountingPin: false };
        await updateDoc(ref, updatedData);
        setBarberiaData(updatedData);
        setIsVerifyModalOpen(false);
        setVerificationPin("");
        setPinError(false);
        alert("Protección desactivada y guardada.");
      } catch (error) {
        alert("Error al guardar.");
      } finally {
        setIsSavingSecurity(false);
      }
    } else {
      setPinError(true);
      setVerificationPin("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      barberiaData?.useAccountingPin &&
      (!barberiaData?.adminPin || barberiaData.adminPin.length < 4)
    ) {
      alert("El PIN debe ser de 4 dígitos");
      return;
    }
    setSaving(true);
    try {
      const ref = doc(db, "barberias", auth.currentUser.uid);
      await updateDoc(ref, barberiaData);
      alert("Ajustes guardados con éxito");
    } catch (e) {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const daysLeft = () => {
    if (!barberiaData?.plan?.expiresAt) return 0;
    const diff = new Date(barberiaData.plan.expiresAt) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen overflow-scroll bg-slate-50 dark:bg-slate-950 p-6 md:p-12 pb-32 font-sans transition-colors">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
              Ajustes
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              Gestión de Barbería
            </p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500/10 text-red-500 hover:bg-red-500 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* LOGO */}
        <section className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative">
            <div className="size-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-xl">
              {barberiaData?.logo ? (
                <img
                  src={barberiaData.logo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Store size={40} />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 p-3 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
              <Camera size={20} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </label>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-black dark:text-white uppercase  tracking-tight">
              Imagen del Negocio
            </h3>
            <p className="text-slate-500 text-xs font-bold uppercase mt-1 tracking-widest">
              Tu marca en el perfil público
            </p>
          </div>
        </section>

        {/* PROTECCIÓN PIN */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="flex items-center gap-2 font-black uppercase text-xs text-yellow-500 tracking-widest">
                <ShieldCheck size={18} /> Seguridad de Finanzas
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                Bloquea la contabilidad a otros barberos
              </p>
            </div>
            <div
              onClick={handleTogglePinProtection}
              className={`w-14 h-8 rounded-full flex items-center px-1 cursor-pointer transition-all ${
                barberiaData?.useAccountingPin
                  ? "bg-emerald-500 justify-end"
                  : "bg-slate-300 dark:bg-slate-700 justify-start"
              }`}
            >
              <div className="size-6 bg-white rounded-full shadow-md" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                  {barberiaData?.useAccountingPin ? (
                    <Lock size={20} />
                  ) : (
                    <Unlock size={20} />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Estado
                  </p>
                  <p className="text-xs font-black dark:text-white uppercase">
                    {barberiaData?.useAccountingPin
                      ? "Protección Activa"
                      : "Sin PIN"}
                  </p>
                </div>
              </div>
              {barberiaData?.useAccountingPin && (
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Nuevo PIN"
                  value={barberiaData?.adminPin || ""}
                  onChange={(e) =>
                    setBarberiaData({
                      ...barberiaData,
                      adminPin: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-blue-500/30 rounded-2xl py-4 px-6 text-center text-xl font-black tracking-[.5em] text-blue-600 outline-none"
                />
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed uppercase bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border dark:border-slate-700">
              El PIN es obligatorio para proteger tus ingresos. Si deseas
              desactivarlo, el sistema verificará tu código actual y guardará
              los cambios automáticamente.
            </p>
          </div>
        </section>

        {/* LINK AGENDA */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="flex items-center gap-2 font-black uppercase text-xs text-blue-600 mb-4 tracking-widest ">
            <Calendar size={16} /> Link de Reserva Público
          </h3>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl font-bold text-xs truncate border dark:border-slate-700 text-blue-500">{`https://barberias.vercel.app/reserva/${auth.currentUser?.uid}`}</div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://barberias.vercel.app/reserva/${auth.currentUser?.uid}`
                  );
                  alert("Copiado");
                }}
                className="flex-1 md:flex-none bg-slate-900 dark:bg-slate-800 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase"
              >
                Copiar
              </button>
              <button
                type="button"
                onClick={() =>
                  window.open(
                    `https://barberias.vercel.app/reserva/${auth.currentUser?.uid}`,
                    "_blank"
                  )
                }
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase shadow-lg"
              >
                <ExternalLink size={16} /> Ver
              </button>
              <button
                type="button"
                onClick={() => {
                  const msg = encodeURIComponent(
                    `¡Reserva tu turno aquí!: https://barberias.vercel.app/reserva/${auth.currentUser?.uid}`
                  );
                  window.open(`https://wa.me/?text=${msg}`, "_blank");
                }}
                className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase"
              >
                <MessageSquare size={16} /> WhatsApp
              </button>
            </div>
          </div>
        </section>

        {/* DATOS COMERCIALES Y GOOGLE MAPS */}
        <form onSubmit={handleSave} className="space-y-6">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest ">
                Nombre de la Barbería
              </label>
              <input
                value={barberiaData?.businessName || ""}
                onChange={(e) =>
                  setBarberiaData({
                    ...barberiaData,
                    businessName: e.target.value,
                  })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none border dark:border-slate-700"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest ">
                WhatsApp
              </label>
              <input
                value={barberiaData?.telefono || ""}
                onChange={(e) =>
                  setBarberiaData({ ...barberiaData, telefono: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none border dark:border-slate-700"
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2 ">
                <MapPin size={12} /> Dirección Escrita
              </label>
              <div className="flex gap-2">
                <input
                  placeholder="Ej: Calle Falsa 123, Ciudad"
                  value={barberiaData?.direccion || ""}
                  onChange={(e) =>
                    setBarberiaData({
                      ...barberiaData,
                      direccion: e.target.value,
                    })
                  }
                  className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none border dark:border-slate-700"
                />
                <button
                  type="button"
                  onClick={handleSearchAddress}
                  className="px-6 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-black text-[10px] uppercase"
                >
                  Buscar en Maps
                </button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2 ">
                <Navigation size={12} /> ¿Cómo obtenerlo? 1. Busca tu local en
                Google Maps 2. Toca en "Compartir" y luego en "Copiar enlace".
              </label>
              <input
                placeholder="Pega el link de Google Maps aquí"
                value={barberiaData?.mapsLink || ""}
                onChange={(e) =>
                  setBarberiaData({ ...barberiaData, mapsLink: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold text-blue-500 outline-none border dark:border-slate-700"
              />
            </div>
          </section>

          {/* PLANES */}
          <section className="space-y-6" id="planes">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-black uppercase text-xs text-slate-400 tracking-widest ">
                Tu Suscripción
              </h3>
              <div
                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                  daysLeft() > 0
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
              >
                {daysLeft()} Días Restantes
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {planes.map((p) => {
                const isCurrent = barberiaData?.plan?.type === p.id;
                return (
                  <div
                    key={p.id}
                    className={`p-8 rounded-[2.5rem] border-2 transition-all ${
                      isCurrent
                        ? "border-blue-600 bg-blue-50/10"
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    <div className="mb-4 text-blue-600">{p.icon}</div>
                    <h4 className="font-black dark:text-white uppercase ">
                      {p.name}
                    </h4>
                    <p className="text-2xl font-black text-blue-600 mb-4">
                      ${p.price}
                    </p>
                    <ul className="text-[10px] font-bold text-slate-500 space-y-2 mb-8 uppercase">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2
                            size={12}
                            className="text-emerald-500"
                          />{" "}
                          {f}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <div className="text-center py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase">
                        Activo
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black uppercase text-[10px]"
                      >
                        Cambiar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <button
            type="submit"
            className="fixed bottom-8 right-8 bg-blue-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl z-50 flex items-center gap-3 transition-all hover:scale-105"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {saving ? "Guardando..." : "Guardar Todo"}
          </button>
        </form>

        {/* MODAL VERIFICACIÓN */}
        {isVerifyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 border dark:border-slate-800 text-center">
              <div className="size-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-black uppercase dark:text-white">
                Confirmar Identidad
              </h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase mt-1 mb-6">
                PIN actual para desbloquear y guardar
              </p>
              <form onSubmit={confirmDeactivationAndSave} className="space-y-4">
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  value={verificationPin}
                  onChange={(e) =>
                    setVerificationPin(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl py-4 text-center text-2xl font-black tracking-[1em] dark:text-white outline-none border-2 border-transparent focus:border-red-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsVerifyModalOpen(false);
                      setVerificationPin("");
                    }}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 rounded-xl font-black text-[10px] uppercase dark:text-white"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingSecurity}
                    className="flex-1 py-4 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase"
                  >
                    {isSavingSecurity ? "..." : "Confirmar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-950" />}>
      <SettingsContent />
    </Suspense>
  );
}
