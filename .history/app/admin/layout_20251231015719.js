"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CircleDollarSign,
  Scissors,
  DonutIcon,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Funciones para abrir/cerrar
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const menuItems = [
    {
      name: "Panel Control",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/control",
    },
    {
      name: "Ingresos",
      icon: <CircleDollarSign size={20} />,
      path: "/admin/finanzas",
    },
    {
      name: "Rendimiento",
      icon: <DonutIcon size={20} />,
      path: "/admin/rendimiento",
    },
  ];

  return (
    <>
      {/* =======================================================
          1. BARRA SUPERIOR MOBILE (Solo visible en md:hidden)
          ======================================================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0f1a] border-b border-white/5 flex items-center justify-between px-6 z-40">
        <h1 className="text-lg flex gap-2 font-black uppercase text-white tracking-tighter">
          Admin <Scissors className="text-blue-500" size={18} />
        </h1>
        <button onClick={toggleMenu} className="text-white p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* =======================================================
          2. OVERLAY OSCURO (Fondo negro al abrir en mobile)
          ======================================================= */}
      {isOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* =======================================================
          3. SIDEBAR PRINCIPAL
          - En Mobile: fixed (flotante), oculto a la izquierda (-translate-x-full)
          - En Desktop: sticky (fijo en columna), siempre visible (translate-x-0)
          ======================================================= */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0f1a] border-r border-white/5 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:h-screen md:top-0
        `}
      >
        <div className="p-8 hidden md:block">
          <h1 className="text-xl flex gap-2 font-black uppercase text-white tracking-tighter">
            Admin <Scissors className="text-blue-500" size={20} />
          </h1>
        </div>

        {/* Espacio extra en mobile para que el menú no quede tapado por la X */}
        <div className="md:hidden h-20 flex items-center px-8 text-white/50 text-xs font-bold uppercase tracking-widest">
          Menú de navegación
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link
            href="/login"
            className="w-full flex items-center gap-3 px-4 py-4 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500/5 rounded-2xl transition-all"
          >
            <LogOut size={20} /> Salir
          </Link>
        </div>
      </aside>
    </>
  );
}
