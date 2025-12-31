"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Solo importamos lo estrictamente necesario para Email/Password
import { auth, signInWithEmailAndPassword } from "@/services/firebase";
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validación básica antes de llamar a Firebase
    if (!email || !password) {
      setError("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Intento de inicio de sesión modular
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err.code);
      // Mapeo de errores para el usuario
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Credenciales incorrectas. Revisa tu email y clave.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Demasiados intentos fallidos. Intenta más tarde.");
      } else {
        setError("Error al conectar con el servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 font-sans antialiased">
      {/* SECCIÓN FORMULARIO */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-32 bg-white dark:bg-slate-900 z-10 shadow-2xl">
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
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2 leading-none">
              Panel de <span className="text-blue-600">Acceso.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Ingresa tus credenciales para administrar tu local.
            </p>
          </div>

          {/* ALERTA DE ERROR */}
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest animate-in fade-in zoom-in-95">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Email Profesional
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@barberia.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 ring-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Contraseña
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 ring-blue-600 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Iniciar Sesión <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 font-bold">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate ahora
            </a>
          </p>
        </div>
      </div>

      {/* SECCIÓN IMAGEN LATERAL */}
      <div className="hidden lg:flex flex-1 relative bg-blue-600 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000"
          alt="Barber Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
        />
        <div className="relative z-10 w-full flex flex-col justify-end p-20 text-white">
          <h3 className="text-5xl font-black leading-tight mb-4 uppercase italic">
            Gestión Sin Límites.
          </h3>
          <p className="text-blue-200 font-black uppercase tracking-[0.4em] text-[10px]">
            Profesionalizando el sector barbería
          </p>
        </div>
      </div>
    </div>
  );
}
