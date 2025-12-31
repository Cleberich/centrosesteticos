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
  Link as LinkIcon,
  CheckCircle2,
  Zap,
  Star,
  Crown,
} from "lucide-react";
// Firebase
import { auth, db, signOut } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPaying, setIsPaying] = useState(null);
  const [barberiaData, setBarberiaData] = useState(null);

  const planes = [
    {
      id: "Basico",
      name: "Básico",
      price: 0,
      icon: <Zap size={20} />,
      features: ["1 Barbero", "Agenda Online"],
    },
    {
      id: "Pro",
      name: "Pro",
      price: 1500,
      icon: <Star size={20} />,
      features: ["3 Barberos", "Soporte WhatsApp"],
    },
    {
      id: "Premium",
      name: "Premium",
      price: 3000,
      icon: <Crown size={20} />,
      features: ["Barberos Ilimitados", "Estadísticas"],
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "barberias", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBarberiaData(docSnap.data());

            // Detectar si vuelve de Mercado Pago
            if (searchParams.get("status") === "approved") {
              const planId = searchParams.get("plan");
              actualizarPlanPostPago(user.uid, planId);
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

  const handlePayment = async (plan) => {
    if (plan.price === 0) return;
    setIsPaying(plan.id);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          price: plan.price,
          userId: auth.currentUser.uid,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      alert("Error al conectar con Mercado Pago");
    } finally {
      setIsPaying(null);
    }
  };

  const actualizarPlanPostPago = async (uid, planId) => {
    const ref = doc(db, "barberias", uid);
    const vto = new Date();
    vto.setDate(vto.getDate() + 30);
    await updateDoc(ref, {
      "plan.type": planId,
      "plan.status": "active",
      "plan.expiresAt": vto.toISOString().split("T")[0],
    });
    router.replace("/dashboard/settings");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ref = doc(db, "barberias", auth.currentUser.uid);
      await updateDoc(ref, barberiaData);
      alert("Configuración guardada");
    } catch (e) {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen overflow-scroll bg-slate-50 dark:bg-slate-950 p-6 md:p-12 pb-32">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
            Ajustes
          </h1>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500/10 text-red-500 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            Salir del sistema
          </button>
        </header>

        {/* LINK DE AGENDA */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <LinkIcon className="text-blue-600" size={20} />
            <h3 className="font-black uppercase text-sm dark:text-white tracking-tight">
              Tu Agenda Online
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-slate-50 dark:bg-slate-800 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              <code className="text-blue-600 font-bold text-xs truncate block">
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
              Copiar Link
            </button>
          </div>
        </section>

        {/* PLANES */}
        <section className="space-y-6">
          <h3 className="font-black uppercase text-xs text-slate-400 tracking-widest ml-2">
            Planes de Suscripción
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planes.map((p) => {
              const isCurrent = barberiaData?.plan?.type === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-8 rounded-[3rem] border-2 transition-all ${
                    isCurrent
                      ? "border-blue-600 bg-blue-50/10 scale-105"
                      : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center mb-4 ${
                      isCurrent
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {p.icon}
                  </div>
                  <h4 className="text-xl font-black dark:text-white uppercase">
                    {p.name}
                  </h4>
                  <p className="text-3xl font-black text-blue-600 mb-6">
                    ${p.price}
                  </p>
                  <ul className="space-y-2 mb-8 text-xs font-bold text-slate-500">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <div className="text-center py-3 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase">
                      Plan Activo
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePayment(p)}
                      className="w-full py-4 bg-gray-100 dark:bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest"
                    >
                      {isPaying === p.id ? "Cargando..." : "Contratar"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FORMULARIO DE DATOS */}
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
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                WhatsApp
              </label>
              <input
                value={barberiaData?.telefono || ""}
                onChange={(e) =>
                  setBarberiaData({ ...barberiaData, telefono: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Dirección
              </label>
              <input
                value={barberiaData?.direccion || ""}
                onChange={(e) =>
                  setBarberiaData({
                    ...barberiaData,
                    direccion: e.target.value,
                  })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="fixed bottom-8 right-8 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl flex items-center gap-3 z-50"
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
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}
