"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCircle,
  Sparkles, // Cambiado de Scissors
  Settings,
  LogOut,
  BarChart3,
  Loader2,
  BadgeCheck,
  Menu,
  X,
  Flower2, // Nuevo icono para estética
  Heart,
} from "lucide-react";
import Link from "next/link";

// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // CAMBIO A COLECCIÓN centros_estetica
          const docRef = doc(db, "centros_estetica", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            const isDark = data.themePreference === "dark";
            setDarkMode(isDark);
            if (isDark) document.documentElement.classList.add("dark");
            else document.documentElement.classList.remove("dark");
          }
        } catch (error) {
          console.error("Error cargando perfil estético:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const SidebarLink = ({ href, icon, label, variant = "default", onClick }) => {
    const active = pathname === href;
    const styles = active
      ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20 scale-[1.02]"
      : "text-slate-500 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-600 dark:hover:text-pink-300";

    const content = (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm cursor-pointer ${styles} ${
          variant === "danger"
            ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
            : ""
        }`}
      >
        {icon}
        <span className="font-black tracking-tight uppercase text-[10px]">
          {label}
        </span>
      </div>
    );
    if (onClick) return <div onClick={onClick}>{content}</div>;
    return <Link href={href}>{content}</Link>;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="size-11 rounded-2xl border-2 border-pink-500 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {loading ? (
              <Loader2 className="animate-spin text-pink-500" size={16} />
            ) : userData?.logo ? (
              <img src={userData.logo} className="w-full h-full object-cover" />
            ) : (
              <Sparkles className="text-pink-500" size={20} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xs font-black truncate uppercase dark:text-white tracking-widest italic leading-none mb-1">
              {userData?.businessName || "Aura Estética"}
            </h1>
            <div className="flex items-center gap-1">
              <BadgeCheck size={10} className="text-pink-400" />
              <span className="text-[8px] font-black text-pink-400 uppercase tracking-widest">
                Plan {userData?.plan?.type || "Standard"}
              </span>
            </div>
          </div>
          <button
            className="lg:hidden text-slate-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          <p className="text-[9px] font-black uppercase text-slate-400 ml-4 mb-3 tracking-[0.3em]">
            Principal
          </p>
          <SidebarLink
            href="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Panel General"
          />
          <SidebarLink
            href="/dashboard/calendar"
            icon={<Calendar size={18} />}
            label="Agenda de Citas"
          />

          <p className="text-[9px] font-black uppercase text-slate-400 ml-4 mb-3 mt-8 tracking-[0.3em]">
            Gestión Aura
          </p>
          <SidebarLink
            href="/dashboard/especialistas"
            icon={<UserCircle size={18} />}
            label="Especialistas"
          />
          <SidebarLink
            href="/dashboard/clientes"
            icon={<Users size={18} />}
            label="Pacientes / Clientes"
          />
          <SidebarLink
            href="/dashboard/services"
            icon={<Flower2 size={18} />}
            label="Tratamientos"
          />
          <SidebarLink
            href="/dashboard/accounting"
            icon={<BarChart3 size={18} />}
            label="Finanzas"
          />
        </nav>
      </div>

      <div className="space-y-1 pt-6 border-t border-pink-50 dark:border-slate-800">
        <SidebarLink
          href="/dashboard/settings"
          icon={<Settings size={18} />}
          label="Configuración"
        />
        <SidebarLink
          href="#"
          icon={<LogOut size={18} />}
          label="Salir"
          variant="danger"
          onClick={handleLogout}
        />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#FDF8FA] dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-pink-50 dark:border-slate-800 bg-pink-100 dark:bg-slate-900 h-full p-6">
        <SidebarContent />
      </aside>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <aside
          className={`absolute top-0 left-0 w-72 h-full bg-white dark:bg-slate-900 p-6 shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent />
        </aside>
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header móvil */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-pink-50 dark:border-slate-800">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-pink-500 bg-pink-50 dark:bg-pink-900/20 rounded-xl"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase italic dark:text-white tracking-widest text-pink-500">
              {userData?.businessName || "Aura"}
            </span>
          </div>
          <div className="size-8 rounded-lg overflow-hidden bg-pink-50 border border-pink-100">
            {userData?.logo ? (
              <img src={userData.logo} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Heart size={14} className="text-pink-400" />
              </div>
            )}
          </div>
        </header>

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Decoración sutil de fondo para estética */}
          <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
            <Flower2 size={400} />
          </div>
          <div className="relative z-10 p-4 md:p-0 h-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
