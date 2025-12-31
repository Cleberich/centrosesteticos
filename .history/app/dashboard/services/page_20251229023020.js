"use client";
import React, { useState } from "react";
import {
  Plus,
  Scissors,
  Clock,
  Tag,
  ToggleRight,
  Settings2,
  Trash2,
  Edit,
} from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Corte Clásico",
      price: 20,
      time: 30,
      active: true,
      color: "blue",
    },
    {
      id: 2,
      name: "Barba Royal",
      price: 15,
      time: 20,
      active: true,
      color: "amber",
    },
    {
      id: 3,
      name: "Combo Elite",
      price: 30,
      time: 50,
      active: false,
      color: "indigo",
    },
  ]);

  const toggleService = (id) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <header className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-10">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            Menú de <span className="text-blue-600">Estilo</span>
          </h1>
          <p className="text-slate-400 font-bold mt-2 tracking-widest uppercase text-xs">
            Crea experiencias, no solo servicios
          </p>
        </div>
        <button className="size-16 bg-blue-600 text-white rounded-[2rem] hover:rotate-90 hover:rounded-2xl transition-all flex items-center justify-center shadow-2xl shadow-blue-500/40">
          <Plus size={32} strokeWidth={3} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((s) => (
          <div
            key={s.id}
            className={`group relative bg-white dark:bg-slate-900 rounded-[3rem] p-10 border-2 transition-all ${
              s.active
                ? "border-slate-100 dark:border-slate-800 hover:border-blue-600"
                : "border-dashed border-slate-200 dark:border-slate-800 opacity-60"
            }`}
          >
            {/* Acciones Rápidas */}
            <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-blue-600 transition-colors">
                <Edit size={16} />
              </button>
              <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>

            <div
              className={`size-16 rounded-3xl bg-${s.color}-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-${s.color}-500/20`}
            >
              <Scissors size={28} strokeWidth={2.5} />
            </div>

            <h3 className="text-2xl font-black mb-2 tracking-tight">
              {s.name}
            </h3>

            <div className="flex items-center gap-6 mb-10">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-600" />
                <span className="text-sm font-black italic">{s.time} MIN</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-blue-600" />
                <span className="text-2xl font-black tracking-tighter">
                  ${s.price}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Disponibilidad
              </span>
              <button
                onClick={() => toggleService(s.id)}
                className={`transition-colors ${
                  s.active ? "text-blue-600" : "text-slate-300"
                }`}
              >
                <ToggleRight
                  size={40}
                  strokeWidth={1.5}
                  fill={s.active ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
