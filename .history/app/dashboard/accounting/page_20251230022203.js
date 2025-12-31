"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  Scissors,
  Wallet,
  Loader2,
  Banknote,
  Smartphone,
  Receipt,
  CreditCard,
  Calendar as CalendarIcon,
  TrendingUp,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Diccionario para iconos y nombres de métodos de pago
const PAYMENT_DETAILS = {
  cash: {
    name: "Efectivo",
    icon: <Banknote size={16} />,
    color: "text-emerald-500",
  },
  transfer: {
    name: "Transferencia",
    icon: <Receipt size={16} />,
    color: "text-blue-500",
  },
  mp: {
    name: "Mercado Pago",
    icon: <Smartphone size={16} />,
    color: "text-sky-400",
  },
  pos: {
    name: "Tarjeta / POS",
    icon: <CreditCard size={16} />,
    color: "text-purple-500",
  },
  unknown: {
    name: "Sin especificar",
    icon: <DollarSign size={16} />,
    color: "text-slate-400",
  },
};

export default function AccountingPage() {
  const [view, setView] = useState("dia");
  // Fecha seleccionada para el filtro personalizado (YYYY-MM-DD)
  const [selectedCustomDate, setSelectedCustomDate] = useState(
    new Date().toLocaleDateString("sv-SE")
  );
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

  const accountingData = useMemo(() => {
    if (!barberiaData || !barberiaData.appointments)
      return {
        stats: [],
        totalBruto: 0,
        totalServicios: 0,
        netoLocal: 0,
        payments: {},
      };

    const hoy = new Date();
    const hoyStr = hoy.toLocaleDateString("sv-SE");
    const barberStats = {};
    const paymentStats = { cash: 0, transfer: 0, mp: 0, pos: 0, unknown: 0 };

    const commissionMap = {};
    (barberiaData.barbers || []).forEach((b) => {
      commissionMap[b.name] = Number(b.commission) || 50;
    });

    const filteredApps = barberiaData.appointments.filter((app) => {
      // Intentamos obtener una fecha válida de la cita
      const rawDate = app.paidAt || app.date || app.start;
      if (!rawDate) return false;

      const appDate = new Date(rawDate);
      if (isNaN(appDate)) return false;

      const appDateStr = appDate.toLocaleDateString("sv-SE");

      // Solo contabilidad de citas finalizadas
      if (app.status !== "done") return false;

      // FILTROS DE VISTA
      if (view === "dia") return appDateStr === hoyStr;

      if (view === "personalizado") return appDateStr === selectedCustomDate;

      if (view === "semana") {
        const haceSieteDias = new Date();
        haceSieteDias.setDate(hoy.getDate() - 7);
        return appDate >= haceSieteDias && appDate <= hoy;
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
      const method = app.paymentMethod || "unknown";
      const rate = commissionMap[barberName] || 50;

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
      barberStats[barberName].commissionEarned += monto * (rate / 100);

      if (paymentStats[method] !== undefined) {
        paymentStats[method] += monto;
      } else {
        paymentStats.unknown += monto;
      }
    });

    const statsArray = Object.values(barberStats).filter((b) => b.services > 0);
    const totalBruto = statsArray.reduce((acc, curr) => acc + curr.total, 0);
    const totalComisiones = statsArray.reduce(
      (acc, curr) => acc + curr.commissionEarned,
      0
    );

    return {
      stats: statsArray,
      totalBruto,
      totalServicios: filteredApps.length,
      netoLocal: totalBruto - totalComisiones,
      payments: paymentStats,
    };
  }, [barberiaData, view, selectedCustomDate]);

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#0a0f1a]">
        <Loader2 className="text-blue-600 animate-spin" size={40} />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#0a0f1a] p-6 lg:p-10 overflow-y-auto transition-colors duration-300">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Contabilidad
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Resumen de ingresos y métodos de pago.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* SELECTOR DE DÍA CUALQUIERA */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 pl-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <CalendarIcon size={14} className="text-blue-600" />
            <input
              type="date"
              value={selectedCustomDate}
              onChange={(e) => {
                setSelectedCustomDate(e.target.value);
                setView("personalizado");
              }}
              className="bg-transparent text-[11px] font-black uppercase dark:text-white outline-none cursor-pointer"
            />
          </div>

          <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl">
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
        </div>
      </header>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      {/* MÉTODOS DE PAGO */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {Object.entries(accountingData.payments).map(([key, value]) => {
          if (value === 0 && key === "unknown") return null;
          const details = PAYMENT_DETAILS[key] || PAYMENT_DETAILS.unknown;
          return (
            <div
              key={key}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3"
            >
              <div
                className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${details.color}`}
              >
                {details.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {details.name}
                </p>
                <p className="text-sm font-black dark:text-white">
                  ${value.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabla de Barberos */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Desglose por Barbero
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-50 dark:border-slate-800">
                  <th className="px-6 py-4">Barbero</th>
                  <th className="px-6 py-4 text-center">Servicios</th>
                  <th className="px-6 py-4">Comisión</th>
                  <th className="px-6 py-4 text-right">Neto Local</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {accountingData.stats.map((b, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold dark:text-slate-200">
                        {b.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-500">
                      {b.services}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-orange-500">
                      ${b.commissionEarned.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-emerald-500">
                      ${(b.total - b.commissionEarned).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfico de Margen */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center">
          <div className="size-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 mb-4">
            <TrendingUp size={28} />
          </div>
          <h3 className="text-lg font-black dark:text-white uppercase italic">
            Rentabilidad
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Retención actual del local sobre el bruto.
          </p>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
              <span>Local</span>
              <span className="text-blue-500">
                {(
                  (accountingData.netoLocal /
                    (accountingData.totalBruto || 1)) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full"
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
