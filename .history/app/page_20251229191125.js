// import Link from "next/link";
// import {
//   Scissors,
//   Menu,
//   CheckCircle2,
//   Calendar,
//   ShieldCheck,
//   Megaphone,
//   Check,
//   Globe,
//   Instagram,
//   Linkedin,
//   Star,
//   User,
// } from "lucide-react";

// const HomePage = () => {
//   return (
//     <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
//       {/* Navigation */}
//       <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-10 py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2 text-slate-900 dark:text-white">
//               <div className="bg-blue-600 p-1.5 rounded-lg text-white">
//                 <Scissors size={20} />
//               </div>
//               <h2 className="text-lg font-bold tracking-tight">
//                 BarberManager
//               </h2>
//             </div>
//             <nav className="hidden md:flex items-center gap-9">
//               <a
//                 className="text-sm font-medium hover:text-blue-600 transition-colors"
//                 href="#features"
//               >
//                 Funcionalidades
//               </a>
//               <a
//                 className="text-sm font-medium hover:text-blue-600 transition-colors"
//                 href="#pricing"
//               >
//                 Precios
//               </a>
//               <a
//                 className="text-sm font-medium hover:text-blue-600 transition-colors"
//                 href="/login"
//               >
//                 Ingresar
//               </a>
//             </nav>
//             <div className="flex items-center gap-4">
//               <a
//                 href="/register"
//                 className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-bold"
//               >
//                 Registrar mi barbería
//               </a>
//               <a href="/register" className="md:hidden p-2">
//                 <Menu size={24} />
//               </a>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="relative w-full">
//         <div className="max-w-7xl mx-auto px-4 sm:px-10 py-12 lg:py-20">
//           <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 items-center">
//             <div className="flex flex-col gap-6 lg:w-1/2">
//               <div className="flex flex-col gap-4 text-left">
//                 <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
//                   <span className="relative flex h-2 w-2">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
//                   </span>
//                   Nuevo: Integración con WhatsApp
//                 </div>
//                 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
//                   Gestiona tu barbería como un profesional
//                 </h1>
//                 <h2 className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
//                   Olvídate del papel y lápiz. Consigue más clientes, automatiza
//                   tus reservas y controla tus finanzas con nuestra plataforma
//                   todo en uno.
//                 </h2>
//               </div>
//               <div className="flex flex-col sm:flex-row gap-4 mt-2">
//                 <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-blue-600 hover:bg-blue-700 transition-all text-white text-base font-bold shadow-lg shadow-blue-500/20">
//                   Empezar prueba gratis
//                 </button>
//                 <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-900 dark:text-white text-base font-bold">
//                   Ver demostración
//                 </button>
//               </div>
//               <p className="text-sm text-slate-500">
//                 * No requiere tarjeta de crédito para empezar.
//               </p>
//             </div>

//             <div className="w-full lg:w-1/2 relative">
//               <div className="absolute -inset-4 bg-blue-600/20 rounded-xl blur-2xl opacity-50 dark:opacity-20"></div>
//               <div className="relative w-full aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80')] bg-center bg-cover rounded-xl shadow-2xl overflow-hidden group">
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
//                 <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur p-4 rounded-lg shadow-lg transform transition-transform group-hover:-translate-y-2 duration-300">
//                   <div className="flex items-center gap-4">
//                     <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
//                       <CheckCircle2 size={20} />
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-slate-900 dark:text-white">
//                         Nueva Reserva Confirmada
//                       </p>
//                       <p className="text-xs text-slate-500 dark:text-slate-400">
//                         Carlos M. - Corte y Barba - Hoy 16:00
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Trust/Stats Bar */}
//       <div className="w-full border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
//           <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-center">
//             La plataforma elegida por más de 500 barberías
//           </p>
//           <div className="flex items-center gap-8 md:gap-12 text-slate-400">
//             <div className="flex items-center gap-2">
//               <Scissors size={18} /> BarberKings
//             </div>
//             <div className="flex items-center gap-2">
//               <User size={18} /> Gentleman's Club
//             </div>
//             <div className="flex items-center gap-2">
//               <Star size={18} /> EliteCuts
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Benefits Section */}
//       <section className="py-20 px-4 sm:px-10 max-w-7xl mx-auto" id="features">
//         <div className="flex flex-col gap-4 mb-12 text-center items-center">
//           <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
//             Beneficios Principales
//           </h2>
//           <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
//             Herramientas diseñadas específicamente para el crecimiento de tu
//             negocio de barbería.
//           </p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {[
//             {
//               icon: <Calendar size={32} />,
//               title: "Agenda 24/7",
//               desc: "Tus clientes reservan mientras duermes. Gestión inteligente de turnos y disponibilidad.",
//             },
//             {
//               icon: <ShieldCheck size={32} />,
//               title: "Pagos Seguros",
//               desc: "Reduce las inasistencias solicitando depósitos previos o cobros completos online.",
//             },
//             {
//               icon: <Megaphone size={32} />,
//               title: "Marketing Automático",
//               desc: "Recordatorios por SMS y WhatsApp para evitar olvidos y fidelizar clientes.",
//             },
//           ].map((item, i) => (
//             <div
//               key={i}
//               className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="text-blue-600 dark:text-blue-400 mb-2">
//                 {item.icon}
//               </div>
//               <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
//               <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
//                 {item.desc}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Pricing Section */}
//       <section className="py-20 px-4 sm:px-10 max-w-7xl mx-auto" id="pricing">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-black mb-4">
//             Planes de Membresía
//           </h2>
//           <p className="text-lg text-slate-600 dark:text-slate-400">
//             Elige el plan perfecto para la etapa de tu negocio.
//           </p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
//           {[
//             {
//               name: "Barbero Independiente",
//               desc: "Para profesionales que inician.",
//               price: 19,
//               features: [
//                 "Agenda Online Básica",
//                 "Hasta 100 Clientes",
//                 "Recordatorios por Email",
//               ],
//               popular: false,
//             },
//             {
//               name: "Barbería Profesional",
//               desc: "Para dueños de local.",
//               price: 49,
//               features: [
//                 "Agenda Ilimitada",
//                 "Hasta 5 Barberos",
//                 "Recordatorios SMS & WhatsApp",
//                 "Reportes Financieros",
//                 "Pagos Online",
//               ],
//               popular: true,
//             },
//             {
//               name: "Franquicias",
//               desc: "Para múltiples sucursales.",
//               price: 99,
//               features: [
//                 "Todo lo de Pro",
//                 "Múltiples Locales",
//                 "API & Integraciones",
//                 "Soporte Prioritario 24/7",
//               ],
//               popular: false,
//             },
//           ].map((plan, i) => (
//             <div
//               key={i}
//               className={`rounded-2xl p-8 flex flex-col gap-6 relative transition-all ${
//                 plan.popular
//                   ? "border-2 border-blue-600 bg-white dark:bg-slate-800 shadow-xl md:-translate-y-4"
//                   : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
//               }`}
//             >
//               {plan.popular && (
//                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
//                   Más Popular
//                 </div>
//               )}
//               <div>
//                 <h3 className="text-xl font-bold">{plan.name}</h3>
//                 <p className="text-sm text-slate-500 mt-2">{plan.desc}</p>
//               </div>
//               <div className="flex items-baseline gap-1">
//                 <span className="text-4xl font-black">${plan.price}</span>
//                 <span className="text-slate-500">/mes</span>
//               </div>
//               <ul className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
//                 {plan.features.map((f, j) => (
//                   <li key={j} className="flex items-center gap-3">
//                     <Check
//                       size={18}
//                       className={
//                         plan.popular ? "text-blue-600" : "text-green-500"
//                       }
//                     />
//                     {f}
//                   </li>
//                 ))}
//               </ul>
//               <button
//                 className={`w-full rounded-lg h-12 font-bold transition-colors ${
//                   plan.popular
//                     ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
//                     : "border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
//                 }`}
//               >
//                 {plan.popular
//                   ? "Probar Pro Gratis"
//                   : plan.price === 99
//                   ? "Contactar Ventas"
//                   : "Comenzar Gratis"}
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="py-20 px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="rounded-3xl bg-slate-900 dark:bg-blue-900/20 p-8 sm:p-16 relative overflow-hidden">
//             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl"></div>
//             <div className="relative z-10 text-white">
//               <h2 className="text-3xl sm:text-4xl font-black mb-6">
//                 ¿Listo para llevar tu barbería al siguiente nivel?
//               </h2>
//               <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
//                 Únete a cientos de barberos que ya han modernizado su negocio.
//                 Prueba BarberManager gratis por 14 días.
//               </p>
//               <button className="inline-flex min-w-[200px] items-center justify-center rounded-lg h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold transition-all shadow-xl shadow-blue-900/50">
//                 Registrar mi barbería ahora
//               </button>
//               <p className="mt-4 text-sm text-slate-400">
//                 Sin contratos forzosos. Cancela cuando quieras.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-16 pb-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-10">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
//             <div className="col-span-2 md:col-span-1">
//               <div className="flex items-center gap-2 text-slate-900 dark:text-white mb-4">
//                 <Scissors size={24} className="text-blue-600" />
//                 <span className="text-lg font-bold">BarberManager</span>
//               </div>
//               <p className="text-sm text-slate-500 leading-relaxed">
//                 La plataforma líder en gestión para barberías modernas.
//                 Simplificamos tu día a día.
//               </p>
//             </div>
//             {[
//               {
//                 title: "Producto",
//                 links: [
//                   "Funcionalidades",
//                   "Precios",
//                   "Integraciones",
//                   "Actualizaciones",
//                 ],
//               },
//               {
//                 title: "Compañía",
//                 links: ["Sobre Nosotros", "Blog", "Carreras", "Contacto"],
//               },
//               {
//                 title: "Legal",
//                 links: ["Privacidad", "Términos", "Seguridad"],
//               },
//             ].map((col, i) => (
//               <div key={i}>
//                 <h4 className="font-bold mb-4">{col.title}</h4>
//                 <ul className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
//                   {col.links.map((link, j) => (
//                     <li key={j}>
//                       <a
//                         className="hover:text-blue-600 transition-colors"
//                         href="#"
//                       >
//                         {link}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//           <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-sm text-slate-400">
//               © 2024 BarberManager. Todos los derechos reservados.
//             </p>
//             <div className="flex gap-4 text-slate-400">
//               <Link href="#" className="hover:text-blue-600">
//                 <Globe size={20} />
//               </Link>
//               <Link href="#" className="hover:text-blue-600">
//                 <Instagram size={20} />
//               </Link>
//               <Link href="#" className="hover:text-blue-600">
//                 <Linkedin size={20} />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;
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
  Calendar as CalendarIcon,
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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

  // Función para obtener la fecha de hoy en formato YYYY-MM-DD local
  const getTodayStr = () => new Date().toLocaleDateString("sv-SE");

  // Estado inicial para citas nuevas
  const initialAppState = {
    id: null,
    customer: "",
    phone: "",
    email: "",
    barber: "",
    start: "09:00",
    day: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
    date: getTodayStr(),
    status: "pending",
    selectedServiceIds: [],
  };

  const [currentApp, setCurrentApp] = useState(initialAppState);

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

  // FILTRADO ESTRICTO: SOLO HOY
  const filteredAppointments = useMemo(() => {
    const today = getTodayStr();

    // Filtramos para que SOLO aparezcan las de la fecha actual
    const todayApps = appointments.filter((app) => app.date === today);

    if (viewFilter === "all") return todayApps;
    return todayApps.filter((app) => app.barber === viewFilter);
  }, [appointments, viewFilter]);

  const { totalAmount, totalDuration } = useMemo(() => {
    if (
      !currentApp.selectedServiceIds ||
      currentApp.selectedServiceIds.length === 0
    ) {
      const serviceByName = availableServices.find(
        (s) => s.name === currentApp.service
      );
      return {
        totalAmount: Number(serviceByName?.price) || 0,
        totalDuration: Number(serviceByName?.time) || 30,
      };
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
  }, [currentApp.selectedServiceIds, currentApp.service, availableServices]);

  const saveToFirebase = async (newList) => {
    const docRef = doc(db, "barberias", user.uid);
    await updateDoc(docRef, { appointments: newList });
  };

  const handleDelete = async () => {
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
    if (!currentApp.customer) return alert("Falta el nombre del cliente");

    const appData = {
      ...currentApp,
      id: currentApp.id || Date.now().toString(),
      total: totalAmount,
      duration: totalDuration,
      // Forzamos la fecha de hoy si no tiene una válida
      date: currentApp.date || getTodayStr(),
      selectedServiceIds:
        currentApp.selectedServiceIds.length > 0
          ? currentApp.selectedServiceIds
          : availableServices.find((s) => s.name === currentApp.service)
          ? [availableServices.find((s) => s.name === currentApp.service).id]
          : [],
    };

    let newList = appointments.some(
      (a) => String(a.id) === String(currentApp.id)
    )
      ? appointments.map((a) =>
          String(a.id) === String(currentApp.id) ? appData : a
        )
      : [...appointments, appData];

    setAppointments(newList);
    await saveToFirebase(newList);
    setIsDrawerOpen(false);
  };

  const handleFinalizePayment = async () => {
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
      <div className="h-screen flex items-center justify-center bg-white dark:bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      {/* HEADER */}
      <header className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter dark:text-white">
              Agenda <span className="text-blue-600">de Hoy</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
              <CalendarIcon size={12} />{" "}
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentApp({
                ...initialAppState,
                barber: team[0]?.name || "",
              });
              setShowPaymentSelector(false);
              setIsDrawerOpen(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
          >
            Nueva Cita
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setViewFilter("all")}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
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
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
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

      {/* CALENDARIO VISUAL */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[1000px] h-full flex flex-col">
          <div className="flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#0a0f1a] z-20">
            <div className="w-20 shrink-0 border-r border-slate-100 dark:border-slate-800" />
            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800 uppercase text-[10px] font-black text-slate-400">
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
            <div className="w-20 shrink-0 border-r border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-300 text-center">
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
                    const serviceMatch = availableServices.find(
                      (s) => s.name === app.service
                    );
                    setCurrentApp({
                      ...app,
                      selectedServiceIds:
                        app.selectedServiceIds ||
                        (serviceMatch ? [serviceMatch.id] : []),
                      date: app.date || getTodayStr(), // Reparación al abrir
                    });
                    setShowPaymentSelector(false);
                    setIsDrawerOpen(true);
                  }}
                  className={`absolute left-1 right-1 rounded-xl border-l-4 p-2 z-10 shadow-md cursor-pointer transition-all hover:brightness-95 ${
                    app.status === "done"
                      ? "bg-slate-100 border-slate-300 text-slate-400 grayscale opacity-60"
                      : `${barberColorMap[app.barber]?.bg || "bg-blue-600"} ${
                          barberColorMap[app.barber]?.border ||
                          "border-blue-400"
                        } text-white`
                  }`}
                  style={{
                    top: getTimeTop(app.start),
                    height: (app.duration / 60) * HOUR_HEIGHT - 2,
                    gridColumnStart: app.day + 1,
                    gridColumnEnd: app.day + 2,
                  }}
                >
                  <p className="text-[10px] font-black uppercase italic truncate">
                    {app.customer}
                  </p>
                  <div className="flex items-center gap-1 mt-1 opacity-80 text-[8px] font-bold">
                    <Clock size={8} /> {app.duration} min
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER (LATERAL) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-[450px] bg-white dark:bg-slate-900 h-full flex flex-col p-8 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic uppercase dark:text-white">
                {showPaymentSelector ? "Cobrar" : "Detalles del Turno"}
              </h2>
              <div className="flex gap-2">
                {currentApp.id &&
                  currentApp.status !== "done" &&
                  !showPaymentSelector && (
                    <button
                      onClick={handleDelete}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full dark:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {!showPaymentSelector ? (
              <form onSubmit={handleSave} className="space-y-6">
                {currentApp.id && currentApp.status !== "done" && (
                  <button
                    type="button"
                    onClick={() => setShowPaymentSelector(true)}
                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase shadow-lg mb-6 active:scale-95 transition-all"
                  >
                    Proceder al Cobro
                  </button>
                )}

                <div className="space-y-5">
                  <div className="space-y-2">
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
                      className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-600/20"
                      placeholder="Nombre completo"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          size={14}
                        />
                        <input
                          value={currentApp.phone || ""}
                          onChange={(e) =>
                            setCurrentApp({
                              ...currentApp,
                              phone: e.target.value,
                            })
                          }
                          className="w-full p-4 pl-10 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none text-xs"
                          placeholder="09xxxxxxxx"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          size={14}
                        />
                        <input
                          value={currentApp.email || ""}
                          onChange={(e) =>
                            setCurrentApp({
                              ...currentApp,
                              email: e.target.value,
                            })
                          }
                          className="w-full p-4 pl-10 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none text-xs"
                          placeholder="email@gmail.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                        Hora inicio
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
                        className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                        Barbero
                      </label>
                      <select
                        value={currentApp.barber}
                        onChange={(e) =>
                          setCurrentApp({
                            ...currentApp,
                            barber: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none"
                      >
                        {team.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Servicios
                    </label>
                    <div className="grid grid-cols-1 gap-2">
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
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-4 rounded border-2 flex items-center justify-center ${
                                currentApp.selectedServiceIds.includes(s.id)
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "border-slate-300"
                              }`}
                            >
                              {currentApp.selectedServiceIds.includes(s.id) && (
                                <Check size={10} strokeWidth={4} />
                              )}
                            </div>
                            <span className="text-xs font-bold dark:text-white">
                              {s.name} ({s.time}m)
                            </span>
                          </div>
                          <span className="text-xs font-black text-blue-600">
                            ${s.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t dark:border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Total {totalDuration} min
                    </p>
                    <p className="text-3xl font-black text-blue-600">
                      ${totalAmount}
                    </p>
                  </div>
                  {currentApp.status !== "done" && (
                    <button
                      type="submit"
                      className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase shadow-xl active:scale-[0.98] transition-all"
                    >
                      Guardar Cambios
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <button
                  onClick={() => setShowPaymentSelector(false)}
                  className="text-[10px] font-black uppercase text-blue-600 mb-4 flex items-center gap-2"
                >
                  ← Volver a detalles
                </button>
                <div className="grid grid-cols-1 gap-3">
                  {PAYMENT_METHODS.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`p-6 rounded-3xl border-2 flex justify-between items-center cursor-pointer transition-all ${
                        selectedMethod === m.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-600/10"
                          : "border-transparent bg-slate-50 dark:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-xl ${
                            selectedMethod === m.id
                              ? "bg-blue-600 text-white"
                              : "bg-white dark:bg-slate-700 text-slate-400"
                          }`}
                        >
                          {m.icon}
                        </div>
                        <span className="font-black text-[11px] uppercase dark:text-white tracking-widest">
                          {m.name}
                        </span>
                      </div>
                      {selectedMethod === m.id && (
                        <Check size={20} className="text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleFinalizePayment}
                  className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl mt-4 active:scale-95 transition-all"
                >
                  Finalizar Cobro (${totalAmount})
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
