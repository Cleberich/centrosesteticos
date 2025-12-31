"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [barberiaData, setBarberiaData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "barberias", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setBarberiaData(docSnap.data());
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      await updateDoc(barberiaRef, barberiaData);
      alert("¡Configuración guardada!");
    } catch (error) {
      alert("Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const daysRemaining = () => {
    if (!barberiaData?.plan?.expiresAt) return 0;
    const diff = new Date(barberiaData.plan.expiresAt) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen overflow-scroll bg-slate-50 dark:bg-slate-950 p-6 md:p-12 pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
              Ajustes
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">
              Configuración General
            </p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="text-red-500 font-black uppercase text-[10px] tracking-widest p-3 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={18} />
          </button>
        </header>

        {/* LINK DE AGENDA */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <LinkIcon className="text-blue-600" size={20} />
            <h3 className="font-black uppercase text-sm dark:text-white">
              Link de tu Agenda Online
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-slate-50 dark:bg-slate-800 px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-700">
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
                alert("Copiado!");
              }}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
            >
              Copiar Link
            </button>
          </div>
        </section>

        {/* MEMBRESÍA Y PLANES */}
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
                  Vence: {barberiaData?.plan?.expiresAt || "N/A"}
                </p>
              </div>
            </div>
            <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
              {daysRemaining()} Días Restantes
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Basico", "Pro", "Premium"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() =>
                  setBarberiaData({
                    ...barberiaData,
                    plan: { ...barberiaData.plan, type: p },
                  })
                }
                className={`p-6 rounded-[2rem] border-2 text-left transition-all ${
                  barberiaData?.plan?.type === p
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-600/10"
                    : "border-transparent bg-slate-50 dark:bg-slate-800"
                }`}
              >
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                  {p}
                </p>
                <p className="font-black dark:text-white">
                  {p === "Basico"
                    ? "Gratis"
                    : p === "Pro"
                    ? "$15/mes"
                    : "$29/mes"}
                </p>
                {barberiaData?.plan?.type === p && (
                  <CheckCircle2 className="text-blue-600 mt-2" size={16} />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* DATOS DEL NEGOCIO */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
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
              className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              WhatsApp de Reservas
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
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              Dirección Física
            </label>
            <input
              value={barberiaData?.direccion || ""}
              onChange={(e) =>
                setBarberiaData({ ...barberiaData, direccion: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500"
            />
          </div>
        </section>

        <button
          onClick={handleUpdateSettings}
          disabled={saving}
          className="fixed bottom-8 right-8 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/40 hover:scale-105 transition-all flex items-center gap-3"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}{" "}
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
}
