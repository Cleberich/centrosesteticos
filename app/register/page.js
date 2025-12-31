"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// IMPORTACIÓN DE EMAILJS
import emailjs from "@emailjs/browser";

// Iconos
import {
  Sparkles, // Cambiado de Scissors
  Store,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  User,
  ShieldCheck,
  Heart, // Nuevo icono para estética
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
      // 1. Crear usuario en Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Generadores de ID y fechas
      const generateUID = () =>
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      const specialistId = generateUID(); // Cambiado de barberId
      const serviceId = generateUID();
      const appointmentId = generateUID();

      const today = new Date();
      const dateString = today.toISOString().split("T")[0];
      const dayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;

      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      const defaultAvatar =
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

      // 2. CREACIÓN DEL DOCUMENTO EN FIRESTORE
      // Cambiado nombre de colección de 'barberias' a 'centros_estetica'
      await setDoc(doc(db, "centros_estetica", user.uid), {
        ownerId: user.uid,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone || "",
        createdAt: serverTimestamp(),
        plan: {
          type: "Inicial",
          status: "active",
          price: "0",
          nextPayment: expiryDate,
        },
        specialists: [
          // Cambiado de barbers
          {
            id: specialistId,
            name: formData.ownerName,
            imageUrl: defaultAvatar,
            active: true,
          },
        ],
        services: [
          {
            id: serviceId,
            name: "Limpieza Facial Profunda", // Servicio de ejemplo de estética
            price: "1200",
            time: 60,
            active: true,
          },
        ],
        calendar: {
          settings: { slotDuration: 30, startHour: "09:00", endHour: "20:00" },
        },
        appointments: [
          {
            id: appointmentId,
            customer: "Cliente de Prueba",
            phone: "092 123 456",
            specialist: formData.ownerName, // Vinculado al nombre del dueño
            service: "Limpieza Facial Profunda",
            start: "10:00",
            date: dateString,
            day: dayIdx,
            duration: 60,
            status: "pending",
            isTest: true,
            note: "Esta es una cita de prueba automática",
          },
        ],
        customers: [],
      });

      // 3. ENVIAR EMAIL DE NOTIFICACIÓN
      try {
        await emailjs.send(
          "service_bm0xbov",
          "template_vzfzz0m",
          {
            business_name: formData.businessName,
            owner_name: formData.ownerName,
            email: formData.email,
            phone: formData.phone,
          },
          "QQV_D_IXpW03jTg8X"
        );
      } catch (emailError) {
        console.error("Error enviando email:", emailError);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error en registro:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8FA] flex flex-col items-center justify-center p-6 dark:bg-[#0f0a0c]">
      <div className="w-full max-w-[480px] space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-2xl flex gap-2 font-black uppercase dark:text-white tracking-widest italic">
              Aura{" "}
              <div className="size-10 -mt-2 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                <Sparkles size={24} />
              </div>
              Estética
            </h1>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
              Crea tu cuenta de profesional
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1114] p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-pink-100/50 dark:shadow-none border border-pink-50 dark:border-slate-800">
          <form onSubmit={handleRegister} className="space-y-5">
            <InputGroup
              label="Nombre del Centro de Estética"
              name="businessName"
              placeholder="Ej. Centro Belleza"
              icon={<Store size={18} />}
              value={formData.businessName}
              onChange={handleChange}
              required
            />

            <InputGroup
              label="Tu Nombre (Especialista Principal)"
              name="ownerName"
              placeholder="Ej. Valentina Gómez"
              icon={<User size={18} />}
              value={formData.ownerName}
              onChange={handleChange}
              required
            />

            <InputGroup
              label="Correo Electrónico"
              name="email"
              type="email"
              placeholder="contacto@tucentro.com"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <InputGroup
              label="Contraseña"
              name="password"
              type="password"
              placeholder="Seguridad de nivel profesional"
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
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-pink-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Registrar mi Centro <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center gap-3 p-4 bg-pink-50/50 dark:bg-pink-900/10 rounded-2xl border border-pink-100/50 dark:border-slate-800">
            <Heart className="text-pink-500 shrink-0" size={20} />
            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-tight uppercase tracking-tight">
              Bienvenida: Hemos preparado una agenda con un tratamiento de
              prueba para que explores las herramientas.
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          ¿Ya eres parte de Aura?{" "}
          <Link href="/login" className="text-pink-500 hover:underline">
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
        <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-pink-500 transition-colors pointer-events-none">
          {icon}
        </div>
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full py-4.5 pl-14 pr-5 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-pink-500/20 focus:bg-white dark:focus:bg-slate-800 rounded-[1.25rem] font-bold text-sm outline-none transition-all dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
        />
      </div>
    </div>
  );
}
