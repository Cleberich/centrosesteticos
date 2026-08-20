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

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  ShieldCheck,
  Loader2,
  Camera,
  Calendar,
  Lock,
  Zap,
  Star,
  Crown,
  MapPin,
  Sparkles,
  Scissors,
  Sparkle,
  Eye,
  CheckCircle2,
  History,
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  MessageSquare,
  LogOut,
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
  const [esteticaData, setEsteticaData] = useState(null);

  // Estados de Seguridad
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verificationPin, setVerificationPin] = useState("");
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  const planes = [
    {
      id: "Inicial",
      name: "Inicial",
      price: 0,
      icon: <Zap size={20} className="text-emerald-500" />,
      features: [
        "1 Especialista",
        "30 citas gratis",
        "Agenda digital",
        "Fichas de clientes",
      ],
    },
    {
      id: "Starter",
      name: "Starter",
      price: 2,
      icon: <Star size={20} className="text-emerald-500" />,
      features: [
        "1 Especialista",
        "90 citas",
        "Agenda digital",
        "Fichas de clientes",
        "Recordatorios por WhatsApp",
      ],
    },
    {
      id: "Profesional",
      name: "Profesional",
      price: 2460,
      icon: <Star size={20} className="text-emerald-500" />,
      features: [
        "3 Especialistas",
        "250 citas",
        "Recordatorios por WhatsApp",
        "Historial clínico digital",
        "Reportes de comisiones",
      ],
    },
    {
      id: "Business",
      name: "Business",
      price: 3650,
      icon: <Crown size={20} className="text-emerald-500" />,
      features: [
        "5 Especialistas",
        "Citas sin límite",
        "Historial clínico digital",
        "Módulo de finanzas",
        "Reportes avanzados",
        "Soporte prioritario",
      ],
    },
  ];

  const servicios = [
    {
      id: "peluqueria",
      label: "Peluquería & Peinados",
      icon: <Scissors size={16} />,
    },
    {
      id: "manicuria",
      label: "Manicuría & Nails",
      icon: <Sparkle size={16} />,
    },
    { id: "pestanas", label: "Lash & Cejas", icon: <Eye size={16} /> },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "centros_estetica", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setEsteticaData(docSnap.data());
          }

          const paymentId = searchParams.get("payment_id");
          const paymentStatus = searchParams.get("payment_status");
          if (paymentStatus === "success") {
            if (paymentId) {
              const confirmationResponse = await fetch("/api/payments/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, userId: user.uid }),
              });

              if (confirmationResponse.ok) {
                const updatedDoc = await getDoc(docRef);
                if (updatedDoc.exists()) {
                  setEsteticaData(updatedDoc.data());
                }
              }
            }

            const updatedDoc = await getDoc(docRef);
            if (updatedDoc.exists()) {
              setEsteticaData(updatedDoc.data());
            }
            router.replace("/dashboard/settings");
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
  }, [router, searchParams]);

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
        alert(data.error || "Error al generar el enlace de pago");
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
        alert("Protección de finanzas desactivada.");
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
      alert("Error al guardar");
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

  const formatPaymentDate = (value) => {
    if (!value) return "Sin registrar";
    const date = value.toDate
      ? value.toDate()
      : value.seconds
        ? new Date(value.seconds * 1000)
        : new Date(value);
    if (Number.isNaN(date.getTime())) return "Sin registrar";
    return date.toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const paymentHistory = [...(esteticaData?.paymentHistory || [])].sort(
    (first, second) => {
      const firstDate = first.date?.seconds || 0;
      const secondDate = second.date?.seconds || 0;
      return secondDate - firstDate;
    },
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF6F4]">
        <Loader2 className="animate-spin text-[#d87cef]" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FBF8F6] font-sans text-slate-700 flex">
      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto space-y-8 overflow-y-auto">
        <header className="flex justify-between items-center bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-rose-100/50 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Ajustes del Salón
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Configura la presencia de tu Centro de Peluquería, Manicuría y
              Cejas
            </p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all border border-rose-100"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </header>

        {/* LOGO & MARCA */}
        <section className="bg-white p-8 rounded-[2rem] border border-rose-100/60 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="size-28 rounded-3xl overflow-hidden bg-rose-50 border-2 border-rose-100 shadow-inner flex items-center justify-center">
              {esteticaData?.logo ? (
                <img
                  src={esteticaData.logo}
                  className="w-full h-full object-cover"
                  alt="Logo"
                />
              ) : (
                <Sparkles className="text-rose-300" size={36} />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 bg-emerald-400 hover:bg-emerald-500 p-2.5 rounded-2xl text-white cursor-pointer shadow-md transition-all">
              <Camera size={16} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </label>
          </div>
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-lg font-bold text-slate-800">
              Logo del Centro
            </h3>
            <p className="text-xs text-slate-400">
              Sube la insignia de tu peluquería o salón de manicura (PNG o JPG,
              máx 1MB).
            </p>
          </div>
        </section>

        {/* FORMULARIO DE INFORMACIÓN GENERAL */}
        <form onSubmit={handleSave} className="space-y-8">
          <section className="bg-white p-8 rounded-[2rem] border border-rose-100/60 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-xs border-b border-slate-100 pb-3">
              Información General
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">
                  Nombre del Salón / Estética
                </label>
                <input
                  value={esteticaData?.businessName || ""}
                  onChange={(e) =>
                    setEsteticaData({
                      ...esteticaData,
                      businessName: e.target.value,
                    })
                  }
                  placeholder="Ej. Glamour Beauty Salon"
                  className="w-full bg-slate-50/60 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-400 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">
                  Teléfono de Contacto / WhatsApp
                </label>
                <input
                  placeholder="09X XXX XXX"
                  value={esteticaData?.telefono || ""}
                  onChange={(e) =>
                    setEsteticaData({
                      ...esteticaData,
                      telefono: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50/60 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-400 focus:bg-white transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <MapPin size={14} className="text-rose-400" /> Dirección del
                  Local
                </label>
                <div className="flex gap-3">
                  <input
                    placeholder="Calle, Número, Ciudad"
                    value={esteticaData?.direccion || ""}
                    onChange={(e) =>
                      setEsteticaData({
                        ...esteticaData,
                        direccion: e.target.value,
                      })
                    }
                    className="flex-1 bg-slate-50/60 border border-slate-200/80 p-3.5 rounded-2xl text-xs font-semibold text-slate-800 outline-none focus:border-emerald-400 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleSearchAddress}
                    className="px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold text-xs transition-colors"
                  >
                    Ubicación
                  </button>
                </div>
              </div>
            </div>

            {/* SELECCIÓN DE ESPECIALIDADES */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-600 mb-3 block">
                Servicios Ofrecidos
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {servicios.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/40 text-xs font-semibold text-slate-700"
                  >
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      {s.icon}
                    </div>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FINANZAS Y SEGURIDAD PIN */}
          <section className="bg-white p-8 rounded-[2rem] border border-rose-100/60 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-500" />{" "}
                  Proteccion de Finanzas
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Protege los reportes de ingresos y caja mediante un PIN de 4
                  dígitos.
                </p>
              </div>
              <div
                onClick={handleTogglePinProtection}
                className={`w-12 h-7 rounded-full flex items-center px-1 cursor-pointer transition-colors ${
                  esteticaData?.useAccountingPin
                    ? "bg-emerald-400 justify-end"
                    : "bg-slate-200 justify-start"
                }`}
              >
                <div className="size-5 bg-white rounded-full shadow-md" />
              </div>
            </div>

            {esteticaData?.useAccountingPin && (
              <div className="pt-2">
                <input
                  type="password"
                  maxLength={4}
                  placeholder="0 0 0 0"
                  value={esteticaData?.adminPin || ""}
                  onChange={(e) =>
                    setEsteticaData({
                      ...esteticaData,
                      adminPin: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-48 bg-rose-50/50 border-2 border-dashed border-rose-200 rounded-2xl py-3 px-4 text-center text-xl font-bold tracking-[0.4em] text-rose-600 outline-none focus:border-rose-400"
                />
              </div>
            )}
          </section>

          {/* RESERVAS LINK */}
          <section className="bg-white p-8 rounded-[2rem] border border-rose-100/60 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={18} className="text-rose-400" /> Enlace Público de
              Reservas
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-xs font-mono text-slate-600 truncate">
                {`https://centros-esteticos.vercel.app/reserva/${auth.currentUser?.uid}`}
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://centros-esteticos.vercel.app/reserva/${auth.currentUser?.uid}`,
                  );
                  alert("Enlace copiado");
                }}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-6 py-3 rounded-2xl font-bold text-xs transition-colors"
              >
                Copiar
              </button>
            </div>
          </section>

          {/* PLANES & SUSCRIPCIÓN */}
          <section className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-sm font-bold text-slate-800">
                Plan de Suscripción
              </h3>
              <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                {daysLeft()} Días Restantes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {planes.map((p) => {
                const isCurrent = esteticaData?.plan?.type === p.id;
                return (
                  <div
                    key={p.id}
                    className={`p-7 rounded-[2rem] border transition-all flex flex-col justify-between ${
                      isCurrent
                        ? "bg-emerald-50/40 border-emerald-300 shadow-md"
                        : "bg-white border-rose-100/60 shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="p-3 bg-white size-12 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                        {p.icon}
                      </div>
                      <h4 className="font-bold text-slate-800 text-base">
                        {p.name}
                      </h4>
                      <p className="text-2xl font-extrabold text-slate-900 mt-2 mb-6">
                        ${p.price}
                        <span className="text-xs font-medium text-slate-400 ml-1">
                          /mes
                        </span>
                      </p>

                      <ul className="space-y-3 mb-8">
                        {p.features.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-xs font-medium text-slate-600"
                          >
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500 shrink-0"
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {isCurrent ? (
                      <div className="w-full py-3 bg-emerald-500 text-white rounded-2xl text-center text-xs font-bold">
                        Plan Activo
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isPaying !== null}
                        onClick={() => handleUpgrade(p)}
                        className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        {isPaying === p.id ? (
                          <Loader2 className="animate-spin" size={16} />
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

          {/* HISTORIAL DE PAGOS */}
          <section className="bg-white p-8 rounded-[2rem] border border-rose-100/60 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <History size={18} className="text-emerald-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Información de pago
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Pagos confirmados por Mercado Pago y fecha de vencimiento.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Último pago
                </p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">
                  $
                  {Number(
                    esteticaData?.plan?.lastPaymentAmount ||
                      esteticaData?.plan?.price ||
                      0,
                  ).toLocaleString("es-UY")}
                </p>
                <p className="text-xs text-slate-500">
                  {formatPaymentDate(esteticaData?.plan?.lastPayment)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Vencimiento
                </p>
                <p className="text-lg font-extrabold text-slate-800 mt-1">
                  {formatPaymentDate(esteticaData?.plan?.expiresAt)}
                </p>
                <p className="text-xs text-slate-500">
                  {daysLeft()} días restantes
                </p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Medio de pago
                </p>
                <p className="text-lg font-extrabold text-slate-800 mt-1 capitalize">
                  {esteticaData?.plan?.lastPaymentMethod || "Sin registrar"}
                </p>
                <p className="text-xs text-slate-500">
                  {esteticaData?.plan?.lastPaymentStatus === "approved"
                    ? "Pago aprobado"
                    : esteticaData?.plan?.lastPaymentStatus || "Sin registrar"}
                </p>
              </div>
            </div>

            {paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 text-[10px] uppercase text-slate-400">
                    <tr>
                      <th className="py-3 pr-4">Fecha</th>
                      <th className="py-3 pr-4">Plan</th>
                      <th className="py-3 pr-4">Importe</th>
                      <th className="py-3 pr-4">Vence</th>
                      <th className="py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.paymentId}>
                        <td className="py-3 pr-4 text-slate-600">
                          {formatPaymentDate(payment.date)}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-slate-700">
                          {payment.planName || payment.planType || "Plan"}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-slate-700">
                          $
                          {(Number(payment.amount) || 0).toLocaleString(
                            "es-UY",
                          )}{" "}
                          {payment.currency || "UYU"}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {formatPaymentDate(payment.expiresAt)}
                        </td>
                        <td className="py-3">
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                            {payment.status === "approved"
                              ? "Aprobado"
                              : payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Todavía no hay pagos registrados.
              </p>
            )}
          </section>

          {/* BOTÓN FLOTANTE */}
          <button
            type="submit"
            className="fixed bottom-8 right-8 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-xs shadow-xl flex items-center gap-2.5 transition-all hover:scale-105 z-50"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>

        {/* MODAL VERIFICACIÓN PIN */}
        {isVerifyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xs rounded-[2rem] shadow-2xl p-8 text-center space-y-5 border border-rose-100">
              <div className="size-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Desactivar PIN
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ingresa tu clave de 4 dígitos para confirmar.
                </p>
              </div>

              <form onSubmit={confirmDeactivationAndSave} className="space-y-4">
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  value={verificationPin}
                  onChange={(e) =>
                    setVerificationPin(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 text-center text-xl font-bold tracking-[0.5em] outline-none focus:border-rose-400"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsVerifyModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-rose-500 text-white rounded-2xl font-bold text-xs"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-[#FAF6F4]">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
