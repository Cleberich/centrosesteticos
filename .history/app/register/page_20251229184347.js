"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Iconos
import {
  Scissors,
  Store,
  Phone,
  Lock,
  ArrowRight,
  Loader2,
  User,
  ShieldCheck,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "", // Nombre del barbero principal
    email: "",
    password: "",
    phone: "",
  });

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

      // 2. Generador de UIDs alfanuméricos puros (sin prefijos)
      const generateUID = () =>
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      const barberId = generateUID();
      const serviceId = generateUID();

      // 3. Configuración de vencimiento del plan (1 mes)
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      // 4. Imagen por defecto para el barbero
      const defaultAvatar =
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

      // 5. Crear documento de la Barbería en Firestore
      await setDoc(doc(db, "barberias", user.uid), {
        ownerId: user.uid,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone || "",
        createdAt: serverTimestamp(),
        // PLAN GRATUITO POR DEFECTO
        plan: {
          type: "free",
          status: "active",
          price: "0",
          nextPayment: expiryDate,
          limits: {
            maxBarbers: 1,
            maxServices: 3,
            maxAppointments: 20,
          },
        },
        // BARBERO PRINCIPAL (Con el nombre del dueño)
        barbers: [
          {
            id: barberId,
            name: formData.ownerName,
            imageUrl: defaultAvatar,
            active: true,
          },
        ],
        // SERVICIO DE EJEMPLO ACTIVO
        services: [
          {
            id: serviceId,
            name: "Corte Clásico",
            price: "15",
            time: 30,
            active: true,
          },
        ],
        calendar: {
          settings: { slotDuration: 30, startHour: "09:00", endHour: "20:00" },
        },
        appointments: [],
        customers: [],
      });

      // Redirigir al Dashboard tras éxito
      router.push("/dashboard");
    } catch (error) {
      console.error("Error en registro:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 dark:bg-[#0a0f1a]">
      <div className="w-full max-w-[480px] space-y-8">
        {/* LOGO Y CABECERA */}
        <div className="text-center space-y-3">
          <div className="size-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-500/30">
            <Scissors size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
              Barber<span className="text-blue-600">Manager</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
              Crea tu cuenta gratuita
            </p>
          </div>
        </div>

        {/* TARJETA DE REGISTRO */}
        <div className="bg-white dark:bg-[#111827] p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleRegister} className="space-y-5">
            <InputGroup
              label="Nombre de la Barbería"
              name="businessName"
              placeholder="Ej. El Templo del Corte"
              icon={<Store size={18} />}
              value={formData.businessName}
              onChange={handleChange}
              required
            />

            <InputGroup
              label="Tu Nombre (Barbero Principal)"
              name="ownerName"
              placeholder="Ej. Carlos Rodríguez"
              icon={<User size={18} />}
              value={formData.ownerName}
              onChange={handleChange}
              required
            />

            <InputGroup
              label="Correo Electrónico"
              name="email"
              type="email"
              placeholder="admin@barberia.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputGroup
              label="Contraseña"
              name="password"
              type="password"
              placeholder="Min. 6 caracteres"
              icon={<Lock size={18} />}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <InputGroup
              label="Teléfono / WhatsApp"
              name="phone"
              placeholder="Ej. 099 123 456"
              icon={<Phone size={18} />}
              value={formData.phone}
              onChange={handleChange}
            />

            <div className="pt-4">
              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Comenzar Gratis <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* BENEFICIO RÁPIDO */}
          <div className="mt-8 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-tight uppercase tracking-tight">
              Plan Gratis activo por defecto: 1 barbero y hasta 20 citas
              mensuales.
            </p>
          </div>
        </div>

        {/* PIE DE PÁGINA */}
        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

// COMPONENTE DE INPUT REUTILIZABLE
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
      <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.15em] ml-2">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-blue-600 transition-colors pointer-events-none">
          {icon}
        </div>
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full py-4.5 pl-14 pr-5 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-600/20 focus:bg-white dark:focus:bg-slate-800 rounded-[1.25rem] font-bold text-sm outline-none transition-all dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
        />
      </div>
    </div>
  );
}
