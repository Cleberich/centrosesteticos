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
  Calendar as CalendarIcon, // Importamos el icono
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// ... (PAYMENT_DETAILS se mantiene igual)

export default function AccountingPage() {
  const [view, setView] = useState("dia");
  const [selectedCustomDate, setSelectedCustomDate] = useState(
    new Date().toLocaleDateString("sv-SE") // Formato YYYY-MM-DD
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
    const barberStats = {};
    const paymentStats = { cash: 0, transfer: 0, mp: 0, pos: 0, unknown: 0 };

    const commissionMap = {};
    (barberiaData.barbers || []).forEach((b) => {
      commissionMap[b.name] = Number(b.commission) || 50;
    });

    const filteredApps = barberiaData.appointments.filter((app) => {
      // Normalizamos la fecha de la cita a formato YYYY-MM-DD
      const rawDate = app.paidAt || app.date || app.start;
      if (!rawDate) return false;
      const appDateObj = new Date(rawDate);
      if (isNaN(appDateObj)) return false;

      const appDateStr = appDateObj.toLocaleDateString("sv-SE");

      if (app.status !== "done") return false;

      // LÓGICA DE FILTRADO ACTUALIZADA
      if (view === "dia") {
        return appDateStr === new Date().toLocaleDateString("sv-SE");
      }
      if (view === "personalizado") {
        return appDateStr === selectedCustomDate;
      }
      if (view === "semana") {
        const haceSieteDias = new Date();
        haceSieteDias.setDate(hoy.getDate() - 7);
        return appDateObj >= haceSieteDias;
      }
      if (view === "mes") {
        return (
          appDateObj.getMonth() === hoy.getMonth() &&
          appDateObj.getFullYear() === hoy.getFullYear()
        );
      }
      return true;
    });

    // ... (El resto del procesamiento de statsArray, totalBruto, etc. se mantiene igual)
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

      if (paymentStats[method] !== undefined) paymentStats[method] += monto;
      else paymentStats.unknown += monto;
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

  // ... (loading state se mantiene igual)

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#0a0f1a] p-6 lg:p-10 overflow-y-auto">
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
          {/* Selector de Fecha Específica */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 pl-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <CalendarIcon size={14} className="text-slate-400" />
            <input
              type="date"
              value={selectedCustomDate}
              onChange={(e) => {
                setSelectedCustomDate(e.target.value);
                setView("personalizado");
              }}
              className="bg-transparent text-xs font-bold dark:text-white outline-none py-2 cursor-pointer"
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

      {/* ... El resto del JSX (KPIs, Pagos, Tabla) se mantiene exactamente igual ... */}
      {/* (Grid de KPIs, Grid de pagos y la tabla por barbero) */}
    </div>
  );
}
