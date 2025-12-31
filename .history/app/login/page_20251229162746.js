"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, createUserWithEmailAndPassword } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  Scissors,
  Mail,
  Lock,
  User,
  Store,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Crear documento de la barbería en Firestore
      await setDoc(doc(db, "barberias", user.uid), {
        ownerName: formData.name,
        businessName: formData.businessName,
        email: formData.email,
        telefono: "",
        direccion: "",
        plan: {
          type: "Basico",
          status: "active",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // 7 días prueba
        },
        barbers: [{ name: formData.name }], // El dueño es el primer barbero por defecto
        appointments: [],
      });

      router.push("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use")
        setError("El correo ya está registrado.");
      else setError("Error al crear la cuenta. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 font-sans antialiased">
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 bg-white dark:bg-slate-900 z-10 shadow-2xl">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Scissors size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase dark:text-white">
              {" "}
              BarberManager{" "}
            </h1>
          </div>

          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Crea tu <span className="text-blue-600">Cuenta.</span>
            </h2>
            <p className="text-slate-500 font-medium mt-4">
              Empieza a gestionar tus turnos hoy mismo.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest animate-pulse">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 text-blue-600">
                Nombre Personal
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600"
                  size={18}
                />
                <input
                  required
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 ring-blue-600 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 text-blue-600">
                Nombre de la Barbería
              </label>
              <div className="relative group">
                <Store
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600"
                  size={18}
                />
                <input
                  required
                  type="text"
                  placeholder="Ej: Urban Style"
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 ring-blue-600 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 text-blue-600">
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600"
                  size={18}
                />
                <input
                  required
                  type="email"
                  placeholder="admin@tubarberia.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 ring-blue-600 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 text-blue-600">
                Contraseña
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600"
                  size={18}
                />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 ring-blue-600 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Crear mi Barbería <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm font-bold text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
