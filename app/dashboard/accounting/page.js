"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  Sparkles,
  Wallet,
  Loader2,
  Banknote,
  Smartphone,
  Receipt,
  CreditCard,
  Calendar as CalendarIcon,
  TrendingUp,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Flower2,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
// PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  // --- SEGURIDAD ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // --- DATOS ---
  const [view, setView] = useState("dia");
  const [selectedCustomDate, setSelectedCustomDate] = useState(
    new Date().toLocaleDateString("sv-SE")
  );
  const [loading, setLoading] = useState(true);
  const [esteticaData, setEsteticaData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // CAMBIO A COLECCIÓN centros_estetica
          const docRef = doc(db, "centros_estetica", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setEsteticaData(data);

            if (data.useAccountingPin === true) {
              setIsAuthorized(false);
            } else {
              setIsAuthorized(true);
            }
          }
        } catch (error) {
          console.error("Error cargando finanzas:", error);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleVerifyPin = (e) => {
    e.preventDefault();
    const correctPin = esteticaData?.adminPin || "0000";
    if (pinInput === correctPin) {
      setIsAuthorized(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const accountingData = useMemo(() => {
    if (!esteticaData || !esteticaData.appointments)
      return {
        stats: [],
        totalBruto: 0,
        totalServicios: 0,
        netoLocal: 0,
        payments: {},
      };

    const hoy = new Date();
    const hoyStr = hoy.toLocaleDateString("sv-SE");
    const specialistStats = {};
    const paymentStats = { cash: 0, transfer: 0, mp: 0, pos: 0, unknown: 0 };
    const commissionMap = {};

    (esteticaData.specialists || []).forEach(
      (s) => (commissionMap[s.name] = Number(s.commission) || 40)
    );

    const filteredApps = esteticaData.appointments.filter((app) => {
      const rawDate = app.paidAt || app.date || app.start;
      if (!rawDate || app.status !== "done") return false;
      const appDate = new Date(rawDate);
      const appDateStr = appDate.toLocaleDateString("sv-SE");
      if (view === "dia") return appDateStr === hoyStr;
      if (view === "personalizado") return appDateStr === selectedCustomDate;
      if (view === "semana") {
        const haceSiete = new Date();
        haceSiete.setDate(hoy.getDate() - 7);
        return appDate >= haceSiete && appDate <= hoy;
      }
      if (view === "mes")
        return (
          appDate.getMonth() === hoy.getMonth() &&
          appDate.getFullYear() === hoy.getFullYear()
        );
      return true;
    });

    filteredApps.forEach((app) => {
      const specName = app.specialist || "Sin asignar";
      const monto = Number(app.total) || 0;
      const method = app.paymentMethod || "unknown";
      const rate = commissionMap[specName] || 40;
      if (!specialistStats[specName]) {
        specialistStats[specName] = {
          name: specName,
          services: 0,
          total: 0,
          commissionEarned: 0,
        };
      }
      specialistStats[specName].services += 1;
      specialistStats[specName].total += monto;
      specialistStats[specName].commissionEarned += monto * (rate / 100);
      paymentStats[method] = (paymentStats[method] || 0) + monto;
    });

    const statsArray = Object.values(specialistStats).filter(
      (s) => s.services > 0
    );
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
  }, [esteticaData, view, selectedCustomDate]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(esteticaData?.businessName || "Reporte Aura", 14, 22);
    autoTable(doc, {
      startY: 45,
      head: [["Concepto", "Valor"]],
      body: [
        ["Total Bruto", `$${accountingData.totalBruto.toLocaleString()}`],
        ["Neto Centro", `$${accountingData.netoLocal.toLocaleString()}`],
        ["Cantidad Tratamientos", accountingData.totalServicios],
      ],
    });
    doc.save(`Reporte_Aura_${view}.pdf`);
  };

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#0a0f1a]">
        <Loader2 className="text-pink-500 animate-spin" size={40} />
      </div>
    );

  if (!isAuthorized) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FDF8FA] dark:bg-[#0a0f1a] p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-2xl text-center border border-pink-50">
          <div className="size-20 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-pink-500" size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white mb-6 tracking-tighter">
            Acceso <span className="text-pink-500 text-3xl block">Privado</span>
          </h1>
          <form onSubmit={handleVerifyPin} className="space-y-6">
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder="****"
                className="w-full bg-pink-50/50 dark:bg-slate-800 border-2 border-pink-100 rounded-2xl py-5 px-6 text-center text-2xl font-black tracking-[0.5em] text-pink-600 outline-none focus:border-pink-500 transition-all"
                maxLength={4}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300"
              >
                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {pinError && (
              <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest">
                PIN de Aura Incorrecto
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black uppercase py-5 rounded-2xl transition-all shadow-lg shadow-pink-500/20 tracking-widest text-xs"
            >
              Desbloquear Finanzas
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FDF8FA] dark:bg-[#0a0f1a] p-6 lg:p-10 overflow-y-auto font-sans">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
            Caja & <span className="text-pink-500">Finanzas</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">
            Gestión de ingresos Aura Estética
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-pink-100 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-pink-50 transition-colors"
          >
            <FileText size={16} className="text-rose-500" /> Reporte PDF
          </button>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 pl-4 rounded-2xl border border-pink-100 shadow-sm">
            <CalendarIcon size={14} className="text-pink-500" />
            <input
              type="date"
              value={selectedCustomDate}
              onChange={(e) => {
                setSelectedCustomDate(e.target.value);
                setView("personalizado");
              }}
              className="bg-transparent text-[10px] font-black uppercase dark:text-white outline-none"
            />
          </div>
          <div className="flex p-1.5 bg-pink-50 dark:bg-slate-800 rounded-2xl">
            {["dia", "semana", "mes"].map((t) => (
              <button
                key={t}
                onClick={() => setView(t)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                  view === t
                    ? "bg-white dark:bg-slate-700 text-pink-500 shadow-sm"
                    : "text-slate-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <KpiCard
          label="Venta Bruta"
          value={`$${accountingData.totalBruto.toLocaleString()}`}
          icon={<DollarSign size={22} />}
          color="pink"
        />
        <KpiCard
          label="Tratamientos"
          value={accountingData.totalServicios.toString()}
          icon={<Flower2 size={22} />}
          color="violet"
        />
        <KpiCard
          label="Neto Aura"
          value={`$${accountingData.netoLocal.toLocaleString()}`}
          icon={<Wallet size={22} />}
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
              className="bg-white dark:bg-slate-900 p-5 rounded-[1.5rem] border border-pink-50 flex items-center gap-4 shadow-sm"
            >
              <div
                className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 ${details.color}`}
              >
                {details.icon}
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {details.name}
                </p>
                <p className="text-base font-black dark:text-white">
                  ${value.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-pink-50 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-pink-50/30 border-b border-pink-50">
                <th className="px-8 py-5">Especialista</th>
                <th className="px-6 py-5 text-center">Sesiones</th>
                <th className="px-6 py-5 text-right">Comisión</th>
                <th className="px-8 py-5 text-right">Neto Centro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50 dark:divide-slate-800">
              {accountingData.stats.map((s, i) => (
                <tr
                  key={i}
                  className="hover:bg-pink-50/20 transition-colors group"
                >
                  <td className="px-8 py-5 font-black uppercase italic text-sm text-slate-700 dark:text-slate-200">
                    {s.name}
                  </td>
                  <td className="px-6 py-5 text-center font-black text-slate-500">
                    {s.services}
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-rose-400">
                    -${s.commissionEarned.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-right font-black text-emerald-600">
                    ${(s.total - s.commissionEarned).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-pink-50 p-10 flex flex-col items-center justify-center text-center h-fit shadow-sm">
          <div className="size-20 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center text-pink-500 mb-6 shadow-inner">
            <TrendingUp size={32} strokeWidth={3} />
          </div>
          <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter italic">
            Margen Aura
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase mt-2 mb-8 tracking-widest">
            Rentabilidad neta del local
          </p>
          <div className="w-full space-y-4">
            <div className="flex justify-between text-[11px] font-black uppercase text-pink-500">
              <span>Ganancia Real</span>
              <span>
                {(
                  (accountingData.netoLocal /
                    (accountingData.totalBruto || 1)) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50">
              <div
                className="h-full bg-pink-500 transition-all duration-1000 ease-out rounded-full"
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
    pink: "bg-pink-50 text-pink-500",
    violet: "bg-violet-50 text-violet-500",
    emerald: "bg-emerald-50 text-emerald-500",
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-pink-50 shadow-sm transition-all hover:scale-[1.02]">
      <div className={`p-4 rounded-2xl inline-block mb-6 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </p>
      <h2 className="text-4xl font-black text-slate-900 dark:text-white mt-2 tracking-tighter italic">
        {value}
      </h2>
    </div>
  );
}
