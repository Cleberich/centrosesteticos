import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0a0f1a]">
      {/* El Sidebar en desktop ocupa espacio físico (flex). 
        En mobile es 'fixed', por lo que flota sobre el contenido.
      */}
      <AdminSidebar />

      {/* Contenido Dinámico */}
      <main className="flex-1 w-full">
        {/* Contenedor interno para manejar el padding:
           - pt-20: En celular, bajamos el contenido para que no lo tape la barra del menú (h-16).
           - md:pt-0: En escritorio, no necesitamos bajarlo, el menú está al lado.
           - p-6: Padding general para que el contenido respire.
        */}
        <div className="p-6 pt-24 md:pt-6 md:p-10 h-full">{children}</div>
      </main>
    </div>
  );
}
