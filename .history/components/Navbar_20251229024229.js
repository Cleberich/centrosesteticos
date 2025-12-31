"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scissors,
  Calendar,
  User,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  Bell,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Definición de las rutas
  const navLinks = [
    { name: "Dashboard", href: "#", icon: LayoutDashboard },
    { name: "Calendario", href: "/calendar", icon: Calendar },
    { name: "Clientes", href: "/reservations/4092", icon: User }, // Ejemplo de link a detalle
    { name: "Configuración", href: "#", icon: Settings },
  ];

  const isActive = (path) => pathname === path;

  return (
    <header className="fixed top-0 w-full z-[100] bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Scissors size={18} />
          </div>
          <h2 className="text-lg font-black italic tracking-tighter uppercase dark:text-white">
            Barber<span className="text-blue-600">Manager</span>
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                isActive(link.href)
                  ? "bg-blue-600/10 text-blue-600"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <link.icon size={16} />
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Acciones Derecha */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <Bell size={20} />
          </button>

          <Link
            href="/login"
            className="hidden sm:block size-9 rounded-full border-2 border-white dark:border-slate-700 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCid2qfibK-KUxjRMpc-RKIvAo9Q6piqZeWHOqBN8LUy9NhWE-2TdWbFqzq5pqop1r-Wln_8n1sUWW_E9jNlu3lTjBUoZw4gF_KSLyNewf82wqfzez63oV32gZ_DimIK1rWFnsU93lSVNMjWYcYUXXiRK4MNsJfZvf0ayjbqlHYbMC5yflW25PZi9XS2YSuYC-mMpAbYthBG7yoopSVEc0eukSDHzQ7Lnibp2O1jUqM8NPYEGdFyt9QTdNe50hoH5UPu51tYs88VxQR')] bg-cover shadow-sm hover:ring-2 hover:ring-blue-600/20 transition-all"
          />

          {/* Botón Móvil */}
          <button
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-[#101622] border-b border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-black uppercase tracking-widest text-sm ${
                isActive(link.href)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50"
              }`}
            >
              <link.icon size={20} />
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
          <Link
            href="/login"
            className="flex items-center gap-4 p-4 text-slate-500 font-black uppercase text-sm"
          >
            <div className="size-8 rounded-full bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCid2qfibK-KUxjRMpc-RKIvAo9Q6piqZeWHOqBN8LUy9NhWE-2TdWbFqzq5pqop1r-Wln_8n1sUWW_E9jNlu3lTjBUoZw4gF_KSLyNewf82wqfzez63oV32gZ_DimIK1rWFnsU93lSVNMjWYcYUXXiRK4MNsJfZvf0ayjbqlHYbMC5yflW25PZi9XS2YSuYC-mMpAbYthBG7yoopSVEc0eukSDHzQ7Lnibp2O1jUqM8NPYEGdFyt9QTdNe50hoH5UPu51tYs88VxQR')] bg-cover" />
            Cerrar Sesión
          </Link>
        </div>
      )}
    </header>
  );
}
