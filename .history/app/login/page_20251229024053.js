"use client";
import React, { useState } from "react";
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulación de login
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f6f6f8] dark:bg-[#0a0f1a] font-sans antialiased">
      {/* SECCIÓN IZQUIERDA: Formulario */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-32 bg-white dark:bg-[#101622] z-10 shadow-2xl">
        <div className="max-w-md w-full mx-auto space-y-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Scissors size={24} />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase dark:text-white">
              Barber<span className="text-blue-600">Manager</span>
            </h1>
          </div>

          {/* Texto de Bienvenida */}
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
              Bienvenido <span className="text-blue-600">de nuevo.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Gestiona tu barbería con estilo. Ingresa tus credenciales para
              continuar.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@barberia.com"
                  className="w-full pl-11 pr-4 py-4 bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all outline-none font-bold text-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Contraseña
                </label>
                <a
                  href="#"
                  className="text-[10px] font-black uppercase text-blue-600 hover:underline"
                >
                  ¿Olvidaste la clave?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all outline-none font-bold text-slate-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
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

          {/* Separador */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest bg-white dark:bg-[#101622] px-4 text-slate-400">
              O accede con
            </div>
          </div>

          {/* Botones Sociales */}
          <div className="grid grid-cols-1 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <Chrome size={18} /> Google Workspace
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 font-medium">
            ¿Aún no tienes cuenta?{" "}
            <a href="#" className="text-blue-600 font-black hover:underline">
              Regístrate
            </a>
          </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Imagen/Branding (Solo Desktop) */}
      <div className="hidden lg:flex flex-1 relative bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000"
            alt="Barber Shop"
            className="w-full h-full object-cover opacity-40 grayscale"
          />
        </div>
        <div className="relative z-10 w-full flex flex-col justify-end p-20 text-white">
          <blockquote className="text-4xl font-black italic leading-tight mb-6">
            "La barbería no es solo un corte, es una experiencia de gestión
            impecable."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full border-2 border-white/50 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCuvIytLAf85ING8ztXT8oezTSMgPx0fcR9R5Wx8nS6yKlLVx3wbHPQjuPV74LuY5g1rNZFx40nZxGYDA04i_lWXuG_UC-uVlkMC-5gjP1NE1S6DvTJQeJTf--TnAdgu7_3GjTua2f550ENwZ2XZ6rkmstGD7H-5yYwhnvc1fhWPctyRSGcbAfuEPCYgwDoWyZvW57xx6CL-eEHlUtUxJbF3RYMF0uSFz4bPIdl9bLA_3UTQRc94wVosr1QPiVVxfA0wqA8idd4fqik')] bg-cover" />
            <div>
              <p className="font-black uppercase tracking-widest text-sm">
                Juan Pérez
              </p>
              <p className="text-xs font-bold text-white/70">
                Master Barber & CEO
              </p>
            </div>
          </div>
        </div>

        {/* Decoración abstracta */}
        <div className="absolute top-[-10%] right-[-10%] size-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] size-64 bg-blue-400/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
