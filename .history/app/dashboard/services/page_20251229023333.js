"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Wallet,
  Settings,
  Download,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  Edit3,
  Trash2,
  X,
  ChevronDown,
  Upload,
  Check,
} from "lucide-react";

// --- Componentes Pequeños ---

const NavItem = ({ icon: Icon, label, active = false }) => (
  <a
    href="#"
    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
      active
        ? "bg-blue-600/10 text-blue-600 font-bold"
        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600"
    }`}
  >
    <Icon
      size={20}
      className={
        active ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"
      }
    />
    <span className="text-sm">{label}</span>
  </a>
);

export default function BarberAdmin() {
  const [activeTab, setActiveTab] = useState("catalogo");

  return (
    <div className="flex h-screen w-full bg-[#f6f6f8] dark:bg-[#0a0f1a] font-sans antialiased overflow-hidden text-slate-900 dark:text-white">
      {/* 1. SIDEBAR */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-black italic">
              B
            </div>
            <div>
              <h1 className="text-base font-black leading-tight uppercase tracking-tighter">
                Barber Admin
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Premium System
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" />
            <NavItem icon={Calendar} label="Agenda" />
            <NavItem icon={Scissors} label="Servicios y Personal" active />
            <NavItem icon={Users} label="Clientes" />
            <NavItem icon={Wallet} label="Finanzas" />
          </nav>

          <div className="mt-auto pt-10">
            <NavItem icon={Settings} label="Configuración" />
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          <div className="px-8 py-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight italic uppercase">
                  Gestión de <span className="text-blue-600">Servicios</span>
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Controla tu catálogo, precios y equipo técnico.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold hover:bg-slate-50 transition-all">
                  <Download size={18} /> Exportar
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                  <Plus size={18} /> Nuevo Item
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 flex gap-8 border-b border-slate-100 dark:border-slate-800">
              {["Catálogo de Servicios", "Equipo de Barberos", "Horarios"].map(
                (tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                      idx === 0
                        ? "text-blue-600"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab}
                    {idx === 0 && (
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full" />
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        </header>

        {/* Contenido Scrollable */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="relative w-full md:w-96 group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar servicio..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                  <Filter size={18} /> Filtros
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                  <ArrowUpDown size={18} /> Ordenar
                </button>
              </div>
            </div>

            {/* Tabla Estilizada */}
            <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <tr className="text-[10px] uppercase font-black tracking-[0.15em] text-slate-400">
                    <th className="px-8 py-5">Servicio</th>
                    <th className="px-8 py-5">Duración</th>
                    <th className="px-8 py-5">Precio</th>
                    <th className="px-8 py-5">Estado</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  <tr className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-slate-200 overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=100"
                            className="size-full object-cover"
                            alt="corte"
                          />
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase">
                            Corte Clásico
                          </p>
                          <p className="text-slate-400 text-xs font-medium">
                            Lavado + Peinado
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm">
                        <Clock size={16} className="text-blue-500" /> 30 min
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-lg">$15.00</td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                        <span className="size-1.5 rounded-full bg-green-500"></span>{" "}
                        Activo
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-200">
                          <Edit3 size={18} />
                        </button>
                        <button className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm transition-all text-slate-400 hover:text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </main>
      </div>

      {/* 3. DRAWER (Panel de Edición) */}
      <aside className="hidden xl:flex w-[400px] flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-30">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-black italic uppercase">
            Editar <span className="text-blue-600">Servicio</span>
          </h3>
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Imagen */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Imagen de portada
            </span>
            <div className="group relative h-40 rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:border-blue-500/50 transition-all cursor-pointer">
              <div className="text-center">
                <Upload
                  size={24}
                  className="mx-auto text-slate-300 group-hover:text-blue-500 mb-2 transition-all"
                />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Click para subir
                </p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                Nombre
              </label>
              <input
                type="text"
                defaultValue="Corte Clásico"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-600/20 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Precio
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    defaultValue="15"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-600/20 font-black"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Minutos
                </label>
                <select className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-600/20 font-bold appearance-none">
                  <option>30 min</option>
                  <option>45 min</option>
                  <option>60 min</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                Personal Asignado
              </label>
              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {["Juan Pérez", "Carlos Barber"].map((name) => (
                  <label
                    key={name}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">
                        {name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold">{name}</span>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded-lg text-blue-600 focus:ring-blue-600/20 size-5 border-slate-200"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Drawer */}
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 space-y-3">
          <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Guardar Cambios
          </button>
          <button className="w-full py-4 text-slate-400 font-black uppercase tracking-[0.2em] text-xs hover:text-slate-600 transition-all">
            Cancelar
          </button>
        </div>
      </aside>
    </div>
  );
}
