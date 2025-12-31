"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Clock,
  UserPlus,
  Star,
  BellRing,
  X,
  Search,
  ShieldCheck,
  Loader2,
  Phone,
  MessageSquare,
  Trash2, // Nuevo icono para eliminar
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

  // --- 1. CARGA DE DATOS ---
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
    const name = formData.get("clientName");
    const phone = formData.get("clientPhone");
    const time = formData.get("time");

    const newApp = {
      id: Date.now(),
      customer: name,
      phone: phone,
      email: formData.get("clientEmail"),
      barber: formData.get("barberName"),
      selectedServiceIds: [],
      service: "Servicio Rápido",
      start: time,
      day: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
      status: "pending",
      duration: 30,
    };

    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      const currentApps = barberiaData?.appointments || [];
      const newList = [...currentApps, newApp];

      await updateDoc(barberiaRef, { appointments: newList });
      setBarberiaData((prev) => ({ ...prev, appointments: newList }));
      setIsModalOpen(false);

      if (phone) {
        const cleanPhone = phone.replace(/\D/g, "");
        const msg = encodeURIComponent(
          `Hola ${name}, confirmamos tu turno para hoy a las ${time}. ¡Te esperamos!`
        );
        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
      }
    } catch (error) {
      alert("Error al guardar la cita.");
    }
  };

  // --- 3. LÓGICA DE ELIMINAR CITA ---
  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta reserva?"))
      return;

    try {
      const barberiaRef = doc(db, "barberias", auth.currentUser.uid);
      const currentApps = barberiaData?.appointments || [];
      const newList = currentApps.filter((app) => app.id !== appointmentId);

      await updateDoc(barberiaRef, { appointments: newList });
      setBarberiaData((prev) => ({ ...prev, appointments: newList }));
    } catch (error) {
      alert("Error al eliminar la reserva.");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="text-blue-600 animate-spin" size={40} />
      </div>
    );

  const appointments = barberiaData?.appointments || [];
  const team = barberiaData?.barbers || [];
  const activeAppointments = appointments.filter(
    (app) => app.status === "pending"
  );

  const filteredAppointments = activeAppointments
    .filter((app) =>
      (app.customer || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      <header className="flex-none flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl w-full max-w-md border border-transparent focus-within:border-blue-500 transition-all">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="bg-transparent border-none outline-none ml-3 text-sm w-full dark:text-white font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-all font-black text-xs uppercase tracking-widest ml-4"
        >
          <Plus size={18} /> Nueva Reserva
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Pendientes"
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
            title="Staff"
            value={team.length.toString()}
            change="Barberos"
            icon={<UserPlus size={16} />}
            color="violet"
          />
          <StatCard
            title="Servicios"
            value={barberiaData?.services?.length || "0"}
            change="Activos"
            icon={<Star size={16} />}
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 ml-2">
              <BellRing size={14} className="text-blue-600" /> Próximas citas de
              hoy
            </h3>

            <div className="grid gap-3">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => (
                  <AppointmentItem
                    key={app.id}
                    app={app}
                    onDelete={() => handleDeleteAppointment(app.id)}
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 font-bold text-sm">
                    No hay citas programadas
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
              Staff en línea
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              {team.length > 0 ? (
                team.map((barber, idx) => (
                  <StaffItem
                    key={idx}
                    name={barber.name}
                    imageUrl={barber.imageUrl}
                    status={barber.active ? "En turno" : "Fuera"}
                  />
                ))
              ) : (
                <p className="text-[10px] font-bold text-slate-400 text-center py-4">
                  Sin personal configurado
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-black uppercase tracking-tight dark:text-white">
                Agendado Rápido
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full dark:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-8 space-y-4">
              <input
                required
                name="clientName"
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white"
                placeholder="Nombre del Cliente"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  name="clientPhone"
                  type="tel"
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white text-sm"
                  placeholder="Teléfono"
                />
                <input
                  name="clientEmail"
                  type="email"
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 font-bold dark:text-white text-sm"
                  placeholder="Email (Opcional)"
                />
              </div>
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
                className="w-full bg-blue-600 text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all mt-4 tracking-widest text-xs"
              >
                Confirmar y Avisar WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div>
      </div>
      <h4 className="text-3xl font-black uppercase dark:text-white tracking-tighter">
        {value}
      </h4>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
        {change}
      </p>
    </div>
  );
}

function AppointmentItem({ app, onDelete }) {
  const { time, customer, phone, service, barber } = app;
  const cleanPhone = phone ? phone.replace(/\D/g, "") : "";
  const wsMessage = encodeURIComponent(
    `Hola ${customer}, confirmamos tu turno a las ${app.start}. ¡Te esperamos!`
  );

  return (
    <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.8rem] hover:border-blue-500 transition-all shadow-sm">
      <div className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-3 rounded-2xl min-w-[80px] text-center shadow-inner">
        <span className="text-xs font-black">{app.start}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h5 className="font-black text-sm uppercase dark:text-white leading-none truncate">
            {customer}
          </h5>
          {phone && (
            <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-lg whitespace-nowrap">
              {phone}
            </span>
          )}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 truncate">
          {service || "Corte"} con •{" "}
          <span className="text-blue-500">{barber}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        {phone && (
          <>
            <a
              href={`tel:${cleanPhone}`}
              className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
            >
              <Phone size={16} strokeWidth={3} />
            </a>
            <a
              href={`https://wa.me/${cleanPhone}?text=${wsMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
            >
              <MessageSquare size={16} strokeWidth={3} />
            </a>
          </>
        )}
        {/* BOTÓN ELIMINAR RESERVA */}
        <button
          onClick={onDelete}
          className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
        >
          <Trash2 size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function StaffItem({ name, status, imageUrl }) {
  return (
    <div className="flex items-center gap-3 p-2">
      <div className="size-10 rounded-2xl overflow-hidden bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-black text-blue-600 uppercase text-xs">
            {name.charAt(0)}
          </span>
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs font-black uppercase dark:text-white leading-tight">
          {name}
        </p>
        <p
          className={`text-[8px] font-black uppercase tracking-tighter ${
            status === "En turno" ? "text-emerald-500" : "text-slate-400"
          }`}
        >
          {status}
        </p>
      </div>
      {status === "En turno" && (
        <div className="size-2 rounded-full bg-emerald-500 shadow-lg animate-pulse"></div>
      )}
    </div>
  );
}
