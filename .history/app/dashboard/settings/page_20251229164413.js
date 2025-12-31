"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script"; // Importante para cargar el script de MP
import {
  Save,
  LogOut,
  ShieldCheck,
  Loader2,
  Link as LinkIcon,
  CheckCircle2,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ref = doc(db, "barberias", auth.currentUser.uid);
      await updateDoc(ref, barberiaData);
      alert("Ajustes guardados correctamente");
    } catch (e) {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const daysLeft = () => {
    if (!barberiaData?.plan?.expiresAt) return 0;
    const diff = new Date(barberiaData.plan.expiresAt) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen overflow-scroll bg-slate-50 dark:bg-slate-950 p-6 md:p-12 pb-32">
      {/* Script de Mercado Pago */}
      <Script
        src="https://secure.mlstatic.com/mptools/render.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.$MPC_loaded = true;
        }}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
              Ajustes
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">
              Panel de Control
            </p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 bg-red-500/10 text-red-500 px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 transition-all"
          >
            <LogOut size={16} /> Salir
          </button>
        </header>

        {/* 1. LINK DE AGENDA */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <LinkIcon className="text-blue-600" size={20} />
            <h3 className="font-black uppercase text-sm dark:text-white">
              Tu Link de Reservas
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-slate-50 dark:bg-slate-800 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center">
              <code className="text-blue-600 dark:text-blue-400 font-bold text-xs truncate">
                http://localhost:3000/reserva/{auth.currentUser?.uid}
              </code>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `http://localhost:3000/reserva/${auth.currentUser?.uid}`
                );
                alert("Link copiado!");
              }}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
            >
              Copiar
            </button>
          </div>
        </section>

        {/* 2. PLANES (Aquí incluimos tu botón de suscripción) */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-lg shadow-blue-500/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-black uppercase text-xl dark:text-white">
                  Plan {barberiaData?.plan?.type || "Básico"}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Vencimiento: {barberiaData?.plan?.expiresAt || "Sin fecha"}
                </p>
              </div>
            </div>
            <div
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                daysLeft() > 0
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}
            >
              {daysLeft() > 0
                ? `${daysLeft()} Días Restantes`
                : "Suscripción Vencida"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PLAN GRATUITO */}
            <div className="p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                Básico
              </p>
              <p className="text-2xl font-black dark:text-white">Gratis</p>
              <div className="mt-6 flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase">
                <CheckCircle2 size={14} /> Plan Actual
              </div>
            </div>

            {/* PLAN PREMIUM CON TU BOTÓN DE MERCADO PAGO */}
            <div className="p-6 rounded-[2rem] border-2 border-blue-600 bg-blue-50/10 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-blue-600 mb-1">
                  Premium
                </p>
                <p className="text-2xl font-black dark:text-white">
                  Suscripción Mensual
                </p>
                <p className="text-slate-500 text-xs mt-2 font-bold uppercase">
                  Acceso ilimitado a todas las funciones
                </p>
              </div>

              <div className="mt-6">
                {/* TU BOTÓN DE MERCADO PAGO INTEGRADO */}
                <a
                  href="https://www.mercadopago.com.uy/subscriptions/checkout?preapproval_plan_id=069d62d5d9b6473ba4633724e944c41e"
                  name="MP-payButton"
                  className="w-full block text-center bg-[#3483FA] hover:bg-[#2a68c8] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] transition-all shadow-lg shadow-blue-500/20"
                >
                  Suscribirme con MP
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FORMULARIO DE DATOS */}
        <form onSubmit={handleSave} className="space-y-6">
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Nombre del Negocio
              </label>
              <input
                value={barberiaData?.businessName || ""}
                onChange={(e) =>
                  setBarberiaData({
                    ...barberiaData,
                    businessName: e.target.value,
                  })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                WhatsApp
              </label>
              <input
                placeholder="598..."
                value={barberiaData?.telefono || ""}
                onChange={(e) =>
                  setBarberiaData({ ...barberiaData, telefono: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="fixed bottom-8 right-8 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all flex items-center gap-3 z-50 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
