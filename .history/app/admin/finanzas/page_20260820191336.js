"use client";

import React, { useState, useEffect, useMemo } from "react";
import { db, auth } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import {
  ArrowLeft,
  Loader2,
  Scissors,
  Sparkles,
  CreditCard,
  Zap,
  History,
} from "lucide-react";
import Link from "next/link";

export default function FinancePage() {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [allPayments, setAllPayments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const ADMIN_EMAIL = "cleberich@gmail.com";

  async function fetchData() {
    try {
      const [barberSnap, esteticaSnap] = await Promise.all([
        getDocs(collection(db, "barberias")),
        getDocs(collection(db, "centros_estetica")),
      ]);

      const extractedPayments = [];

      const processDocs = (snap, type) => {
        snap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const history = data.paymentHistory || [];

          history.forEach((payment) => {
            extractedPayments.push({
              ...payment,
              businessName: data.businessName,
              businessEmail: data.email,
              businessType: type,
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
  }

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
        return dateB - dateA;
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
      },
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
      <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-[#c084fc]" size={40} />
      </div>
    );

  if (!isAuthorized)
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafc] text-slate-800 font-bold">
        Acceso no autorizado.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] p-6 md:p-12 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER CON SELECTORES */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link
              href="/admin/control"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a855f7] hover:text-[#c084fc] mb-2 transition-colors"
            >
              <ArrowLeft size={14} /> Volver al Control
            </Link>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#e879f9]/20 flex items-center justify-center text-[#c084fc] font-bold text-sm">
                +
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#a855f7]">
                estetica integral • Finanzas
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Ingresos de Plataformas
            </h1>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 flex gap-2 shadow-xs">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-700 p-2 outline-none cursor-pointer"
            >
              {months.map((m, i) => (
                <option key={m} value={i} className="bg-white">
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-700 p-2 outline-none cursor-pointer border-l border-slate-200/80 pl-3"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y} className="bg-white">
                  {y}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* TARJETAS DE RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* RECAUDACIÓN GLOBAL */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#c084fc] via-[#e879f9] to-[#f472b6] rounded-3xl p-8 text-white shadow-lg shadow-purple-200/50 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">
                Recaudación Global
              </p>
              <h2 className="text-5xl font-extrabold tracking-tight">
                ${stats.total.toLocaleString()}
              </h2>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/20 px-3 py-1.5 rounded-full w-max backdrop-blur-xs">
              <Zap size={14} /> {filteredData.length} pagos registrados en el
              periodo
            </div>
          </div>

          {/* BARBERÍAS */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-700 mb-3">
              <div className="p-2 bg-slate-100 rounded-xl">
                <Scissors size={18} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Barberías
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                ${stats.barberiaIncome.toLocaleString()}
              </h3>
              <p className="text-slate-400 text-xs font-medium mt-1">
                {stats.barberiaCount} transacciones
              </p>
            </div>
          </div>

          {/* ESTÉTICAS */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[#a855f7] mb-3">
              <div className="p-2 bg-[#e879f9]/20 rounded-xl">
                <Sparkles size={18} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Estéticas
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                ${stats.esteticaIncome.toLocaleString()}
              </h3>
              <p className="text-slate-400 text-xs font-medium mt-1">
                {stats.esteticaCount} transacciones
              </p>
            </div>
          </div>
        </div>

        {/* LISTADO DE HISTORIAL */}
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
              <History size={16} className="text-[#a855f7]" /> Historial
              Detallado de Cobros
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 bg-[#f8fafc]">
                  <th className="px-6 py-4">Establecimiento</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Fecha Registro</th>
                  <th className="px-6 py-4">Método</th>
                  <th className="px-6 py-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((pay, idx) => (
                  <tr
                    key={pay.id || idx}
                    className="hover:bg-[#f8fafc] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {pay.businessName}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">
                        {pay.businessEmail}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                          pay.businessType === "barberia"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-[#e879f9]/20 text-[#a855f7]"
                        }`}
                      >
                        {pay.businessType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      {pay.date?.toDate
                        ? pay.date.toDate().toLocaleDateString()
                        : new Date(pay.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {pay.method === "mercadopago_auto" ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Zap size={10} /> Mercado Pago
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            <CreditCard size={10} /> Manual
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-[#10b981] text-xs">
                      ${Number(pay.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-16 text-center text-slate-400 font-semibold text-xs"
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
