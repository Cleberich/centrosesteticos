"use client";
import React from "react";
import { Plus, Scissors, Clock, DollarSign, Edit3, Trash2 } from "lucide-react";

export default function ServicesPage() {
  const categories = ["Corte", "Barba", "Tratamientos", "Combos"];

  const services = [
    {
      id: 1,
      title: "Corte Clásico",
      price: "$20",
      time: "30 min",
      cat: "Corte",
      color: "blue",
    },
    {
      id: 2,
      title: "Arreglo de Barba",
      price: "$15",
      time: "20 min",
      cat: "Barba",
      color: "emerald",
    },
    {
      id: 3,
      title: "Corte + Barba",
      price: "$30",
      time: "50 min",
      cat: "Combos",
      color: "indigo",
    },
    {
      id: 4,
      title: "Exfoliación Facial",
      price: "$25",
      time: "30 min",
      cat: "Tratamientos",
      color: "amber",
    },
  ];

  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <header className="flex flex-col md:items-start gap-4 mb-10">
        <div className="w-full flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Servicios
            </h1>
            <p className="text-slate-500">
              Configura tu menú de servicios y precios
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all">
            <Plus size={20} /> Nuevo Servicio
          </button>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 w-full">
          <button className="px-6 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full text-xs font-bold">
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div
              className={`size-12 rounded-2xl bg-${s.color}-50 dark:bg-${s.color}-900/20 text-${s.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <Scissors size={24} />
            </div>
            <h3 className="font-black text-lg mb-1">{s.title}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
              {s.cat}
            </p>

            <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Precio
                </span>
                <span className="text-xl font-black text-blue-600">
                  {s.price}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Duración
                </span>
                <span className="text-sm font-bold flex items-center gap-1">
                  <Clock size={14} /> {s.time}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-2 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
                <Edit3 size={14} /> Editar
              </button>
              <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
