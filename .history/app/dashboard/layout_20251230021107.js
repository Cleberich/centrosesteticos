"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCircle,
  Scissors,
  Settings,
  LogOut,
  BarChart3,
  Loader2,
  BadgeCheck,
  Moon,
  Sun,
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

  // 1. Iniciamos el estado basado en localStorage si existe
  const [darkMode, setDarkMode] = useState(false);

  // --- EFECTO DE CARGA INICIAL (TEMA) ---
  useEffect(() => {
    // Verificamos el tema guardado
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // --- FUNCIÓN PARA CAMBIAR EL ESTADO Y GUARDAR ---
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // --- CARGA DE FIREBASE ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "barberias", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error("Error:", error);
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

  // Helper para los links
  const SidebarLink = ({ href, icon, label, variant = "default", onClick }) => {
    const active = pathname === href;
    const styles = active
      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200";

    const content = (
      <div
        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm cursor-pointer ${styles} ${
          variant === "danger"
            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            : ""
        }`}
      >
        {icon}
        <span className="font-bold tracking-tight">{label}</span>
      </div>
    );
    if (onClick) return <div onClick={onClick}>{content}</div>;
    return <Link href={href}>{content}</Link>;
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full p-6">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-8">
            {/* LOGO SECCIÓN */}
            <div className="flex items-center gap-3 px-2">
              <div className="size-12 rounded-full border-2 border-blue-600 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                {loading ? (
                  <Loader2 className="animate-spin text-blue-600" size={18} />
                ) : userData?.logo ? (
                  <img
                    src={userData.logo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-black text-blue-600 italic">
                    {userData?.businessName?.charAt(0) || "B"}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-black truncate uppercase italic dark:text-white">
                  {userData?.businessName || "Barbería"}
                </h1>
                <div className="flex items-center gap-1">
                  <BadgeCheck size={12} className="text-blue-600" />
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                    Plan {userData?.plan?.type || "Basic"}
                  </span>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 tracking-[0.2em]">
                Navegación
              </p>
              <SidebarLink
                href="/dashboard"
                icon={<LayoutDashboard size={20} />}
                label="Panel de Control"
              />
              <SidebarLink
                href="/dashboard/calendar"
                icon={<Calendar size={20} />}
                label="Calendario"
              />
              <p className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 mt-6 tracking-[0.2em]">
                Administración
              </p>
              <SidebarLink
                href="/dashboard/barberos"
                icon={<UserCircle size={20} />}
                label="Mi Equipo"
              />
              <SidebarLink
                href="/dashboard/clientes"
                icon={<Users size={20} />}
                label="Clientes"
              />
              <SidebarLink
                href="/dashboard/services"
                icon={<Scissors size={20} />}
                label="Servicios"
              />
              <SidebarLink
                href="/dashboard/accounting"
                icon={<BarChart3 size={20} />}
                label="Contabilidad"
              />
            </nav>
          </div>

          <div className="space-y-1 pt-6 border-t border-slate-100 dark:border-slate-800">
            {/* --- BOTÓN DE MODO OSCURO MEJORADO --- */}

            <SidebarLink
              href="/dashboard/settings"
              icon={<Settings size={20} />}
              label="Configuración"
            />
            <SidebarLink
              href="#"
              icon={<LogOut size={20} />}
              label="Cerrar Sesión"
              variant="danger"
              onClick={handleLogout}
            />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
