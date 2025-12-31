"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Iconos
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
  ShieldCheck,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

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

  // --- 2. LÓGICA DE AGREGAR CITA ---
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newApp = {
      id: Date.now(),
      name: formData.get("clientName"),
      service: formData.get("service"),
      time: formData.get("time"),
      status: "pendiente",
      img: Math.floor(Math.random() * 50) + 1, // Para el avatar dinámico
    };

    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      await updateDoc(barberiaRef, {
        "calendar.appointments": arrayUnion(newApp),
      });

      // Optimistic update (actualizar UI localmente)
      setBarberiaData((prev) => ({
        ...prev,
        calendar: {
          ...prev.calendar,
          appointments: [...(prev.calendar?.appointments || []), newApp],
        },
      }));
      setIsModalOpen(false);
    } catch (error) {
      alert("Error al guardar la cita.");
    }
  };

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="size-12 bg-blue-600/20 rounded-full flex items-center justify-center">
            <Clock className="text-blue-600 animate-spin" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Cargando Agenda...
          </p>
        </div>
      </div>
    );

  // Derivados de datos
  const appointments = barberiaData?.calendar?.appointments || [];
  const filteredAppointments = appointments
    .filter((app) => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <>
      {/* Header interno */}
      <header className="flex-none flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl w-full max-w-md border border-transparent focus-within:border-blue-500 transition-all">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            className="bg-transparent border-none outline-none ml-3 text-sm w-full"
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

      {/* Contenido Scrolleable */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Estadísticas Reales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Citas de hoy"
            value={appointments.length.toString()}
            change="Agenda abierta"
            icon={<Clock size={16} />}
            color="blue"
          />
          <StatCard
            title="Estado Plan"
            value={
              barberiaData?.plan?.status === "active" ? "ACTIVO" : "INACTIVO"
            }
            change={barberiaData?.plan?.type}
            icon={<ShieldCheck size={16} />}
            color="emerald"
          />
          <StatCard
            title="Personal"
            value={barberiaData?.barbers?.length || "0"}
            change="En plantilla"
            icon={<UserPlus size={16} />}
            color="violet"
          />
          <StatCard
            title="Clientes"
            value={barberiaData?.customers?.length || "0"}
            change="Base de datos"
            icon={<Star size={16} />}
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Lista de Citas Dinámica */}
            <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <BellRing size={16} className="text-blue-600" /> Próximas citas
                hoy
              </h3>

              <div className="space-y-3">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((app) => (
                    <AppointmentItem
                      key={app.id}
                      time={app.time}
                      name={app.name}
                      service={app.service}
                      img={app.img}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500 font-bold">
                      No hay citas registradas
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar de Staff */}
          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                Equipo
              </h3>
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                {barberiaData?.barbers?.length > 0 ? (
                  barberiaData.barbers.map((barber, idx) => (
                    <StaffItem
                      key={idx}
                      name={barber.name}
                      status="Disponible"
                      color="emerald"
                      img={idx + 10}
                    />
                  ))
                ) : (
                  <p className="text-xs font-bold text-slate-400 text-center">
                    Sin barberos asignados
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Modal de Reserva */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-black italic uppercase tracking-tight">
                Nueva Reserva
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Cliente
                </label>
                <input
                  required
                  name="clientName"
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Nombre completo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Hora
                  </label>
                  <input
                    required
                    name="time"
                    type="time"
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Servicio
                  </label>
                  <select
                    name="service"
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold outline-none"
                  >
                    <option>Corte</option>
                    <option>Barba</option>
                    <option>Combo Pro</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-[0.98]"
              >
                Agendar Cita
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// Sub-componentes visuales
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
      <div className="space-y-1">
        <h4 className="text-3xl font-black italic uppercase tracking-tighter">
          {value}
        </h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {change}
        </p>
      </div>
    </div>
  );
}

function AppointmentItem({ time, name, service, img }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] hover:border-blue-500 transition-all shadow-sm">
      <div className="bg-blue-600 text-white px-3 py-2 rounded-xl text-center min-w-[70px]">
        <span className="block text-xs font-black uppercase italic">
          {time}
        </span>
      </div>
      <div className="flex-1">
        <h5 className="font-black text-sm uppercase italic">{name}</h5>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {service}
        </p>
      </div>
      <img
        src={`https://i.pravatar.cc/100?u=${img}`}
        className="size-10 rounded-full grayscale"
        alt="Client"
      />
    </div>
  );
}

function StaffItem({ name, status, color, img }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src={`https://i.pravatar.cc/100?u=${img}`}
          className="size-10 rounded-xl object-cover"
          alt={name}
        />
        <div
          className={`absolute -bottom-1 -right-1 size-3 bg-${color}-500 border-2 border-white dark:border-slate-900 rounded-full`}
        ></div>
      </div>
      <div className="flex-1">
        <p className="text-xs font-black uppercase italic">{name}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase">
          {status}
        </p>
      </div>
      <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
        <MessageSquare size={16} />
      </button>
    </div>
  );
}
