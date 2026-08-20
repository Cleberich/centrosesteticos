"use client";

import React from "react";
import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-[#334155] font-sans antialiased">
      {/* Sidebar de administración */}
      <AdminSidebar />

      {/* Contenido Dinámico */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
          {/* pt-20 en móvil para evitar superposición con el botón hamburguesa */}
          {children}
        </div>
      </main>
    </div>
  );
}
