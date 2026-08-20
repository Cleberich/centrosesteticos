import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0a0f1a] text-white">
      {/* El Sidebar se encarga de su propia visibilidad responsive */}
      <AdminSidebar />

      {/* Contenido Dinámico */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-0 md:p-8 pt-20 md:pt-8">
          {/* pt-20 en mobile para no quedar detrás del botón hamburguesa */}
          {children}
        </div>
      </main>
    </div>
  );
}
