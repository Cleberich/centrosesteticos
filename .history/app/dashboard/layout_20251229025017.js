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

  const SidebarLink = ({ href, icon, label, variant = "default" }) => {
    const active = pathname === href;
    const styles = active
      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200";

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm ${styles} ${
          variant === "danger" ? "text-red-500" : ""
        }`}
      >
        {icon} <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* SIDEBAR GLOBAL */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full p-6">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Scissors size={20} />
              </div>
              <div>
                <h1 className="text-base font-black italic uppercase tracking-tighter dark:text-white">
                  Elite<span className="text-blue-600">Cut</span>
                </h1>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full uppercase">
                  Plan Pro
                </span>
              </div>
            </div>
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

      {/* CONTENIDO VARIABLE (Dashboard o Calendario) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
