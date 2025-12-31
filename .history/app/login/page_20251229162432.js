"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  auth,
  signInWithEmailAndPassword,
  googleProvider,
  signInWithPopup,
} from "@/services/firebase"; // Asegúrate de que la ruta sea correcta
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // --- 1. LOGIN CON EMAIL Y PASSWORD ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/dashboard"); // Redirigir al entrar
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas o usuario no encontrado.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. LOGIN CON GOOGLE ---
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err) {
      setError("Error al acceder con Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f6f6f8] dark:bg-[#0a0f1a] font-sans antialiased">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-32 bg-white dark:bg-[#101622] z-10 shadow-2xl">
        <div className="max-w-md w-full mx-auto space-y-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Scissors size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase dark:text-white">
              Barber<span className="text-blue-600">Manager</span>
            </h1>
          </div>

          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
              Bienvenido <span className="text-blue-600">de nuevo.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Ingresa tus credenciales para gestionar tu barbería.
            </p>
          </div>

          {/* MENSAGE DE ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold animate-shake">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="admin@barberia.com"
                  className="w-full pl-11 pr-4 py-4 bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl transition-all outline-none font-bold dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Contraseña
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl transition-all outline-none font-bold dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar al Panel <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest bg-white dark:bg-[#101622] px-4 text-slate-400">
              O accede con
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all dark:text-white"
          >
            <Chrome size={18} /> Google Workspace
          </button>

          <p className="text-center text-sm text-slate-500 font-medium">
            ¿Aún no tienes cuenta?{" "}
            <a
              href="/register"
              className="text-blue-600 font-black hover:underline"
            >
              Regístrate
            </a>
          </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA */}
      <div className="hidden lg:flex flex-1 relative bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000"
            alt="Barber Shop"
            className="w-full h-full object-cover opacity-40 grayscale"
          />
        </div>
        <div className="relative z-10 w-full flex flex-col justify-end p-20 text-white">
          <blockquote className="text-4xl font-black leading-tight mb-6">
            "La barbería no es solo un corte, es una experiencia de gestión
            impecable."
          </blockquote>
          <p className="font-black uppercase tracking-[0.3em] text-xs text-blue-200">
            Software Profesional para Barberos
          </p>
        </div>
      </div>
    </div>
  );
}
