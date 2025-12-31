"use client";
import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Scissors,
  Download,
} from "lucide-react";

export default function AccountingPage() {
  const [view, setView] = useState("dia"); // dia, semana, mes

  // Simulación de datos provenientes de las citas finalizadas
  const stats = [
    { id: 1, name: "Juan Pérez", services: 12, total: 240, commission: 120 },
    { id: 2, name: "Carlos Ruiz", services: 8, total: 185, commission: 92.5 },
    { id: 3, name: "Miguel Ángel", services: 15, total: 310, commission: 155 },
  ];

  const totalGenerated = useMemo(
    () => stats.reduce((acc, curr) => acc + curr.total, 0),
    [stats]
  );

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-[#0a0f1a] p-8 overflow-y-auto">
      {/* HEADER DE CONTABILIDAD */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black dark:text-white uppercase tracking-tighter italic">
            Caja y Comisiones
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Reporte de ingresos generados por el equipo
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          {["dia", "semana", "mes"].map((t) => (
            <button
              key={t}
              onClick={() => setView(t)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                view === t
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* TARJETAS DE RESUMEN (KPIS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
              <DollarSign size={24} />
            </div>
            <span className="flex items-center text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight size={14} /> +12%
            </span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Total Generado
          </p>
          <h2 className="text-3xl font-black dark:text-white">
            ${totalGenerated.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl">
              <Scissors size={24} />
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Servicios Totales
          </p>
          <h2 className="text-3xl font-black dark:text-white">35</h2>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-white bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="flex justify-between items-start mb-4 text-white/80">
            <Users size={24} />
          </div>
          <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">
            Top Barbero
          </p>
          <h2 className="text-2xl font-black">Miguel Ángel</h2>
          <p className="text-xs text-white/80 mt-1">$310 hoy</p>
        </div>
      </div>

      {/* TABLA DE DETALLE POR BARBERO */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold dark:text-white">
            Rendimiento del Personal
          </h3>
          <button className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:bg-blue-50 p-2 px-4 rounded-xl transition-all">
            <Download size={16} /> Exportar
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50 dark:bg-slate-800/50">
              <th className="px-8 py-4">Barbero</th>
              <th className="px-8 py-4">Servicios</th>
              <th className="px-8 py-4">Bruto</th>
              <th className="px-8 py-4">Comisión (50%)</th>
              <th className="px-8 py-4 text-right">Neto Local</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {stats.map((barber) => (
              <tr
                key={barber.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {barber.name.charAt(0)}
                    </div>
                    <span className="font-bold dark:text-white text-sm">
                      {barber.name}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {barber.services} cortes
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-black dark:text-white">
                    ${barber.total}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-bold text-orange-500">
                    ${barber.commission}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <span className="text-sm font-black text-emerald-500">
                    ${barber.total - barber.commission}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GRÁFICO SIMPLE (SIMULADO CON BARRAS) */}
      <div className="mt-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold mb-8 dark:text-white">
          Flujo de Ingresos ({view})
        </h3>
        <div className="flex items-end gap-4 h-48">
          {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-blue-600/10 hover:bg-blue-600 rounded-t-xl transition-all cursor-pointer"
                style={{ height: `${h}%` }}
              />
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                Día {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
