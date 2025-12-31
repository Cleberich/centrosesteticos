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

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const generateUID = () =>
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      const barberId = generateUID();
      const serviceId = generateUID();
      const appointmentId = generateUID();

      // Fecha de hoy para la cita de prueba
      const today = new Date();
      const dateString = today.toISOString().split("T")[0];
      // Ajuste de índice de día (Lunes = 0)
      const dayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;

      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      const defaultAvatar =
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

      // CREACIÓN DEL DOCUMENTO
      await setDoc(doc(db, "barberias", user.uid), {
        ownerId: user.uid,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone || "",
        createdAt: serverTimestamp(),
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
        barbers: [
          {
            id: barberId,
            name: formData.ownerName,
            imageUrl: defaultAvatar,
            active: true,
          },
        ],
        services: [
          {
            id: serviceId,
            name: "Corte Clásico",
            price: "380",
            time: 30,
            active: true,
          },
        ],
        calendar: {
          settings: { slotDuration: 30, startHour: "09:00", endHour: "20:00" },
        },
        // CITA DE PRUEBA AGREGADA AQUÍ
        appointments: [
          {
            id: appointmentId,
            customer: "Cliente de Prueba",
            phone: "092 123 456",
            barber: formData.ownerName, // Vinculado al nombre del dueño
            service: "Corte Clásico",
            start: "10:00",
            date: dateString,
            day: dayIdx,
            duration: 30,
            status: "pending",
            isTest: true, // Flag para identificar que es de prueba
            note: "Esta es una visita de prueba automática",
          },
        ],
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 dark:bg-[#0a0f1a]">
      <div className="w-full max-w-[480px] space-y-8">
        <div className="text-center space-y-3">
          <div className="size-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-500/30">
            <Scissors size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
              Crea tu cuenta gratuita
            </p>
          </div>
        </div>

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
              icon={<Lock size={18} className="" />}
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

          <div className="mt-8 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-tight uppercase tracking-tight">
              Plan Gratis activo: Te incluimos una cita de prueba en tu agenda
              para comenzar.
            </p>
          </div>
        </div>

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
