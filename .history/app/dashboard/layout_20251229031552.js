"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Scissors,
  BarChart3,
  Users,
  Settings,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      name: "Calendario",
      icon: <Calendar size={20} />,
      path: "/dashboard/calendar",
    },
    {
      name: "Servicios",
      icon: <Scissors size={20} />,
      path: "/dashboard/services",
    },
    {
      name: "Contabilidad",
      icon: <BarChart3 size={20} />,
      path: "/dashboard/accounting",
    }, // Nueva ruta
    { name: "Barberos", icon: <Users size={20} />, path: "/dashboard/staff" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0a0f1a]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Scissors size={20} />
            </div>
            <span className="text-xl font-black dark:text-white tracking-tighter italic">
              BARBEROS<span className="text-blue-600">PRO</span>
            </span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Settings size={20} /> Ajustes
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all">
            <LogOut size={20} /> Salir
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
