"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  ShieldCheck,
  Loader2,
  LogOut,
  Link as LinkIcon,
  CheckCircle2,
  Zap,
  Star,
  Crown,
  Store,
  Phone,
  MapPin,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados
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
      price: 1,
      icon: <Star size={20} />,
      features: ["3 Barberos", "Soporte WhatsApp"],
    },
    {
      id: "Premium",
      name: "Premium",
      price: 2,
      icon: <Crown size={20} />,
      features: ["Barberos Ilimitados", "Estadísticas"],
    },
  ];

  // 1. CARGA DE DATOS Y LÓGICA DE RETORNO DE PAGO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "barberias", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setBarberiaData(data);

            // Verificar si venimos de un pago aprobado de Mercado Pago
            const status = searchParams.get("status");
            const planId = searchParams.get("plan");
            const paymentId = searchParams.get("payment_id");

            if (status === "approved" && planId) {
              await actualizarPlanPostPago(user.uid, planId, paymentId);
            }
          }
        } catch (error) {
          console.error("Error al cargar datos:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router, searchParams]);

  // 2. ACTUALIZAR PLAN EN FIREBASE TRAS EL PAGO
  const actualizarPlanPostPago = async (uid, planId, paymentId) => {
    try {
      const ref = doc(db, "barberias", uid);
      const ahora = new Date();
      const vencimiento = new Date();
      vencimiento.setDate(ahora.getDate() + 30); // 30 días de suscripción

      await updateDoc(ref, {
        "plan.type": planId,
        "plan.status": "active",
        "plan.lastPaymentId": paymentId || "n/a",
        "plan.updatedAt": ahora.toISOString().split("T")[0],
        "plan.expiresAt": vencimiento.toISOString().split("T")[0],
      });

      // Refrescar datos locales y limpiar URL
      const updatedSnap = await getDoc(ref);
      setBarberiaData(updatedSnap.data());
      router.replace("/dashboard/settings");
      alert("¡Suscripción actualizada correctamente!");
    } catch (error) {
      console.error("Error actualizando plan:", error);
    }
  };

  // 3. INICIAR PAGO CON MERCADO PAGO
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
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error: " + (data.error || "No se pudo generar el pago"));
      }
    } catch (e) {
      alert("Error de conexión con el servidor de pagos");
    } finally {
      setIsPaying(null);
    }
  };

  // 4. GUARDAR CAMBIOS DEL FORMULARIO
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ref = doc(db, "barberias", auth.currentUser.uid);
      await updateDoc(ref, barberiaData);
      alert("Configuración guardada con éxito");
    } catch (e) {
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const daysLeft = () => {
    if (!barberiaData?.plan?.expiresAt) return 0;
    const diff = new Date(barberiaData.plan.expiresAt) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 ">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 pb-32">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* HEADER */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter ">
              Ajustes
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              Gestiona tu suscripción y negocio
            </p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* LINK DE AGENDA */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="flex items-center gap-2 font-black uppercase text-xs text-blue-600 mb-4 ">
            <LinkIcon size={16} /> Link Público de Reservas
          </h3>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl font-bold text-xs truncate border dark:border-slate-700 dark:text-blue-400">
              {`http://barberias.vercel.app/reserva/${auth.currentUser?.uid}`}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `http://barberias.vercel.app/reserva/${auth.currentUser?.uid}`
                );
                alert("Link copiado al portapapeles");
              }}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
            >
              Copiar Link
            </button>
          </div>
        </section>

        {/* SECCIÓN DE PLANES */}
        <section className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-black uppercase text-xs text-slate-400 tracking-widest ">
              Planes Disponibles
            </h3>
            <div
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                daysLeft() > 0
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}
            >
              {daysLeft()} Días de suscripción restantes
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planes.map((p) => {
              const isCurrent = barberiaData?.plan?.type === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-8 rounded-[2.5rem] border-2 transition-all ${
                    isCurrent
                      ? "border-blue-600 bg-blue-50/10 scale-105"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center mb-6 ${
                      isCurrent
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {p.icon}
                  </div>
                  <h4 className="text-xl font-black dark:text-white uppercase  tracking-tighter">
                    {p.name}
                  </h4>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-black text-blue-600">
                      ${p.price}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      /mes
                    </span>
                  </div>
                  <ul className="text-[11px] font-bold text-slate-500 space-y-3 mb-10 uppercase tracking-tight">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <div className="w-full py-4 text-center bg-emerald-500/20 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      Plan Actual Activo
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePayment(p)}
                      disabled={isPaying || p.price === 0}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-blue-500/20"
                    >
                      {isPaying === p.id ? (
                        <Loader2 className="animate-spin mx-auto" size={16} />
                      ) : (
                        "Contratar Plan"
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FORMULARIO DE DATOS DEL NEGOCIO */}
        <form onSubmit={handleSave} className="space-y-6">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="flex items-center gap-2 font-black uppercase text-xs text-slate-400 mb-8 ">
              <Store size={16} /> Datos de tu Barbería
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                  Nombre Comercial
                </label>
                <div className="relative">
                  <Store
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    value={barberiaData?.businessName || ""}
                    onChange={(e) =>
                      setBarberiaData({
                        ...barberiaData,
                        businessName: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 pl-12 pr-4 py-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all border dark:border-slate-700"
                    placeholder="Mi Gran Barbería"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                  WhatsApp de Contacto
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    value={barberiaData?.telefono || ""}
                    onChange={(e) =>
                      setBarberiaData({
                        ...barberiaData,
                        telefono: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 pl-12 pr-4 py-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all border dark:border-slate-700"
                    placeholder="59899000111"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                  Dirección del Local
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    value={barberiaData?.direccion || ""}
                    onChange={(e) =>
                      setBarberiaData({
                        ...barberiaData,
                        direccion: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 pl-12 pr-4 py-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all border dark:border-slate-700"
                    placeholder="Av. 18 de Julio 1234, Montevideo"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* BOTÓN FLOTANTE GUARDAR */}
          <button
            type="submit"
            disabled={saving}
            className="fixed bottom-8 right-8 bg-blue-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 z-50 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {saving ? "Guardando..." : "Guardar Ajustes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-slate-950 text-white font-black uppercase tracking-widest">
          Cargando Sistema...
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
