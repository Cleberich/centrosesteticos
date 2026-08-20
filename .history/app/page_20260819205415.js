// "use client"; // Necesario para el uso de useState
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
//   Star,
//   User,
//   History,
//   Linkedin,
// } from "lucide-react";

// const HomePage = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const closeMenu = () => setIsMenuOpen(false);

//   return (
//     <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
//       {/* Navigation */}
//       <header className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-10 py-3">
//           <div className="flex items-center justify-between">
//             <Link
//               href="/"
//               className="flex items-center gap-2 text-slate-900 dark:text-white shrink-1"
//             >
//               <span className="text-lg sm:text-xl flex items-center gap-2 font-black uppercase tracking-widest italic">
//                 Aura <Sparkles size={24} className="text-pink-500" /> Estética
//               </span>
//             </Link>

//             {/* Desktop Nav */}
//             <nav className="hidden md:flex items-center gap-8">
//               <a
//                 className="text-xs font-bold hover:text-pink-500 transition-colors uppercase tracking-widest"
//                 href="#features"
//               >
//                 Servicios
//               </a>
//               <a
//                 className="text-xs font-bold hover:text-pink-500 transition-colors uppercase tracking-widest"
//                 href="#pricing"
//               >
//                 Planes
//               </a>
//               <Link
//                 className="text-xs font-bold hover:text-pink-500 transition-colors uppercase tracking-widest"
//                 href="/login"
//               >
//                 Ingresar
//               </Link>
//               <Link
//                 href="/register"
//                 className="flex items-center justify-center rounded-full h-10 px-6 bg-pink-500 hover:bg-pink-600 transition-all text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-500/20"
//               >
//                 Probar Gratis
//               </Link>
//             </nav>

//             {/* Mobile Menu Button */}
//             <button
//               className="md:hidden p-2 text-slate-600 dark:text-slate-300"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation Menu */}
//         <div
//           className={`fixed inset-0 top-[65px] h-80 z-40 bg-white dark:bg-slate-950 transition-transform duration-300 md:hidden ${
//             isMenuOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//         >
//           <nav className="flex flex-col p-6 gap-6 text-center">
//             <a
//               onClick={closeMenu}
//               className="text-md font-black uppercase border-b border-slate-100 pb-4"
//               href="#features"
//             >
//               Servicios
//             </a>
//             <a
//               onClick={closeMenu}
//               className="text-md font-black uppercase border-b border-slate-100 pb-4"
//               href="#pricing"
//             >
//               Planes
//             </a>
//             <Link
//               onClick={closeMenu}
//               href="/register"
//               className="mt-4 flex items-center justify-center rounded-full h-16 bg-pink-500 text-white text-lg font-black uppercase tracking-widest"
//             >
//               Empezar Ahora
//             </Link>
//           </nav>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="relative w-full overflow-hidden">
//         <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 lg:py-24">
//           <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
//             <div className="flex flex-col gap-6 lg:w-1/2 text-center lg:text-left">
//               <div className="inline-flex mx-auto lg:mx-0 w-fit items-center gap-2 rounded-full bg-pink-50 dark:bg-pink-900/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-pink-600">
//                 <Flower2 size={14} />
//                 Gestión para Centros de Belleza
//               </div>
//               <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tighter uppercase italic">
//                 Resalta la <span className="text-pink-500">Belleza</span> de tu
//                 negocio
//               </h1>
//               <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
//                 La plataforma integral para gestionar citas, tratamientos y
//                 clientes. Simplifica tu día a día y brinda una experiencia de
//                 lujo.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
//                 <Link
//                   href="/register"
//                   className="flex items-center justify-center rounded-full h-14 px-10 bg-pink-500 hover:bg-pink-600 text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-pink-500/20 transition-all hover:scale-105"
//                 >
//                   Registrar mi centro
//                 </Link>
//               </div>
//             </div>

//             <div className="w-full lg:w-1/2 relative px-4 sm:px-0">
//               <div className="absolute -inset-4 sm:-inset-10 bg-pink-500/10 rounded-full blur-3xl"></div>
//               <div className="relative w-full aspect-square sm:aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80')] bg-center bg-cover rounded-[3rem] shadow-2xl border-4 border-white dark:border-slate-900">
//                 <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-xl border border-pink-50">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
//                       <Heart size={20} />
//                     </div>
//                     <div>
//                       <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
//                         Citas de hoy
//                       </p>
//                       <p className="text-lg font-black dark:text-white">
//                         24 Tratamientos
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
//         className="py-16 sm:py-24 px-6 sm:px-10 max-w-7xl mx-auto"
//         id="features"
//       >
//         <div className="text-center mb-16">
//           <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 mb-4">
//             Elegancia & Eficiencia
//           </h2>
//           <p className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
//             Control total de tu spa o centro
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {[
//             {
//               icon: <Calendar size={32} />,
//               title: "Agenda Pro",
//               desc: "Gestión inteligente de cabinas y profesionales de belleza.",
//             },
//             {
//               icon: <PieChart size={32} />,
//               title: "Ventas",
//               desc: "Control de productos, servicios y stock de insumos.",
//             },
//             {
//               icon: <BarChart3 size={32} />,
//               title: "Análisis",
//               desc: "Reportes de rentabilidad por tratamiento y especialista.",
//             },
//             {
//               icon: <History size={32} />,
//               title: "Ficha Clínica",
//               desc: "Historial de tratamientos y consentimiento de clientes.",
//             },
//             {
//               icon: <Smartphone size={32} />,
//               title: "Recordatorios",
//               desc: "Avisos vía WhatsApp para reducir el ausentismo.",
//             },
//             {
//               icon: <CheckCircle2 size={32} />,
//               title: "Comisiones",
//               desc: "Cálculo automático para esteticistas y especialistas.",
//             },
//           ].map((item, i) => (
//             <div
//               key={i}
//               className="group flex flex-col gap-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 hover:border-pink-200 transition-all hover:shadow-lg"
//             >
//               <div className="text-pink-500 bg-pink-50 dark:bg-pink-900/20 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
//                 {item.icon}
//               </div>
//               <h3 className="text-xl font-black uppercase italic">
//                 {item.title}
//               </h3>
//               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
//                 {item.desc}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Pricing Section */}
//       <section
//         className="py-16 sm:py-24 px-6 bg-slate-50 dark:bg-slate-950/50"
//         id="pricing"
//       >
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl sm:text-5xl font-black mb-4 uppercase italic tracking-tighter">
//               Nuestros Planes
//             </h2>
//             <p className="text-base text-slate-500 font-medium">
//               Elige la mejor opción para tu crecimiento.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               {
//                 name: "Soft",
//                 price: "GRATIS",
//                 features: ["1 Especialista", "20 Citas", "Agenda Básica"],
//               },
//               {
//                 name: "Glow",
//                 price: "$750",
//                 features: [
//                   "1 Especialista",
//                   "100 Citas/mes",
//                   "Fichas Digitales",
//                 ],
//               },
//               {
//                 name: "Radiance",
//                 price: "$1450",
//                 popular: true,
//                 features: [
//                   "4 Especialistas",
//                   "250 Citas/mes",
//                   "Estadísticas",
//                   "Recordatorios",
//                 ],
//               },
//               {
//                 name: "Diamond",
//                 price: "$2200",
//                 features: [
//                   "Especialistas Ilimitados",
//                   "Citas Ilimitadas",
//                   "Marketing",
//                   "Recordatorios",
//                   "Finanzas",
//                 ],
//               },
//             ].map((plan, i) => (
//               <div
//                 key={i}
//                 className={`relative flex flex-col rounded-[3rem] p-8 border-2 transition-all ${
//                   plan.popular
//                     ? "border-pink-500 bg-white shadow-2xl"
//                     : "border-slate-100 bg-white"
//                 }`}
//               >
//                 {plan.popular && (
//                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[9px] font-black px-6 py-1.5 rounded-full uppercase tracking-widest">
//                     Recomendado
//                   </div>
//                 )}
//                 <div className="mb-6 text-center">
//                   <h3 className="text-xl font-black uppercase italic text-slate-800">
//                     {plan.name}
//                   </h3>
//                   <div className="flex items-baseline justify-center gap-1 mt-4">
//                     <span className="text-3xl font-black text-pink-500">
//                       {plan.price}
//                     </span>
//                     {plan.price !== "GRATIS" && (
//                       <span className="text-[10px] font-black text-slate-400">
//                         / MES
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <ul className="flex flex-col gap-4 mb-8 flex-grow">
//                   {plan.features.map((f, j) => (
//                     <li
//                       key={j}
//                       className="flex items-center gap-3 text-[10px] font-bold uppercase text-slate-500"
//                     >
//                       <Check
//                         size={16}
//                         className="text-pink-500"
//                         strokeWidth={3}
//                       />{" "}
//                       {f}
//                     </li>
//                   ))}
//                 </ul>
//                 <Link
//                   href="/register"
//                   className="w-full rounded-full h-12 flex items-center justify-center bg-pink-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-pink-600 transition-colors"
//                 >
//                   Seleccionar
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-slate-100 bg-white py-12 px-6">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
//           <span className="text-xl flex items-center gap-2 font-black uppercase tracking-widest italic">
//             Aura <Sparkles size={24} className="text-pink-500" /> Estética
//           </span>
//           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
//             © 2025 AuraManager. Elevando el estándar de belleza.
//           </p>
//           <div className="flex gap-4">
//             <Instagram
//               size={20}
//               className="text-slate-400 hover:text-pink-500 cursor-pointer"
//             />
//             <Linkedin
//               size={20}
//               className="text-slate-400 hover:text-pink-500 cursor-pointer"
//             />
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;
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
  Flower2,
  Heart,
  Star,
  User,
  History,
  Linkedin,
  Search,
  Plus,
  Clock,
  AlertCircle,
  Scissors,
  Eye,
  MessageSquare,
  CreditCard,
  LayoutDashboard,
  UserCheck,
  LogOut,
  ChevronRight,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export default function AppEsteticaLandingAndDashboard() {
  const [activeTab, setActiveTab] = useState("landing"); // 'landing' o vista del CRM ('schedule', 'clients', 'services', 'payments')
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const closeMenu = () => setIsMenuOpen(false);

  // --- MOCK DATA CRM ---
  const [appointments] = useState([
    {
      id: "APT-001",
      client: "Lucía Méndez",
      service: "Balayage + Nutrición",
      category: "peluqueria",
      specialist: "Carlos Ruiz",
      time: "09:00 AM",
      duration: "2h",
      station: "Sillón 02",
      bgClass: "bg-amber-50 text-amber-900 border-amber-200/60",
      badgeClass: "bg-amber-100 text-amber-800",
    },
    {
      id: "APT-002",
      client: "Ana Paula Silva",
      service: "Kapping Gel + Nail Art",
      category: "manicuria",
      specialist: "Sofía Martínez",
      time: "10:30 AM",
      duration: "1h 30m",
      station: "Mesa 01",
      bgClass: "bg-emerald-50 text-emerald-900 border-emerald-200/60",
      badgeClass: "bg-emerald-200/60 text-emerald-900",
    },
    {
      id: "APT-003",
      client: "Valeria Gómez",
      service: "Extensión Volumen Ruso",
      category: "pestanas",
      specialist: "Valentina Kohl",
      time: "11:00 AM",
      duration: "1h 45m",
      station: "Cabina 03",
      bgClass: "bg-rose-50 text-rose-900 border-rose-200/60",
      badgeClass: "bg-rose-200/60 text-rose-900",
    },
  ]);

  const [clients] = useState([
    {
      id: "CLI-101",
      name: "Valeria Gómez",
      phone: "+598 99 123 456",
      visits: 12,
      lastVisit: "2026-08-10",
      alerts: "Alergia a adhesivos de cianocrilato (usar pegamento Sensitive)",
      lastService: "Lifting de Pestañas + Tinte",
      status: "VIP",
    },
    {
      id: "CLI-102",
      name: "Lucía Méndez",
      phone: "+598 98 654 321",
      visits: 5,
      lastVisit: "2026-08-15",
      alerts: "Cuero cabelludo sensible - Decoloración máxima 20 vol.",
      lastService: "Balayage",
      status: "Frecuente",
    },
  ]);

  // Si estamos dentro de la demo interactiva del CRM
  if (activeTab !== "landing") {
    return (
      <div className="flex min-h-screen bg-[#FCF7F7] text-slate-800 font-sans">
        {/* SIDEBAR ESTILO 'BYUTIE' */}
        <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-md border-r border-slate-100 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            {/* Brand Header */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-2xl bg-[#D1FAE5] text-emerald-700 flex items-center justify-center font-black text-lg">
                ✦
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-none">
                  byutie
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Beauty Studio Pro
                </span>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1.5">
              {[
                {
                  id: "schedule",
                  label: "Agenda Citas",
                  icon: <Calendar size={18} />,
                },
                {
                  id: "clients",
                  label: "Clientes & Fichas",
                  icon: <Users size={18} />,
                },
                {
                  id: "services",
                  label: "Servicios",
                  icon: <Sparkles size={18} />,
                },
                {
                  id: "payments",
                  label: "Pagos & Caja",
                  icon: <CreditCard size={18} />,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === item.id
                      ? "bg-[#D1FAE5] text-emerald-900 shadow-sm"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <div className="bg-[#FFE4E6]/60 border border-rose-100 p-4 rounded-[2rem] text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-rose-200/60 text-rose-600 mx-auto flex items-center justify-center">
                <Heart size={16} />
              </div>
              <p className="text-xs font-bold text-rose-900">Módulo WhatsApp</p>
              <p className="text-[10px] text-rose-700/80 leading-relaxed">
                Recordatorios automáticos activados para reducir ausentismos.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("landing")}
              className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors w-full"
            >
              <LogOut size={18} />
              <span>Volver a la Web</span>
            </button>
          </div>
        </aside>

        {/* MAIN PANEL */}
        <main className="flex-1 p-8 overflow-y-auto">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {activeTab === "schedule" &&
                  "Surgery Schedule / Agenda de Turnos"}
                {activeTab === "clients" && "Directorio de Clientes"}
                {activeTab === "services" && "Catálogo de Tratamientos"}
                {activeTab === "payments" && "Caja & Facturación"}
              </h1>
              <p className="text-xs font-medium text-slate-400 mt-1">
                Peluquería • Manicuría • Pestañas
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Buscar cliente, turno..."
                  className="pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-100 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 w-60 shadow-sm"
                />
              </div>
              <button className="flex items-center gap-2 bg-[#D1FAE5] hover:bg-emerald-200 text-emerald-950 font-bold text-xs px-5 py-3 rounded-2xl transition-all shadow-sm">
                <Plus size={16} />
                <span>Nuevo Turno</span>
              </button>
            </div>
          </header>

          {/* TAB: AGENDA */}
          {activeTab === "schedule" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit">
                {[
                  { id: "all", label: "Todos los Servicios" },
                  { id: "peluqueria", label: "Peluquería" },
                  { id: "manicuria", label: "Manicuría" },
                  { id: "pestanas", label: "Pestañas" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat.id
                        ? "bg-[#D1FAE5] text-emerald-950 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {appointments
                  .filter(
                    (app) =>
                      selectedCategory === "all" ||
                      app.category === selectedCategory,
                  )
                  .map((app) => (
                    <div
                      key={app.id}
                      className={`p-6 rounded-[2.5rem] border ${app.bgClass} flex flex-col justify-between space-y-4 hover:shadow-md transition-all`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-white/80 backdrop-blur-sm">
                          <Clock size={12} /> {app.time} ({app.duration})
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${app.badgeClass}`}
                        >
                          {app.category}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900">
                          {app.client}
                        </h3>
                        <p className="text-xs font-semibold text-slate-600 mt-1">
                          {app.service}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs font-bold">
                        <div className="text-slate-500">
                          <span className="block text-[10px] uppercase text-slate-400">
                            Asignación:
                          </span>
                          {app.station} • {app.specialist}
                        </div>
                        <button className="text-emerald-800 hover:underline">
                          Ver Ficha →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: CLIENTES */}
          {activeTab === "clients" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.map((cli) => (
                <div
                  key={cli.id}
                  className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFE4E6] text-rose-600 font-extrabold text-base flex items-center justify-center">
                        {cli.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">
                          {cli.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                          {cli.phone}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#D1FAE5] text-emerald-900 text-[10px] font-black">
                      {cli.status}
                    </span>
                  </div>

                  <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-2xl flex items-start gap-3 text-rose-800 text-xs font-semibold">
                    <AlertCircle
                      size={16}
                      className="shrink-0 mt-0.5 text-rose-500"
                    />
                    <span>{cli.alerts}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>Último Servicio:</span>
                      <span className="text-slate-500">{cli.lastVisit}</span>
                    </div>
                    <p className="text-slate-600 font-medium">
                      {cli.lastService}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: SERVICIOS */}
          {activeTab === "services" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Peluquería",
                  icon: <Scissors size={24} />,
                  count: "12 Servicios",
                  color: "bg-amber-50 text-amber-600",
                },
                {
                  title: "Manicuría",
                  icon: <Sparkles size={24} />,
                  count: "8 Servicios",
                  color: "bg-emerald-50 text-emerald-600",
                },
                {
                  title: "Pestañas",
                  icon: <Eye size={24} />,
                  count: "6 Servicios",
                  color: "bg-rose-50 text-rose-600",
                },
              ].map((cat, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center`}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-black text-slate-800">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {cat.count}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB: PAGOS */}
          {activeTab === "payments" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { title: "Ingresos Hoy", value: "$12,450", trend: "+15%" },
                {
                  title: "Comisiones Pendientes",
                  value: "$3,200",
                  trend: "3 Especialistas",
                },
                {
                  title: "Ventas de Productos",
                  value: "$4,100",
                  trend: "Tratamientos/Insumos",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-2"
                >
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {card.value}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-[#D1FAE5] px-2.5 py-1 rounded-full inline-block">
                    {card.trend}
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // --- LANDING PAGE ---
  return (
    <div className="min-h-screen bg-[#FCF7F7] text-slate-900 font-sans selection:bg-[#D1FAE5]">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#D1FAE5] text-emerald-700 flex items-center justify-center font-black text-base">
                ✦
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                byutie
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
              >
                Servicios
              </a>
              <a
                href="#pricing"
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
              >
                Planes
              </a>
              <button
                onClick={() => setActiveTab("schedule")}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
              >
                Demo App
              </button>
              <button
                onClick={() => setActiveTab("schedule")}
                className="flex items-center justify-center rounded-full h-11 px-7 bg-[#D1FAE5] hover:bg-emerald-200 transition-all text-emerald-950 text-xs font-extrabold tracking-wide shadow-sm"
              >
                Probar Gratis
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-[65px] h-80 z-40 bg-white border-b border-slate-100 md:hidden p-6 flex flex-col gap-6 text-center">
            <a
              onClick={closeMenu}
              href="#features"
              className="text-sm font-bold uppercase tracking-wider border-b pb-3"
            >
              Servicios
            </a>
            <a
              onClick={closeMenu}
              href="#pricing"
              className="text-sm font-bold uppercase tracking-wider border-b pb-3"
            >
              Planes
            </a>
            <button
              onClick={() => {
                closeMenu();
                setActiveTab("schedule");
              }}
              className="flex items-center justify-center rounded-full h-14 bg-[#D1FAE5] text-emerald-950 font-extrabold uppercase tracking-wider"
            >
              Empezar Ahora
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
            <div className="flex flex-col gap-6 lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex mx-auto lg:mx-0 w-fit items-center gap-2 rounded-full bg-[#FFE4E6] px-4 py-1.5 text-xs font-bold text-rose-700">
                <Flower2 size={16} />
                Gestión para Peluquerías, Nails & Pestañas
              </div>
              <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight text-slate-900">
                Elevamos la{" "}
                <span className="text-rose-500 italic">gestión</span> de tu
                centro de estética
              </h1>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Simplifica turnos, controla puestos de trabajo, comisiones e
                historial de tratamientos en una sola plataforma diseñada con
                elegancia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-center lg:justify-start">
                <button
                  onClick={() => setActiveTab("schedule")}
                  className="flex items-center justify-center rounded-full h-14 px-8 bg-[#D1FAE5] hover:bg-emerald-200 text-emerald-950 text-xs font-extrabold tracking-wider shadow-sm transition-all hover:scale-105"
                >
                  Ver Demo Interactivas
                </button>
              </div>
            </div>

            {/* Visual Hero Feature */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative bg-white rounded-[3rem] p-6 border border-slate-100 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] text-emerald-700 flex items-center justify-center font-bold">
                      ✦
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Citas de Hoy
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Peluquería & Manicuría
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black bg-rose-50 text-rose-600 px-3 py-1 rounded-full">
                    24 Tratamientos
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100/60 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">
                        Lucía Méndez — Balayage
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500">
                        Sillón 02 • Carlos R.
                      </p>
                    </div>
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/60 px-2.5 py-1 rounded-full">
                      09:00 AM
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100/60 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">
                        Valeria Gómez — Lash Lifting
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500">
                        Cabina 03 • Valentina K.
                      </p>
                    </div>
                    <span className="text-[10px] font-black text-rose-800 bg-rose-200/60 px-2.5 py-1 rounded-full">
                      11:00 AM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-10 max-w-7xl mx-auto" id="features">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
            Simplicidad & Estilo
          </h2>
          <p className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Control total de tu spa, cabinas y equipo
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Calendar size={28} />,
              title: "Agenda Por Puestos",
              desc: "Asigna turnos automáticamente por sillones, mesas de uñas o cabinas de pestañas.",
            },
            {
              icon: <PieChart size={28} />,
              title: "Insumos & Stock",
              desc: "Control exacto de tintura, insumos de manicuría y vencimiento de adhesivos.",
            },
            {
              icon: <BarChart3 size={28} />,
              title: "Reportes & Comisiones",
              desc: "Cálculo automático de comisiones para peluqueros, manicuras y lashestis.",
            },
            {
              icon: <History size={28} />,
              title: "Fichas & Alergias",
              desc: "Registro de fórmulas de tinte y alertas médicas sobre parches y pegamentos.",
            },
            {
              icon: <Smartphone size={28} />,
              title: "Recordatorios WhatsApp",
              desc: "Reduce cancelaciones avisando a tus clientes antes de cada cita.",
            },
            {
              icon: <CheckCircle2 size={28} />,
              title: "Caja & Pagos",
              desc: "Cobro de servicios, productos de reventa y señas de reserva online.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-5 rounded-[2.5rem] border border-slate-100 bg-white p-8 hover:shadow-md transition-all"
            >
              <div className="text-emerald-700 bg-[#D1FAE5] w-14 h-14 rounded-2xl flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="py-20 px-6 bg-white/50 border-t border-slate-100"
        id="pricing"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Planes a tu medida
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Elige el plan que potencie el crecimiento de tu centro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Soft",
                price: "$750",
                features: [
                  "1 Especialista",
                  "100 Citas/mes",
                  "Fichas Digitales",
                ],
              },
              {
                name: "Glow Pro",
                price: "$1,450",
                popular: true,
                features: [
                  "Hasta 5 Especialistas",
                  "Citas Ilimitadas",
                  "Control de Comisiones",
                  "Recordatorios por WhatsApp",
                ],
              },
              {
                name: "Diamond",
                price: "$2,200",
                features: [
                  "Especialistas Ilimitados",
                  "Múltiples Sucursales",
                  "Caja & Finanzas Pro",
                  "Soporte Prioritario",
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col rounded-[3rem] p-8 border-2 transition-all ${
                  plan.popular
                    ? "border-emerald-300 bg-white shadow-xl"
                    : "border-slate-100 bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D1FAE5] text-emerald-950 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                    Recomendado
                  </div>
                )}
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-bold text-slate-900">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mt-3">
                    <span className="text-4xl font-black text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      / mes
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-3.5 mb-8 flex-grow">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-3 text-xs font-bold text-slate-600"
                    >
                      <Check
                        size={16}
                        className="text-emerald-600 shrink-0"
                        strokeWidth={3}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setActiveTab("schedule")}
                  className="w-full rounded-full h-12 flex items-center justify-center bg-[#D1FAE5] hover:bg-emerald-200 text-emerald-950 text-xs font-extrabold transition-all"
                >
                  Seleccionar Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#D1FAE5] text-emerald-700 flex items-center justify-center font-black text-xs">
              ✦
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              byutie CRM
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            © 2026 byutie. Estética, Peluquería y Pestañas.
          </p>
        </div>
      </footer>
    </div>
  );
}
