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
  History,
  Linkedin,
  Users,
  CreditCard,
  Plus,
  Search,
  Clock,
  AlertCircle,
  Scissors,
  Eye,
  LogOut,
  ChevronRight,
  UserCheck,
  DollarSign,
} from "lucide-react";

export default function AppEsteticaLanding() {
  const [view, setView] = useState("landing"); // 'landing' | 'schedule' | 'clients' | 'services' | 'payments'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const closeMenu = () => setIsMenuOpen(false);

  // --- DATOS MOCK DEL CRM ---
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
      badgeClass: "bg-amber-100 text-amber-900 border-amber-200",
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
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-200",
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
      badgeClass: "bg-rose-100 text-rose-900 border-rose-200",
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

  // ==========================================
  // VISTA INTERNA DEL CRM (PANEL DE CONTROL)
  // ==========================================
  if (view !== "landing") {
    return (
      <div className="flex min-h-screen bg-[#FCF7F7] text-slate-800 font-sans">
        {/* SIDEBAR ESTILO 'BYUTIE' */}
        <aside className="w-64 min-h-screen bg-white/90 backdrop-blur-md border-r border-slate-100 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
                ✦
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-none">
                  AppEstetica
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  CRM para estética
                </span>
              </div>
            </div>

            <nav className="space-y-1.5">
              {[
                {
                  id: "schedule",
                  label: "Agenda Turnos",
                  icon: <Calendar size={18} />,
                },
                {
                  id: "clients",
                  label: "Fichas Clientes",
                  icon: <Users size={18} />,
                },
                {
                  id: "services",
                  label: "Tratamientos",
                  icon: <Sparkles size={18} />,
                },
                {
                  id: "payments",
                  label: "Caja & Pagos",
                  icon: <CreditCard size={18} />,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    view === item.id
                      ? "bg-emerald-100 text-emerald-950 shadow-sm"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-[2rem] text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-rose-200/60 text-rose-600 mx-auto flex items-center justify-center">
                <Heart size={16} />
              </div>
              <p className="text-xs font-bold text-rose-900">
                Recordatorios WA
              </p>
              <p className="text-[10px] text-rose-700/80 leading-relaxed">
                Mensajes de confirmación automáticos activos.
              </p>
            </div>

            <button
              onClick={() => setView("landing")}
              className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors w-full"
            >
              <LogOut size={18} />
              <span>Volver a la Web</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-8 overflow-y-auto">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {view === "schedule" && "Agenda de Turnos & Cabinas"}
                {view === "clients" && "Directorio de Clientes"}
                {view === "services" && "Catálogo de Servicios"}
                {view === "payments" && "Caja & Facturación"}
              </h1>
              <p className="text-xs font-semibold text-slate-400 mt-1">
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
                  placeholder="Buscar turno, cliente..."
                  className="pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-100 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 w-60 shadow-sm"
                />
              </div>
              <button className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs px-5 py-3 rounded-2xl transition-all shadow-sm">
                <Plus size={16} />
                <span>Nuevo Turno</span>
              </button>
            </div>
          </header>

          {/* VISTA AGENDA */}
          {view === "schedule" && (
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
                        ? "bg-emerald-100 text-emerald-950 shadow-sm"
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
                      className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
                          <Clock size={12} /> {app.time} ({app.duration})
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${app.badgeClass}`}
                        >
                          {app.category}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900">
                          {app.client}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-1">
                          {app.service}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                        <div>
                          <span className="block text-[10px] uppercase text-slate-400">
                            Estación:
                          </span>
                          {app.station} • {app.specialist}
                        </div>
                        <button className="text-pink-600 hover:underline">
                          Ver Ficha →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* VISTA CLIENTES */}
          {view === "clients" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.map((cli) => (
                <div
                  key={cli.id}
                  className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 font-extrabold text-base flex items-center justify-center">
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
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black">
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

                  <div className="bg-slate-50 p-4 rounded-2xl space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>Último Servicio:</span>
                      <span className="text-slate-400">{cli.lastVisit}</span>
                    </div>
                    <p className="text-slate-600 font-medium">
                      {cli.lastService}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISTA SERVICIOS */}
          {view === "services" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Peluquería",
                  icon: <Scissors size={24} />,
                  count: "12 Tratamientos",
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

          {/* VISTA PAGOS */}
          {view === "payments" && (
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
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full inline-block">
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

  // ==========================================
  // VISTA LANDING PAGE (APPESTETICA)
  // ==========================================
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-900 dark:text-white shrink-1"
            >
              <span className="text-lg sm:text-xl flex items-center gap-2 font-black uppercase tracking-widest italic">
                AppEstetica <Sparkles size={24} className="text-pink-500" />
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                className="text-xs font-bold hover:text-pink-500 transition-colors uppercase tracking-widest"
                href="#features"
              >
                Funciones
              </a>
              <a
                className="text-xs font-bold hover:text-pink-500 transition-colors uppercase tracking-widest"
                href="#pricing"
              >
                Planes
              </a>
              <Link
                href="/login"
                className="text-xs font-bold hover:text-pink-500 transition-colors uppercase tracking-widest text-slate-600 dark:text-slate-300"
              >
                Ingresar al CRM
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center rounded-full h-10 px-6 bg-pink-500 hover:bg-pink-600 transition-all text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-500/20"
              >
                Probar Gratis
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed inset-0 top-[65px] h-80 z-40 bg-white dark:bg-slate-950 transition-transform duration-300 md:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <nav className="flex flex-col p-6 gap-6 text-center">
            <a
              onClick={closeMenu}
              className="text-md font-black uppercase border-b border-slate-100 pb-4"
              href="#features"
            >
              Servicios
            </a>
            <a
              onClick={closeMenu}
              className="text-md font-black uppercase border-b border-slate-100 pb-4"
              href="#pricing"
            >
              Planes
            </a>
            <button
              onClick={() => {
                closeMenu();
                window.location.href = "/login";
              }}
              className="mt-4 flex items-center justify-center rounded-full h-16 bg-pink-500 text-white text-lg font-black uppercase tracking-widest"
            >
              Empezar Ahora
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 lg:py-24">
          <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
            <div className="flex flex-col gap-6 lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex mx-auto lg:mx-0 w-fit items-center gap-2 rounded-full bg-pink-50 dark:bg-pink-900/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-pink-600">
                <Flower2 size={14} />
                El CRM de tu centro de estética
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tighter uppercase italic">
                Ordena tu operación y haz crecer tu negocio
              </h1>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                AppEstetica reúne agenda, clientes, especialistas, servicios,
                finanzas y reservas online en un solo lugar. Menos planillas,
                más tiempo para atender.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-full h-14 px-10 bg-pink-500 hover:bg-pink-600 text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-pink-500/20 transition-all hover:scale-105"
                >
                  Crear mi cuenta gratis
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-full h-14 px-8 border border-slate-200 bg-white text-slate-700 text-sm font-black uppercase tracking-widest transition-all hover:border-emerald-300 hover:text-emerald-700"
                >
                  Ingresar al CRM
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative px-4 sm:px-0">
              <div className="absolute -inset-4 sm:-inset-10 bg-pink-500/10 rounded-full blur-3xl"></div>
              <div className="relative w-full aspect-square sm:aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80')] bg-center bg-cover rounded-[3rem] shadow-2xl border-4 border-white dark:border-slate-900">
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-xl border border-pink-50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                      <Heart size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                        Citas de hoy
                      </p>
                      <p className="text-lg font-black dark:text-white">
                        24 Tratamientos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-16 sm:py-24 px-6 sm:px-10 max-w-7xl mx-auto"
        id="features"
      >
        <div className="text-center mb-16">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 mb-4">
            Todo lo que tu operación necesita
          </h2>
          <p className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
            Una vista clara de cada parte del negocio
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Calendar size={32} />,
              title: "Agenda online",
              desc: "Publica tu enlace de reservas y organiza turnos por especialista, fecha y horario.",
            },
            {
              icon: <PieChart size={32} />,
              title: "Clientes y fichas",
              desc: "Centraliza datos, historial de visitas y notas importantes para cada cliente.",
            },
            {
              icon: <BarChart3 size={32} />,
              title: "Servicios y especialistas",
              desc: "Administra tratamientos, precios, duración, categorías y equipo desde un mismo lugar.",
            },
            {
              icon: <History size={32} />,
              title: "Finanzas",
              desc: "Registra cobros por efectivo, transferencia, tarjeta o Mercado Pago y consulta tus totales.",
            },
            {
              icon: <Smartphone size={32} />,
              title: "Pagos online",
              desc: "Cobra tus planes con Mercado Pago y activa 30 días de servicio automáticamente.",
            },
            {
              icon: <CheckCircle2 size={32} />,
              title: "Control administrativo",
              desc: "Consulta planes, estados e historial de pagos de todos tus centros desde el panel maestro.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group flex flex-col gap-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 hover:border-pink-200 transition-all hover:shadow-lg"
            >
              <div className="text-pink-500 bg-pink-50 dark:bg-pink-900/20 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-black uppercase italic">
                {item.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="py-16 sm:py-24 px-6 bg-slate-50 dark:bg-slate-950/50"
        id="pricing"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 uppercase italic tracking-tighter">
              Nuestros Planes
            </h2>
            <p className="text-base text-slate-500 font-medium">
              Elige la mejor opción para tu crecimiento.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Soft",
                price: "GRATIS",
                features: ["1 Especialista", "20 Citas", "Agenda Básica"],
              },
              {
                name: "Glow",
                price: "$1",
                features: [
                  "1 Especialista",
                  "50 Citas/mes",
                  "Agenda y clientes",
                ],
              },
              {
                name: "Radiance",
                price: "$1450",
                popular: true,
                features: [
                  "3 Especialistas",
                  "250 Citas/mes",
                  "Estadísticas",
                  "Recordatorios",
                ],
              },
              {
                name: "Diamond",
                price: "$2200",
                features: [
                  "Especialistas Ilimitados",
                  "Citas Ilimitadas",
                  "Marketing",
                  "Recordatorios",
                  "Finanzas",
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col rounded-[3rem] p-8 border-2 transition-all ${
                  plan.popular
                    ? "border-pink-500 bg-white shadow-2xl dark:bg-slate-900"
                    : "border-slate-100 bg-white dark:bg-slate-900/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[9px] font-black px-6 py-1.5 rounded-full uppercase tracking-widest">
                    Recomendado
                  </div>
                )}
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-black uppercase italic text-slate-800 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mt-4">
                    <span className="text-3xl font-black text-pink-500">
                      {plan.price}
                    </span>
                    {plan.price !== "GRATIS" && (
                      <span className="text-[10px] font-black text-slate-400">
                        / MES
                      </span>
                    )}
                  </div>
                </div>
                <ul className="flex flex-col gap-4 mb-8 flex-grow">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-3 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400"
                    >
                      <Check
                        size={16}
                        className="text-pink-500"
                        strokeWidth={3}
                      />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="w-full rounded-full h-12 flex items-center justify-center bg-pink-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-pink-600 transition-colors"
                >
                  Comenzar ahora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-xl flex items-center gap-2 font-black uppercase tracking-widest italic">
            AppEstetica <Sparkles size={24} className="text-pink-500" />
          </span>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            © 2026 AppEstetica. Gestión simple para centros que crecen.
          </p>
          <div className="flex gap-4">
            <Instagram
              size={20}
              className="text-slate-400 hover:text-pink-500 cursor-pointer"
            />
            <Linkedin
              size={20}
              className="text-slate-400 hover:text-pink-500 cursor-pointer"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
