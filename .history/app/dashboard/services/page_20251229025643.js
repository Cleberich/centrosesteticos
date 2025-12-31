"use client";
import React, { useState } from "react";
import {
  Plus,
  Scissors,
  Clock,
  MoreVertical,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
} from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Corte Clásico",
      price: 20,
      time: 30,
      active: true,
      category: "Cabello",
    },
    {
      id: 2,
      name: "Barba Royal",
      price: 15,
      time: 20,
      active: true,
      category: "Barba",
    },
    {
      id: 3,
      name: "Combo Elite",
      price: 30,
      time: 50,
      active: false,
      category: "Premium",
    },
    {
      id: 4,
      name: "Limpieza Facial",
      price: 25,
      time: 40,
      active: true,
      category: "Skin",
    },
  ]);

  const toggleService = (id) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-[#0a0f1a]">
      {/* HEADER REFINADO */}
      <header className="flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight dark:text-white flex items-center gap-2">
            Catálogo de Servicios
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">
              {services.length} Total
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Define precios, tiempos y disponibilidad
          </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-900/10 active:scale-95">
          <Plus size={16} /> Añadir Servicio
        </button>
      </header>

      {/* GRID DE SERVICIOS */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((s) => (
            <div
              key={s.id}
              className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-md ${
                s.active
                  ? "border-slate-100 dark:border-slate-800"
                  : "border-dashed border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50"
              }`}
            >
              {/* Top Row: Category & Menu */}
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-md">
                  {s.category}
                </span>
                <button className="text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Info Principal */}
              <div className="space-y-1 mb-6">
                <h3 className="text-base font-bold dark:text-white group-hover:text-blue-600 transition-colors">
                  {s.name}
                </h3>
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span className="text-xs font-medium">{s.time} min</span>
                  </div>
                  <div className="size-1 rounded-full bg-slate-200" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-300">
                    ${s.price}
                  </span>
                </div>
              </div>

              {/* Footer: Toggle & Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/50">
                <button
                  onClick={() => toggleService(s.id)}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                    s.active ? "text-emerald-500" : "text-red-300"
                  }`}
                >
                  {s.active ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                  {s.active ? "Activo" : "Pausado"}
                </button>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                    <Edit3 size={14} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State / Add Card */}
          <button className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-blue-500/50 hover:text-blue-500 transition-all group">
            <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-blue-50 transition-all">
              <Plus size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">
              Nuevo Servicio
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
