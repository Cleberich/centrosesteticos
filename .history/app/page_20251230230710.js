"use client"; // Necesario para el uso de useState
import React, { useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Menu,
  X, // Icono para cerrar el menú
  CheckCircle2,
  Calendar,
  BarChart3,
  PieChart,
  Smartphone,
  Check,
  Instagram,
  Linkedin,
  Star,
  User,
  History,
} from "lucide-react";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para cerrar el menú al hacer clic en un enlace
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-900 dark:text-white shrink-0"
            >
              <span className="text-lg sm:text-xl flex items-center gap-2 font-black uppercase tracking-tighter ">
                Agenda <Scissors size={24} className="text-blue-600" /> Barber
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                className="text-sm font-bold hover:text-blue-600 transition-colors uppercase"
                href="#features"
              >
                Funcionalidades
              </a>
              <a
                className="text-sm font-bold hover:text-blue-600 transition-colors uppercase"
                href="#pricing"
              >
                Precios
              </a>
              <Link
                className="text-sm font-bold hover:text-blue-600 transition-colors uppercase"
                href="/login"
              >
                Ingresar
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center rounded-xl h-10 px-6 bg-blue-600 hover:bg-blue-700 transition-all text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
              >
                Empezar Ahora
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed inset-0 top-[65px] h-80 z-40 bg-white dark:bg-slate-950 transition-transform duration-300 ease-in-out md:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <nav className="flex flex-col p-6 gap-6 text-center">
            <a
              onClick={closeMenu}
              className="text-xl font-black uppercase italic border-b border-slate-100 dark:border-slate-800 pb-4"
              href="#features"
            >
              Funcionalidades
            </a>
            <a
              onClick={closeMenu}
              className="text-xl font-black uppercase italic border-b border-slate-100 dark:border-slate-800 pb-4"
              href="#pricing"
            >
              Precios
            </a>
            <Link
              onClick={closeMenu}
              className="text-xl font-black uppercase italic border-b border-slate-100 dark:border-slate-800 pb-4"
              href="/login"
            >
              Ingresar
            </Link>
            <Link
              onClick={closeMenu}
              href="/register"
              className="mt-4 flex items-center justify-center rounded-2xl h-16 bg-blue-600 text-white text-lg font-black uppercase italic tracking-widest"
            >
              Empezar Ahora
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 lg:py-24">
          <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
            <div className="flex flex-col gap-6 lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex mx-auto lg:mx-0 w-fit items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Control Total de tu Negocio
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight sm:leading-[0.9] tracking-tighter uppercase italic">
                Eleva el nivel de tu{" "}
                <span className="text-blue-600">Barbería</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Organiza tu agenda, controla tus ingresos y profesionaliza el
                trato con tus clientes con la plataforma más completa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-xl h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black uppercase tracking-widest shadow-xl"
                >
                  Registrar mi barbería
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative px-4 sm:px-0">
              <div className="absolute -inset-4 sm:-inset-10 bg-blue-600/10 rounded-full blur-3xl"></div>
              <div className="relative w-full aspect-square sm:aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80')] bg-center bg-cover rounded-3xl shadow-2xl border-4 sm:border-8 border-white dark:border-slate-900">
                <div className="relative -bottom-4 -right-4 sm:top-6 sm:-left-6 bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600">
                      <BarChart3 size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                        Ingresos Hoy
                      </p>
                      <p className="text-base sm:text-lg font-black dark:text-white">
                        $12,450
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        className="py-16 sm:py-24 px-6 sm:px-10 max-w-7xl mx-auto"
        id="features"
      >
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">
            Herramientas Profesionales
          </h2>
          <p className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-tight">
            Todo lo que necesitas para gestionar tu equipo
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: <Calendar size={32} />,
              title: "Agenda",
              desc: "Calendario dinámico e intuitivo para todos tus barberos.",
            },
            {
              icon: <PieChart size={32} />,
              title: "Contabilidad",
              desc: "Registra cada pago y controla el efectivo en caja.",
            },
            {
              icon: <BarChart3 size={32} />,
              title: "Estadísticas",
              desc: "Reportes de rendimiento y crecimiento de tu negocio.",
            },
            {
              icon: <History size={32} />,
              title: "Fidelización",
              desc: "Historial detallado de cada cliente y sus preferencias.",
            },
            {
              icon: <Smartphone size={32} />,
              title: "WhatsApp",
              desc: "Envía recordatorios personalizados de forma rápida.",
            },
            {
              icon: <CheckCircle2 size={32} />,
              title: "Comisiones",
              desc: "Configura pagos personalizados para cada barbero.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 sm:p-8 hover:bg-slate-50 transition-all"
            >
              <div className="text-blue-600 bg-blue-50 dark:bg-blue-900/20 w-14 h-14 rounded-2xl flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-lg font-black uppercase italic">
                {item.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="py-16 sm:py-24 px-6 bg-slate-50 dark:bg-slate-950"
        id="pricing"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 uppercase italic tracking-tighter">
              Planes
            </h2>
            <p className="text-base text-slate-500 font-medium">
              Gestión profesional para tu barbería.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {[
              {
                name: "Inicial",
                price: "GRATIS",
                features: ["1 Barbero", "20 Reservas", "Gestión de Agenda"],
              },
              {
                name: "Básico",
                price: "$690",
                features: [
                  "1 Barbero",
                  "150 Reservas/mes",
                  "Gestión de Agenda",
                ],
              },
              {
                name: "Profesional",
                price: "$1290",
                popular: true,
                features: [
                  "3 Barberos",
                  "600 Reservas/mes",
                  "Gestión de Agenda",
                  "Estadísticas",
                ],
              },
              {
                name: "Elite",
                price: "$1900",
                features: [
                  "Ilimitado",
                  "Agenda Pro",
                  "Estadísticas",
                  "Marketing",
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col rounded-[2.5rem] p-8 border-2 transition-all ${
                  plan.popular
                    ? "border-blue-600 bg-blue-50/20 dark:bg-blue-900/10 shadow-xl"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a1120]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase">
                    Más Elegido
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-black uppercase italic dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-black text-blue-600">
                      {plan.price}
                    </span>
                    <span className="text-[10px] font-black text-slate-500 uppercase">
                      {plan.price !== "GRATIS" && "/ mes"}
                    </span>
                  </div>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-grow">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-300"
                    >
                      <Check
                        size={14}
                        className="text-green-500"
                        strokeWidth={4}
                      />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="w-full rounded-2xl h-12 flex items-center justify-center bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
                >
                  Elegir
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-xl flex items-center gap-2 font-black uppercase">
              Agenda <Scissors size={24} className="text-blue-600" /> Barber
            </span>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              © 2025 BarberManager. El arte de gestionar bien.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
