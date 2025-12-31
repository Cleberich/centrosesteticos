"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Scissors,
  Sparkles,
  PieChart,
  CreditCard,
  Zap,
  History,
} from "lucide-react";
import Link from "next/link";

export default function FinancePage() {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [allPayments, setAllPayments] = useState([]); // Ahora guardamos una lista de pagos, no de negocios
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const ADMIN_EMAIL = "cleberich@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const userEmail = user?.email?.toLowerCase().trim();
      const masterEmail = ADMIN_EMAIL.toLowerCase().trim();

      if (user && userEmail === masterEmail) {
        setIsAuthorized(true);
        await fetchData();
      } else {
        setIsAuthorized(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const [barberSnap, esteticaSnap] = await Promise.all([
        getDocs(collection(db, "barberias")),
        getDocs(collection(db, "centros_estetica")),
      ]);

      const extractedPayments = [];

      // Función procesadora para extraer el historial de cada negocio
      const processDocs = (snap, type) => {
        snap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const history = data.paymentHistory || [];

          history.forEach((payment) => {
            extractedPayments.push({
              ...payment,
              businessName: data.businessName,
              businessEmail: data.email,
              businessType: type, // 'barberia' o 'estetica'
              id: payment.paymentId || Math.random().toString(),
            });
          });
        });
      };

      processDocs(barberSnap, "barberia");
      processDocs(esteticaSnap, "estetica");

      setAllPayments(extractedPayments);
    } catch (error) {
      console.error("Error cargando historial de finanzas:", error);
    }
  };

  // --- FILTRADO POR MES Y AÑO DEL HISTORIAL ---
  const filteredData = useMemo(() => {
    return allPayments
      .filter((pay) => {
        const payDate = pay.date?.toDate
          ? pay.date.toDate()
          : new Date(pay.date?.seconds * 1000 || pay.date);
        return (
          payDate.getMonth() === selectedMonth &&
          payDate.getFullYear() === selectedYear
        );
      })
      .sort((a, b) => {
        const dateA = a.date?.seconds || 0;
        const dateB = b.date?.seconds || 0;
        return dateB - dateA; // Más recientes primero
      });
  }, [allPayments, selectedMonth, selectedYear]);

  // --- CÁLCULOS ESTADÍSTICOS ---
  const stats = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => {
        const amount = Number(curr.amount) || 0;
        if (curr.businessType === "barberia") {
          acc.barberiaIncome += amount;
          acc.barberiaCount += 1;
        } else {
          acc.esteticaIncome += amount;
          acc.esteticaCount += 1;
        }
        acc.total += amount;
        return acc;
      },
      {
        barberiaIncome: 0,
        esteticaIncome: 0,
        barberiaCount: 0,
        esteticaCount: 0,
        total: 0,
      }
    );
  }, [filteredData]);

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

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header con selectores */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link
              href="/admin/control"
              className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4 hover:opacity-70"
            >
              <ArrowLeft size={14} /> Volver al Control
            </Link>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Finanzas <span className="text-blue-500">Plataformas</span>
            </h1>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-2xl p-2 flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-transparent text-xs font-black uppercase p-2 outline-none cursor-pointer"
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
              className="bg-transparent text-xs font-black uppercase p-2 outline-none cursor-pointer"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y} className="bg-slate-900">
                  {y}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="md:col-span-2 bg-blue-600 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/20">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">
              Recaudación Global
            </p>
            <h2 className="text-5xl font-black tracking-tighter">
              ${stats.total.toLocaleString()}
            </h2>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase">
              <Zap size={12} /> {filteredData.length} Pagos registrados en el
              periodo
            </div>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 text-blue-500 mb-4">
              <Scissors size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Barberías
              </span>
            </div>
            <h3 className="text-3xl font-black">
              ${stats.barberiaIncome.toLocaleString()}
            </h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase mt-2">
              {stats.barberiaCount} Transacciones
            </p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8">
            <div className="flex items-center gap-3 text-pink-500 mb-4">
              <Sparkles size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Estéticas
              </span>
            </div>
            <h3 className="text-3xl font-black">
              ${stats.esteticaIncome.toLocaleString()}
            </h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase mt-2">
              {stats.esteticaCount} Transacciones
            </p>
          </div>
        </div>

        {/* Listado de Historial */}
        <div className="bg-slate-900/50 border border-white/5 rounded-[3rem] overflow-hidden shadow-xl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
            <h3 className="font-black uppercase text-sm tracking-widest flex items-center gap-3">
              <History size={18} className="text-blue-500" /> Historial
              Detallado de Cobros
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase text-slate-600 tracking-widest border-b border-white/5">
                  <th className="px-8 py-6">Establecimiento</th>
                  <th className="px-8 py-6">Tipo</th>
                  <th className="px-8 py-6">Fecha Registro</th>
                  <th className="px-8 py-6">Método</th>
                  <th className="px-8 py-6 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map((pay, idx) => (
                  <tr
                    key={pay.id || idx}
                    className="hover:bg-white/[0.02] transition-all group"
                  >
                    <td className="px-8 py-6">
                      <p className="text-xs font-black uppercase text-white leading-none mb-1">
                        {pay.businessName}
                      </p>
                      <p className="text-[9px] font-bold text-slate-500 lowercase">
                        {pay.businessEmail}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`text-[8px] font-black uppercase px-2 py-1 rounded ${
                          pay.businessType === "barberia"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-pink-500/10 text-pink-500"
                        }`}
                      >
                        {pay.businessType}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[11px] font-medium text-slate-400">
                      {pay.date?.toDate
                        ? pay.date.toDate().toLocaleDateString()
                        : new Date(pay.date).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {pay.method === "mercadopago_auto" ? (
                          <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase">
                            <Zap size={10} /> Mercado Pago
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[9px] font-black text-blue-400 uppercase">
                            <CreditCard size={10} /> Manual
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-emerald-400">
                      ${Number(pay.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-24 text-center text-slate-700 font-bold uppercase text-[10px] tracking-[0.4em]"
                    >
                      Sin movimientos financieros para {months[selectedMonth]}{" "}
                      {selectedYear}
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
