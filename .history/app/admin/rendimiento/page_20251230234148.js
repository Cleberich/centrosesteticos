"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Store,
  CalendarCheck,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  MousePointer2,
  Activity,
} from "lucide-react";
import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminRendimientoPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBarberias: 0,
    totalBarberos: 0,
    totalCitasMes: 0,
    totalCitasHistoricas: 0,
    crecimientoBarberias: 0,
  });

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "barberias"));
        let barberiasCount = 0;
        let barberosCount = 0;
        let citasMensuales = 0;
        let citasTotales = 0;

        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const anioActual = hoy.getFullYear();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          barberiasCount++;

          // Contar barberos de cada barbería
          if (data.barbers) barberosCount += data.barbers.length;

          // Analizar citas
          if (data.appointments) {
            data.appointments.forEach((app) => {
              citasTotales++;
              const fechaApp = new Date(app.date || app.paidAt);
              if (
                fechaApp.getMonth() === mesActual &&
                fechaApp.getFullYear() === anioActual
              ) {
                citasMensuales++;
              }
            });
          }
        });

        setStats({
          totalBarberias: barberiasCount,
          totalBarberos: barberosCount,
          totalCitasMes: citasMensuales,
          totalCitasHistoricas: citasTotales,
        });
      } catch (error) {
        console.error("Error cargando stats globales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalStats();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Rendimiento <span className="text-blue-600">Global</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">
              Estadísticas reales de la plataforma AgendaBarber
            </p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-2xl flex items-center gap-3">
            <Activity className="text-blue-500 animate-pulse" size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Sistema Online
            </span>
          </div>
        </header>

        {/* GRILLA DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Barberías"
            value={stats.totalBarberias}
            icon={<Store size={20} />}
            color="blue"
            desc="Registradas"
          />
          <StatCard
            title="Barberos"
            value={stats.totalBarberos}
            icon={<Users size={20} />}
            color="purple"
            desc="Usuarios activos"
          />
          <StatCard
            title="Citas Mes"
            value={stats.totalCitasMes}
            icon={<CalendarCheck size={20} />}
            color="emerald"
            desc="Diciembre 2025"
          />
          <StatCard
            title="Visitas Web"
            value="Ver en Vercel"
            icon={<MousePointer2 size={20} />}
            color="orange"
            desc="Tráfico Landing"
            isExternal
          />
        </div>

        {/* SECCIÓN DETALLE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-lg font-black uppercase italic mb-6">
              Crecimiento de Reservas
            </h3>
            <div className="h-64 flex items-end gap-2">
              {/* Esto es una representación visual simple del volumen */}
              {[30, 45, 25, 60, 75, 50, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-600/20 rounded-t-xl hover:bg-blue-600 transition-all relative group"
                >
                  <div
                    style={{ height: `${h}%` }}
                    className="bg-blue-600 rounded-t-xl w-full"
                  />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    +{h}%
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">
              <span>Jun</span>
              <span>Jul</span>
              <span>Ago</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dic</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl shadow-blue-500/20">
            <div>
              <TrendingUp size={40} className="mb-6" />
              <h3 className="text-2xl font-black uppercase leading-tight">
                Total de Citas <br />
                Gestionadas
              </h3>
              <p className="text-5xl font-black mt-4 tracking-tighter italic">
                {stats.totalCitasHistoricas.toLocaleString()}
              </p>
            </div>
            <p className="text-[10px] font-bold uppercase opacity-60 tracking-[0.2em] mt-8">
              AgendaBarber Ecosystem
            </p>
          </div>
        </div>

        {/* ACCESO A VERCEL */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-black rounded-xl flex items-center justify-center border border-white/10">
              <svg width="20" height="20" viewBox="0 0 76 65" fill="white">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest">
                Analítica de Visitas en Tiempo Real
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                Accede al panel de Vercel para ver procedencia y dispositivos
              </p>
            </div>
          </div>
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Abrir Vercel
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, desc, isExternal }) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    orange: "text-orange-500 bg-orange-500/10",
  };

  return (
    <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] hover:border-white/10 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</div>
        <ArrowUpRight
          size={18}
          className="text-slate-700 group-hover:text-white transition-colors"
        />
      </div>
      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
        {title}
      </p>
      <h2 className="text-3xl font-black mt-2 tracking-tighter italic">
        {value}
      </h2>
      <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">
        {desc}
      </p>
    </div>
  );
}
