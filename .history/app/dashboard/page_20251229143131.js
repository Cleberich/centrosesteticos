"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Clock,
  UserPlus,
  Star,
  MessageSquare,
  BellRing,
  X,
  Search,
  ShieldCheck,
  Loader2,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function DashboardPage() {
  const router = useRouter();

  // --- ESTADOS ---
  const [barberiaData, setBarberiaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- 1. CARGA DE DATOS REALES ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "barberias", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBarberiaData(docSnap.data());
          }
        } catch (error) {
          console.error("Error al cargar datos:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // --- 2. LÓGICA DE AGREGAR CITA RÁPIDA ---
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Estructura compatible con tu agenda unificada
    const newApp = {
      id: Date.now(),
      customer: formData.get("clientName"),
      barber: formData.get("barberName"),
      selectedServiceIds: [], // En dashboard rápido queda vacío o podrías mapear uno
      service: formData.get("service"),
      start: formData.get("time"),
      day: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, // Hoy
      status: "pending",
      duration: 30, // Default
    };

    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      const currentApps = barberiaData?.appointments || [];
      const newList = [...currentApps, newApp];

      await updateDoc(barberiaRef, {
        appointments: newList,
      });

      setBarberiaData((prev) => ({ ...prev, appointments: newList }));
      setIsModalOpen(false);
    } catch (error) {
      alert("Error al guardar la cita.");
    }
  };

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="text-blue-600 animate-spin" size={40} />
      </div>
    );

  // Derivados de datos reales de la BD
  const appointments = barberiaData?.appointments || [];
  const team = barberiaData?.barbers || [];

  // Filtrar solo las que no están cobradas ("pending") para el dashboard
  const activeAppointments = appointments.filter(
    (app) => app.status === "pending"
  );

  const filteredAppointments = activeAppointments
    .filter((app) =>
      (app.customer || app.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.start.localeCompare(b.start));

  return (
    <>
      <header className="flex-none flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl w-full max-w-md border border-transparent focus-within:border-blue-500 transition-all">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            className="bg-transparent border-none outline-none ml-3 text-sm w-full dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all font-bold text-sm ml-4"
        >
          <Plus size={18} /> Nueva Reserva
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Estadísticas Reales extraídas de la BD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Citas Pendientes"
            value={activeAppointments.length.toString()}
            change="En espera"
            icon={<Clock size={16} />}
            color="blue"
          />
          <StatCard
            title="Suscripción"
            value={barberiaData?.plan?.type || "Gratis"}
            change={
              barberiaData?.plan?.status === "active" ? "ACTIVO" : "PENDIENTE"
            }
            icon={<ShieldCheck size={16} />}
            color="emerald"
          />
          <StatCard
            title="Equipo"
            value={team.length.toString()}
            change="Barberos activos"
            icon={<UserPlus size={16} />}
            color="violet"
          />
          <StatCard
            title="Servicios"
            value={barberiaData?.services?.length || "0"}
            change="Configurados"
            icon={<Star size={16} />}
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <BellRing size={16} className="text-blue-600" /> Próximas citas
              </h3>

              <div className="space-y-3">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((app) => (
                    <AppointmentItem
                      key={app.id}
                      time={app.start}
                      name={app.customer || app.name}
                      service={app.service || "Corte General"}
                      barber={app.barber}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500 font-bold">
                      No hay citas para hoy
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                Staff en línea
              </h3>
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                {team.length > 0 ? (
                  team.map((barber, idx) => (
                    <StaffItem
                      key={idx}
                      name={barber.name}
                      status="En turno"
                      color="emerald"
                    />
                  ))
                ) : (
                  <p className="text-xs font-bold text-slate-400 text-center">
                    Configura tu equipo en Ajustes
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Modal Ajustado a tus datos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-black italic uppercase tracking-tight dark:text-white">
                Agendado Rápido
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="dark:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-8 space-y-5">
              <input
                required
                name="clientName"
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
                placeholder="Nombre del Cliente"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="time"
                  type="time"
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
                />
                <select
                  name="barberName"
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
                >
                  {team.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-blue-500/30"
              >
                Agendar Ahora
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// --- SUBCOMPONENTES ---
function StatCard({ title, value, change, icon, color }) {
  const colors = {
    emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
    violet: "text-violet-500 bg-violet-50 dark:bg-violet-500/10",
    amber: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div>
      </div>
      <h4 className="text-3xl font-black italic uppercase dark:text-white tracking-tighter">
        {value}
      </h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
        {change}
      </p>
    </div>
  );
}

function AppointmentItem({ time, name, service, barber }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] hover:border-blue-500 transition-all">
      <div className="bg-slate-900 dark:bg-blue-600 text-white px-3 py-2 rounded-xl min-w-[70px] text-center">
        <span className="text-xs font-black italic">{time}</span>
      </div>
      <div className="flex-1">
        <h5 className="font-black text-sm uppercase italic dark:text-white">
          {name}
        </h5>
        <p className="text-[10px] font-bold text-slate-400 uppercase">
          {service} • <span className="text-blue-500">{barber}</span>
        </p>
      </div>
    </div>
  );
}

function StaffItem({ name, status, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-blue-600">
        {name.charAt(0)}
      </div>
      <div className="flex-1">
        <p className="text-xs font-black uppercase italic dark:text-white">
          {name}
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase">
          {status}
        </p>
      </div>
      <div
        className={`size-2 rounded-full bg-${color}-500 shadow-lg shadow-emerald-500/20`}
      ></div>
    </div>
  );
}
