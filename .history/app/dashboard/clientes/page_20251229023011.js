"use client";
import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Star,
  Mail,
  Phone,
  MoreHorizontal,
  ArrowUpRight,
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
    },
    {
      id: 2,
      name: "Marcos Pérez",
      status: "Nuevo",
      visits: 1,
      spend: "$25",
      email: "marcos@mail.com",
    },
  ]);

  return (
    <div className="p-8 lg:p-12 bg-white dark:bg-slate-950 min-h-screen space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            Mi <span className="text-blue-600">Club</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Gestiona {customers.length} clientes registrados
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="pl-12 pr-6 py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 w-64 lg:w-96 transition-all outline-none font-medium"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
            <UserPlus size={24} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {customers
          .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
          .map((customer) => (
            <div
              key={customer.id}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    customer.status === "VIP"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {customer.status}
                </span>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <div className="size-16 rounded-3xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center text-2xl font-black italic">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">
                    {customer.name}
                  </h3>
                  <p className="text-slate-400 text-sm font-medium">
                    {customer.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Visitas
                  </p>
                  <p className="text-xl font-black">{customer.visits}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Total
                  </p>
                  <p className="text-xl font-black text-blue-600">
                    {customer.spend}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                  Ver Perfil
                </button>
                <button className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400">
                  <Phone size={18} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
