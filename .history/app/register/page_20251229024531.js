"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Store,
  Clock,
  Award,
  Check,
  ArrowRight,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function RegisterPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = [
    {
      id: "basic",
      name: "Inicial",
      price: "29",
      features: ["1 Barbero", "50 Reservas/mes"],
    },
    {
      id: "pro",
      name: "Profesional",
      price: "49",
      features: ["3 Barberos", "Reservas Ilimitadas", "Recordatorios SMS"],
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Empresa",
      price: "99",
      features: ["Barberos Ilimitados", "App Personalizada"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#0a0f1a] font-sans antialiased">
      {/* Header unificado con el resto de la app */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-6 lg:px-10 justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Scissors size={18} />
          </div>
          <h2 className="text-lg font-black italic tracking-tighter uppercase dark:text-white">
            Barber<span className="text-blue-600">Manager</span>
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Inicio", "Funcionalidades", "Precios", "Soporte"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors"
            >
              {item}
            </Link>
          ))}
          <Link
            href="/login"
            className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto pt-24 pb-20 px-6">
        {/* Encabezado y Progreso */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white italic uppercase">
                Registra tu <span className="text-blue-600">Barbería</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold max-w-xl">
                Únete a la plataforma líder y gestiona tus reservas
                profesionalmente.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
              <ShieldCheck size={14} /> Registro 100% Seguro
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <span>Paso 1 de 3: Configuración</span>
              <span className="text-blue-600">33% Completado</span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-1">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                style={{ width: "33%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Columna Formulario (Izquierda) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sección: Información del Negocio */}
            <div className="bg-white dark:bg-[#101622] rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Store size={24} />
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-tight dark:text-white">
                  Negocio
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Nombre de la Barbería"
                  placeholder="Ej. El Caballero"
                />
                <InputGroup
                  label="Email Comercial"
                  placeholder="contacto@barberia.com"
                  type="email"
                />
                <div className="md:col-span-2">
                  <InputGroup
                    label="Dirección Completa"
                    placeholder="Calle Principal 123..."
                    icon={<MapPin size={18} />}
                  />
                </div>
                <InputGroup label="Ciudad" placeholder="Madrid, ES" />
                <InputGroup
                  label="Teléfono"
                  placeholder="+34 600 000 000"
                  icon={<Phone size={18} />}
                />
              </div>
            </div>

            {/* Sección: Planes */}
            <div className="bg-white dark:bg-[#101622] rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                  <Award size={24} />
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-tight dark:text-white">
                  Plan
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPlan === plan.id
                        ? "border-blue-600 bg-blue-600/5 ring-4 ring-blue-600/10"
                        : "border-slate-100 dark:border-slate-800 hover:border-blue-300"
                    }`}
                  >
                    {plan.recommended && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-[8px] font-black uppercase tracking-widest text-white px-3 py-1 rounded-full">
                        Recomendado
                      </span>
                    )}
                    <h3
                      className={`font-black uppercase italic ${
                        selectedPlan === plan.id
                          ? "text-blue-600"
                          : "text-slate-400"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <div className="my-4">
                      <span className="text-3xl font-black dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        /mes
                      </span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-400"
                        >
                          <Check size={14} className="text-green-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div
                      className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedPlan === plan.id
                          ? "border-blue-600 bg-blue-600"
                          : "border-slate-200"
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-blue-500/40 transition-all flex items-center gap-3 active:scale-95">
                Continuar al Pago{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Columna Resumen (Derecha) */}
          <aside className="space-y-6 sticky top-24">
            <div className="rounded-3xl overflow-hidden shadow-2xl h-52 relative group">
              <img
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent flex items-end p-6">
                <p className="text-white text-xs font-black uppercase tracking-widest leading-relaxed">
                  Únete a más de 2,000 barberías exitosas.
                </p>
              </div>
            </div>

            <div className="bg-[#101622] text-white rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-xl font-black italic uppercase mb-6">
                Resumen
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold py-3 border-b border-white/5">
                  <span className="text-slate-400">Plan Seleccionado</span>
                  <span className="uppercase text-blue-400">
                    {selectedPlan}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold py-3 border-b border-white/5">
                  <span className="text-slate-400">Cuota Mensual</span>
                  <span>
                    ${plans.find((p) => p.id === selectedPlan).price}.00
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-black uppercase italic">
                    Total
                  </span>
                  <span className="text-3xl font-black text-blue-500">
                    ${plans.find((p) => p.id === selectedPlan).price}.00
                  </span>
                </div>
              </div>
              <div className="mt-8 bg-white/5 p-4 rounded-2xl flex gap-4 items-start border border-white/5">
                <ShieldCheck className="text-green-500 shrink-0" size={20} />
                <p className="text-[10px] font-bold text-slate-400 leading-normal">
                  Garantía de devolución de 30 días. Transacción cifrada punto a
                  punto.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-100 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
              <h4 className="font-black uppercase text-xs mb-2 dark:text-white">
                ¿Necesitas ayuda?
              </h4>
              <p className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest">
                Soporte 24/7 disponible para ti.
              </p>
              <Link
                href="#"
                className="text-blue-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
              >
                Contactar <ExternalLink size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

// Subcomponente de Input refinado
function InputGroup({ label, placeholder, type = "text", icon }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full py-4 ${
            icon ? "pl-12" : "pl-4"
          } pr-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all outline-none font-bold text-slate-700 dark:text-white placeholder:text-slate-400 placeholder:font-medium`}
        />
      </div>
    </div>
  );
}
