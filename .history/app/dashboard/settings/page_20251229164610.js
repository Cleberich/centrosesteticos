"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  ShieldCheck,
  Loader2,
  Link as LinkIcon,
  CheckCircle2,
  Star,
  Crown,
  Zap,
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(null); // Guardamos el ID del plan que se está pagando
  const [barberiaData, setBarberiaData] = useState(null);

  const planes = [
    {
      id: "Basico",
      name: "Básico",
      price: 0,
      icon: <Zap size={20} />,
      features: ["Hasta 50 turnos/mes", "1 Barbero"],
    },
    {
      id: "Pro",
      name: "Profesional",
      price: 1500,
      icon: <Star size={20} />,
      features: ["Turnos ilimitados", "3 Barberos", "Soporte WhatsApp"],
    },
    {
      id: "Premium",
      name: "Premium",
      price: 3000,
      icon: <Crown size={20} />,
      features: [
        "Todo lo anterior",
        "Barberos ilimitados",
        "Estadísticas avanzadas",
      ],
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, "barberias", user.uid));
        if (docSnap.exists()) {
          setBarberiaData(docSnap.data());

          // Verificar si vuelve de un pago exitoso
          if (searchParams.get("status") === "approved") {
            const planId = searchParams.get("plan");
            actualizarPlan(user.uid, planId);
          }
        }
        setLoading(false);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [searchParams]);

  const handlePayment = async (plan) => {
    if (plan.price === 0) return;
    setIsPaying(plan.id);

    try {
      // Llamada a tu API de Backend para crear la preferencia
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

  const actualizarPlan = async (uid, planId) => {
    const ref = doc(db, "barberias", uid);
    const vto = new Date();
    vto.setDate(vto.getDate() + 30);

    await updateDoc(ref, {
      "plan.type": planId,
      "plan.status": "active",
      "plan.expiresAt": vto.toISOString().split("T")[0],
    });
    router.replace("/dashboard/settings"); // Limpiar la URL
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 pb-32">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* INFO PLAN ACTUAL */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-500/20">
              <ShieldCheck size={30} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Plan Actual
              </p>
              <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">
                {barberiaData?.plan?.type || "Básico"}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Vence el
            </p>
            <p className="font-bold dark:text-white">
              {barberiaData?.plan?.expiresAt || "Nunca"}
            </p>
          </div>
        </section>

        {/* GRILLA DE PLANES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planes.map((p) => {
            const isCurrent = barberiaData?.plan?.type === p.id;
            return (
              <div
                key={p.id}
                className={`relative p-8 rounded-[3rem] border-2 transition-all ${
                  isCurrent
                    ? "border-blue-600 bg-blue-50/5 scale-105"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">
                    Plan Activo
                  </div>
                )}

                <div className="mb-8">
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center mb-4 ${
                      isCurrent
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {p.icon}
                  </div>
                  <h3 className="text-2xl font-black dark:text-white mb-1 uppercase tracking-tighter">
                    {p.name}
                  </h3>
                  <p className="text-4xl font-black text-blue-600">
                    ${p.price}
                    <span className="text-sm text-slate-400 font-bold">
                      /mes
                    </span>
                  </p>
                </div>

                <ul className="space-y-4 mb-10">
                  {p.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400"
                    >
                      <CheckCircle2 size={16} className="text-emerald-500" />{" "}
                      {f}
                    </li>
                  ))}
                </ul>

                {!isCurrent && (
                  <button
                    onClick={() => handlePayment(p)}
                    disabled={p.price === 0 || isPaying}
                    className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {isPaying === p.id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      "Seleccionar Plan"
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
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
