"use client";
import React, { useState } from "react";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Mail,
  Phone,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Star,
} from "lucide-react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [customers] = useState([
    {
      id: 1,
      name: "Carlos Ruiz",
      status: "VIP",
      visits: 24,
      spend: "$520.00",
      email: "carlos@mail.com",
      lastVisit: "24/12/2025",
    },
    {
      id: 2,
      name: "Marcos Pérez",
      status: "Nuevo",
      visits: 1,
      spend: "$25.00",
      email: "marcos@mail.com",
      lastVisit: "Hoy",
    },
    {
      id: 3,
      name: "Adrián Suar",
      status: "Activo",
      visits: 12,
      spend: "$310.00",
      email: "adrian@mail.com",
      lastVisit: "15/12/2025",
    },
    {
      id: 4,
      name: "Roberto Gómez",
      status: "Inactivo",
      visits: 45,
      spend: "$940.00",
      email: "robert@mail.com",
      lastVisit: "Hace 3 meses",
    },
  ]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      {/* HEADER COMPACTO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight dark:text-white">
            Clientes{" "}
            <span className="text-blue-600 ml-2 text-sm font-bold bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
              {customers.length}
            </span>
          </h1>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">
            Base de datos centralizada
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 outline-none w-64 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            <UserPlus size={14} /> Nuevo
          </button>
        </div>
      </div>

      {/* TABLA ESTILO LISTADO */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Cliente
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Estado
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                Visitas
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Total Gastado
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Última Visita
              </th>
              <th className="px-8 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {customers
              .filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((customer) => (
                <tr
                  key={customer.id}
                  className="group hover:bg-slate-50/80 dark:hover:bg-blue-600/5 transition-colors cursor-pointer"
                >
                  {/* Info Personal */}
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {customer.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                        customer.status === "VIP"
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                          : customer.status === "Nuevo"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                          : customer.status === "Activo"
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  {/* Visitas */}
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {customer.visits}
                    </span>
                  </td>

                  {/* Gasto */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {customer.spend}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td className="px-4 py-4 text-sm text-slate-500 font-medium">
                    {customer.lastVisit}
                  </td>

                  {/* Acciones */}
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                        <Phone size={14} />
                      </button>
                      <button className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-white rounded-lg transition-all">
                        <MoreHorizontal size={14} />
                      </button>
                      <ChevronRight
                        size={14}
                        className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
