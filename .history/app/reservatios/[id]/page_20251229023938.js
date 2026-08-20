import React from "react";
import {
  Scissors,
  Notifications,
  ChevronRight,
  X,
  Calendar,
  Check,
  User,
  Phone,
  Mail,
  Star,
  Award,
  Scissors as CutIcon,
  StickyNote,
  CreditCard,
  CheckCircle2,
  Clock,
} from "lucide-react";

// Componentes pequeños para organizar el código
const Badge = ({ children, status }) => {
  const styles = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}
    >
      {status === "pending" && (
        <span className="size-2 rounded-full bg-yellow-500 animate-pulse" />
      )}
      {children}
    </span>
  );
};

export default function ReservationDetail() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] text-[#111827] dark:text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e7ebf3] dark:border-slate-800 bg-white dark:bg-[#101622] px-6 py-3 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="size-8 flex items-center justify-center text-blue-600">
            <Scissors className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">BarberManager</h2>
        </div>
        <nav className="hidden lg:flex items-center gap-8">
          {[
            "Dashboard",
            "Reservas",
            "Clientes",
            "Finanzas",
            "Configuración",
          ].map((item) => (
            <a
              key={item}
              href="#"
              className={`text-sm font-medium transition-colors ${
                item === "Reservas"
                  ? "text-blue-600 font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-blue-600"
              }`}
            >
              {item}
            </a>
          ))}
          <div className="flex items-center gap-4 ml-4">
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
              <Notifications className="w-5 h-5" />
            </button>
            <div className="size-10 rounded-full border border-slate-200 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCid2qfibK-KUxjRMpc-RKIvAo9Q6piqZeWHOqBN8LUy9NhWE-2TdWbFqzq5pqop1r-Wln_8n1sUWW_E9jNlu3lTjBUoZw4gF_KSLyNewf82wqfzez63oV32gZ_DimIK1rWFnsU93lSVNMjWYcYUXXiRK4MNsJfZvf0ayjbqlHYbMC5yflW25PZi9XS2YSuYC-mMpAbYthBG7yoopSVEc0eukSDHzQ7Lnibp2O1jUqM8NPYEGdFyt9QTdNe50hoH5UPu51tYs88VxQR')] bg-cover" />
          </div>
        </nav>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 md:px-10 py-8 space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 dark:text-slate-400">Inicio</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400">Reservas</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="font-medium">Detalle #4092</span>
        </div>

        {/* Heading Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-[#1e2736] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Reserva #4092
              </h1>
              <Badge status="pending">Pendiente</Badge>
            </div>
            <p className="text-slate-500 text-sm">
              Creada el 10 Oct, 2023 a las 14:20
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-sm rounded-lg transition-colors">
              <X className="w-4 h-4" /> Cancelar
            </button>
            <button className="flex items-center gap-2 px-4 h-10 border border-slate-300 dark:border-slate-600 font-bold text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Calendar className="w-4 h-4" /> Reagendar
            </button>
            <button className="flex items-center gap-2 px-6 h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-md font-bold text-sm rounded-lg transition-all active:scale-95">
              <Check className="w-4 h-4" /> Confirmar Cita
            </button>
          </div>
        </div>

        {/* Client Info Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Información del Cliente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ClientCard
              title="Cliente"
              name="Carlos Rodríguez"
              sub="Cliente frecuente"
              icon={<User />}
            />
            <ClientCard
              title="Contacto"
              name="+34 600 123 456"
              sub="carlos.rodriguez@email.com"
              icon={<Phone />}
              isContact
            />
            <ClientCard
              title="Membresía"
              name="Plan Premium"
              sub="Miembro desde 2022"
              icon={<Award />}
              isPremium
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Details */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CutIcon className="w-5 h-5 text-blue-600" /> Detalles del
              Servicio
            </h2>
            <div className="flex flex-col md:flex-row bg-white dark:bg-[#1e2736] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="md:w-48 h-48 md:h-auto bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDcBh7v49efRctewRCu9ubYQfJ7b4AoJ_8JZtaGCxJYBnD_LuOGVC6bthhR4lVFBJmEbA5BCwCsDUHsCqGylDkvNiibnLMGV6FELNI3_WkNAk4aW6xXbs16ZJRi_ybZVDEhjf-RnxZcLCvDXRzezcxyJB79RoJb89sHX_UhavE_gyEXUPL3udL7hdQJAXwayFtAoX6nwnhHHRdvK64-V-z9EMq1yDTPaYRcYfvn6udpjLb4RmnGSC7m18Ayomih7nq06MwByouJsxwD')] bg-cover shrink-0" />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">
                      Servicio Principal
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-bold text-slate-600 dark:text-slate-300">
                      45 min
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Corte de Cabello y Afeitado
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Incluye lavado, masaje capilar, corte con tijera, perfilado
                    con toalla caliente y aftershave premium.
                  </p>
                </div>
                <div className="flex gap-8 border-t dark:border-slate-700 pt-4 mt-6">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                      Precio
                    </p>
                    <p className="text-xl font-bold">25.00€</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                      Extras
                    </p>
                    <p className="text-sm font-medium">Ninguno</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e2736] p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-slate-400" /> Notas del
                Cliente
              </h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300 text-sm italic">
                  "Por favor, usar productos para piel sensible si es posible.
                  Tengo prisa, necesito terminar antes de las 16:30."
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar: Timing */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Cita
            </h2>
            <div className="bg-white dark:bg-[#1e2736] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="bg-blue-600/5 p-6 border-b border-blue-600/10 text-blue-600">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="font-bold uppercase text-[10px] tracking-widest">
                    Fecha y Hora
                  </span>
                </div>
                <p className="text-2xl font-black">Jueves, 12 Oct</p>
                <p className="text-xl font-medium opacity-80">15:30 - 16:15</p>
              </div>
              <div className="p-6">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-4">
                  Profesional Asignado
                </p>
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-full border-2 border-white shadow-sm bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCuvIytLAf85ING8ztXT8oezTSMgPx0fcR9R5Wx8nS6yKlLVx3wbHPQjuPV74LuY5g1rNZFx40nZxGYDA04i_lWXuG_UC-uVlkMC-5gjP1NE1S6DvTJQeJTf--TnAdgu7_3GjTua2f550ENwZ2XZ6rkmstGD7H-5yYwhnvc1fhWPctyRSGcbAfuEPCYgwDoWyZvW57xx6CL-eEHlUtUxJbF3RYMF0uSFz4bPIdl9bLA_3UTQRc94wVosr1QPiVVxfA0wqA8idd4fqik')] bg-cover" />
                  <div>
                    <p className="font-bold">Juan Pérez</p>
                    <p className="text-xs text-slate-500">Master Barber</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-bold">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-700 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>20.66€</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>IVA (21%)</span>
                  <span>4.34€</span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-black text-blue-600">
                    25.00€
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded border dark:border-slate-600">
                  <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Pago en local
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    Pendiente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <section className="mt-8 border-t dark:border-slate-800 pt-8">
          <h3 className="text-lg font-bold mb-4">
            Historial Reciente del Cliente
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-bold">Fecha</th>
                  <th className="px-6 py-3 font-bold">Servicio</th>
                  <th className="px-6 py-3 font-bold">Barbero</th>
                  <th className="px-6 py-3 font-bold">Precio</th>
                  <th className="px-6 py-3 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-[#1e2736]">
                <TableRow
                  date="15 Sept, 2023"
                  service="Corte Clásico"
                  barber="Juan Pérez"
                  price="18.00€"
                />
                <TableRow
                  date="20 Ago, 2023"
                  service="Afeitado Completo"
                  barber="Carlos M."
                  price="15.00€"
                />
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

// Sub-componentes internos para limpieza visual
function ClientCard({ title, name, sub, icon, isContact, isPremium }) {
  return (
    <div className="p-5 bg-white dark:bg-[#1e2736] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`size-10 rounded-full flex items-center justify-center ${
            isPremium
              ? "bg-yellow-100 text-yellow-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {React.cloneElement(icon, { size: 20 })}
        </div>
        {!isPremium && !isContact && (
          <button className="text-blue-600 text-xs font-bold hover:underline">
            Ver Perfil
          </button>
        )}
      </div>
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
        {title}
      </p>
      <p className="font-bold text-lg leading-tight">{name}</p>
      <p className="text-slate-500 text-sm">{sub}</p>
    </div>
  );
}

function TableRow({ date, service, barber, price }) {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-6 py-4 font-bold">{date}</td>
      <td className="px-6 py-4">{service}</td>
      <td className="px-6 py-4">{barber}</td>
      <td className="px-6 py-4">{price}</td>
      <td className="px-6 py-4">
        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 px-3 py-1 rounded-full text-xs font-bold">
          Completada
        </span>
      </td>
    </tr>
  );
}
