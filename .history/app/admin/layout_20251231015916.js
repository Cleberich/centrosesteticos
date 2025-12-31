import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
  return (
    // 1. Agregamos 'text-slate-100' para que el texto base sea blanco
    <div className="flex min-h-screen bg-[#0a0f1a] text-slate-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Contenido Principal */}
      <main className="flex-1 w-full flex flex-col relative z-0">
        {/* 2. Ajustamos los paddings:
            - pt-20: En mobile para bajar el contenido y que no lo tape la barra superior.
            - md:pt-10: En desktop lo subimos porque no hay barra superior.
         */}
        <div className="flex-1 p-6 pt-20 md:p-10 md:pt-10 overflow-y-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
