"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Store,
  CalendarCheck,
  TrendingUp,
  Loader2,
  ArrowUpRight,
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

            const staff = isBarberia ? data.barbers : data.specialists;
            if (staff) profesionalesCount += staff.length;

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
      <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-[#c084fc] mb-3" size={40} />
        <p className="text-[#a855f7] font-bold text-xs">
          Calculando Rendimiento Global...
        </p>
      </div>
    );

  const nombreMesActual = new Date().toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] p-6 md:p-12 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#e879f9]/20 flex items-center justify-center text-[#c084fc] font-bold text-sm">
                +
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#a855f7]">
                estetica integral • Analytics
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Rendimiento del Ecosistema
            </h1>
            <p className="text-slate-400 font-medium text-xs mt-1">
              Consolidado: Barberías + Centros de Estética
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-xs">
            <Activity className="text-[#10b981] animate-pulse" size={16} />
            <span className="text-xs font-bold text-slate-700">
              Red Unificada Sincronizada
            </span>
          </div>
        </header>

        {/* GRILLA DE ESTADÍSTICAS PRINCIPALES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Negocios Registrados"
            value={stats.totalNegocios}
            icon={<Store size={18} />}
            color="purple"
            desc={`${stats.totalBarberias} Barb. / ${stats.totalEsteticas} Estet.`}
          />
          <StatCard
            title="Profesionales"
            value={stats.totalProfesionales}
            icon={<Users size={18} />}
            color="mint"
            desc="Staff total en red"
          />
          <StatCard
            title="Citas del Mes"
            value={stats.totalCitasMes}
            icon={<CalendarCheck size={18} />}
            color="pink"
            desc={nombreMesActual}
          />
          <StatCard
            title="Crecimiento Est."
            value="+12%"
            icon={<TrendingUp size={18} />}
            color="amber"
            desc="Vs. mes anterior"
          />
        </div>

        {/* SECCIÓN DETALLE Y HISTÓRICO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <span>Distribución de Mercado</span>
              </h3>
            </div>

            <div className="space-y-6">
              {/* Barra Barberías */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Scissors size={14} className="text-slate-500" /> Barberías
                  </span>
                  <span className="text-slate-600">
                    {stats.totalNegocios > 0
                      ? Math.round(
                          (stats.totalBarberias / stats.totalNegocios) * 100,
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-700 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        stats.totalNegocios > 0
                          ? (stats.totalBarberias / stats.totalNegocios) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Barra Estéticas */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-[#a855f7]">
                    <Sparkles size={14} /> Centros de Estética
                  </span>
                  <span className="text-[#a855f7]">
                    {stats.totalNegocios > 0
                      ? Math.round(
                          (stats.totalEsteticas / stats.totalNegocios) * 100,
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#c084fc] to-[#e879f9] rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        stats.totalNegocios > 0
                          ? (stats.totalEsteticas / stats.totalNegocios) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-8">
              <div>
                <p className="text-xs font-bold text-slate-400">
                  Promedio Tickets
                </p>
                <p className="text-lg font-bold text-slate-800 mt-0.5">
                  $1.450
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">
                  Retención Promedio
                </p>
                <p className="text-lg font-bold text-[#10b981] mt-0.5">68%</p>
              </div>
            </div>
          </div>

          {/* BANNER DESTACADO */}
          <div className="bg-gradient-to-br from-[#c084fc] via-[#e879f9] to-[#f472b6] rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg shadow-purple-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-15 group-hover:rotate-12 transition-transform">
              <Activity size={110} />
            </div>
            <div className="relative z-10">
              <TrendingUp size={36} className="mb-6 text-white/90" />
              <h3 className="text-xl font-bold leading-tight tracking-tight">
                Volumen Total <br />
                de Citas Procesadas
              </h3>
              <p className="text-5xl font-extrabold mt-4 tracking-tight">
                {stats.totalCitasHistoricas.toLocaleString()}
              </p>
            </div>
            <p className="text-[10px] font-bold uppercase opacity-80 tracking-wider mt-8 bg-white/20 py-1.5 px-3 rounded-full inline-block backdrop-blur-xs w-max">
              Red Unificada CRM
            </p>
          </div>
        </div>

        {/* ACCESO A ANALÍTICAS EXTERNAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExternalLinkCard
            title="Google Analytics"
            subtitle="Comportamiento de clientes y conversión"
            href="#"
            icon={<PieChart size={18} />}
          />
          <ExternalLinkCard
            title="Vercel Insights"
            subtitle="Rendimiento técnico y velocidad de respuesta"
            href="https://vercel.com/cleberichs-projects/barberias/analytics"
            icon={<Activity size={18} />}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, desc }) {
  const colorStyles = {
    purple: "bg-[#e879f9]/20 text-[#c084fc]",
    mint: "bg-[#6ee7b7]/30 text-slate-800",
    pink: "bg-pink-100 text-pink-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-2xl ${colorStyles[color]}`}>{icon}</div>
        <ArrowUpRight
          size={16}
          className="text-slate-300 group-hover:text-slate-600 transition-colors"
        />
      </div>
      <p className="text-xs font-bold text-slate-400">{title}</p>
      <h2 className="text-2xl font-extrabold text-slate-800 mt-1 tracking-tight">
        {value}
      </h2>
      <p className="text-[11px] font-medium text-slate-500 mt-1">{desc}</p>
    </div>
  );
}

function ExternalLinkCard({ title, subtitle, href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white border border-slate-200/80 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#f8fafc] rounded-xl flex items-center justify-center text-[#c084fc] border border-slate-200/80 group-hover:border-[#c084fc] transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800">{title}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>
      <ArrowUpRight
        size={18}
        className="text-slate-300 group-hover:text-slate-600 transition-colors"
      />
    </a>
  );
}
