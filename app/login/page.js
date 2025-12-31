"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, signInWithEmailAndPassword } from "@/services/firebase";
import {
  Sparkles, // Cambiado de Scissors
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Flower2, // Añadido para toque estético
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
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      // 1. Limpiamos y normalizamos los correos
      const userEmail = user.email?.toLowerCase().trim();
      const adminEmail =
        process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim();

      // 2. LOGS DE DEPURACIÓN (Míralos en la consola del navegador F12)
      console.log("Email Logueado:", userEmail);
      console.log("Email Admin (.env):", adminEmail);

      // 3. Verificación con "Failsafe"
      // Si el email es el que definiste en el .env, entra como admin
      if (adminEmail && userEmail === adminEmail) {
        router.push("/admin/control");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error completo:", err);
      setError("Error de acceso. Verifica tus datos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FDF8FA] dark:bg-slate-950">
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 bg-white dark:bg-slate-900 shadow-2xl">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Logo Section */}
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-2xl flex gap-2 font-black uppercase dark:text-white tracking-widest italic">
              Aura{" "}
              <div className="size-10 -mt-2 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                <Sparkles size={24} />
              </div>
              Estética
            </h1>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black dark:text-white leading-none italic uppercase tracking-tighter">
              Bienvenida{" "}
              <span className="text-pink-500 text-2xl block mt-1 tracking-widest">
                de nuevo.
              </span>
            </h2>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Email Profesional
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tucentro.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-pink-500/20 border-2 border-transparent focus:border-pink-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-pink-500/20 border-2 border-transparent focus:border-pink-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-pink-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Ingresar al Panel <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pt-4">
            ¿Aún no tienes cuenta?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-pink-500 hover:underline"
            >
              Regístrate ahora
            </button>
          </p>
        </div>
      </div>

      {/* Side Decorative Section (Opcional - Visible en Desktop) */}
      <div className="hidden lg:flex flex-1 bg-pink-50 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Flower2
            size={400}
            className="text-pink-200 absolute -bottom-20 -right-20"
          />
          <Sparkles
            size={200}
            className="text-pink-200 absolute -top-10 -left-10"
          />
        </div>
        <div className="relative z-10 text-center space-y-4 px-12">
          <h3 className="text-3xl font-black uppercase italic text-pink-500">
            Gestión con Estilo
          </h3>
          <p className="text-slate-500 font-medium">
            La plataforma que entiende la elegancia de tu negocio.
          </p>
        </div>
      </div>
    </div>
  );
}
