"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  TrendingUp,
  Clock,
  UserPlus,
  Star,
  MessageSquare,
  BellRing,
  X,
  Search,
  LogOut,
  Scissors,
  ShieldAlert,
  Calendar as CalendarIcon,
} from "lucide-react";

// FIREBASE IMPORTS
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export default function DashboardPage() {
  const router = useRouter();

  // --- ESTADOS DE DATOS REALES ---
  const [user, setUser] = useState(null);
  const [barberiaData, setBarberiaData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE UI ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("hoy");

  // --- 1. EFECTO: VERIFICAR AUTH Y CARGAR FIREBASE ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Traer datos de la barbería desde Firestore
        const docRef = doc(db, "barberias", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBarberiaData(docSnap.data());
        }
        setLoading(false);
      } else {
        router.push("/login"); // Si no está logeado, fuera
      }
    });

    return () => unsubscribe();
  }, [router]);

  // --- 2. LÓGICA DE ACTUALIZACIÓN (Ej: Nueva Reserva) ---
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newApp = {
      id: Date.now(),
      name: formData.get("clientName"),
      service: formData.get("service"),
      time: formData.get("time"),
      status: "pendiente",
      createdAt: new Date().toISOString(),
    };

    try {
      // Guardar en Firestore (en el array de appointments del calendario)
      const barberiaRef = doc(db, "barberias", user.uid);
      await updateDoc(barberiaRef, {
        "calendar.appointments": arrayUnion(newApp),
      });

      // Actualizar estado local para ver el cambio instantáneo
      setBarberiaData((prev) => ({
        ...prev,
        calendar: {
          ...prev.calendar,
          appointments: [...(prev.calendar.appointments || []), newApp],
        },
      }));

      setIsModalOpen(false);
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => router.push("/login"));
  };

  // --- RENDER DE CARGA ---
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filtrar citas basado en búsqueda
  const appointments = barberiaData?.calendar?.appointments || [];
  const filteredAppointments = appointments.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      {/* Sidebar Integrado */}
      <aside className="w-64 flex-none border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Scissors size={18} />
          </div>
          <h2 className="text-lg font-black italic tracking-tighter uppercase dark:text-white">
            {barberiaData?.businessName?.split(" ")[0] || "Barber"}
            <span className="text-blue-600">Manager</span>
          </h2>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">
            Menú Principal
          </p>
          <SidebarLink icon={<Clock size={18} />} label="Dashboard" active />
          <SidebarLink icon={<CalendarIcon size={18} />} label="Calendario" />
          <SidebarLink icon={<UserPlus size={18} />} label="Clientes" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-slate-400">
                Plan {barberiaData?.plan?.type}
              </span>
              <span
                className={`size-2 rounded-full ${
                  barberiaData?.plan?.status === "active"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></span>
            </div>
            <p className="text-xs font-bold truncate">{barberiaData?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 font-bold text-sm w-full px-3 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header con Buscador */}
        <header className="flex-none flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl w-96 border border-transparent focus-within:border-blue-500 transition-all">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="bg-transparent border-none outline-none ml-3 text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all font-bold text-sm"
          >
            <Plus size={18} /> Nueva Reserva
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Stats con Datos de Firebase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Citas Hoy"
              value={appointments.length.toString()}
              change="Actualizado"
              icon={<Clock size={16} />}
              color="blue"
            />
            <StatCard
              title="Personal"
              value={barberiaData?.barbers?.length || "0"}
              change="Activos"
              icon={<UserPlus size={16} />}
              color="violet"
            />
            <StatCard
              title="Estado Plan"
              value={
                barberiaData?.plan?.status === "active" ? "Activo" : "Inactivo"
              }
              change={barberiaData?.plan?.type}
              icon={<ShieldAlert size={16} />}
              color="emerald"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Lista de Citas de Firebase */}
              <section className="space-y-4">
                <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800">
                  <button className="text-sm font-bold pb-2 border-b-2 border-blue-600 text-blue-600">
                    Próximas Citas ({filteredAppointments.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((app) => (
                      <AppointmentItem
                        key={app.id}
                        time={app.time}
                        name={app.name}
                        service={app.service}
                        barber={app.barber || "Sin asignar"}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                      <p className="text-slate-500 text-sm">
                        No hay citas registradas para hoy.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Staff dinámico desde Firebase */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-lg font-bold">Staff en Turno</h3>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
                  {barberiaData?.barbers?.length > 0 ? (
                    barberiaData.barbers.map((b, i) => (
                      <StaffItem
                        key={i}
                        name={b.name}
                        status="Activo"
                        color="emerald"
                      />
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4">
                      No has registrado barberos todavía.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL PARA GUARDAR EN FIREBASE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">Nueva Reserva</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
              <input
                required
                name="clientName"
                placeholder="Nombre del cliente"
                className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="time"
                  type="time"
                  className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl outline-none"
                />
                <select
                  name="service"
                  className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl outline-none"
                >
                  <option>Corte</option>
                  <option>Barba</option>
                  <option>Completo</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl"
              >
                Confirmar en Agenda
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponentes simplificados para el ejemplo
function SidebarLink({ icon, label, active = false }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {icon} {label}
    </div>
  );
}

function StatCard({ title, value, change, icon, color }) {
  const colorMap = {
    emerald: "text-emerald-500 bg-emerald-500/10",
    blue: "text-blue-500 bg-blue-500/10",
    violet: "text-violet-500 bg-violet-500/10",
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between mb-4">
        <span className="text-slate-500 text-xs font-black uppercase tracking-widest">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
      </div>
      <h4 className="text-3xl font-black">{value}</h4>
      <span className="text-[10px] font-bold text-slate-400">{change}</span>
    </div>
  );
}

function AppointmentItem({ time, name, service, barber }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div className="font-black text-blue-600 text-sm">{time}</div>
      <div className="flex-1">
        <p className="font-bold text-sm">{name}</p>
        <p className="text-[10px] text-slate-500 uppercase">{service}</p>
      </div>
      <div className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">
        {barber}
      </div>
    </div>
  );
}

function StaffItem({ name, status, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs uppercase">
        {name.charAt(0)}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold">{name}</p>
        <p
          className={`text-[10px] font-bold ${
            color === "emerald" ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
}
