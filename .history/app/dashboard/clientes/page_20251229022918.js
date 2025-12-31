"use client";
import React, { useState } from "react";
import {
  Search,
  UserPlus,
  MoreVertical,
  Phone,
  Calendar as CalendarIcon,
  Filter,
} from "lucide-react";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const customers = [
    {
      id: 1,
      name: "Carlos Ruiz",
      phone: "+34 600 000 001",
      lastVisit: "Hace 2 días",
      totalSpent: "$240",
      visits: 12,
    },
    {
      id: 2,
      name: "Marcos Pérez",
      phone: "+34 600 000 002",
      lastVisit: "Hace 1 semana",
      totalSpent: "$45",
      visits: 2,
    },
    {
      id: 3,
      name: "Juan Gómez",
      phone: "+34 600 000 003",
      lastVisit: "Ayer",
      totalSpent: "$120",
      visits: 6,
    },
    {
      id: 4,
      name: "Roberto Diaz",
      phone: "+34 600 000 004",
      lastVisit: "Hace 1 mes",
      totalSpent: "$300",
      visits: 15,
    },
  ];

  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Clientes
          </h1>
          <p className="text-slate-500">
            Gestiona tu base de datos de clientes
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all">
          <UserPlus size={20} /> Nuevo Cliente
        </button>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Filtros */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o teléfono..."
              className="bg-transparent border-none outline-none ml-3 text-sm w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
            <Filter size={18} /> Filtros
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] uppercase tracking-widest font-black text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Última Visita</th>
                <th className="px-6 py-4 text-center">Visitas</th>
                <th className="px-6 py-4">Total Invertido</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{c.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone size={10} /> {c.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={14} /> {c.lastVisit}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {c.visits}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm text-blue-600">
                    {c.totalSpent}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                      <MoreVertical size={18} className="text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
