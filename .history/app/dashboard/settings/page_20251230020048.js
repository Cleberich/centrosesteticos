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
  Camera,
  Upload,
  MessageCircle,
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
      price: 690,
      icon: <Zap size={20} />,
      features: ["1 Barbero", "150 reservas/mes"],
    },
    {
      id: "Pro",
      name: "Pro",
      price: 990,
      icon: <Star size={20} />,
      features: ["3 Barberos", "600 reservas/mes", "Estadísticas"],
    },
    {
      id: "Premium",
      name: "Premium",
      price: 1900,
      icon: <Crown size={20} />,
      features: [
        "Barberos Ilimitados",
        "Reservas Ilimitadas",
        "Estadísticas",
        "Marketing",
      ],
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "barberias", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBarberiaData(data);
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

  const actualizarPlanPostPago = async (uid, planId, paymentId) => {
    try {
      const ref = doc(db, "barberias", uid);
      const ahora = new Date();
      const vencimiento = new Date();
      vencimiento.setDate(ahora.getDate() + 30);
      await updateDoc(ref, {
        "plan.type": planId,
        "plan.status": "active",
        "plan.lastPaymentId": paymentId || "n/a",
        "plan.updatedAt": ahora.toISOString().split("T")[0],
        "plan.expiresAt": vencimiento.toISOString().split("T")[0],
      });
      const updatedSnap = await getDoc(ref);
      setBarberiaData(updatedSnap.data());
      router.replace("/dashboard/settings");
      alert("¡Suscripción actualizada correctamente!");
    } catch (error) {
      console.error("Error actualizando plan:", error);
    }
  };

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
      else alert("Error: " + (data.error || "No se pudo generar el pago"));
    } catch (e) {
      alert("Error de conexión");
    } finally {
      setIsPaying(null);
    }
  };

  // NUEVA FUNCIÓN: Manejo del Logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000000) {
        // Límite de 1MB para Firestore
        alert("La imagen es muy pesada. Máximo 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBarberiaData({ ...barberiaData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ref = doc(db, "barberias", auth.currentUser.uid);
      await updateDoc(ref, barberiaData);
      alert("Configuración guardada con éxito");
    } catch (e) {
      alert("Error al guardar");
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
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen overflow-scroll bg-slate-50 dark:bg-slate-950 p-6 md:p-12 pb-32 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* HEADER */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
              Ajustes
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              Configura tu perfil público
            </p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500/10 text-red-500 hover:bg-red-500 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all hover:text-white"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* LOGO CARGA */}
        <section className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative group">
            <div className="size-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-xl">
              {barberiaData?.logo ? (
                <img
                  src={barberiaData.logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Store size={40} />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 p-3 rounded-full text-white cursor-pointer hover:scale-110 transition-transform shadow-lg">
              <Camera size={20} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </label>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-black dark:text-white uppercase">
              Logo de tu Barbería
            </h3>
            <p className="text-slate-500 text-xs font-bold uppercase mt-1 tracking-tight">
              Se mostrará en tu página de reservas
            </p>
          </div>
        </section>

        {/* LINK DE AGENDA */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
          <h3 className="flex items-center gap-2 font-black uppercase text-xs text-blue-600 mb-4 tracking-widest">
            {/* Asegúrate de tener LinkIcon importado o usa uno de Lucide como Link */}
            <LinkIcon size={16} /> Tu Agenda en Línea
          </h3>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl font-bold text-xs truncate border dark:border-slate-700 text-blue-500">
              {`http://agendabarber.vercel.app/reserva/${auth.currentUser?.uid}`}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `http://agendabarber.vercel.app/reserva/${auth.currentUser?.uid}`
                  );
                  alert("¡Link copiado al portapapeles!");
                }}
                className="flex-1 md:flex-none bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
              >
                Copiar Link
              </button>

              <button
                onClick={() => {
                  const message = encodeURIComponent(
                    `¡Hola! Ya puedes agendar tu turno online aquí: http://agendabarber.vercel.app/reserva/${auth.currentUser?.uid}`
                  );
                  window.open(`https://wa.me/?text=${message}`, "_blank");
                }}
                className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare size={16} />
                Compartir
              </button>
            </div>
          </div>
        </section>

        {/* PLANES */}
        <section className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-black uppercase text-xs text-slate-400 tracking-widest">
              Suscripción
            </h3>
            <div
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                daysLeft() > 0
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}
            >
              {daysLeft()} Días Restantes
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
                      ? "border-blue-600 bg-blue-50/10"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <div className="mb-4 text-blue-600">{p.icon}</div>
                  <h4 className="font-black dark:text-white uppercase">
                    {p.name}
                  </h4>
                  <p className="text-2xl font-black text-blue-600 mb-4">
                    ${p.price}
                  </p>
                  <ul className="text-[10px] font-bold text-slate-500 space-y-2 mb-8 uppercase">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-emerald-500" />{" "}
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <div className="text-center py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                      Activo
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePayment(p)}
                      className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest"
                    >
                      {isPaying === p.id ? "..." : "Elegir"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FORMULARIO */}
        <form onSubmit={handleSave} className="space-y-6">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Nombre Comercial
              </label>
              <input
                value={barberiaData?.businessName || ""}
                onChange={(e) =>
                  setBarberiaData({
                    ...barberiaData,
                    businessName: e.target.value,
                  })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none border dark:border-slate-700"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                WhatsApp
              </label>
              <input
                value={barberiaData?.telefono || ""}
                onChange={(e) =>
                  setBarberiaData({ ...barberiaData, telefono: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none border dark:border-slate-700"
              />
            </div>
            <div className="md:col-span-2 space-y-3">
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
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none border dark:border-slate-700"
              />
            </div>
          </section>

          <button
            type="submit"
            className="fixed bottom-8 right-8 bg-blue-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl z-50 flex items-center gap-3"
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
    <Suspense fallback={<div className="h-screen bg-slate-950" />}>
      <SettingsContent />
    </Suspense>
  );
}
