"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CircleDollarSign,
  Settings,
  LogOut,
  Scissors,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Panel Control",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/control-panel",
    },
    {
      name: "Ingresos",
      icon: <CircleDollarSign size={20} />,
      path: "/admin/finance",
    },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1a] border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <h1 className="text-xl flex gap-2 font-black uppercase text-white tracking-tighter">
          Admin <Scissors className="text-blue-500" size={20} />
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
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
        <button className="w-full flex items-center gap-3 px-4 py-4 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500/5 rounded-2xl transition-all">
          <LogOut size={20} /> Salir
        </button>
      </div>
    </aside>
  );
}
