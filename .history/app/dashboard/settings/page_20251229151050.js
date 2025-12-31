"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  User,
  Store,
  Clock,
  Bell,
  Lock,
  Loader2,
  Camera,
  ChevronRight,
  LogOut,
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

  // Carga de datos iniciales
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "barberias", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBarberiaData(docSnap.data());
        }
        setLoading(false);
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
      alert("Configuración actualizada correctamente");
    } catch (error) {
      console.error(error);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
              Configuración
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">
              Gestiona tu negocio y preferencias
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </header>

        <form onSubmit={handleUpdateSettings} className="space-y-6">
          {/* SECCIÓN: PERFIL DE LA BARBERÍA */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl">
                <Store size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight dark:text-white">
                Perfil de la Barbería
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Nombre del Negocio
                </label>
                <input
                  type="text"
                  value={barberiaData?.nombre || ""}
                  onChange={(e) =>
                    setBarberiaData({ ...barberiaData, nombre: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Teléfono de contacto
                </label>
                <input
                  type="tel"
                  value={barberiaData?.telefono || ""}
                  onChange={(e) =>
                    setBarberiaData({
                      ...barberiaData,
                      telefono: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Dirección física
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
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
                />
              </div>
            </div>
          </section>

          {/* SECCIÓN: HORARIOS */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl">
                <Clock size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight dark:text-white">
                Horario Comercial
              </h3>
            </div>

            <div className="space-y-4">
              {[
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
                "Domingo",
              ].map((dia) => (
                <div
                  key={dia}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl"
                >
                  <span className="font-bold uppercase text-xs dark:text-white w-24">
                    {dia}
                  </span>
                  <div className="flex items-center gap-4">
                    <input
                      type="time"
                      className="bg-white dark:bg-slate-700 border-none rounded-lg px-3 py-1 text-sm font-bold dark:text-white"
                      defaultValue="09:00"
                    />
                    <span className="text-slate-400 font-bold">a</span>
                    <input
                      type="time"
                      className="bg-white dark:bg-slate-700 border-none rounded-lg px-3 py-1 text-sm font-bold dark:text-white"
                      defaultValue="20:00"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECCIÓN: PREFERENCIAS DE RESERVA */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-violet-50 dark:bg-violet-500/10 text-violet-600 rounded-2xl">
                <Bell size={20} />
              </div>
              <h3 className="font-black uppercase tracking-tight dark:text-white">
                Reservas y Notificaciones
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold dark:text-white text-sm uppercase">
                    Confirmación automática WhatsApp
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Enviar mensaje al agendar cita rápida
                  </p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                  <div className="size-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <hr className="border-slate-100 dark:border-slate-800" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold dark:text-white text-sm uppercase">
                    Intervalo de turnos
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Tiempo predeterminado por servicio
                  </p>
                </div>
                <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 font-bold text-xs dark:text-white">
                  <option>30 minutos</option>
                  <option>45 minutos</option>
                  <option>60 minutos</option>
                </select>
              </div>
            </div>
          </section>

          {/* BOTÓN FLOTANTE DE GUARDAR */}
          <div className="sticky bottom-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl shadow-2xl shadow-blue-500/40 transition-all font-black uppercase tracking-widest text-xs disabled:opacity-50"
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
