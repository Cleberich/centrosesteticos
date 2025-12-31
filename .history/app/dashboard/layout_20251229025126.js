"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Settings,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // Componente interno para los links del sidebar
  const SidebarLink = ({ href, icon, label, variant = "default" }) => {
    const active = pathname === href;
    const styles = active
      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200";

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm ${styles} ${
          variant === "danger"
            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            : ""
        }`}
      >
        {icon}
        <span className="font-bold tracking-tight">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* SIDEBAR PERSISTENTE */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full p-6 shrink-0">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-8">
            {/* Logo Section */}
            <div className="flex items-center gap-3 px-2">
              <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Scissors size={20} />
              </div>
              <div>
                <h1 className="text-base font-black italic uppercase tracking-tighter dark:text-white">
                  Barber<span className="text-blue-600">Elite</span>
                </h1>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full uppercase">
                  Plan Pro
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
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
              <SidebarLink
                href="/dashboard/clientes"
                icon={<Users size={20} />}
                label="Clientes"
              />
              <SidebarLink
                href="/dashboard/servicios"
                icon={<Scissors size={20} />}
                label="Servicios"
              />
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-1 pt-6 border-t border-slate-100 dark:border-slate-800">
            <SidebarLink
              href="/dashboard/settings"
              icon={<Settings size={20} />}
              label="Configuración"
            />
            <SidebarLink
              href="/login"
              icon={<LogOut size={20} />}
              label="Cerrar Sesión"
              variant="danger"
            />
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO (Aquí se renderiza el Dashboard o el Calendario) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
