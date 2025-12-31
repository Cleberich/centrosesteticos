import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0a0f1a]">
      {/* Sidebar Fijo */}
      <AdminSidebar />

      {/* Contenido Dinámico */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
