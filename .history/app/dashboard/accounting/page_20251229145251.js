"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  ArrowUpRight,
  Scissors,
  Download,
  Wallet,
  Loader2,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function AccountingPage() {
  const [view, setView] = useState("dia");
  const [loading, setLoading] = useState(true);
  const [barberiaData, setBarberiaData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "barberias", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBarberiaData(docSnap.data());
          }
        } catch (error) {
          console.error("Error al cargar contabilidad:", error);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // --- LÓGICA DE CÁLCULO CON COMISIONES PERSONALIZADAS ---
  const accountingData = useMemo(() => {
    if (!barberiaData || !barberiaData.appointments)
      return { stats: [], totalBruto: 0, totalServicios: 0, netoLocal: 0 };

    const hoy = new Date();
    const barberStats = {};

    // Crear un mapa de comisiones para búsqueda rápida { "Nombre": 40 }
    const commissionMap = {};
    (barberiaData.barbers || []).forEach((b) => {
      commissionMap[b.name] = Number(b.commission) || 50;
    });

    // Inicializar estadísticas por barbero
    (barberiaData.barbers || []).forEach((b) => {
      barberStats[b.name] = {
        name: b.name,
        services: 0,
        total: 0,
        commissionEarned: 0,
        commissionRate: commissionMap[b.name],
      };
    });

    const filteredApps = barberiaData.appointments.filter((app) => {
      const appDate = new Date(app.paidAt || app.start);
      if (isNaN(appDate)) return false;

      if (view === "dia") return appDate.toDateString() === hoy.toDateString();
      if (view === "semana") {
        const haceSieteDias = new Date();
        haceSieteDias.setDate(hoy.getDate() - 7);
        return appDate >= haceSieteDias;
      }
      if (view === "mes") {
        return (
          appDate.getMonth() === hoy.getMonth() &&
          appDate.getFullYear() === hoy.getFullYear()
        );
      }
      return true;
    });

    filteredApps.forEach((app) => {
      const barberName = app.barber || "Sin asignar";
      const monto = Number(app.total) || 0;
      const rate = commissionMap[barberName] || 50; // 50% si no existe el barbero en la lista

      if (!barberStats[barberName]) {
        barberStats[barberName] = {
          name: barberName,
          services: 0,
          total: 0,
          commissionEarned: 0,
          commissionRate: rate,
        };
      }

      barberStats[barberName].services += 1;
      barberStats[barberName].total += monto;
      // Cálculo individual basado en su propio porcentaje
      barberStats[barberName].commissionEarned += monto * (rate / 100);
    });

    const statsArray = Object.values(barberStats).filter((b) => b.services > 0);
    const totalBruto = statsArray.reduce((acc, curr) => acc + curr.total, 0);
    const totalServicios = filteredApps.length;
    const totalComisionesBarberos = statsArray.reduce(
      (acc, curr) => acc + curr.commissionEarned,
      0
    );

    return {
      stats: statsArray,
      totalBruto,
      totalServicios,
      netoLocal: totalBruto - totalComisionesBarberos,
    };
  }, [barberiaData, view]);

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#0a0f1a]">
        <Loader2 className="text-blue-600 animate-spin" size={40} />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#0a0f1a] p-6 lg:p-10 overflow-y-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Contabilidad
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ingresos calculados según comisión individual.
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
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <KpiCard
          label="Total Bruto"
          value={`$${accountingData.totalBruto.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          color="blue"
        />
        <KpiCard
          label="Servicios"
          value={accountingData.totalServicios.toString()}
          icon={<Scissors size={20} />}
          color="purple"
        />
        <KpiCard
          label="Neto Local"
          value={`$${accountingData.netoLocal.toLocaleString()}`}
          icon={<Wallet size={20} />}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Comisiones del Equipo
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800">
                  <th className="px-6 py-4">Barbero</th>
                  <th className="px-6 py-4 text-center">Servicios</th>
                  <th className="px-6 py-4">Comisión Pagada</th>
                  <th className="px-6 py-4 text-right">Ganancia Local</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {accountingData.stats.map((b, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {b.name}
                        </span>
                        <span className="text-[10px] font-bold text-blue-500 uppercase italic">
                          Rate: {b.commissionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-500 font-medium">
                      {b.services}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-orange-600 dark:text-orange-400">
                      ${b.commissionEarned.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      ${(b.total - b.commissionEarned).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-center items-center text-center">
          <div className="size-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 mb-4">
            <TrendingUp size={32} />
          </div>
          <h3 className="text-lg font-black dark:text-white uppercase italic tracking-tighter">
            Resumen de Margen
          </h3>
          <p className="text-xs text-slate-500 mb-6 px-4">
            Este periodo el local retuvo el{" "}
            {(
              (accountingData.netoLocal / (accountingData.totalBruto || 1)) *
              100
            ).toFixed(1)}
            % del total generado.
          </p>
          <div className="w-full space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 px-2">
              <span>Bruto</span>
              <span className="dark:text-white">
                ${accountingData.totalBruto.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-1000"
                style={{
                  width: `${
                    (accountingData.netoLocal /
                      (accountingData.totalBruto || 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icono extra para el resumen
function TrendingUp({ size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  );
}

function KpiCard({ label, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    purple:
      "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:scale-[1.02]">
      <div className={`p-2.5 rounded-xl inline-block mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tighter">
        {value}
      </h2>
    </div>
  );
}
