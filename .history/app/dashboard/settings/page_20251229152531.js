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

  // --- CARGA DE DATOS ---
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
          console.error("Error al cargar configuración:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // --- ACTUALIZAR DATOS ---
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      await updateDoc(barberiaRef, {
        businessName: barberiaData.businessName,
        email: barberiaData.email,
        telefono: barberiaData.telefono || "",
        direccion: barberiaData.direccion || "",
      });
      alert("Configuración guardada con éxito");
    } catch (error) {
      alert("Error al actualizar los datos.");
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
              Ajustes
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">
              Configuración general del negocio
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 px-6 py-3 rounded-2xl border border-red-100 dark:border-red-500/20 transition-all"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </header>

        <form onSubmit={handleUpdateSettings} className="space-y-6">
          {/* CARD DE MEMBRESÍA */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-hidden relative">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-lg shadow-blue-500/30">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Estado de Membresía
                  </p>
                  <h2 className="text-2xl font-black uppercase dark:text-white leading-none mt-1">
                    Plan {barberiaData?.plan?.type || "Básico"}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                <div
                  className={`size-3 rounded-full animate-pulse ${
                    barberiaData?.plan?.status === "active"
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                />
                <span className="text-xs font-black uppercase tracking-widest dark:text-white">
                  {barberiaData?.plan?.status === "active"
                    ? "Cuenta Activa"
                    : "Pago Pendiente"}
                </span>
              </div>
            </div>
            {/* Decoración de fondo */}
            <CreditCard className="absolute -right-6 -bottom-6 size-32 text-slate-100 dark:text-slate-800/50" />
          </div>

          {/* FORMULARIO DE DATOS */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl">
                <Store size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight dark:text-white">
                Perfil Público
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NOMBRE DE LA BARBERÍA */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Nombre Comercial
                </label>
                <div className="relative">
                  <Store
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={barberiaData?.businessName || ""}
                    onChange={(e) =>
                      setBarberiaData({
                        ...barberiaData,
                        businessName: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-5 py-4 font-bold dark:text-white focus:ring-2 ring-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Email de Negocio
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={barberiaData?.email || ""}
                    onChange={(e) =>
                      setBarberiaData({
                        ...barberiaData,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-5 py-4 font-bold dark:text-white focus:ring-2 ring-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* TELÉFONO */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  WhatsApp / Teléfono
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
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-5 py-4 font-bold dark:text-white focus:ring-2 ring-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* DIRECCIÓN */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Ubicación
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={barberiaData?.direccion || ""}
                    onChange={(e) =>
                      setBarberiaData({
                        ...barberiaData,
                        direccion: e.target.value,
                      })
                    }
                    placeholder="Calle y número, Ciudad"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-5 py-4 font-bold dark:text-white focus:ring-2 ring-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* BOTÓN GUARDAR */}
          <div className="flex justify-end">
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
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
