// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import {
//   Sparkles,
//   Menu,
//   X,
//   CheckCircle2,
//   Calendar,
//   BarChart3,
//   PieChart,
//   Smartphone,
//   Check,
//   Instagram,
//   Flower2,
//   Heart,
//   History,
//   Linkedin,
//   Users,
//   CreditCard,
//   Plus,
//   Search,
//   Clock,
//   AlertCircle,
//   Scissors,
//   Eye,
//   LogOut,
//   ChevronRight,
//   TrendingUp,
//   ShieldCheck,
// } from "lucide-react";

// export default function AppEsteticaLanding() {
//   const [view, setView] = useState("landing"); // 'landing' | 'schedule' | 'clients' | 'services' | 'payments'
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("all");

//   const closeMenu = () => setIsMenuOpen(false);

//   // --- DATOS MOCK DEL CRM ---
//   const [appointments] = useState([
//     {
//       id: "APT-001",
//       client: "Lucía Méndez",
//       service: "Balayage + Nutrición",
//       category: "peluqueria",
//       specialist: "Carlos Ruiz",
//       time: "09:00 AM",
//       duration: "2h",
//       station: "Sillón 02",
//       badgeClass: "bg-amber-50 text-amber-700 border-amber-200/60",
//     },
//     {
//       id: "APT-002",
//       client: "Ana Paula Silva",
//       service: "Kapping Gel + Nail Art",
//       category: "manicuria",
//       specialist: "Sofía Martínez",
//       time: "10:30 AM",
//       duration: "1h 30m",
//       station: "Mesa 01",
//       badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
//     },
//     {
//       id: "APT-003",
//       client: "Valeria Gómez",
//       service: "Extensión Volumen Ruso",
//       category: "pestanas",
//       specialist: "Valentina Kohl",
//       time: "11:00 AM",
//       duration: "1h 45m",
//       station: "Cabina 03",
//       badgeClass: "bg-rose-50 text-rose-700 border-rose-200/60",
//     },
//   ]);

//   const [clients] = useState([
//     {
//       id: "CLI-101",
//       name: "Valeria Gómez",
//       phone: "+598 99 123 456",
//       visits: 12,
//       lastVisit: "2026-08-10",
//       alerts: "Alergia a adhesivos de cianocrilato (usar pegamento Sensitive)",
//       lastService: "Lifting de Pestañas + Tinte",
//       status: "VIP",
//     },
//     {
//       id: "CLI-102",
//       name: "Lucía Méndez",
//       phone: "+598 98 654 321",
//       visits: 5,
//       lastVisit: "2026-08-15",
//       alerts: "Cuero cabelludo sensible - Decoloración máxima 20 vol.",
//       lastService: "Balayage",
//       status: "Frecuente",
//     },
//   ]);

//   // ==========================================
//   // VISTA INTERNA DEL CRM (PANEL DE CONTROL)
//   // ==========================================
//   if (view !== "landing") {
//     return (
//       <div className="flex min-h-screen bg-slate-50/60 text-slate-800 font-sans antialiased">
//         {/* SIDEBAR REFINADO */}
//         <aside className="w-64 min-h-screen bg-white border-r border-slate-200/70 p-6 flex flex-col justify-between shrink-0 shadow-sm">
//           <div className="space-y-8">
//             <div className="flex items-center gap-3 px-2">
//               <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
//                 ✦
//               </div>
//               <div>
//                 <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
//                   AppEstetica
//                 </span>
//                 <span className="text-[11px] text-slate-400 font-medium">
//                   Workspace CRM
//                 </span>
//               </div>
//             </div>

//             <nav className="space-y-1">
//               {[
//                 {
//                   id: "schedule",
//                   label: "Agenda & Turnos",
//                   icon: <Calendar size={18} />,
//                 },
//                 {
//                   id: "clients",
//                   label: "Fichas Clientes",
//                   icon: <Users size={18} />,
//                 },
//                 {
//                   id: "services",
//                   label: "Tratamientos",
//                   icon: <Sparkles size={18} />,
//                 },
//                 {
//                   id: "payments",
//                   label: "Caja & Pagos",
//                   icon: <CreditCard size={18} />,
//                 },
//               ].map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => setView(item.id)}
//                   className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
//                     view === item.id
//                       ? "bg-slate-900 text-white shadow-sm"
//                       : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
//                   }`}
//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </button>
//               ))}
//             </nav>
//           </div>

//           <div className="space-y-4">
//             <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl space-y-2">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
//                 <p className="text-xs font-bold text-slate-800">
//                   WhatsApp Bot Activo
//                 </p>
//               </div>
//               <p className="text-[11px] text-slate-500 leading-relaxed">
//                 Confirmaciones de citas enviándose automáticamente.
//               </p>
//             </div>

//             <button
//               onClick={() => setView("landing")}
//               className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors w-full"
//             >
//               <LogOut size={16} />
//               <span>Volver al sitio web</span>
//             </button>
//           </div>
//         </aside>

//         {/* MAIN CONTENT AREA */}
//         <main className="flex-1 p-8 overflow-y-auto">
//           <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
//                 {view === "schedule" && "Agenda de Turnos & Cabinas"}
//                 {view === "clients" && "Directorio de Clientes"}
//                 {view === "services" && "Catálogo de Servicios"}
//                 {view === "payments" && "Caja & Facturación"}
//               </h1>
//               <p className="text-xs text-slate-500 mt-0.5">
//                 Peluquería • Manicuría • Pestañas
//               </p>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <Search
//                   className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//                   size={15}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Buscar turno, cliente..."
//                   className="pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 w-64 shadow-sm placeholder:text-slate-400"
//                 />
//               </div>
//               <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm">
//                 <Plus size={15} />
//                 <span>Nuevo Turno</span>
//               </button>
//             </div>
//           </header>

//           {/* VISTA AGENDA */}
//           {view === "schedule" && (
//             <div className="space-y-6">
//               <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/70 shadow-sm w-fit">
//                 {[
//                   { id: "all", label: "Todos los Servicios" },
//                   { id: "peluqueria", label: "Peluquería" },
//                   { id: "manicuria", label: "Manicuría" },
//                   { id: "pestanas", label: "Pestañas" },
//                 ].map((cat) => (
//                   <button
//                     key={cat.id}
//                     onClick={() => setSelectedCategory(cat.id)}
//                     className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
//                       selectedCategory === cat.id
//                         ? "bg-slate-100 text-slate-900 font-semibold"
//                         : "text-slate-500 hover:text-slate-800"
//                     }`}
//                   >
//                     {cat.label}
//                   </button>
//                 ))}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//                 {appointments
//                   .filter(
//                     (app) =>
//                       selectedCategory === "all" ||
//                       app.category === selectedCategory,
//                   )
//                   .map((app) => (
//                     <div
//                       key={app.id}
//                       className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
//                           <Clock size={12} /> {app.time} ({app.duration})
//                         </span>
//                         <span
//                           className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${app.badgeClass}`}
//                         >
//                           {app.category}
//                         </span>
//                       </div>

//                       <div>
//                         <h3 className="font-bold text-base text-slate-900">
//                           {app.client}
//                         </h3>
//                         <p className="text-xs text-slate-500 mt-0.5">
//                           {app.service}
//                         </p>
//                       </div>

//                       <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
//                         <div>
//                           <span className="block text-[10px] uppercase font-semibold text-slate-400">
//                             Ubicación / Especialista
//                           </span>
//                           <span className="font-medium text-slate-700">
//                             {app.station} • {app.specialist}
//                           </span>
//                         </div>
//                         <button className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors">
//                           Ver Ficha →
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             </div>
//           )}

//           {/* VISTA CLIENTES */}
//           {view === "clients" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               {clients.map((cli) => (
//                 <div
//                   key={cli.id}
//                   className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-4"
//                 >
//                   <div className="flex items-center justify-between pb-3 border-b border-slate-100">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 font-bold text-sm flex items-center justify-center border border-rose-100">
//                         {cli.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </div>
//                       <div>
//                         <h3 className="text-sm font-bold text-slate-900">
//                           {cli.name}
//                         </h3>
//                         <p className="text-xs text-slate-400">{cli.phone}</p>
//                       </div>
//                     </div>
//                     <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
//                       {cli.status}
//                     </span>
//                   </div>

//                   <div className="bg-rose-50/60 border border-rose-100 p-3 rounded-xl flex items-start gap-2.5 text-rose-900 text-xs font-medium">
//                     <AlertCircle
//                       size={15}
//                       className="shrink-0 mt-0.5 text-rose-500"
//                     />
//                     <span>{cli.alerts}</span>
//                   </div>

//                   <div className="bg-slate-50 p-3.5 rounded-xl space-y-1 text-xs">
//                     <div className="flex justify-between font-semibold text-slate-700">
//                       <span>Último Servicio:</span>
//                       <span className="text-slate-400 font-normal">
//                         {cli.lastVisit}
//                       </span>
//                     </div>
//                     <p className="text-slate-600">{cli.lastService}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* VISTA SERVICIOS */}
//           {view === "services" && (
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//               {[
//                 {
//                   title: "Peluquería",
//                   icon: <Scissors size={20} />,
//                   count: "12 Tratamientos",
//                   color: "bg-amber-50 text-amber-700 border-amber-200/60",
//                 },
//                 {
//                   title: "Manicuría",
//                   icon: <Sparkles size={20} />,
//                   count: "8 Servicios",
//                   color: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
//                 },
//                 {
//                   title: "Pestañas",
//                   icon: <Eye size={20} />,
//                   count: "6 Servicios",
//                   color: "bg-rose-50 text-rose-700 border-rose-200/60",
//                 },
//               ].map((cat, i) => (
//                 <div
//                   key={i}
//                   className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-3"
//                 >
//                   <div
//                     className={`w-10 h-10 rounded-xl ${cat.color} border flex items-center justify-center`}
//                   >
//                     {cat.icon}
//                   </div>
//                   <h3 className="text-base font-bold text-slate-900">
//                     {cat.title}
//                   </h3>
//                   <p className="text-xs text-slate-400 font-medium">
//                     {cat.count}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* VISTA PAGOS */}
//           {view === "payments" && (
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//               {[
//                 {
//                   title: "Ingresos Hoy",
//                   value: "$12,450",
//                   trend: "+15% vs ayer",
//                 },
//                 {
//                   title: "Comisiones Pendientes",
//                   value: "$3,200",
//                   trend: "3 Especialistas",
//                 },
//                 {
//                   title: "Ventas de Productos",
//                   value: "$4,100",
//                   trend: "Tratamientos/Insumos",
//                 },
//               ].map((card, i) => (
//                 <div
//                   key={i}
//                   className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-2"
//                 >
//                   <p className="text-xs font-medium text-slate-400">
//                     {card.title}
//                   </p>
//                   <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
//                     {card.value}
//                   </p>
//                   <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-200/50">
//                     {card.trend}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>
//     );
//   }

//   // ==========================================
//   // VISTA LANDING PAGE (APPESTETICA)
//   // ==========================================
//   return (
//     <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-rose-100 selection:text-rose-900">
//       {/* Header / Navigation */}
//       <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
//         <div className="max-w-6xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <Link href="/" className="flex items-center gap-2">
//               <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
//                 AppEstetica
//                 <span className="w-2 h-2 rounded-full bg-rose-500"></span>
//               </span>
//             </Link>

//             {/* Desktop Nav */}
//             <nav className="hidden md:flex items-center gap-8">
//               <a
//                 className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
//                 href="#features"
//               >
//                 Funciones
//               </a>
//               <a
//                 className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
//                 href="#pricing"
//               >
//                 Planes
//               </a>
//               <button
//                 onClick={() => setView("schedule")}
//                 className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
//               >
//                 Demo Panel CRM
//               </button>
//             </nav>

//             <div className="hidden md:flex items-center gap-3">
//               <Link
//                 href="/login"
//                 className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
//               >
//                 Iniciar Sesión
//               </Link>
//               <Link
//                 href="/register"
//                 className="flex items-center justify-center rounded-xl h-9 px-4 bg-slate-900 hover:bg-slate-800 transition-all text-white text-xs font-semibold shadow-sm"
//               >
//                 Probar Gratis
//               </Link>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               className="md:hidden p-2 text-slate-600"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation Menu */}
//         {isMenuOpen && (
//           <div className="fixed inset-x-0 top-[65px] bg-white border-b border-slate-100 p-6 space-y-4 md:hidden shadow-xl">
//             <nav className="flex flex-col gap-3 text-sm font-medium">
//               <a
//                 onClick={closeMenu}
//                 href="#features"
//                 className="text-slate-700"
//               >
//                 Funciones
//               </a>
//               <a onClick={closeMenu} href="#pricing" className="text-slate-700">
//                 Planes
//               </a>
//               <button
//                 onClick={() => {
//                   closeMenu();
//                   setView("schedule");
//                 }}
//                 className="text-left text-slate-700 font-medium"
//               >
//                 Ver Demo CRM
//               </button>
//               <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
//                 <Link
//                   href="/register"
//                   className="flex items-center justify-center rounded-xl h-11 bg-slate-900 text-white font-semibold text-sm"
//                 >
//                   Probar Gratis
//                 </Link>
//               </div>
//             </nav>
//           </div>
//         )}
//       </header>

//       {/* Hero Section */}
//       <section className="relative w-full overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="flex flex-col lg:flex-row gap-12 items-center">
//             <div className="flex flex-col gap-6 lg:w-1/2 text-center lg:text-left">
//               <div className="inline-flex mx-auto lg:mx-0 w-fit items-center gap-2 rounded-full bg-rose-50 border border-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
//                 <Sparkles size={14} className="text-rose-500" />
//                 <span>Gestión inteligente para centros de estética</span>
//               </div>
//               <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
//                 Simplifica tu agenda. Potencia tu negocio.
//               </h1>
//               <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
//                 AppEstetica centraliza citas, fichas de clientes, especialistas
//                 y finanzas en una sola plataforma moderna. Diseñada para ahorrar
//                 tiempo y profesionalizar tu salón.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
//                 <Link
//                   href="/register"
//                   className="flex items-center justify-center rounded-xl h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md transition-all"
//                 >
//                   Comenzar prueba gratis
//                 </Link>
//                 <button
//                   onClick={() => setView("schedule")}
//                   className="flex items-center justify-center rounded-xl h-12 px-6 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all"
//                 >
//                   Explorar demo interactiva
//                 </button>
//               </div>
//               <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-slate-500">
//                 <span className="flex items-center gap-1.5">
//                   <ShieldCheck size={16} className="text-emerald-600" /> Sin
//                   tarjeta de crédito
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <CheckCircle2 size={16} className="text-emerald-600" />{" "}
//                   Configuración en 5 min
//                 </span>
//               </div>
//             </div>

//             <div className="w-full lg:w-1/2 relative">
//               <div className="absolute -inset-4 bg-gradient-to-tr from-rose-100 to-indigo-100 rounded-3xl blur-2xl opacity-60"></div>
//               <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-2xl">
//                 <img
//                   src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80"
//                   alt="AppEstetica Dashboard"
//                   className="w-full h-[380px] object-cover"
//                 />
//                 <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 max-w-xs">
//                   <div className="flex items-center gap-3">
//                     <div className="h-9 w-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
//                       <TrendingUp size={18} />
//                     </div>
//                     <div>
//                       <p className="text-[11px] font-semibold text-slate-400">
//                         Rendimiento semanal
//                       </p>
//                       <p className="text-sm font-bold text-slate-900">
//                         +28% en reservas online
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section
//         className="py-20 bg-slate-50/50 border-y border-slate-100"
//         id="features"
//       >
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
//             <p className="text-xs font-bold uppercase tracking-widest text-rose-600">
//               Funcionalidades Clave
//             </p>
//             <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
//               Diseñado para la excelencia en tu centro
//             </h2>
//             <p className="text-slate-600 text-sm">
//               Herramientas pensadas específicamente para resolver los desafíos
//               diarios de salones y spas.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[
//               {
//                 icon: <Calendar size={22} />,
//                 title: "Agenda Inteligente",
//                 desc: "Organización de turnos por especialista, gabinete y tratamiento con sincronización instantánea.",
//               },
//               {
//                 icon: <PieChart size={22} />,
//                 title: "Fichas Clínicas y Clientes",
//                 desc: "Historial completo de visitas, notas técnicas, fotos antes/después y alergias del cliente.",
//               },
//               {
//                 icon: <BarChart3 size={22} />,
//                 title: "Control de Especialistas",
//                 desc: "Asignación de horarios, cálculo de comisiones automáticas y gestión de productividad.",
//               },
//               {
//                 icon: <History size={22} />,
//                 title: "Caja y Finanzas",
//                 desc: "Registro preciso de ingresos por servicios, ventas de productos y métricas del negocio.",
//               },
//               {
//                 icon: <Smartphone size={22} />,
//                 title: "Reservas Online 24/7",
//                 desc: "Enlace personalizado para que tus clientes agenden solos desde Instagram o WhatsApp.",
//               },
//               {
//                 icon: <CheckCircle2 size={22} />,
//                 title: "Recordatorios WhatsApp",
//                 desc: "Reducción drástica de ausencias con confirmaciones automáticas enviadas directamente a sus teléfonos.",
//               },
//             ].map((item, i) => (
//               <div
//                 key={i}
//                 className="p-6 rounded-2xl bg-white border border-slate-200/70 shadow-sm hover:shadow-md transition-all space-y-3"
//               >
//                 <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
//                   {item.icon}
//                 </div>
//                 <h3 className="text-base font-bold text-slate-900">
//                   {item.title}
//                 </h3>
//                 <p className="text-slate-500 text-xs leading-relaxed">
//                   {item.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Pricing Section */}
//       <section className="py-20" id="pricing">
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
//             <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
//               Planes transparentes a tu medida
//             </h2>
//             <p className="text-slate-600 text-sm">
//               Escala tu negocio sin sorpresas ni costos ocultos.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               {
//                 name: "Soft",
//                 price: "Gratis",
//                 features: ["1 Especialista", "20 Citas / mes", "Agenda Básica"],
//               },
//               {
//                 name: "Glow",
//                 price: "$1",
//                 features: [
//                   "1 Especialista",
//                   "50 Citas / mes",
//                   "Agenda & Clientes",
//                 ],
//               },
//               {
//                 name: "Radiance",
//                 price: "$1,450",
//                 popular: true,
//                 features: [
//                   "3 Especialistas",
//                   "250 Citas / mes",
//                   "Métricas & Reportes",
//                   "Recordatorios WhatsApp",
//                 ],
//               },
//               {
//                 name: "Diamond",
//                 price: "$2,200",
//                 features: [
//                   "Especialistas Ilimitados",
//                   "Citas Ilimitadas",
//                   "Módulo de Finanzas",
//                   "Soporte Prioritario",
//                 ],
//               },
//             ].map((plan, i) => (
//               <div
//                 key={i}
//                 className={`relative flex flex-col rounded-2xl p-6 border transition-all ${
//                   plan.popular
//                     ? "border-rose-500 bg-white shadow-xl ring-1 ring-rose-500"
//                     : "border-slate-200 bg-white shadow-sm"
//                 }`}
//               >
//                 {plan.popular && (
//                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
//                     Más elegido
//                   </div>
//                 )}
//                 <div className="mb-6 space-y-2">
//                   <h3 className="text-base font-bold text-slate-900">
//                     {plan.name}
//                   </h3>
//                   <div className="flex items-baseline gap-1">
//                     <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
//                       {plan.price}
//                     </span>
//                     {plan.price !== "Gratis" && (
//                       <span className="text-xs text-slate-400 font-medium">
//                         / mes
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <ul className="flex flex-col gap-2.5 mb-8 flex-grow">
//                   {plan.features.map((f, j) => (
//                     <li
//                       key={j}
//                       className="flex items-center gap-2 text-xs font-medium text-slate-600"
//                     >
//                       <Check size={14} className="text-rose-500 shrink-0" />
//                       <span>{f}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 <Link
//                   href="/register"
//                   className={`w-full rounded-xl h-10 flex items-center justify-center text-xs font-semibold transition-all ${
//                     plan.popular
//                       ? "bg-rose-500 hover:bg-rose-600 text-white shadow-sm"
//                       : "bg-slate-900 hover:bg-slate-800 text-white"
//                   }`}
//                 >
//                   Seleccionar plan
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-slate-100 bg-slate-50/50 py-12 px-6">
//         <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
//           <span className="text-base font-bold text-slate-900 flex items-center gap-1.5">
//             AppEstetica
//             <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
//           </span>
//           <p className="text-xs text-slate-500">
//             © 2026 AppEstetica. Todos los derechos reservados.
//           </p>
//           <div className="flex gap-4 text-slate-400">
//             <Instagram
//               size={18}
//               className="hover:text-slate-700 cursor-pointer transition-colors"
//             />
//             <Linkedin
//               size={18}
//               className="hover:text-slate-700 cursor-pointer transition-colors"
//             />
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Menu,
  X,
  CheckCircle2,
  Calendar,
  BarChart3,
  PieChart,
  Smartphone,
  Check,
  Instagram,
  Linkedin,
  Users,
  CreditCard,
  Plus,
  Search,
  Clock,
  AlertCircle,
  Scissors,
  Eye,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  MessageCircle,
  Bell,
  Heart,
  Star,
} from "lucide-react";

export default function LandingEsteticaIntegral() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] font-sans antialiased selection:bg-[#e879f9]/20 selection:text-[#c084fc]">
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo identico al CRM */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#e879f9]/20 flex items-center justify-center text-[#c084fc] font-bold text-lg">
              +
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              estetica integral
            </span>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#funciones"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#planes"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Planes
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
            >
              Ingresar
            </Link>

            {/* Botón Verde Menta idéntico al CRM (+ Nuevo Turno) */}
            <Link
              href="/register"
              className="flex items-center gap-2 bg-[#6ee7b7] hover:bg-[#5eead4] text-slate-800 text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm"
            >
              <span>+ Probar Gratis</span>
            </Link>
          </div>

          {/* Botón Menú Mobile */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú Mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-b border-slate-100 bg-white p-6 space-y-4 shadow-xl">
            <a
              href="#funciones"
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm font-medium text-slate-700"
            >
              Funcionalidades
            </a>
            <a
              href="#planes"
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm font-medium text-slate-700"
            >
              Planes
            </a>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/register"
                className="flex items-center justify-center bg-[#6ee7b7] text-slate-800 font-semibold text-sm h-11 rounded-full"
              >
                + Probar Gratis
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Texto Hero */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-6">
              {/* Badge Estilo CRM Banner (+ Gradient) */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#c084fc]/15 to-[#e879f9]/15 border border-[#e879f9]/30 text-xs font-semibold text-[#a855f7]">
                <Sparkles size={14} />
                <span>Gestión inteligente para tu centro de estética</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                La plataforma que simplifica la agenda de tu centro
              </h1>

              <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Gestiona turnos, fichas de clientes, avisos por WhatsApp y la
                caja de tu estética en una interfaz limpia, intuitiva y rápida.
              </p>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                {/* Botón Degradado Púrpura Rosa (Estilo Banner Inferior del CRM) */}
                <Link
                  href="/register"
                  className="flex items-center justify-center h-12 px-7 rounded-2xl bg-gradient-to-r from-[#c084fc] to-[#e879f9] text-white font-semibold text-sm shadow-md hover:opacity-95 transition-all"
                >
                  Comenzar prueba gratis
                </Link>

                <a
                  href="#demo"
                  className="flex items-center justify-center h-12 px-7 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all shadow-xs"
                >
                  Ver Demo En Vivo
                </a>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 pt-2 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#6ee7b7]" /> Sin
                  tarjeta de crédito
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#6ee7b7]" />{" "}
                  Configuración en 5 min
                </span>
              </div>
            </div>

            {/* MOCKUP HERO - RÉPLICA DE TU CRM */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl bg-white p-5 border border-slate-200/80 shadow-2xl shadow-purple-100 space-y-4">
                {/* Topbar Mock CRM */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60 w-64">
                    <Search size={14} className="text-slate-400" />
                    <span className="text-xs text-slate-400">
                      Buscar cliente...
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#6ee7b7] text-slate-800 text-xs font-semibold px-3 py-1 rounded-full">
                      + Nuevo Turno
                    </span>
                  </div>
                </div>

                {/* KPI Cards (Exactas a tu captura) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Turnos Hoy
                      </p>
                      <p className="text-lg font-bold text-slate-800">1</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#6ee7b7]/20 flex items-center justify-center text-[#10b981]">
                      <Clock size={14} />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Recall
                      </p>
                      <p className="text-lg font-bold text-slate-800">0</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#fca5a5]/20 flex items-center justify-center text-[#f87171]">
                      <MessageCircle size={14} />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Especialistas
                      </p>
                      <p className="text-lg font-bold text-slate-800">1</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#cbd5e1]/30 flex items-center justify-center text-slate-600">
                      <Users size={14} />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Atendidos
                      </p>
                      <p className="text-lg font-bold text-slate-800">0</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#fef08a]/40 flex items-center justify-center text-[#eab308]">
                      <Star size={14} />
                    </div>
                  </div>
                </div>

                {/* Filtros Categorías */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="bg-slate-900 text-white text-[11px] px-3 py-1 rounded-full font-medium">
                    Todos
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-[11px] px-3 py-1 rounded-full font-medium">
                    Pestañas
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-[11px] px-3 py-1 rounded-full font-medium">
                    Manicuría
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-[11px] px-3 py-1 rounded-full font-medium">
                    Peluquería
                  </span>
                </div>

                {/* Agenda Row */}
                <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#10b981] bg-[#6ee7b7]/20 px-2 py-0.5 rounded-md">
                      10:00
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Cliente de Prueba
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Especialista: melany pailis
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                    Especialidad
                  </span>
                </div>

                {/* Banner Inferior Degradado (Widget idéntico al tuyo) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-100/70 via-pink-100/70 to-amber-100/50 border border-purple-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Enjoy improved performance & new features.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#c084fc] to-[#e879f9] text-white shadow-xs">
                    Explore!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN FUNCIONALIDADES */}
      <section
        className="py-20 bg-white border-y border-slate-100"
        id="funciones"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#a855f7]">
              Módulos Principales
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Diseñado exclusivamente para estéticas y salones
            </h2>
            <p className="text-slate-500 text-sm">
              Simplifica las tareas administrativas diarias y enfócate en tus
              clientas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Calendar className="text-[#a855f7]" size={22} />,
                title: "Agenda del Día e Inteligente",
                desc: "Visualiza turnos en tiempo real por especialidad (Pestañas, Manicuría, Peluquería, Estética).",
              },
              {
                icon: <MessageCircle className="text-[#f87171]" size={22} />,
                title: "Recall y Alerta de Retoques",
                desc: "Recordatorios automáticos por WhatsApp para avisar a tus clientas cuando les toca su mantenimiento.",
              },
              {
                icon: <Users className="text-[#10b981]" size={22} />,
                title: "Gestión de Especialistas",
                desc: "Asigna turnos, estaciones y salones específicos para cada profesional de tu equipo.",
              },
              {
                icon: <PieChart className="text-[#eab308]" size={22} />,
                title: "Fichas de Clientes Completa",
                desc: "Guarda historial de atenciones, notas técnicas, alergias y preferencias de cada cliente.",
              },
              {
                icon: <BarChart3 className="text-[#a855f7]" size={22} />,
                title: "Módulo de Contabilidad",
                desc: "Lleva el control de cobros, métodos de pago y rendimiento de caja de forma súper clara.",
              },
              {
                icon: <Smartphone className="text-[#10b981]" size={22} />,
                title: "Link de Reservas Online",
                desc: "Permite que tus clientas agenden directo desde Instagram sin tener que atender llamadas.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-[#f8fafc] border border-slate-100 hover:border-purple-200 transition-all space-y-3 hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-xs">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES / PRECIOS */}
      <section className="py-20" id="planes">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Planes simples y transparentes
            </h2>
            <p className="text-slate-500 text-sm">
              Elige el plan ideal según el tamaño de tu centro de estética.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Inicial",
                price: "$1,200",
                features: [
                  "Hasta 2 Especialistas",
                  "Agenda de Turnos ilimitada",
                  "Fichas de Clientes básicas",
                  "Soporte por WhatsApp",
                ],
              },
              {
                name: "Pro Studio",
                price: "$2,450",
                popular: true,
                features: [
                  "Hasta 5 Especialistas",
                  "Avisos y Recall por WhatsApp",
                  "Módulo de Contabilidad",
                  "Alertas de Mantenimiento",
                  "Reservas Online 24/7",
                ],
              },
              {
                name: "Estética Premium",
                price: "$3,800",
                features: [
                  "Especialistas ilimitados",
                  "Múltiples sucursales",
                  "Reportes avanzados de finanzas",
                  "Soporte prioritario 24/7",
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col rounded-3xl p-8 bg-white border transition-all ${
                  plan.popular
                    ? "border-[#c084fc] shadow-xl shadow-purple-100 ring-2 ring-[#e879f9]/30"
                    : "border-slate-200/80 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#c084fc] to-[#e879f9] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    Más Elegido
                  </div>
                )}

                <div className="mb-6 space-y-2">
                  <h3 className="text-lg font-bold text-slate-800">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      / mes
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-grow">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2.5 text-xs font-medium text-slate-600"
                    >
                      <Check size={15} className="text-[#10b981] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`w-full rounded-2xl h-11 flex items-center justify-center text-xs font-bold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#c084fc] to-[#e879f9] text-white shadow-md hover:opacity-95"
                      : "bg-[#6ee7b7] text-slate-800 hover:bg-[#5eead4]"
                  }`}
                >
                  Elegir Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/60 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#e879f9]/20 flex items-center justify-center text-[#c084fc] font-bold text-xs">
              +
            </div>
            <span className="text-base font-bold text-slate-800">
              estetica integral
            </span>
          </div>
          <p className="text-xs text-slate-400">
            © 2026 estetica integral. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-slate-400">
            <Instagram
              size={18}
              className="hover:text-slate-700 cursor-pointer transition-colors"
            />
            <Linkedin
              size={18}
              className="hover:text-slate-700 cursor-pointer transition-colors"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
