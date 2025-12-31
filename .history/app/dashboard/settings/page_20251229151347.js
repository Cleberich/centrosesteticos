"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Store,
  Clock,
  Bell,
  Loader2,
  LogOut,
  CreditCard,
  ShieldCheck,
  Phone,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [barberiaData, setBarberiaData] = useState(null);

  // --- CARGA DE DATOS REALES ---
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
          console.error("Error cargando configuración:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // --- GUARDAR CAMBIOS ---
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      await updateDoc(barberiaRef, {
        nombre: barberiaData.nombre,
        telefono: barberiaData.telefono,
        direccion: barberiaData.direccion,
        // Aquí puedes añadir más campos si los necesitas
      });
      alert("Configuración actualizada correctamente");
    } catch (error) {
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="text-blue-600 animate-spin" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
              Configuración
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">
              Gestiona tu negocio y suscripción
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 px-6 py-3 rounded-2xl border border-red-100 dark:border-red-500/20 transition-all w-fit"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </header>

        <form onSubmit={handleUpdateSettings} className="space-y-6">
          {/* SECCIÓN 1: ESTADO DE MEMBRESÍA (INFO REAL) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-black uppercase tracking-tight dark:text-white">
                  Estado de la Suscripción
                </h3>
              </div>

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[1.8rem]">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    Plan Actual
                  </p>
                  <p className="text-2xl font-black uppercase dark:text-white leading-none">
                    {barberiaData?.plan?.type || "Gratis"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">
                    Estado
                  </p>
                  <span
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      barberiaData?.plan?.status === "active"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                    }`}
                  >
                    {barberiaData?.plan?.status === "active"
                      ? "Activo"
                      : "Pendiente"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-center relative overflow-hidden group shadow-xl shadow-blue-500/20">
              <CreditCard className="absolute -right-4 -bottom-4 size-32 text-white/10 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">
                Próximo cobro
              </p>
              <p className="text-3xl font-black uppercase">Automático</p>
              <button
                type="button"
                className="mt-4 text-[10px] font-black uppercase bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors w-fit"
              >
                Ver Facturas
              </button>
            </div>
          </div>

          {/* SECCIÓN 2: DATOS DE LA BARBERÍA */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl">
                <Store size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight dark:text-white">
                Información General
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Nombre del Negocio
                </label>
                <div className="relative">
                  <Store
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={barberiaData?.nombre || ""}
                    onChange={(e) =>
                      setBarberiaData({
                        ...barberiaData,
                        nombre: e.target.value,
                      })
                    }
                    placeholder="Ej. Barbería El Corte"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-5 py-4 font-bold dark:text-white focus:ring-2 ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Teléfono Público
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="tel"
                    value={barberiaData?.telefono || ""}
                    onChange={(e) =>
                      setBarberiaData({
                        ...barberiaData,
                        telefono: e.target.value,
                      })
                    }
                    placeholder="+54 11 0000-0000"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-5 py-4 font-bold dark:text-white focus:ring-2 ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Dirección Completa
                </label>
                <input
                  type="text"
                  value={barberiaData?.direccion || ""}
                  onChange={(e) =>
                    setBarberiaData({
                      ...barberiaData,
                      direccion: e.target.value,
                    })
                  }
                  placeholder="Calle 123, Ciudad, País"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white focus:ring-2 ring-blue-500 transition-all"
                />
              </div>
            </div>
          </section>

          {/* BOTÓN DE GUARDAR */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl shadow-2xl shadow-blue-500/40 transition-all font-black uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Guardando cambios..." : "Guardar Configuración"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
