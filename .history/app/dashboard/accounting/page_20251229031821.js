"use client";
import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  Scissors,
  Download,
  ChevronRight,
  Wallet,
} from "lucide-react";

export default function AccountingPage() {
  const [view, setView] = useState("dia");

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
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#0a0f1a] p-6 lg:p-10 overflow-y-auto">
      {/* HEADER SEMÁNTICO */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Contabilidad
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Resumen de ingresos y comisiones por barbero.
          </p>
        </div>

        <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
          {["dia", "semana", "mes"].map((t) => (
            <button
              key={t}
              onClick={() => setView(t)}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                view === t
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* KPIS REFINADOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          {
            label: "Total Bruto",
            val: `$${totalGenerated}`,
            icon: <DollarSign size={20} />,
            color: "blue",
            trend: "+12.5%",
          },
          {
            label: "Servicios",
            val: "35",
            icon: <Scissors size={20} />,
            color: "purple",
            trend: null,
          },
          {
            label: "Neto Local",
            val: `$${totalGenerated / 2}`,
            icon: <Wallet size={20} />,
            color: "emerald",
            trend: "+8.2%",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-hover hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-2.5 rounded-xl bg-${kpi.color}-50 dark:bg-${kpi.color}-500/10 text-${kpi.color}-600 dark:text-${kpi.color}-400`}
              >
                {kpi.icon}
              </div>
              {kpi.trend && (
                <span className="flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <ArrowUpRight size={12} className="mr-1" /> {kpi.trend}
                </span>
              )}
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {kpi.label}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {kpi.val}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TABLA: OCUPA 2 COLUMNAS */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Desempeño del Equipo
            </h3>
            <button className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline">
              <Download size={14} /> Reporte PDF
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                  <th className="px-6 py-4">Barbero</th>
                  <th className="px-6 py-4 text-center">Servicios</th>
                  <th className="px-6 py-4">Comisión</th>
                  <th className="px-6 py-4 text-right">Monto Local</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {stats.map((b) => (
                  <tr
                    key={b.id}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 text-xs">
                          {b.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {b.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-500 font-medium">
                      {b.services}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-orange-600 dark:text-orange-400">
                      ${b.commission}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      ${b.total - b.commission}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GRÁFICO SIMPLIFICADO: OCUPA 1 COLUMNA */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-8">
            Volumen Semanal
          </h3>
          <div className="flex-1 flex items-end justify-between gap-2 h-40 px-2">
            {[30, 50, 45, 80, 60, 90, 40].map((h, i) => (
              <div
                key={i}
                className="group relative flex-1 flex flex-col items-center"
              >
                <div
                  className="w-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-600 transition-all rounded-t-md relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ${h * 5}
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 mt-3">
                  {["L", "M", "X", "J", "V", "S", "D"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
