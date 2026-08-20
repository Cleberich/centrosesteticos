// "use client";

// import React, { useState, useEffect, Suspense } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Save,
//   ShieldCheck,
//   Loader2,
//   Camera,
//   Calendar,
//   ExternalLink,
//   MessageSquare,
//   Lock,
//   Unlock,
//   CheckCircle2,
//   Zap,
//   Star,
//   Crown,
//   MapPin,
//   Navigation,
//   Sparkles,
// } from "lucide-react";
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// function SettingsContent() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [isPaying, setIsPaying] = useState(null); // Estado para Mercado Pago
//   const [esteticaData, setEsteticaData] = useState(null);

//   // Estados de Seguridad
//   const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
//   const [verificationPin, setVerificationPin] = useState("");
//   const [isSavingSecurity, setIsSavingSecurity] = useState(false);

//   const planes = [
//     {
//       id: "Glow",
//       name: "Glow",
//       price: 1,
//       icon: <Zap size={20} />,
//       features: ["1 Especialista", "50 citas/mes"],
//     },
//     {
//       id: "Radiance",
//       name: "Radiance",
//       price: 1450,
//       icon: <Star size={20} />,
//       features: ["3 Especialistas", "250 citas/mes", "Estadísticas"],
//     },
//     {
//       id: "Diamond",
//       name: "Diamond",
//       price: 2200,
//       icon: <Crown size={20} />,
//       features: [
//         "Especialistas Ilimitados",
//         "Citas ilimitadas",
//         "Estadísticas",
//         "Finanzas",
//         "Marketing",
//       ],
//     },
//   ];

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const docRef = doc(db, "centros_estetica", user.uid);
//           const docSnap = await getDoc(docRef);
//           if (docSnap.exists()) {
//             setEsteticaData(docSnap.data());
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
//   }, [router]);

//   // --- LÓGICA DE MERCADO PAGO ---
//   const handleUpgrade = async (plan) => {
//     setIsPaying(plan.id);
//     try {
//       const response = await fetch("/api/checkout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           planId: plan.id,
//           planName: `${plan.name}`,
//           price: plan.price,
//           userId: auth.currentUser.uid,
//           businessName: esteticaData.businessName,
//           email: esteticaData.email,
//           collection: "centros_estetica", // Indispensable para el Webhook
//         }),
//       });

//       const data = await response.json();
//       if (data.url) {
//         window.location.href = data.url;
//       } else {
//         console.error("Error de Mercado Pago:", data.error);
//         alert(data.error || "Error al generar el link de pago");
//       }
//     } catch (error) {
//       console.error("Error de conexión con Mercado Pago:", error);
//       alert("Error de conexión con el servidor de pagos");
//     } finally {
//       setIsPaying(null);
//     }
//   };

//   const handleSearchAddress = () => {
//     if (!esteticaData?.direccion) {
//       alert("Escribe una dirección primero");
//       return;
//     }
//     const query = encodeURIComponent(esteticaData.direccion);
//     window.open(
//       `https://www.google.com/maps/search/?api=1&query=${query}`,
//       "_blank",
//     );
//   };

//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && file.size <= 1000000) {
//       const reader = new FileReader();
//       reader.onloadend = () =>
//         setEsteticaData({ ...esteticaData, logo: reader.result });
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleTogglePinProtection = () => {
//     if (esteticaData?.useAccountingPin) {
//       setIsVerifyModalOpen(true);
//     } else {
//       setEsteticaData({ ...esteticaData, useAccountingPin: true });
//     }
//   };

//   const confirmDeactivationAndSave = async (e) => {
//     e.preventDefault();
//     if (verificationPin === esteticaData?.adminPin) {
//       setIsSavingSecurity(true);
//       try {
//         const ref = doc(db, "centros_estetica", auth.currentUser.uid);
//         const updatedData = { ...esteticaData, useAccountingPin: false };
//         await updateDoc(ref, updatedData);
//         setEsteticaData(updatedData);
//         setIsVerifyModalOpen(false);
//         setVerificationPin("");
//         alert("Protección de finanzas desactivada.");
//       } catch (error) {
//         alert("Error al guardar.");
//       } finally {
//         setIsSavingSecurity(false);
//       }
//     } else {
//       alert("PIN incorrecto");
//       setVerificationPin("");
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     if (
//       esteticaData?.useAccountingPin &&
//       (!esteticaData?.adminPin || esteticaData.adminPin.length < 4)
//     ) {
//       alert("El PIN debe ser de 4 dígitos");
//       return;
//     }
//     setSaving(true);
//     try {
//       const ref = doc(db, "centros_estetica", auth.currentUser.uid);
//       await updateDoc(ref, esteticaData);
//       alert("Ajustes de AppEstetica guardados con éxito");
//     } catch (e) {
//       alert("Error al guardar");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const daysLeft = () => {
//     if (!esteticaData?.plan?.expiresAt) return 0;
//     const expires = esteticaData.plan.expiresAt.toDate
//       ? esteticaData.plan.expiresAt.toDate()
//       : new Date(esteticaData.plan.expiresAt);
//     const diff = expires - new Date();
//     return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
//   };

//   if (loading)
//     return (
//       <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
//         <Loader2 className="animate-spin text-pink-500" size={40} />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#FDF8FA] dark:bg-slate-950 p-6 md:p-12 pb-32 font-sans transition-colors overflow-y-auto text-slate-900">
//       <div className="max-w-5xl mx-auto space-y-10">
//         <header className="flex justify-between items-end">
//           <div>
//             <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter italic">
//               Ajustes <span className="text-pink-500">AppEstetica</span>
//             </h1>
//             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">
//               Perfil del Centro de Estética
//             </p>
//           </div>
//           <button
//             onClick={() => signOut(auth)}
//             className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
//           >
//             Cerrar Sesión
//           </button>
//         </header>

//         {/* SECCIÓN LOGO */}
//         <section className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-pink-50 dark:border-slate-800 shadow-sm">
//           <div className="relative">
//             <div className="size-32 rounded-[2.5rem] overflow-hidden bg-pink-50 dark:bg-slate-800 border-4 border-white shadow-xl">
//               {esteticaData?.logo ? (
//                 <img
//                   src={esteticaData.logo}
//                   className="w-full h-full object-cover"
//                   alt="Logo"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-pink-200">
//                   <Sparkles size={40} />
//                 </div>
//               )}
//             </div>
//             <label className="absolute -bottom-2 -right-2 bg-pink-500 p-3 rounded-2xl text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
//               <Camera size={20} />
//               <input
//                 type="file"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleLogoUpload}
//               />
//             </label>
//           </div>
//           <div>
//             <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">
//               Imagen de Marca
//             </h3>
//             <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-widest italic">
//               Personaliza la vista de tus clientes
//             </p>
//           </div>
//         </section>

//         {/* PROTECCIÓN PIN */}
//         <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-pink-50 dark:border-slate-800 shadow-sm">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h3 className="flex items-center gap-2 font-black uppercase text-xs text-pink-500 tracking-widest">
//                 <ShieldCheck size={18} /> Privacidad de Finanzas
//               </h3>
//             </div>
//             <div
//               onClick={handleTogglePinProtection}
//               className={`w-14 h-8 rounded-full flex items-center px-1 cursor-pointer transition-all ${
//                 esteticaData?.useAccountingPin
//                   ? "bg-pink-500 justify-end"
//                   : "bg-slate-200 dark:bg-slate-700 justify-start"
//               }`}
//             >
//               <div className="size-6 bg-white rounded-full shadow-md" />
//             </div>
//           </div>
//           {esteticaData?.useAccountingPin && (
//             <input
//               type="password"
//               maxLength={4}
//               placeholder="NUEVO PIN"
//               value={esteticaData?.adminPin || ""}
//               onChange={(e) =>
//                 setEsteticaData({
//                   ...esteticaData,
//                   adminPin: e.target.value.replace(/\D/g, ""),
//                 })
//               }
//               className="w-full max-w-xs bg-pink-50/50 dark:bg-slate-800 border-2 border-dashed border-pink-500/30 rounded-2xl py-4 px-6 text-center text-2xl font-black tracking-[.5em] text-pink-600 outline-none"
//             />
//           )}
//         </section>

//         {/* LINK AGENDA */}
//         <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-pink-50 dark:border-slate-800 shadow-sm">
//           <h3 className="flex items-center gap-2 font-black uppercase text-xs text-pink-500 mb-4 tracking-widest">
//             <Calendar size={16} /> Link de Reserva AppEstetica
//           </h3>
//           <div className="flex flex-col md:flex-row gap-3">
//             <div className="flex-1 bg-pink-50/50 dark:bg-slate-950 p-4 rounded-2xl font-bold text-xs truncate border border-pink-100 text-pink-600">
//               {`https://aura-estetica.vercel.app/reserva/${auth.currentUser?.uid}`}
//             </div>
//             <button
//               onClick={() => {
//                 navigator.clipboard.writeText(
//                   `https://aura-estetica.vercel.app/reserva/${auth.currentUser?.uid}`,
//                 );
//                 alert("Copiado");
//               }}
//               className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
//             >
//               Copiar
//             </button>
//           </div>
//         </section>

//         {/* FORMULARIO DATOS */}
//         <form onSubmit={handleSave} className="space-y-6">
//           <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-pink-50 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-3">
//               <label className="text-[10px] font-black uppercase  text-slate-400 ml-2">
//                 Nombre del Centro
//               </label>
//               <input
//                 value={esteticaData?.businessName || ""}
//                 onChange={(e) =>
//                   setEsteticaData({
//                     ...esteticaData,
//                     businessName: e.target.value,
//                   })
//                 }
//                 className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold border border-slate-100 outline-none focus:border-pink-500 placeholder:text-slate-550 dark:placeholder:text-white text-slate-950 dark:text-white"
//               />
//             </div>
//             <div className="space-y-3">
//               <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
//                 WhatsApp
//               </label>
//               <input
//                 placeholder="09x xxx xxx"
//                 value={esteticaData?.telefono || ""}
//                 onChange={(e) =>
//                   setEsteticaData({ ...esteticaData, telefono: e.target.value })
//                 }
//                 className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold border placeholder:text-slate-550 dark:placeholder:text-white text-slate-950 dark:text-white border-slate-100 outline-none focus:border-pink-500"
//               />
//             </div>
//             <div className="md:col-span-2 space-y-3">
//               <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2">
//                 <MapPin size={12} /> Dirección Física
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   placeholder="Calle, Ciudad, País"
//                   value={esteticaData?.direccion || ""}
//                   onChange={(e) =>
//                     setEsteticaData({
//                       ...esteticaData,
//                       direccion: e.target.value,
//                     })
//                   }
//                   className="flex-1 bg-slate-50  placeholder:text-slate-550 dark:placeholder:text-white text-slate-950 dark:text-white dark:bg-slate-800 p-4 rounded-2xl font-bold outline-none border border-slate-100 focus:border-pink-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={handleSearchAddress}
//                   className="px-6 bg-slate-900 dark:bg-pink-600 text-white rounded-2xl font-black text-[10px] uppercase"
//                 >
//                   Ver Mapa
//                 </button>
//               </div>
//             </div>
//           </section>

//           {/* PLANES MERCADO PAGO */}
//           <section className="space-y-6">
//             <div className="flex justify-between items-center px-4">
//               <h3 className="font-black uppercase text-xs text-slate-400 tracking-[0.3em]">
//                 Suscripción AppEstetica
//               </h3>
//               <div
//                 className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border ${
//                   daysLeft() > 0
//                     ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                     : "bg-rose-50 text-rose-600 border-rose-100"
//                 }`}
//               >
//                 {daysLeft()} Días Restantes
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {planes.map((p) => {
//                 const isCurrent = esteticaData?.plan?.type === p.id;
//                 return (
//                   <div
//                     key={p.id}
//                     className={`p-8 rounded-[3rem] border-2 transition-all ${
//                       isCurrent
//                         ? "border-pink-500 bg-pink-50/30"
//                         : "bg-white dark:bg-slate-900 border-slate-100"
//                     }`}
//                   >
//                     <div className="mb-4 text-pink-500">{p.icon}</div>
//                     <h4 className="font-black uppercase italic">{p.name}</h4>
//                     <p className="text-2xl font-black text-pink-500 mb-4">
//                       ${p.price}
//                       <span className="text-[10px] text-slate-400 ml-1">
//                         /mes
//                       </span>
//                     </p>
//                     <ul className="text-[10px] font-bold text-slate-500 space-y-3 mb-8 uppercase">
//                       {p.features.map((f, i) => (
//                         <li key={i} className="flex items-center gap-2">
//                           <CheckCircle2 size={12} className="text-pink-400" />{" "}
//                           {f}
//                         </li>
//                       ))}
//                     </ul>
//                     {isCurrent ? (
//                       <div className="text-center py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase">
//                         Activo
//                       </div>
//                     ) : (
//                       <button
//                         type="button"
//                         disabled={isPaying !== null}
//                         onClick={() => handleUpgrade(p)}
//                         className="w-full py-4 bg-slate-900 dark:bg-pink-500 text-white rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2"
//                       >
//                         {isPaying === p.id ? (
//                           <Loader2 className="animate-spin" size={16} />
//                         ) : (
//                           "Solicitar Plan"
//                         )}
//                       </button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </section>

//           <button
//             type="submit"
//             className="fixed bottom-8 right-8 bg-pink-500 text-white px-10 py-5 rounded-full font-black uppercase text-xs shadow-2xl z-50 flex items-center gap-3 hover:scale-105 transition-all"
//           >
//             {saving ? (
//               <Loader2 className="animate-spin" size={20} />
//             ) : (
//               <Save size={20} />
//             )}
//             {saving ? "Procesando..." : "Guardar Ajustes"}
//           </button>
//         </form>

//         {/* MODAL VERIFICACIÓN PIN */}
//         {isVerifyModalOpen && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
//             <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] shadow-2xl p-10 text-center">
//               <div className="size-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600">
//                 <Lock size={32} />
//               </div>
//               <h3 className="text-xl font-black uppercase italic">
//                 PIN de Seguridad
//               </h3>
//               <form
//                 onSubmit={confirmDeactivationAndSave}
//                 className="space-y-4 mt-6"
//               >
//                 <input
//                   type="password"
//                   maxLength={4}
//                   autoFocus
//                   value={verificationPin}
//                   onChange={(e) =>
//                     setVerificationPin(e.target.value.replace(/\D/g, ""))
//                   }
//                   className="w-full bg-slate-50 rounded-2xl py-5 text-center text-2xl font-black tracking-[1em] outline-none border-2 border-transparent focus:border-rose-500"
//                 />
//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setIsVerifyModalOpen(false)}
//                     className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-[10px] uppercase"
//                   >
//                     Cerrar
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase"
//                   >
//                     Confirmar
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function SettingsPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="h-screen flex items-center justify-center">
//           <Loader2 className="animate-spin text-pink-500" />
//         </div>
//       }
//     >
//       <SettingsContent />
//     </Suspense>
//   );
// }
"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  ShieldCheck,
  Loader2,
  Camera,
  Calendar,
  MessageSquare,
  Lock,
  CheckCircle2,
  Zap,
  Star,
  Crown,
  MapPin,
  Sparkles,
  Plus,
  Clock,
  UserPlus,
  X,
  Search,
  Trash2,
  Check,
  CreditCard,
  Banknote,
  SmartphoneNfc,
  Heart,
  LayoutDashboard,
  Users,
  Calendar as CalendarIcon,
  Scissors,
  CreditCard as PaymentsIcon,
  LogOut,
  Sparkle,
  Settings,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// --- SUBCOMPONENTES DE NAVEGACIÓN Y MÉTRICAS ---

function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
        active
          ? "bg-[#E2F5ED] text-[#2E8B6E] shadow-sm"
          : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ title, value, badge, icon, bgColor }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100/80 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <h4 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          {value}
        </h4>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-md inline-block">
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

// --- VISTA 1: DASHBOARD Y AGENDA GENERAL ---

function DashboardView({
  esteticaData,
  setEsteticaData,
  setIsModalOpen,
  setAppointmentToComplete,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const getTodayStr = () => new Date().toLocaleDateString("sv-SE");

  const formatPhone = (phone) => {
    if (!phone) return "";
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) clean = "598" + clean.substring(1);
    else if (!clean.startsWith("598")) clean = "598" + clean;
    return clean;
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("¿Deseas cancelar esta cita?")) return;
    if (!auth.currentUser) return;
    try {
      const esteticaRef = doc(db, "centros_estetica", auth.currentUser.uid);
      const newList = (esteticaData.appointments || []).filter(
        (app) => String(app.id) !== String(appointmentId),
      );
      await updateDoc(esteticaRef, { appointments: newList });
      setEsteticaData((prev) => ({ ...prev, appointments: newList }));
    } catch (error) {
      alert("Error al cancelar la cita.");
    }
  };

  const handleSendReminder = (app) => {
    if (!app.phone) return;
    const formattedPhone = formatPhone(app.phone);
    const msg = encodeURIComponent(
      `Hola ${app.customer}, te recordamos tu turno de ${app.serviceCategory || "estética"} hoy a las ${app.start}hs 🌸✨`,
    );
    window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
  };

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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* TARJETAS MÉTRICAS (Estilo Byutie) */}
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

      {/* FILTROS DE CATEGORÍA */}
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

      {/* LISTADO PRINCIPAL Y RECALL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles size={16} className="text-[#67C3A5]" /> Agenda del Día
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
                  Sin turnos pendientes para esta categoría hoy
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ALERTA DE RETOQUES (21 DÍAS) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Heart size={16} className="text-[#F89B88]" /> Alerta de Retoques
            (21 Días)
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
                        {client.service} ({client.date.toLocaleDateString()})
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const formatted = formatPhone(client.phone);
                        const msg = encodeURIComponent(
                          `¡Hola ${client.name}! ✨ Pasaron 3 semanas desde tu última sesión de ${client.service}. ¿Te agendamos el retoque? 💅🌸`,
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
                Todas tus clientas están al día con sus retoques ✨
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- VISTA 2: CALENDARIO DE TURNOS (SURGERY SCHEDULE VIBE) ---

function ScheduleView({ esteticaData }) {
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState("Todos");

  const categories = [
    "Todos",
    "Pestañas",
    "Manicuría",
    "Peluquería",
    "Estética Facial",
    "Estética Corporal",
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const weekDays = [
    { name: "Lunes", date: "18" },
    { name: "Martes", date: "19" },
    { name: "Miércoles", date: "20", active: true },
    { name: "Jueves", date: "21" },
    { name: "Viernes", date: "22" },
    { name: "Sábado", date: "23" },
  ];

  const sampleEvents = [
    {
      time: "09:00 AM",
      day: "20",
      client: "Camila Ruiz",
      service: "Pestañas Volumen Ruso",
      specialist: "Valentina",
      category: "Pestañas",
      color: "bg-[#FFF0ED] text-[#F89B88] border-[#FDE2E4]",
    },
    {
      time: "10:00 AM",
      day: "20",
      client: "Lucía Méndez",
      service: "Soft Gel + Nail Art",
      specialist: "Camila",
      category: "Manicuría",
      color: "bg-[#E2F5ED] text-[#2E8B6E] border-[#C3EAD9]",
    },
    {
      time: "11:00 AM",
      day: "21",
      client: "Mariana Silva",
      service: "Balayage + Nutrición",
      specialist: "Sofía",
      category: "Peluquería",
      color: "bg-[#EBF3FE] text-[#3B82F6] border-[#D6E5FD]",
    },
    {
      time: "01:00 PM",
      day: "20",
      client: "Florencia Paz",
      service: "Limpieza Facial Profunda",
      specialist: "Elena",
      category: "Estética Facial",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* HEADER DE NAVEGACIÓN SEMANAL */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
            Hoy
          </button>
          <div className="flex items-center gap-1 text-slate-400">
            <button className="p-1 hover:text-slate-700">
              <ChevronLeft size={18} />
            </button>
            <button className="p-1 hover:text-slate-700">
              <ChevronRight size={18} />
            </button>
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm">Agosto 2026</h3>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-full bg-[#E2F5ED] text-[#2E8B6E] text-xs font-bold">
            Día
          </button>
          <button className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100">
            Semana
          </button>
          <button className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100">
            Mes
          </button>
        </div>
      </div>

      {/* FILTROS POR CATEGORÍA ESTILO BADGE */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCurrentCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              currentCategoryFilter === cat
                ? "bg-[#67C3A5] text-white shadow-sm"
                : "bg-white text-slate-500 border border-slate-200/60 hover:bg-slate-50"
            }`}
          >
            ✓ {cat}
          </button>
        ))}
      </div>

      {/* REJILLA DE CALENDARIO / CRONOGRAMA */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-x-auto">
        <div className="min-w-[800px]">
          {/* DIAS DE LA SEMANA */}
          <div className="grid grid-cols-7 border-b border-slate-100 text-center py-4 bg-slate-50/50">
            <div className="text-xs font-bold text-slate-400">GMT -3</div>
            {weekDays.map((d) => (
              <div key={d.date} className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {d.name}
                </span>
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-extrabold ${
                    d.active
                      ? "bg-[#67C3A5] text-white shadow-md shadow-[#67C3A5]/30"
                      : "text-slate-700"
                  }`}
                >
                  {d.date}
                </span>
              </div>
            ))}
          </div>

          {/* CELDAS Y BLOQUES DE HORARIO */}
          <div className="divide-y divide-slate-100">
            {timeSlots.map((slot) => (
              <div
                key={slot}
                className="grid grid-cols-7 min-h-[90px] relative"
              >
                <div className="p-3 text-[11px] font-bold text-slate-400 border-r border-slate-100 bg-slate-50/30 flex items-start justify-center">
                  {slot}
                </div>
                {weekDays.map((day) => {
                  const match = sampleEvents.find(
                    (e) => e.time === slot && e.day === day.date,
                  );
                  return (
                    <div
                      key={day.date}
                      className="p-1.5 border-r border-slate-100/60 relative group hover:bg-slate-50/50 transition-colors"
                    >
                      {match && (
                        <div
                          className={`p-2.5 rounded-2xl border text-left h-full shadow-sm flex flex-col justify-between ${match.color}`}
                        >
                          <div>
                            <span className="text-[9px] font-extrabold uppercase opacity-80 block">
                              {match.specialist} • {match.category}
                            </span>
                            <p className="text-xs font-bold leading-tight mt-0.5">
                              {match.client}
                            </p>
                          </div>
                          <p className="text-[10px] font-medium opacity-90 truncate">
                            {match.service}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- VISTA 3: CONFIGURACIÓN Y AJUSTES DEL CENTRO ---

function SettingsView({ esteticaData, setEsteticaData }) {
  const [saving, setSaving] = useState(false);
  const [isPaying, setIsPaying] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verificationPin, setVerificationPin] = useState("");
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  const planes = [
    {
      id: "Glow",
      name: "Glow",
      price: 1,
      icon: <Zap size={18} />,
      features: ["1 Especialista", "50 citas/mes"],
    },
    {
      id: "Radiance",
      name: "Radiance",
      price: 1450,
      icon: <Star size={18} />,
      features: ["3 Especialistas", "250 citas/mes", "Estadísticas"],
    },
    {
      id: "Diamond",
      name: "Diamond",
      price: 2200,
      icon: <Crown size={18} />,
      features: [
        "Especialistas Ilimitados",
        "Citas ilimitadas",
        "Estadísticas y Finanzas",
      ],
    },
  ];

  const handleUpgrade = async (plan) => {
    setIsPaying(plan.id);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          planName: `${plan.name}`,
          price: plan.price,
          userId: auth.currentUser.uid,
          businessName: esteticaData.businessName,
          email: esteticaData.email,
          collection: "centros_estetica",
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Error al generar el link de pago");
      }
    } catch (error) {
      alert("Error de conexión con el servidor de pagos");
    } finally {
      setIsPaying(null);
    }
  };

  const handleSearchAddress = () => {
    if (!esteticaData?.direccion) {
      alert("Escribe una dirección primero");
      return;
    }
    const query = encodeURIComponent(esteticaData.direccion);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
    );
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1000000) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setEsteticaData({ ...esteticaData, logo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleTogglePinProtection = () => {
    if (esteticaData?.useAccountingPin) {
      setIsVerifyModalOpen(true);
    } else {
      setEsteticaData({ ...esteticaData, useAccountingPin: true });
    }
  };

  const confirmDeactivationAndSave = async (e) => {
    e.preventDefault();
    if (verificationPin === esteticaData?.adminPin) {
      setIsSavingSecurity(true);
      try {
        const ref = doc(db, "centros_estetica", auth.currentUser.uid);
        const updatedData = { ...esteticaData, useAccountingPin: false };
        await updateDoc(ref, updatedData);
        setEsteticaData(updatedData);
        setIsVerifyModalOpen(false);
        setVerificationPin("");
        alert("Protección desactivada.");
      } catch (error) {
        alert("Error al guardar.");
      } finally {
        setIsSavingSecurity(false);
      }
    } else {
      alert("PIN incorrecto");
      setVerificationPin("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      esteticaData?.useAccountingPin &&
      (!esteticaData?.adminPin || esteticaData.adminPin.length < 4)
    ) {
      alert("El PIN debe ser de 4 dígitos");
      return;
    }
    setSaving(true);
    try {
      const ref = doc(db, "centros_estetica", auth.currentUser.uid);
      await updateDoc(ref, esteticaData);
      alert("Ajustes guardados con éxito");
    } catch (e) {
      alert("Error al guardar los ajustes");
    } finally {
      setSaving(false);
    }
  };

  const daysLeft = () => {
    if (!esteticaData?.plan?.expiresAt) return 0;
    const expires = esteticaData.plan.expiresAt.toDate
      ? esteticaData.plan.expiresAt.toDate()
      : new Date(esteticaData.plan.expiresAt);
    const diff = expires - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto pb-24">
      {/* IDENTIDAD DE MARCA */}
      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-[#FFF0ED] border-2 border-white shadow-md flex items-center justify-center text-[#F89B88]">
            {esteticaData?.logo ? (
              <img
                src={esteticaData.logo}
                className="w-full h-full object-cover"
                alt="Logo"
              />
            ) : (
              <Sparkles size={32} />
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 bg-[#67C3A5] p-2 rounded-xl text-white cursor-pointer shadow-md hover:scale-105 transition-transform">
            <Camera size={14} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </label>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Imagen de Marca del Centro
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Logotipo visible en el portal de clientes y notificaciones
          </p>
        </div>
      </section>

      {/* FORMULARIO DE DATOS DE CONTACTO */}
      <form onSubmit={handleSave} className="space-y-6">
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
              Nombre del Studio / Centro
            </label>
            <input
              value={esteticaData?.businessName || ""}
              onChange={(e) =>
                setEsteticaData({
                  ...esteticaData,
                  businessName: e.target.value,
                })
              }
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#67C3A5]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
              WhatsApp Comercial
            </label>
            <input
              placeholder="099 123 456"
              value={esteticaData?.telefono || ""}
              onChange={(e) =>
                setEsteticaData({ ...esteticaData, telefono: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#67C3A5]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
              Dirección Física
            </label>
            <div className="flex gap-2">
              <input
                placeholder="Calle, Número, Ciudad"
                value={esteticaData?.direccion || ""}
                onChange={(e) =>
                  setEsteticaData({
                    ...esteticaData,
                    direccion: e.target.value,
                  })
                }
                className="flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#67C3A5]"
              />
              <button
                type="button"
                onClick={handleSearchAddress}
                className="px-5 bg-slate-800 text-white rounded-2xl text-xs font-bold"
              >
                Ver Mapa
              </button>
            </div>
          </div>
        </section>

        {/* ENLACE DE RESERVAS ONLINE */}
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={16} className="text-[#67C3A5]" /> Portal de Reservas
            Online
          </h4>
          <div className="flex gap-2">
            <div className="flex-1 bg-[#E2F5ED]/50 border border-[#C3EAD9] p-3 rounded-2xl text-xs font-medium text-[#2E8B6E] truncate">
              {`https://aura-estetica.vercel.app/reserva/${auth.currentUser?.uid}`}
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://aura-estetica.vercel.app/reserva/${auth.currentUser?.uid}`,
                );
                alert("Link copiado al portapapeles");
              }}
              className="px-5 bg-[#67C3A5] hover:bg-[#52B293] text-white rounded-2xl text-xs font-bold transition-all"
            >
              Copiar
            </button>
          </div>
        </section>

        {/* PLANES Y SUSCRIPCIÓN */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Suscripción CRM
            </h4>
            <span className="text-[10px] font-bold px-3 py-1 bg-[#E2F5ED] text-[#2E8B6E] rounded-full">
              {daysLeft()} Días Restantes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {planes.map((p) => {
              const isCurrent = esteticaData?.plan?.type === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    isCurrent
                      ? "border-[#67C3A5] bg-[#E2F5ED]/20 shadow-sm"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <div className="text-[#67C3A5] mb-2">{p.icon}</div>
                  <h5 className="font-extrabold text-slate-800 text-sm">
                    {p.name}
                  </h5>
                  <p className="text-xl font-black text-slate-800 my-2">
                    ${p.price}
                    <span className="text-[10px] font-normal text-slate-400 ml-1">
                      /mes
                    </span>
                  </p>
                  <ul className="text-[10px] font-semibold text-slate-500 space-y-2 mb-6">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-[#67C3A5]" />{" "}
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <div className="text-center py-2.5 bg-[#E2F5ED] text-[#2E8B6E] rounded-2xl text-xs font-bold">
                      Plan Activo
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isPaying !== null}
                      onClick={() => handleUpgrade(p)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-xs font-bold transition-all"
                    >
                      {isPaying === p.id ? (
                        <Loader2 className="animate-spin mx-auto" size={14} />
                      ) : (
                        "Cambiar Plan"
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-[#67C3A5] hover:bg-[#52B293] text-white px-8 py-3.5 rounded-full font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>

      {/* MODAL VERIFICACIÓN DE SEGURIDAD */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center border border-slate-100">
            <div className="w-12 h-12 bg-[#FFF0ED] text-[#F89B88] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              PIN de Desactivación
            </h3>
            <form
              onSubmit={confirmDeactivationAndSave}
              className="space-y-4 mt-4"
            >
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={verificationPin}
                onChange={(e) =>
                  setVerificationPin(e.target.value.replace(/\D/g, ""))
                }
                className="w-full bg-slate-50 rounded-2xl py-3 text-center text-xl font-bold tracking-widest outline-none border border-slate-200 focus:border-[#67C3A5]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsVerifyModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#67C3A5] text-white rounded-2xl text-xs font-bold"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- COMPONENTE CONTENEDOR PRINCIPAL ---

export default function EsteticaCRMContainer() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [esteticaData, setEsteticaData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToComplete, setAppointmentToComplete] = useState(null);

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
          console.error("Error al obtener datos:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleAddAppointment = async (e) => {
    e.preventDefault();

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
      date: new Date().toLocaleDateString("sv-SE"),
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
    } catch (error) {
      alert("Error al guardar la cita.");
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
      alert("Error al registrar el pago.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="animate-spin text-[#67C3A5]" size={36} />
      </div>
    );
  }

  const team = esteticaData?.specialists || [
    { id: "1", name: "Valentina (Pestañas)" },
    { id: "2", name: "Camila (Manicuría)" },
    { id: "3", name: "Sofía (Peluquería)" },
  ];

  return (
    <div className="flex h-screen bg-[#FAF8F5] text-slate-700 font-sans overflow-hidden">
      {/* SIDEBAR VISTA BYUTIE */}
      <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-slate-100 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-[#E2F5ED] text-[#42B18C] flex items-center justify-center font-bold">
              <Sparkle size={20} className="fill-[#42B18C]" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-lg tracking-tight leading-none">
                byutie
              </h2>
              <span className="text-[10px] font-medium text-slate-400">
                Salon & Studio
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <NavItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            />
            <NavItem
              icon={<CalendarIcon size={18} />}
              label="Agenda de Turnos"
              active={activeTab === "schedule"}
              onClick={() => setActiveTab("schedule")}
            />
            <NavItem
              icon={<Settings size={18} />}
              label="Ajustes Centro"
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
          </nav>
        </div>

        <div className="space-y-4">
          <div className="bg-[#FFF0ED] p-4 rounded-3xl border border-[#FDE2E4]/60 relative overflow-hidden">
            <p className="text-xs font-bold text-slate-800 mb-1">
              Retoques 21 Días ✨
            </p>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Sistema automático para pestañas y manicuría.
            </p>
          </div>

          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors w-full"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* BARRA SUPERIOR */}
        <header className="px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="flex items-center bg-white border border-slate-200/80 rounded-full px-4 py-2.5 w-full shadow-sm focus-within:border-[#67C3A5] transition-all">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar cliente, servicio o especialista..."
                className="bg-transparent border-none outline-none ml-2 text-xs w-full text-slate-700 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-[#67C3A5] hover:bg-[#52B293] text-white rounded-full font-bold text-xs transition-all flex items-center gap-2 shadow-sm shadow-[#67C3A5]/20"
            >
              <Plus size={16} />
              Nuevo Turno
            </button>

            <div className="h-8 w-[1px] bg-slate-200 mx-1" />

            <div className="flex items-center gap-3 pl-2">
              <img
                src={
                  esteticaData?.logo ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                }
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {esteticaData?.businessName || "Byutie Studio"}
                </p>
                <span className="text-[10px] text-slate-400">
                  Panel Administración
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* VISTAS MODULARES */}
        {activeTab === "dashboard" && (
          <DashboardView
            esteticaData={esteticaData}
            setEsteticaData={setEsteticaData}
            setIsModalOpen={setIsModalOpen}
            setAppointmentToComplete={setAppointmentToComplete}
          />
        )}

        {activeTab === "schedule" && (
          <ScheduleView esteticaData={esteticaData} />
        )}

        {activeTab === "settings" && (
          <SettingsView
            esteticaData={esteticaData}
            setEsteticaData={setEsteticaData}
          />
        )}
      </main>

      {/* MODAL NUEVO TURNO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#FAF8F5]">
              <h3 className="font-bold text-slate-800 text-sm">
                Agendar Nueva Cita
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Nombre de la Clienta
                </label>
                <input
                  required
                  name="clientName"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#67C3A5]"
                  placeholder="Ej. Valentina Rossi"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  WhatsApp
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
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
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
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
                Confirmar Reserva
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL COBRO */}
      {appointmentToComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-slate-100">
            <div className="text-center mb-6">
              <div className="bg-[#E2F5ED] text-[#42B18C] w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Cerrar Cita y Cobrar
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
    </div>
  );
}
