"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Intentamos el login
      await signInWithEmailAndPassword(auth, email, password);
      // Si llega aquí, es que fue exitoso
      router.push("/dashboard");
    } catch (err) {
      // Manejo de error seguro para evitar el crash de 'stack'
      const errorCode = err?.code || "unknown";

      if (
        errorCode === "auth/invalid-credential" ||
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/wrong-password"
      ) {
        setError("Email o contraseña incorrectos.");
      } else if (errorCode === "auth/too-many-requests") {
        setError("Demasiados intentos. Espera unos minutos.");
      } else {
        setError("Error al iniciar sesión. Verifica tu conexión.");
      }

      // Solo imprimimos el mensaje, no el objeto completo para evitar errores de stack
      console.warn("Auth status:", errorCode);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 font-sans antialiased">
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 bg-white dark:bg-slate-900 z-10 shadow-2xl">
        <div className="max-w-md w-full mx-auto space-y-10">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Scissors size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase dark:text-white">
              Barber<span className="text-blue-600">Manager</span>
            </h1>
          </div>

          <header>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Panel de <span className="text-blue-600">Acceso.</span>
            </h2>
          </header>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Email Profesional
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 ring-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white focus:ring-2 ring-blue-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Entrar <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm font-bold text-slate-500">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
