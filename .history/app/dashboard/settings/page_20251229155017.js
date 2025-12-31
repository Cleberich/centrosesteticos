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

  // --- 1. CARGA DE DATOS ---
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

  // --- 2. ACTUALIZAR DATOS ---
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      await updateDoc(barberiaRef, {
        businessName: barberiaData.businessName || "",
        email: barberiaData.email || "",
        telefono: barberiaData.telefono || "",
        direccion: barberiaData.direccion || "",
      });
      alert("Configuración guardada correctamente");
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

  const copyToClipboard = () => {
    const url = `http://localhost:3000/reserva/${auth.currentUser?.uid}`;
    navigator.clipboard.writeText(url);
    alert("¡Link copiado al portapapeles!");
  };

  if (loading)
    return (
      <div className="h-auto flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="text-blue-600 animate-spin" size={40} />
      </div>
    );

  return (
    <div className="overflow-scroll bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
              Ajustes
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">
              Gestiona tu negocio y herramientas
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 px-6 py-3 rounded-2xl border border-red-100 dark:border-red-500/20 transition-all w-fit"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </header>

        <form onSubmit={handleUpdateSettings} className="space-y-6 pb-20">
          {/* SECCIÓN: LINK DE AGENDA PÚBLICA */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-2xl">
                <LinkIcon size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight dark:text-white">
                Tu Agenda Online
              </h3>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">
                Link para tus clientes:
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 bg-white dark:bg-slate-900 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 w-full overflow-hidden">
                  <code className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                    http://localhost:3000/reserva/{auth.currentUser?.uid}
                  </code>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    <Copy size={14} /> Copiar
                  </button>
                  <a
                    href={`/reserva/${auth.currentUser?.uid}`}
                    target="_blank"
                    className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN: MEMBRESÍA */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-lg shadow-blue-500/30">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Suscripción
                  </p>
                  <h2 className="text-2xl font-black uppercase dark:text-white leading-none mt-1">
                    Plan {barberiaData?.plan?.type || "Básico"}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div
                  className={`size-3 rounded-full animate-pulse ${
                    barberiaData?.plan?.status === "active"
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                />
                <span className="text-xs font-black uppercase tracking-widest dark:text-white">
                  {barberiaData?.plan?.status === "active"
                    ? "Membresía Activa"
                    : "Pago Pendiente"}
                </span>
              </div>
            </div>
            <CreditCard className="absolute -right-6 -bottom-6 size-32 text-slate-50 dark:text-slate-800/20 pointer-events-none" />
          </section>

          {/* SECCIÓN: PERFIL */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl">
                <Store size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight dark:text-white">
                Información del Negocio
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BUSINESS NAME */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Nombre de la Barbería
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
                  Email de Contacto
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
                  Teléfono / WhatsApp
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
                    placeholder="Calle 123, Ciudad"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-5 py-4 font-bold dark:text-white focus:ring-2 ring-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* BOTÓN FLOTANTE GUARDAR */}
          <div className="fixed bottom-8 right-8 md:right-12 z-50">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-3xl shadow-2xl shadow-blue-500/40 transition-all font-black uppercase tracking-widest text-xs disabled:opacity-50 active:scale-95"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Guardando..." : "Guardar Ajustes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
