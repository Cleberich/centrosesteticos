"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  CircleDollarSign,
  PieChart,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Panel Control",
      icon: <LayoutDashboard size={18} />,
      path: "/admin/control",
    },
    {
      name: "Ingresos",
      icon: <CircleDollarSign size={18} />,
      path: "/admin/finanzas",
    },
    {
      name: "Rendimiento",
      icon: <PieChart size={18} />,
      path: "/admin/rendimiento",
    },
  ];

  return (
    <>
      {/* BOTÓN HAMBURGUESA Y HEADER MOBILE */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-5 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#e879f9]/20 flex items-center justify-center text-[#c084fc] font-bold text-sm">
            +
          </div>
          <span className="text-base font-bold tracking-tight text-slate-800">
            estetica{" "}
            <span className="text-[#a855f7] text-xs uppercase font-extrabold ml-1">
              Admin
            </span>
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-[#6ee7b7] hover:bg-[#5eead4] text-slate-800 rounded-xl transition-all shadow-xs"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* OVERLAY (Fondo oscuro atenuado en mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR ASIDE */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 
        flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:h-screen
      `}
      >
        <div>
          {/* HEADER DESKTOP */}
          <div className="p-6 hidden md:flex items-center gap-2.5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-[#e879f9]/20 flex items-center justify-center text-[#c084fc] font-bold text-lg">
              +
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-800 block leading-none">
                estetica integral
              </span>
              <span className="text-[10px] font-bold text-[#a855f7] uppercase tracking-wider">
                Panel Admin
              </span>
            </div>
          </div>

          {/* NAVEGACIÓN */}
          <nav className="p-4 space-y-1.5 mt-16 md:mt-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#c084fc] to-[#e879f9] text-white shadow-xs"
                      : "text-slate-500 hover:bg-[#f8fafc] hover:text-slate-800"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* FOOTER SALIR */}
        <div className="p-4 border-t border-slate-100">
          <Link
            href="/login"
            className="w-full flex items-center gap-3 px-4 py-3 text-[#f87171] hover:bg-[#fca5a5]/15 font-bold text-xs rounded-2xl transition-all"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
