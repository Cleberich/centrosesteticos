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
  Sparkles,
  Scissors,
  PieChart,
} from "lucide-react";
import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminRendimientoPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNegocios: 0,
    totalBarberias: 0,
    totalEsteticas: 0,
    totalProfesionales: 0,
    totalCitasMes: 0,
    totalCitasHistoricas: 0,
  });

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        // CARGA PARALELA DE AMBAS COLECCIONES
        const [barberiaSnap, esteticaSnap] = await Promise.all([
          getDocs(collection(db, "barberias")),
          getDocs(collection(db, "centros_estetica")),
        ]);

        let barberiasCount = barberiaSnap.size;
        let esteticasCount = esteticaSnap.size;
        let profesionalesCount = 0;
        let citasMensuales = 0;
        let citasTotales = 0;

        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const anioActual = hoy.getFullYear();

        const processCollection = (snapshot, isBarberia) => {
          snapshot.forEach((doc) => {
            const data = doc.data();

            // Sumar profesionales (barberos o especialistas)
            const staff = isBarberia ? data.barbers : data.specialists;
            if (staff) profesionalesCount += staff.length;

            // Analizar citas
            if (data.appointments) {
              data.appointments.forEach((app) => {
                citasTotales++;
                const fechaApp = new Date(app.date || app.paidAt || app.start);
                if (
                  fechaApp.getMonth() === mesActual &&
                  fechaApp.getFullYear() === anioActual
                ) {
                  citasMensuales++;
                }
              });
            }
          });
        };

        processCollection(barberiaSnap, true);
        processCollection(esteticaSnap, false);

        setStats({
          totalNegocios: barberiasCount + esteticasCount,
          totalBarberias: barberiasCount,
          totalEsteticas: esteticasCount,
          totalProfesionales: profesionalesCount,
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
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-blue-500 font-black uppercase text-[10px] tracking-widest">
          Calculando Rendimiento Global...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Rendimiento <span className="text-blue-600">Ecosistema</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">
              Consolidado: Barberías + Centros de Estética
            </p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
            <Activity className="text-blue-500 animate-pulse" size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Red Aura & Barber Sincronizada
            </span>
          </div>
        </header>

        {/* GRILLA DE ESTADÍSTICAS PRINCIPALES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Negocios"
            value={stats.totalNegocios}
            icon={<Store size={20} />}
            color="blue"
            desc={`${stats.totalBarberias} Barb. / ${stats.totalEsteticas} Estet.`}
          />
          <StatCard
            title="Profesionales"
            value={stats.totalProfesionales}
            icon={<Users size={20} />}
            color="purple"
            desc="Staff total en red"
          />
          <StatCard
            title="Citas del Mes"
            value={stats.totalCitasMes}
            icon={<CalendarCheck size={20} />}
            color="emerald"
            desc="Diciembre 2025"
          />
          <StatCard
            title="Crecimiento"
            value="+12%"
            icon={<TrendingUp size={20} />}
            color="orange"
            desc="Vs. mes anterior"
          />
        </div>

        {/* SECCIÓN DETALLE Y HISTÓRICO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/50 border border-white/5 rounded-[3rem] p-10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                Distribución de <span className="text-blue-500">Mercado</span>
              </h3>
            </div>

            <div className="space-y-8">
              {/* Barra Barberías */}
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="flex items-center gap-2 text-blue-400">
                    <Scissors size={12} /> Barberías
                  </span>
                  <span>
                    {Math.round(
                      (stats.totalBarberias / stats.totalNegocios) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (stats.totalBarberias / stats.totalNegocios) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Barra Estéticas */}
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="flex items-center gap-2 text-pink-400">
                    <Sparkles size={12} /> Estéticas
                  </span>
                  <span>
                    {Math.round(
                      (stats.totalEsteticas / stats.totalNegocios) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (stats.totalEsteticas / stats.totalNegocios) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex gap-10">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">
                  Promedio Tickets
                </p>
                <p className="text-xl font-black mt-1">$1.450</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">
                  Retención
                </p>
                <p className="text-xl font-black mt-1 text-emerald-500">68%</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
              <Activity size={120} />
            </div>
            <div className="relative z-10">
              <TrendingUp size={40} className="mb-8 text-blue-200" />
              <h3 className="text-2xl font-black uppercase leading-tight tracking-tighter">
                Volumen Total <br />
                de Operaciones
              </h3>
              <p className="text-6xl font-black mt-6 tracking-tighter">
                {stats.totalCitasHistoricas.toLocaleString()}
              </p>
            </div>
            <p className="text-[9px] font-black uppercase opacity-60 tracking-[0.4em] mt-12 bg-black/20 py-2 px-4 rounded-full inline-block">
              Red Unificada AgendaPro
            </p>
          </div>
        </div>

        {/* ACCESO A ANALÍTICAS EXTERNAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExternalLinkCard
            title="Google Analytics"
            subtitle="Comportamiento del consumidor y embudos"
            href="#"
            icon={<PieChart size={20} />}
          />
          <ExternalLinkCard
            title="Vercel Insights"
            subtitle="Rendimiento técnico y velocidad de carga"
            href="https://vercel.com/cleberichs-projects/barberias/analytics"
            icon={<Activity size={20} />}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, desc }) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    orange: "text-orange-500 bg-orange-500/10",
  };

  return (
    <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] hover:bg-slate-900 transition-all group">
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
      <h2 className="text-3xl font-black mt-2 tracking-tighter ">{value}</h2>
      <p className="text-[9px] font-bold text-slate-600 uppercase mt-2 italic">
        {desc}
      </p>
    </div>
  );
}

function ExternalLinkCard({ title, subtitle, href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex items-center justify-between hover:bg-white/10 transition-all group"
    >
      <div className="flex items-center gap-5">
        <div className="size-12 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-500 border border-white/5 group-hover:border-blue-500/50">
          {icon}
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest">
            {title}
          </p>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
            {subtitle}
          </p>
        </div>
      </div>
      <ArrowUpRight
        size={20}
        className="text-slate-600 group-hover:text-white transition-colors"
      />
    </a>
  );
}
