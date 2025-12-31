"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CircleDollarSign,
  Settings,
  LogOut,
  Scissors,
  DonutIcon,
  Menu, // Icono hamburguesa
  X, // Icono cerrar
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
      {/* --- MOBILE HEADER (Solo visible en celular) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0f1a] border-b border-white/5 flex items-center justify-between px-6 z-40">
        <h1 className="text-lg flex gap-2 font-black uppercase text-white tracking-tighter">
          Admin <Scissors className="text-blue-500" size={18} />
        </h1>
        <button
          onClick={toggleMenu}
          className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- OVERLAY (Fondo oscuro al abrir menú en mobile) --- */}
      {isOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen w-64 bg-[#0a0f1a] border-r border-white/5 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
          /* En mobile es fixed full height, en desktop es sticky */
        `}
      >
        <div className="p-8 flex justify-between items-center">
          <h1 className="text-xl flex gap-2 font-black uppercase text-white tracking-tighter">
            Admin <Scissors className="text-blue-500" size={20} />
          </h1>
          {/* Botón cerrar extra dentro del sidebar para mobile */}
          <button onClick={closeMenu} className="md:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeMenu} // Cierra el menú al hacer clic en un link
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
          <a
            href="/login"
            className="w-full flex items-center gap-3 px-4 py-4 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500/5 rounded-2xl transition-all"
          >
            <LogOut size={20} /> Salir
          </a>
        </div>
      </aside>
    </>
  );
}
