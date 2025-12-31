"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Store,
  Phone,
  Lock,
  ArrowRight,
  Loader2,
  User,
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "", // Nuevo campo
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

      // 1. Crear IDs únicos
      const barberId = "barber-" + Date.now();
      const serviceId = "svc-" + Date.now();

      // 2. Imagen por defecto (Avatar neutral de usuario)
      const defaultAvatar =
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

      // 3. Crear documento de la Barbería con el dueño como barbero principal
      await setDoc(doc(db, "barberias", user.uid), {
        ownerId: user.uid,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone || "",
        createdAt: serverTimestamp(),
        plan: {
          type: "free",
          status: "active",
          limits: { maxBarbers: 1, maxServices: 3, maxAppointments: 20 },
        },
        // El barbero principal toma el nombre ingresado por el usuario
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
            price: "15",
            time: 30,
            active: true,
          },
        ],
        appointments: [],
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[450px] space-y-8">
        <div className="text-center space-y-2">
          <div className="size-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-200">
            <Scissors size={24} />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
            Barber<span className="text-blue-600">Manager</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Configura tu espacio gratis
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5"
        >
          <InputGroup
            label="Nombre de la Barbería"
            name="businessName"
            placeholder="Ej: El Caballero"
            icon={<Store size={18} />}
            onChange={handleChange}
            required
          />

          <InputGroup
            label="Tu Nombre (Barbero Principal)"
            name="ownerName"
            placeholder="Ej: Juan Pérez"
            icon={<User size={18} />}
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
            label="Teléfono / WhatsApp"
            name="phone"
            placeholder="09x xxx xxx"
            icon={<Phone size={18} />}
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Registrar mi Barbería <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-600">
            Inicia Sesión
          </a>
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
  onChange,
  required,
}) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.15em] ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center text-slate-300 group-focus-within:text-blue-600 transition-colors">
          {icon}
        </div>
        <input
          name={name}
          onChange={onChange}
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full py-4 pl-12 pr-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all"
        />
      </div>
    </div>
  );
}
