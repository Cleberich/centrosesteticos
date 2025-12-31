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
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // 1. CARGA INICIAL DESDE FIREBASE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "barberias", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);

            // Verificamos preferencia en BD
            const isDark = data.themePreference === "dark";

            // Sincronizamos estado y DOM
            setDarkMode(isDark);
            if (isDark) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          }
        } catch (error) {
          console.error("Error cargando perfil:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 2. FUNCIÓN DE CAMBIO (TOGGLE)
  const toggleDarkMode = async () => {
    if (!auth.currentUser) return;

    const newMode = !darkMode;
    const themeString = newMode ? "dark" : "light";

    // A. Cambio Visual Inmediato (React State)
    setDarkMode(newMode);

    // B. Cambio Físico en el HTML (DOM)
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // C. Guardar en Firebase (Persistencia)
    try {
      const docRef = doc(db, "barberias", auth.currentUser.uid);
      await updateDoc(docRef, {
        themePreference: themeString,
      });
    } catch (error) {
      console.error("No se pudo guardar la preferencia:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Renderizado del SidebarLink... (Igual que antes)
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
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-500">
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full p-6">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <div className="size-12 rounded-full border-2 border-blue-600 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {loading ? (
                  <Loader2 className="animate-spin text-blue-600" size={18} />
                ) : userData?.logo ? (
                  <img
                    src={userData.logo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-black text-blue-600 italic">
                    B
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-black truncate uppercase dark:text-white">
                  {userData?.businessName || "Barbería"}
                </h1>
                <BadgeCheck size={12} className="text-blue-600 inline mr-1" />
                <span className="text-[9px] font-black text-blue-600 uppercase">
                  Plan Basic
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              <SidebarLink
                href="/dashboard"
                icon={<LayoutDashboard size={20} />}
                label="Panel"
              />
              <SidebarLink
                href="/dashboard/calendar"
                icon={<Calendar size={20} />}
                label="Agenda"
              />
              <SidebarLink
                href="/dashboard/barberos"
                icon={<UserCircle size={20} />}
                label="Equipo"
              />
              {/* Otros links... */}
            </nav>
          </div>

          <div className="space-y-1 pt-6 border-t border-slate-100 dark:border-slate-800">
            {/* BOTÓN TOGGLE QUE REALMENTE CAMBIA */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 mb-2 transition-all"
            >
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Sun size={20} className="text-amber-500" />
                ) : (
                  <Moon size={20} />
                )}
                <span className="font-bold text-sm dark:text-slate-200">
                  {darkMode ? "Modo Claro" : "Modo Oscuro"}
                </span>
              </div>
              <div
                className={`w-10 h-5 rounded-full p-1 transition-colors ${
                  darkMode ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`size-3 rounded-full bg-white transition-all transform ${
                    darkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </button>

            <SidebarLink
              href="/dashboard/settings"
              icon={<Settings size={20} />}
              label="Ajustes"
            />
            <SidebarLink
              href="#"
              icon={<LogOut size={20} />}
              label="Salir"
              variant="danger"
              onClick={handleLogout}
            />
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950">
        {children}
      </main>
    </div>
  );
}
