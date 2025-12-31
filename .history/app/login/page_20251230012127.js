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

    // Limpieza previa
    setError("");
    setIsLoading(true);

    try {
      // Intento de login limpio
      await signInWithEmailAndPassword(auth, email.trim(), password);

      // Si el login es exitoso, redirigimos
      router.push("/dashboard");
    } catch (err) {
      // IMPORTANTE: No imprimas 'err' completo en la consola
      // Eso es lo que causa el error de 'stack' en Next.js Turbopack
      const msg = err.message || "";

      if (
        msg.includes("auth/invalid-credential") ||
        msg.includes("auth/user-not-found")
      ) {
        setError("El correo o la contraseña no coinciden.");
      } else if (msg.includes("auth/too-many-requests")) {
        setError("Demasiados intentos. Espera un momento.");
      } else {
        setError("Error de acceso. Verifica tus datos.");
      }

      console.log("Estado de autenticación: Error en credenciales");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950">
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 bg-white dark:bg-slate-900 shadow-2xl">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="flex items-center justify-center gap-3">
            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Scissors size={24} />
            </div>
            <h1 className="text-2xl font-black uppercase dark:text-white tracking-tighter">
              BarberManager
            </h1>
          </div>

          <h2 className="text-4xl text-center font-black dark:text-white leading-none">
            Iniciar <span className="text-blue-600">Sesión.</span>
          </h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                Email
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
                  placeholder="admin@barberia.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
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
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3"
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
        </div>
      </div>
    </div>
  );
}
