"use client";
import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  ArrowUpRight,
  MoreVertical,
  Filter,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [customers] = useState([
    {
      id: 1,
      name: "Carlos Ruiz",
      status: "VIP",
      visits: 24,
      spend: "$520",
      email: "carlos@mail.com",
      lastVisit: "Hace 2 días",
    },
    {
      id: 2,
      name: "Marcos Pérez",
      status: "Nuevo",
      visits: 1,
      spend: "$25",
      email: "marcos@mail.com",
      lastVisit: "Hoy",
    },
  ]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-[#0a0f1a]">
      <div className="max-w-7xl mx-auto p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
        {/* HEADER TIPO ESTUDIO */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <Zap size={12} fill="currentColor" /> CRM de Élite
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none dark:text-white">
              Gestión de <span className="text-blue-600">Clientela</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-md italic">
              Supervisa la actividad, el gasto acumulado y la fidelidad de tu
              comunidad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                className="pl-14 pr-8 py-5 bg-white dark:bg-slate-900 rounded-[2rem] border-none shadow-sm focus:ring-4 focus:ring-blue-600/10 w-full md:w-80 lg:w-96 transition-all outline-none font-bold text-slate-700 dark:text-white"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-3 px-8 py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 active:scale-95">
              <UserPlus size={18} /> Nuevo Registro
            </button>
          </div>
        </header>

        {/* TABLA / GRID VERSION LIMPIA */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {customers
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
            .map((customer) => (
              <div
                key={customer.id}
                className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800/50 hover:border-blue-500/20 transition-all group relative overflow-hidden flex flex-col sm:flex-row gap-10 items-center"
              >
                {/* Avatar con diseño de cuadro */}
                <div className="relative shrink-0">
                  <div className="size-32 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl font-black italic text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-500">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-lg border border-slate-50 dark:border-slate-800">
                    {customer.status === "VIP" ? (
                      <div
                        className="size-6 bg-amber-400 rounded-lg"
                        title="Socio VIP"
                      />
                    ) : (
                      <div
                        className="size-6 bg-blue-500 rounded-lg"
                        title="Socio Estándar"
                      />
                    )}
                  </div>
                </div>

                {/* Información Principal */}
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter uppercase italic dark:text-white">
                        {customer.name}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
                        <Mail size={14} /> {customer.email}
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-blue-600 transition-colors">
                      <MoreVertical size={24} />
                    </button>
                  </div>

                  {/* Stats en una sola línea elegante */}
                  <div className="flex items-center gap-12 border-y border-slate-50 dark:border-slate-800/50 py-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">
                        Visitas
                      </p>
                      <p className="text-2xl font-black dark:text-white">
                        {customer.visits}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">
                        Inversión
                      </p>
                      <p className="text-2xl font-black text-blue-600">
                        {customer.spend}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">
                        Última
                      </p>
                      <p className="text-sm font-bold text-slate-500">
                        {customer.lastVisit}
                      </p>
                    </div>
                  </div>

                  {/* Botones de acción minimalistas */}
                  <div className="flex items-center gap-4">
                    <button className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] dark:text-white hover:text-blue-600 transition-all">
                      Expediente Completo{" "}
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-2 transition-transform"
                      />
                    </button>
                    <div className="flex-1 h-px bg-slate-50 dark:bg-slate-800/50" />
                    <button className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                      <Phone size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
