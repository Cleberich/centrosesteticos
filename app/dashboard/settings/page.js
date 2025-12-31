"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  ShieldCheck,
  Loader2,
  Store,
  Camera,
  Calendar,
  ExternalLink,
  MessageSquare,
  Lock,
  Unlock,
  CheckCircle2,
  Zap,
  Star,
  Crown,
  MapPin,
  Navigation,
  Sparkles,
  Flower2,
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function SettingsContent() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [esteticaData, setEsteticaData] = useState(null);

  // Estados de Seguridad
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verificationPin, setVerificationPin] = useState("");
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  const planes = [
    {
      id: "Soft",
      name: "Soft",
      price: 750,
      icon: <Zap size={20} />,
      features: ["1 Especialista", "50 citas/mes"],
    },
    {
      id: "Radiance",
      name: "Radiance",
      price: 1450,
      icon: <Star size={20} />,
      features: ["4 Especialistas", "200 citas/mes", "Estadísticas"],
    },
    {
      id: "Diamond",
      name: "Diamond",
      price: 2200,
      icon: <Crown size={20} />,
      features: [
        "Especialistas Ilimitados",
        "Citas ilimitadas",
        "Estadísticas",
        "Finanzas",
        "Marketing ",
      ],
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // CAMBIO A COLECCIÓN centros_estetica
          const docRef = doc(db, "centros_estetica", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setEsteticaData(docSnap.data());
          }
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

  const handleSearchAddress = () => {
    if (!esteticaData?.direccion) {
      alert("Escribe una dirección primero");
      return;
    }
    const query = encodeURIComponent(esteticaData.direccion);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1000000) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setEsteticaData({ ...esteticaData, logo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleTogglePinProtection = () => {
    if (esteticaData?.useAccountingPin) {
      setIsVerifyModalOpen(true);
    } else {
      setEsteticaData({ ...esteticaData, useAccountingPin: true });
    }
  };

  const confirmDeactivationAndSave = async (e) => {
    e.preventDefault();
    if (verificationPin === esteticaData?.adminPin) {
      setIsSavingSecurity(true);
      try {
        const ref = doc(db, "centros_estetica", auth.currentUser.uid);
        const updatedData = { ...esteticaData, useAccountingPin: false };
        await updateDoc(ref, updatedData);
        setEsteticaData(updatedData);
        setIsVerifyModalOpen(false);
        setVerificationPin("");
        alert("Protección de finanzas desactivada.");
      } catch (error) {
        alert("Error al guardar.");
      } finally {
        setIsSavingSecurity(false);
      }
    } else {
      alert("PIN incorrecto");
      setVerificationPin("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      esteticaData?.useAccountingPin &&
      (!esteticaData?.adminPin || esteticaData.adminPin.length < 4)
    ) {
      alert("El PIN debe ser de 4 dígitos");
      return;
    }
    setSaving(true);
    try {
      const ref = doc(db, "centros_estetica", auth.currentUser.uid);
      await updateDoc(ref, esteticaData);
      alert("Ajustes de Aura guardados con éxito");
    } catch (e) {
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const daysLeft = () => {
    if (!esteticaData?.plan?.expiresAt) return 0;
    const expires = esteticaData.plan.expiresAt.seconds
      ? new Date(esteticaData.plan.expiresAt.seconds * 1000)
      : new Date(esteticaData.plan.expiresAt);
    const diff = expires - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-pink-500" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDF8FA] dark:bg-slate-950 p-6 md:p-12 pb-32 font-sans transition-colors overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter italic">
              Ajustes <span className="text-pink-500">Aura</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">
              Perfil del Centro de Estética
            </p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* LOGO */}
        <section className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-pink-50 dark:border-slate-800 shadow-sm">
          <div className="relative">
            <div className="size-32 rounded-[2.5rem] overflow-hidden bg-pink-50 dark:bg-slate-800 border-4 border-white shadow-xl">
              {esteticaData?.logo ? (
                <img
                  src={esteticaData.logo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-pink-200">
                  <Sparkles size={40} />
                </div>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 bg-pink-500 p-3 rounded-2xl text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
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
            <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">
              Imagen de Marca
            </h3>
            <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-widest italic">
              Personaliza la vista de tus clientes
            </p>
          </div>
        </section>

        {/* PROTECCIÓN PIN */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-pink-50 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="flex items-center gap-2 font-black uppercase text-xs text-pink-500 tracking-widest">
                <ShieldCheck size={18} /> Privacidad de Finanzas
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                Protege la caja de miradas indiscretas
              </p>
            </div>
            <div
              onClick={handleTogglePinProtection}
              className={`w-14 h-8 rounded-full flex items-center px-1 cursor-pointer transition-all ${
                esteticaData?.useAccountingPin
                  ? "bg-pink-500 justify-end"
                  : "bg-slate-200 dark:bg-slate-700 justify-start"
              }`}
            >
              <div className="size-6 bg-white rounded-full shadow-md" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-center">
              {esteticaData?.useAccountingPin ? (
                <input
                  type="password"
                  maxLength={4}
                  placeholder="NUEVO PIN"
                  value={esteticaData?.adminPin || ""}
                  onChange={(e) =>
                    setEsteticaData({
                      ...esteticaData,
                      adminPin: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full bg-pink-50/50 dark:bg-slate-800 border-2 border-dashed border-pink-500/30 rounded-2xl py-5 px-6 text-center text-2xl font-black tracking-[.5em] text-pink-600 outline-none"
                />
              ) : (
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200">
                  <Unlock className="mx-auto text-slate-300 mb-2" />
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Sin PIN de seguridad
                  </p>
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase bg-pink-50/30 dark:bg-slate-800/50 p-6 rounded-3xl border border-pink-50">
              Activa el PIN para que solo tú puedas ver los reportes de ingresos
              y contabilidad del centro.
            </p>
          </div>
        </section>

        {/* LINK AGENDA */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-pink-50 dark:border-slate-800 shadow-sm">
          <h3 className="flex items-center gap-2 font-black uppercase text-xs text-pink-500 mb-4 tracking-widest">
            <Calendar size={16} /> Link de Reserva Aura
          </h3>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-pink-50/50 dark:bg-slate-950 p-4 rounded-2xl font-bold text-xs truncate border border-pink-100 text-pink-600">
              {`https://aura-estetica.vercel.app/reserva/${auth.currentUser?.uid}`}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://aura-estetica.vercel.app/reserva/${auth.currentUser?.uid}`
                  );
                  alert("Link copiado");
                }}
                className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
              >
                Copiar
              </button>
              <button
                type="button"
                onClick={() =>
                  window.open(
                    `https://aura-estetica.vercel.app/reserva/${auth.currentUser?.uid}`,
                    "_blank"
                  )
                }
                className="flex items-center gap-2 bg-pink-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-pink-500/20"
              >
                <ExternalLink size={16} /> Ver Vista
              </button>
            </div>
          </div>
        </section>

        {/* DATOS COMERCIALES */}
        <form onSubmit={handleSave} className="space-y-6">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-pink-50 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Nombre del Centro
              </label>
              <input
                value={esteticaData?.businessName || ""}
                onChange={(e) =>
                  setEsteticaData({
                    ...esteticaData,
                    businessName: e.target.value,
                  })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none border border-slate-100 focus:border-pink-500 transition-colors"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                WhatsApp de Contacto
              </label>
              <input
                value={esteticaData?.telefono || ""}
                onChange={(e) =>
                  setEsteticaData({ ...esteticaData, telefono: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none border border-slate-100 focus:border-pink-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2">
                <MapPin size={12} /> Dirección Física
              </label>
              <div className="flex gap-2">
                <input
                  placeholder="Calle, Ciudad, País"
                  value={esteticaData?.direccion || ""}
                  onChange={(e) =>
                    setEsteticaData({
                      ...esteticaData,
                      direccion: e.target.value,
                    })
                  }
                  className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl font-bold dark:text-white outline-none border border-slate-100"
                />
                <button
                  type="button"
                  onClick={handleSearchAddress}
                  className="px-6 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase"
                >
                  Ubicación
                </button>
              </div>
            </div>
          </section>

          {/* PLANES */}
          <section className="space-y-6">
            <div className="flex justify-between items-center px-4">
              <h3 className="font-black uppercase text-xs text-slate-400 tracking-[0.3em]">
                Suscripción Aura
              </h3>
              <div
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  daysLeft() > 0
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-rose-50 text-rose-600 border-rose-100"
                }`}
              >
                {daysLeft()} Días Restantes
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {planes.map((p) => {
                const isCurrent = esteticaData?.plan?.type === p.id;
                return (
                  <div
                    key={p.id}
                    className={`p-8 rounded-[3rem] border-2 transition-all ${
                      isCurrent
                        ? "border-pink-500 bg-pink-50/30"
                        : "bg-white dark:bg-slate-900 border-slate-100"
                    }`}
                  >
                    <div className="mb-4 text-pink-500">{p.icon}</div>
                    <h4 className="font-black dark:text-white uppercase tracking-tighter italic">
                      {p.name}
                    </h4>
                    <p className="text-2xl font-black text-pink-500 mb-4">
                      ${p.price}
                      <span className="text-[10px] text-slate-400 ml-1">
                        /mes
                      </span>
                    </p>
                    <ul className="text-[10px] font-bold text-slate-500 space-y-3 mb-8 uppercase">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-pink-400" />{" "}
                          {f}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <div className="text-center py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                        Suscripción Activa
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="w-full py-4 bg-slate-900 dark:bg-pink-300 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-pink-600 transition-colors dark:text-slate-950"
                      >
                        Solicitar Plan
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <button
            type="submit"
            className="fixed bottom-8 right-8 bg-pink-500 text-white px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-2xl z-50 flex items-center gap-3 hover:scale-105 transition-all shadow-pink-500/30"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {saving ? "Procesando..." : "Guardar Ajustes"}
          </button>
        </form>

        {/* MODAL VERIFICACIÓN */}
        {isVerifyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] shadow-2xl p-10 border border-slate-100 text-center">
              <div className="size-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-black uppercase dark:text-white italic">
                Confirmar Identidad
              </h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase mt-2 mb-8 tracking-widest">
                Ingresa tu PIN actual de seguridad
              </p>
              <form onSubmit={confirmDeactivationAndSave} className="space-y-4">
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  value={verificationPin}
                  onChange={(e) =>
                    setVerificationPin(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full bg-slate-50 rounded-2xl py-5 text-center text-2xl font-black tracking-[1em] outline-none border-2 border-transparent focus:border-rose-500 transition-all"
                />
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsVerifyModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-[10px] uppercase"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-rose-600/20"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-pink-500" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
