"use client"; // Necesario para el uso de useState
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
} from "lucide-react";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-900 dark:text-white shrink-1"
            >
              <span className="text-lg sm:text-xl flex items-center gap-2 font-black uppercase tracking-widest italic">
                Aura <Sparkles size={24} className="text-pink-500" /> Estética
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                className="text-xs font-bold hover:text-pink-500 transition-colors uppercase tracking-widest"
                href="#features"
              >
                Servicios
              </a>
              <a
                className="text-xs font-bold hover:text-pink-500 transition-colors uppercase tracking-widest"
                href="#pricing"
              >
                Planes
              </a>
              <Link
                className="text-xs font-bold hover:text-pink-500 transition-colors uppercase tracking-widest"
                href="/login"
              >
                Ingresar
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
            <Link
              onClick={closeMenu}
              href="/register"
              className="mt-4 flex items-center justify-center rounded-full h-16 bg-pink-500 text-white text-lg font-black uppercase tracking-widest"
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
              <div className="inline-flex mx-auto lg:mx-0 w-fit items-center gap-2 rounded-full bg-pink-50 dark:bg-pink-900/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-pink-600">
                <Flower2 size={14} />
                Gestión para Centros de Belleza
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tighter uppercase italic">
                Resalta la <span className="text-pink-500">Belleza</span> de tu
                negocio
              </h1>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                La plataforma integral para gestionar citas, tratamientos y
                clientes. Simplifica tu día a día y brinda una experiencia de
                lujo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-full h-14 px-10 bg-pink-500 hover:bg-pink-600 text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-pink-500/20 transition-all hover:scale-105"
                >
                  Registrar mi centro
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
            Elegancia & Eficiencia
          </h2>
          <p className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
            Control total de tu spa o centro
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Calendar size={32} />,
              title: "Agenda Pro",
              desc: "Gestión inteligente de cabinas y profesionales de belleza.",
            },
            {
              icon: <PieChart size={32} />,
              title: "Ventas",
              desc: "Control de productos, servicios y stock de insumos.",
            },
            {
              icon: <BarChart3 size={32} />,
              title: "Análisis",
              desc: "Reportes de rentabilidad por tratamiento y especialista.",
            },
            {
              icon: <History size={32} />,
              title: "Ficha Clínica",
              desc: "Historial de tratamientos y consentimiento de clientes.",
            },
            {
              icon: <Smartphone size={32} />,
              title: "Recordatorios",
              desc: "Avisos vía WhatsApp para reducir el ausentismo.",
            },
            {
              icon: <CheckCircle2 size={32} />,
              title: "Comisiones",
              desc: "Cálculo automático para esteticistas y especialistas.",
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
                features: ["1 Especialista", "15 Citas", "Agenda Básica"],
              },
              {
                name: "Glow",
                price: "$750",
                features: [
                  "1 Especialista",
                  "100 Citas/mes",
                  "Fichas Digitales",
                ],
              },
              {
                name: "Radiance",
                price: "$1450",
                popular: true,
                features: [
                  "4 Especialistas",
                  "Ilimitado",
                  "Estadísticas Avanzadas",
                  "Recordatorios",
                ],
              },
              {
                name: "Diamond",
                price: "$2200",
                features: [
                  "Ilimitado",
                  "Multisucursal",
                  "Marketing VIP",
                  "Soporte 24/7",
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col rounded-[3rem] p-8 border-2 transition-all ${
                  plan.popular
                    ? "border-pink-500 bg-white shadow-2xl"
                    : "border-slate-100 bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[9px] font-black px-6 py-1.5 rounded-full uppercase tracking-widest">
                    Recomendado
                  </div>
                )}
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-black uppercase italic text-slate-800">
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
                      className="flex items-center gap-3 text-[10px] font-bold uppercase text-slate-500"
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
                  Seleccionar
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-xl flex items-center gap-2 font-black uppercase tracking-widest italic">
            Aura <Sparkles size={24} className="text-pink-500" /> Estética
          </span>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            © 2025 AuraManager. Elevando el estándar de belleza.
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
};

export default HomePage;
