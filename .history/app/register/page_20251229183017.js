"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Lock,
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("free"); // Por defecto Gratis

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
      id: "free",
      name: "Gratis",
      price: "0",
      features: ["1 Barbero", "20 Reservas/mes", "Soporte Comunidad"],
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
      features: ["Barberos Ilimitados", "App Personalizada", "Soporte VIP"],
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      // --- DATOS DE EJEMPLO ---
      const exampleBarberId = "barber-" + Date.now();
      const exampleServiceId = "svc-" + Date.now();

      const exampleBarber = {
        id: exampleBarberId,
        name: "Barbero de Ejemplo",
        imageUrl:
          "https://images.unsplash.com/photo-1503910361362-7a9bb1fd955b?q=80&w=200&h=200&auto=format&fit=crop",
        active: true,
      };

      const exampleService = {
        id: exampleServiceId,
        name: "Corte Clásico",
        price: "15",
        time: 30,
        description: "Servicio inicial de ejemplo.",
      };

      // --- LÍMITES SEGÚN PLAN ---
      const limits = {
        free: { maxBarbers: 1, maxAppointments: 20 },
        pro: { maxBarbers: 3, maxAppointments: 9999 },
        enterprise: { maxBarbers: 99, maxAppointments: 9999 },
      };

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
          limits: limits[selectedPlan], // Guardamos los límites en el doc
          nextPayment: expiryDate,
        },
        calendar: {
          settings: { slotDuration: 30, startHour: "09:00", endHour: "20:00" },
        },
        appointments: [],
        services: [exampleService],
        barbers: [exampleBarber],
        customers: [],
      });

      router.push("/dashboard");
    } catch (error) {
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
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white italic uppercase">
            Registra tu <span className="text-blue-600">Barbería</span>
          </h1>
        </div>

        <form
          onSubmit={handleRegister}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          <div className="lg:col-span-2 space-y-8">
            {/* Formulario de Negocio */}
            <div className="bg-white dark:bg-[#101622] rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="Barbería"
                  name="businessName"
                  placeholder="Nombre"
                  onChange={handleChange}
                  required
                />
                <InputGroup
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="mail@ejemplo.com"
                  onChange={handleChange}
                  required
                />
                <InputGroup
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={18} />}
                  onChange={handleChange}
                  required
                />
                <InputGroup
                  label="Teléfono"
                  name="phone"
                  placeholder="09x xxx xxx"
                  icon={<Phone size={18} />}
                  onChange={handleChange}
                />
                <div className="md:col-span-2">
                  <InputGroup
                    label="Dirección"
                    name="address"
                    icon={<MapPin size={18} />}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Selector de Planes */}
            <div className="bg-white dark:bg-[#101622] rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-black italic uppercase mb-6 dark:text-white">
                Selecciona tu Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPlan === plan.id
                        ? "border-blue-600 bg-blue-600/5"
                        : "border-slate-100 dark:border-slate-800"
                    }`}
                  >
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
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase"
                        >
                          <Check size={12} className="text-green-500" /> {f}
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
                className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl disabled:opacity-50"
              >
                {loading ? "Registrando..." : "Comenzar Ahora"}
              </button>
            </div>
          </div>

          {/* Sidebar Resumen */}
          <aside>
            <div className="bg-[#101622] text-white rounded-3xl p-8 border border-white/10 sticky top-24">
              <h3 className="text-xl font-black italic uppercase mb-6 text-blue-500">
                Resumen
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase py-3 border-b border-white/5">
                  <span className="text-slate-400">Plan</span>
                  <span>{selectedPlan}</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-black uppercase">Total</span>
                  <span className="text-3xl font-black text-blue-500">
                    ${plans.find((p) => p.id === selectedPlan).price}
                  </span>
                </div>
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
  onChange,
  required,
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
            {icon}
          </div>
        )}
        <input
          name={name}
          onChange={onChange}
          type={type}
          required={required}
          placeholder={placeholder}
          className={`w-full py-4 ${
            icon ? "pl-12" : "pl-4"
          } pr-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-600`}
        />
      </div>
    </div>
  );
}
