"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  Store,
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
  LogOut,
  MapPin,
  CreditCard,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
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
  const [isPaying, setIsPaying] = useState(false);
  const [barberiaData, setBarberiaData] = useState(null);

  // 1. CARGAR DATOS Y DETECTAR RETORNO DE PAGO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "barberias", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBarberiaData(data);

            // Si vuelve de Mercado Pago con éxito
            if (searchParams.get("status") === "approved") {
              actualizarPlanPostPago(user.uid);
            }
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
  }, [router, searchParams]);

  // 2. LÓGICA DE MERCADO PAGO
  const handlePayment = async (plan) => {
    setIsPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: plan.id,
          price: plan.priceRaw,
          userId: auth.currentUser.uid,
        }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (e) {
      alert("Error al conectar con Mercado Pago");
    } finally {
      setIsPaying(false);
    }
  };

  const actualizarPlanPostPago = async (uid) => {
    const barberiaRef = doc(db, "barberias", uid);
    const vto = new Date();
    vto.setDate(vto.getDate() + 30); // Sumar 30 días

    await updateDoc(barberiaRef, {
      "plan.status": "active",
      "plan.expiresAt": vto.toISOString().split("T")[0],
    });
    // Limpiar URL
    router.replace("/dashboard/settings");
  };

  // 3. ACTUALIZAR AJUSTES MANUALES
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 pb-32">
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
            className="flex items-center gap-2 bg-red-500/10 text-red-500 px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut size={16} /> Salir
          </button>
        </header>

        {/* 1. AGENDA ONLINE LINK */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <LinkIcon className="text-blue-600" size={20} />
            <h3 className="font-black uppercase text-sm dark:text-white tracking-tight">
              Link de tu Agenda
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-slate-50 dark:bg-slate-800 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center">
              <code className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                http://localhost:3000/reserva/{auth.currentUser?.uid}
              </code>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  `http://localhost:3000/reserva/${auth.currentUser?.uid}`
                );
                alert("Link copiado!");
              }}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
            >
              Copiar Link
            </button>
          </div>
        </section>

        {/* 2. PLANES Y MERCADO PAGO */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "Basico", price: "Gratis", priceRaw: 0 },
              { id: "Pro", price: "$1500", priceRaw: 1500 },
              { id: "Premium", price: "$3000", priceRaw: 3000 },
            ].map((p) => (
              <div
                key={p.id}
                className={`p-6 rounded-[2rem] border-2 flex flex-col justify-between transition-all ${
                  barberiaData?.plan?.type === p.id
                    ? "border-blue-600 bg-blue-50/10"
                    : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30"
                }`}
              >
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    {p.id}
                  </p>
                  <p className="text-2xl font-black dark:text-white">
                    {p.price}
                  </p>
                </div>

                {barberiaData?.plan?.type !== p.id ? (
                  <button
                    type="button"
                    onClick={() => handlePayment(p)}
                    className="mt-6 bg-blue-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all"
                  >
                    {isPaying ? "Conectando..." : "Contratar"}
                  </button>
                ) : (
                  <div className="mt-6 flex items-center justify-center gap-2 text-emerald-500 font-black text-[10px] uppercase">
                    <CheckCircle2 size={14} /> Activo
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 3. DATOS DEL NEGOCIO */}
        <form onSubmit={handleSave} className="space-y-6">
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Nombre de la Barbería
              </label>
              <input
                value={barberiaData?.businessName || ""}
                onChange={(e) =>
                  setBarberiaData({
                    ...barberiaData,
                    businessName: e.target.value,
                  })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                WhatsApp (Con código de país)
              </label>
              <input
                placeholder="Ej: 5491122334455"
                value={barberiaData?.telefono || ""}
                onChange={(e) =>
                  setBarberiaData({ ...barberiaData, telefono: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Dirección Completa
              </label>
              <input
                value={barberiaData?.direccion || ""}
                onChange={(e) =>
                  setBarberiaData({
                    ...barberiaData,
                    direccion: e.target.value,
                  })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all"
              />
            </div>
          </section>

          {/* BOTÓN GUARDAR FLOTANTE */}
          <button
            type="submit"
            disabled={saving}
            className="fixed bottom-8 right-8 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/40 hover:scale-105 transition-all flex items-center gap-3 z-50 disabled:opacity-50"
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

// Exportación con Suspense para manejar searchParams
export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
