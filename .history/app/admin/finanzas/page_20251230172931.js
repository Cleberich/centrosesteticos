"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowLeft,
  Loader2,
  Lock,
  Filter,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function FinancePage() {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [barberias, setBarberias] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Mes actual (0-11)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        setIsAuthorized(true);
        await fetchData();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "barberias"));
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBarberias(docs);
    } catch (error) {
      console.error("Error cargando finanzas:", error);
    }
  };

  // Lógica de filtrado: Obtenemos barberías que pagaron en el mes/año seleccionado
  const filteredPayments = barberias.filter((b) => {
    if (!b.plan?.lastPayment) return false;
    const payDate = b.plan.lastPayment.toDate
      ? b.plan.lastPayment.toDate()
      : new Date(b.plan.lastPayment.seconds * 1000);
    return (
      payDate.getMonth() === selectedMonth &&
      payDate.getFullYear() === selectedYear
    );
  });

  const totalIncome = filteredPayments.reduce(
    (acc, b) => acc + (Number(b.plan?.price) || 0),
    0
  );

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  if (!isAuthorized)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0f1a] text-center">
        <Lock className="text-red-500 mb-4" size={40} />
        <h1 className="text-white font-black uppercase">No tienes permiso</h1>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link
              href="/admin/control"
              className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4 hover:opacity-70 transition-all"
            >
              <ArrowLeft size={14} /> Volver al Control
            </Link>
            <h1 className="text-4xl font-black  uppercase tracking-tighter">
              Reporte de <span className="text-blue-500">Ingresos</span>
            </h1>
          </div>

          <div className="flex gap-2">
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-2 flex gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-transparent text-xs font-black uppercase p-2 outline-none border-none cursor-pointer"
              >
                {months.map((m, i) => (
                  <option key={m} value={i} className="bg-slate-900">
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-transparent text-xs font-black uppercase p-2 outline-none border-none cursor-pointer"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y} className="bg-slate-900">
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-600 rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/20">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <DollarSign size={24} />
              </div>
              <TrendingUp size={20} className="text-white/50" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">
              Recaudación del Mes
            </p>
            <h2 className="text-4xl font-black tracking-tighter">
              ${totalIncome.toLocaleString()}
            </h2>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <BarChart3 size={24} className="text-blue-500" />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
              Pagos Recibidos
            </p>
            <h2 className="text-4xl font-black tracking-tighter">
              {filteredPayments.length}
            </h2>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl">
                <Calendar size={24} className="text-emerald-500" />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
              Mes Seleccionado
            </p>
            <h2 className="text-2xl font-black tracking-tighter uppercase ">
              {months[selectedMonth]}
            </h2>
          </div>
        </div>

        {/* Payment List */}
        <div className="bg-slate-900/50 border border-white/5 rounded-[3rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center gap-4">
            <Filter size={18} className="text-blue-500" />
            <h3 className="font-black uppercase text-sm tracking-widest">
              Desglose de pagos
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-white/5">
                  <th className="px-8 py-6">Barbería</th>
                  <th className="px-8 py-6">Plan</th>
                  <th className="px-8 py-6 text-right">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayments.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center font-black text-[10px] text-blue-500 uppercase">
                          {b.businessName?.[0]}
                        </div>
                        <span className="text-xs font-bold uppercase">
                          {b.businessName}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black uppercase px-3 py-1 bg-slate-800 rounded-full text-slate-400">
                        {b.plan?.type || "Básico"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-emerald-400">
                      ${Number(b.plan?.price || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-8 py-20 text-center text-slate-600 font-bold uppercase text-[10px] tracking-[0.3em]"
                    >
                      No hay registros de pagos para este periodo
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
