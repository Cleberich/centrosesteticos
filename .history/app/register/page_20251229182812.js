"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Iconos
import {
  Scissors,
  Store,
  Clock,
  Award,
  Check,
  ArrowRight,
  MapPin,
  Phone,
  ShieldCheck,
  ExternalLink,
  Lock,
} from "lucide-react";
// Firebase (Ajusta la ruta según tu proyecto)
import { auth, db } from "@/services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");

  // Estado del formulario
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    address: "",
    city: "",
    phone: "",
  });

  const plans = [
    {
      id: "basic",
      name: "Inicial",
      price: "29",
      features: ["1 Barbero", "50 Reservas/mes"],
    },
    {
      id: "pro",
      name: "Profesional",
      price: "49",
      features: ["3 Barberos", "Reservas Ilimitadas", "Recordatorios SMS"],
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Empresa",
      price: "99",
      features: ["Barberos Ilimitados", "App Personalizada"],
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Calcular fecha de vencimiento
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      // --- DATOS DE EJEMPLO ---
      const exampleBarberId = "barber-" + Date.now();
      const exampleServiceId = "svc-" + Date.now();

      const exampleBarber = {
        id: exampleBarberId,
        name: "Barbero de Ejemplo",
        imageUrl:
          "https://images.unsplash.com/photo-1503910361362-7a9bb1fd955b?q=80&w=200&h=200&auto=format&fit=crop", // Foto profesional genérica
        active: true,
      };

      const exampleService = {
        id: exampleServiceId,
        name: "Corte Clásico",
        price: "15",
        time: 30, // Duración en minutos
        description: "Corte de cabello tradicional a tijera o máquina.",
      };

      // 3. Crear documento de la Barbería
      await setDoc(doc(db, "barberias", user.uid), {
        ownerId: user.uid,
        businessName: formData.businessName,
        email: formData.email,
        address: formData.address || "",
        city: formData.city || "",
        phone: formData.phone || "",
        createdAt: serverTimestamp(),
        plan: {
          type: selectedPlan,
          status: "active",
          price: plans.find((p) => p.id === selectedPlan).price,
          lastPayment: serverTimestamp(),
          nextPayment: expiryDate,
        },
        calendar: {
          settings: { slotDuration: 30, startHour: "09:00", endHour: "20:00" },
        },
        // Inyectamos los datos de ejemplo
        appointments: [],
        services: [exampleService],
        barbers: [exampleBarber],
        customers: [],
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error en registro:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#0a0f1a] font-sans antialiased">
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-6 lg:px-10 justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Scissors size={18} />
          </div>
          <h2 className="text-lg font-black italic tracking-tighter uppercase dark:text-white">
            Barber<span className="text-blue-600">Manager</span>
          </h2>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto pt-24 pb-20 px-6">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white italic uppercase">
                Registra tu <span className="text-blue-600">Barbería</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold max-w-xl">
                Configura tu cuenta y empieza a gestionar tus citas hoy mismo.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleRegister}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start"
        >
          <div className="lg:col-span-2 space-y-8">
            {/* Sección: Información del Negocio */}
            <div className="bg-white dark:bg-[#101622] rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                  <Store size={24} />
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-tight dark:text-white">
                  Negocio
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Nombre de la Barbería"
                  name="businessName"
                  placeholder="Ej. El Caballero"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
                <InputGroup
                  label="Email Comercial"
                  name="email"
                  type="email"
                  placeholder="contacto@barberia.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <InputGroup
                  label="Contraseña de acceso"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={18} />}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <InputGroup
                  label="Teléfono"
                  name="phone"
                  placeholder="09x xxx xxx"
                  icon={<Phone size={18} />}
                  value={formData.phone}
                  onChange={handleChange}
                />
                <div className="md:col-span-2">
                  <InputGroup
                    label="Dirección"
                    name="address"
                    placeholder="Calle Principal 123..."
                    icon={<MapPin size={18} />}
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <InputGroup
                  label="Ciudad"
                  name="city"
                  placeholder="Montevideo, UY"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Sección: Planes */}
            <div className="bg-white dark:bg-[#101622] rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white">
                  <Award size={24} />
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-tight dark:text-white">
                  Plan
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPlan === plan.id
                        ? "border-blue-600 bg-blue-600/5 ring-4 ring-blue-600/10"
                        : "border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    {plan.recommended && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-[8px] font-black uppercase tracking-widest text-white px-3 py-1 rounded-full">
                        Recomendado
                      </span>
                    )}
                    <h3
                      className={`font-black uppercase italic ${
                        selectedPlan === plan.id
                          ? "text-blue-600"
                          : "text-slate-400"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <div className="my-4">
                      <span className="text-3xl font-black dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        /mes
                      </span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-400"
                        >
                          <Check size={14} className="text-green-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? "Procesando..." : "Completar Registro"}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Columna Resumen */}
          <aside className="space-y-6 sticky top-24">
            <div className="bg-[#101622] text-white rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h3 className="text-xl font-black italic uppercase mb-6">
                Resumen
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold py-3 border-b border-white/5">
                  <span className="text-slate-400">Plan Seleccionado</span>
                  <span className="uppercase text-blue-400">
                    {selectedPlan}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-black uppercase italic">
                    Total
                  </span>
                  <span className="text-3xl font-black text-blue-500">
                    ${plans.find((p) => p.id === selectedPlan).price}.00
                  </span>
                </div>
              </div>
              <div className="mt-8 bg-white/5 p-4 rounded-2xl flex gap-4 items-start border border-white/5">
                <ShieldCheck className="text-green-500 shrink-0" size={20} />
                <p className="text-[10px] font-bold text-slate-400 leading-normal">
                  Acceso inmediato tras el registro. Gestión segura de datos.
                </p>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}

function InputGroup({
  label,
  placeholder,
  type = "text",
  icon,
  name,
  value,
  onChange,
  required,
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
            {icon}
          </div>
        )}
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          required={required}
          placeholder={placeholder}
          className={`w-full py-4 ${
            icon ? "pl-12" : "pl-4"
          } pr-4 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all outline-none font-bold text-slate-700 dark:text-white placeholder:text-slate-400`}
        />
      </div>
    </div>
  );
}
