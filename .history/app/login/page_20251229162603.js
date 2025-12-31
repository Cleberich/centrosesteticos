"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Importación modular correcta
import {
  auth,
  signInWithEmailAndPassword,
  googleProvider,
  signInWithPopup,
} from "@/services/firebase";
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
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
    e.preventDefault(); // Evita que la página se recargue
    if (!email || !password) return setError("Completa todos los campos");

    setIsLoading(true);
    setError("");

    try {
      // Intentar autenticación
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        router.push("/dashboard"); // Redirección inmediata
      }
    } catch (err) {
      console.error("Error code:", err.code);
      // Mensajes amigables según el error de Firebase
      if (err.code === "auth/invalid-credential")
        setError("Correo o contraseña incorrectos.");
      else if (err.code === "auth/too-many-requests")
        setError("Demasiados intentos. Intenta más tarde.");
      else setError("Hubo un problema al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err) {
      setError("Error al conectar con Google.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 font-sans antialiased">
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-32 bg-white dark:bg-slate-900 shadow-2xl z-10">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Scissors size={22} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase dark:text-white">
              Barber<span className="text-blue-600">Manager</span>
            </h1>
          </div>

          <header>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Bienvenido <span className="text-blue-600">de nuevo.</span>
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              Ingresa tus datos para acceder al panel.
            </p>
          </header>

          {/* ERROR ALERT */}
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest animate-in fade-in zoom-in-95">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Email
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
                  placeholder="admin@barberia.com"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Entrar al Panel <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 border-t border-slate-100 dark:border-slate-800" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              o accede con
            </span>
            <div className="flex-1 border-t border-slate-100 dark:border-slate-800" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all dark:text-white"
          >
            <Chrome size={18} /> Google Workspace
          </button>

          <p className="text-center text-sm font-bold text-slate-500">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Crea una aquí
            </a>
          </p>
        </div>
      </div>

      {/* PANEL LATERAL DECORATIVO */}
      <div className="hidden lg:flex flex-1 relative bg-blue-600 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000"
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale contrast-125"
          alt="Barber Background"
        />
        <div className="relative z-10 p-20 flex flex-col justify-end h-full text-white">
          <h3 className="text-5xl font-black leading-tight uppercase tracking-tighter mb-4 italic">
            El estilo se gestiona.
          </h3>
          <p className="text-blue-100 font-bold uppercase tracking-widest text-xs">
            Software de administración profesional
          </p>
        </div>
      </div>
    </div>
  );
}
