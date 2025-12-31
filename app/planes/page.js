import Link from "next/link";
import {
  Sparkles,
  Menu,
  Check,
  X,
  CheckCircle2,
  Minus,
  Instagram,
  Twitter,
  Flower2,
} from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Top Navigation */}
      <header className="w-full border-b border-pink-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="px-4 md:px-10 py-3 flex items-center justify-between mx-auto max-w-7xl">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-pink-500 p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform shadow-lg shadow-pink-500/20">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-black tracking-widest italic uppercase">
              Aura
            </h2>
          </Link>

          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <nav className="flex items-center gap-6">
              {["Servicios", "Testimonios", "Contacto"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-pink-500 transition-colors"
                >
                  {item}
                </Link>
              ))}
              <Link
                href="#"
                className="text-xs font-black uppercase tracking-widest text-pink-500 border-b-2 border-pink-500"
              >
                Precios
              </Link>
            </nav>
            <div className="flex gap-3 ml-4">
              <Link
                href="/login"
                className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
              >
                Ingresar
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-full bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20"
              >
                Prueba Gratis
              </Link>
            </div>
          </div>
          <button className="md:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="w-full max-w-4xl px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
            <Flower2 size={12} /> Planes Flexibles
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 italic uppercase leading-tight">
            Eleva el estándar de tu{" "}
            <span className="text-pink-500">Centro de Estética</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
            Desde especialistas independientes hasta grandes centros de
            bienestar. Elige el plan que mejor se adapte a tu crecimiento.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <button className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest text-slate-500">
              Mensual
            </button>
            <button className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-white dark:bg-slate-700 text-pink-500 dark:text-white shadow-sm ring-1 ring-black/5">
              Anual{" "}
              <span className="ml-1 text-[9px] bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="w-full max-w-7xl px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {/* Soft Plan */}
            <div className="flex flex-col gap-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-sm hover:shadow-xl transition-all">
              <div>
                <h3 className="text-xl font-black uppercase italic mb-2 tracking-tight">
                  Soft
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                  Esencial para especialistas que comienzan su camino.
                </p>
                <div className="mt-8 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter text-pink-500">
                    $0
                  </span>
                  <span className="text-slate-400 text-xs font-black uppercase tracking-widest">
                    / mes
                  </span>
                </div>
              </div>
              <Link
                href="/register"
                className="w-full py-4 rounded-2xl bg-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-center hover:bg-slate-200 transition-colors"
              >
                Comenzar Gratis
              </Link>
              <div className="space-y-4 flex-grow">
                {[
                  "1 Especialista",
                  "30 Citas al mes",
                  "Fichas de Clientes",
                  "Agenda Digital",
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-tight"
                  >
                    <Check
                      size={16}
                      className="text-pink-500 shrink-0"
                      strokeWidth={3}
                    />
                    <span className="text-slate-600 dark:text-slate-300">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radiance Plan */}
            <div className="flex flex-col gap-8 rounded-[3rem] border-2 border-pink-500 bg-white dark:bg-slate-900 p-10 shadow-2xl relative lg:-translate-y-4 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[9px] font-black px-6 py-2 rounded-full tracking-[0.2em] uppercase">
                Recomendado
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic mb-2 text-pink-500 tracking-tight">
                  Radiance
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                  Gestión avanzada para centros en pleno crecimiento.
                </p>
                <div className="mt-8 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter text-pink-500">
                    $35
                  </span>
                  <span className="text-slate-400 text-xs font-black uppercase tracking-widest">
                    / mes
                  </span>
                </div>
              </div>
              <Link
                href="/register"
                className="w-full py-4 rounded-2xl bg-pink-500 text-white text-[10px] font-black uppercase tracking-[0.2em] text-center hover:bg-pink-600 shadow-xl shadow-pink-500/30 transition-all"
              >
                Prueba Gratis 14 Días
              </Link>
              <div className="space-y-4 flex-grow">
                {[
                  "Hasta 6 Especialistas",
                  "Citas Ilimitadas",
                  "Recordatorios WhatsApp",
                  "Historial Clínico Digital",
                  "Reportes de Comisiones",
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-tight"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-pink-500 shrink-0"
                      strokeWidth={3}
                    />
                    <span className="text-slate-700 dark:text-slate-200">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diamond Plan */}
            <div className="flex flex-col gap-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-sm hover:shadow-xl transition-all">
              <div>
                <h3 className="text-xl font-black uppercase italic mb-2 tracking-tight">
                  Diamond
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                  Para franquicias y clínicas de alta demanda.
                </p>
                <div className="mt-8 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter text-pink-500">
                    $89
                  </span>
                  <span className="text-slate-400 text-xs font-black uppercase tracking-widest">
                    / mes
                  </span>
                </div>
              </div>
              <Link
                href="#"
                className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-center hover:opacity-90 transition-colors"
              >
                Hablar con un experto
              </Link>
              <div className="space-y-4 flex-grow">
                {[
                  "Especialistas Ilimitados",
                  "Múltiples Sucursales",
                  "Módulo de Inventario Pro",
                  "App de Marca Propia",
                  "Soporte VIP 24/7",
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-tight"
                  >
                    <Check
                      size={16}
                      className="text-pink-500 shrink-0"
                      strokeWidth={3}
                    />
                    <span className="text-slate-600 dark:text-slate-300">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="w-full max-w-5xl px-4 pb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
              Tabla Comparativa
            </h2>
            <p className="text-slate-500 font-medium">
              Transparencia total en cada herramienta.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-pink-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-pink-500/5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="bg-pink-50/30 dark:bg-slate-800/50 border-b border-pink-100 dark:border-slate-800">
                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest">
                      Funcionalidades
                    </th>
                    <th className="px-6 py-6 text-center text-[10px] font-black uppercase tracking-widest">
                      Soft
                    </th>
                    <th className="px-6 py-6 text-center text-[10px] font-black uppercase tracking-widest text-pink-500">
                      Radiance
                    </th>
                    <th className="px-6 py-6 text-center text-[10px] font-black uppercase tracking-widest">
                      Diamond
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {[
                    {
                      f: "Agenda en Tiempo Real",
                      b: "check",
                      r: "check",
                      d: "check",
                    },
                    {
                      f: "WhatsApp Automático",
                      b: "minus",
                      r: "check",
                      d: "check",
                    },
                    {
                      f: "Gestión de Comisiones",
                      b: "minus",
                      r: "check",
                      d: "check",
                    },
                    {
                      f: "Fichas Médicas/Estéticas",
                      b: "Básica",
                      r: "Avanzada",
                      d: "Personalizada",
                    },
                    {
                      f: "Control de Inventario",
                      b: "minus",
                      r: "minus",
                      d: "check",
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-pink-50/10 transition-colors"
                    >
                      <td className="px-8 py-5 text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300">
                        {row.f}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {renderCell(row.b)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {renderCell(row.r)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {renderCell(row.d)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-pink-500" />
            <span className="font-black text-xl tracking-widest uppercase italic">
              Aura
            </span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            © 2025 Aura Estética Inc. Gestión con elegancia.
          </p>
          <div className="flex items-center gap-6">
            <Instagram
              size={18}
              className="text-slate-400 hover:text-pink-500 transition-colors"
            />
            <Twitter
              size={18}
              className="text-slate-400 hover:text-sky-400 transition-colors"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

function renderCell(val) {
  if (val === "check")
    return (
      <Check className="mx-auto text-pink-500" size={18} strokeWidth={4} />
    );
  if (val === "minus")
    return <Minus className="mx-auto text-slate-200" size={18} />;
  return (
    <span className="text-[10px] font-black uppercase text-slate-500">
      {val}
    </span>
  );
}
