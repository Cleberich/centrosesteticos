"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Store,
  Phone,
  MapPin,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { auth, db } from "@/services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
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

      // Datos iniciales de ejemplo
      const barberId = "barber-" + Date.now();
      const serviceId = "svc-" + Date.now();

      await setDoc(doc(db, "barberias", user.uid), {
        ownerId: user.uid,
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone || "",
        createdAt: serverTimestamp(),
        // PLAN GRATIS POR DEFECTO
        plan: {
          type: "free",
          status: "active",
          limits: { maxBarbers: 1, maxServices: 3, maxAppointments: 20 },
        },
        barbers: [
          {
            id: barberId,
            name: "Barbero Principal",
            imageUrl:
              "https://images.unsplash.com/photo-1503910361362-7a9bb1fd955b?auto=format&fit=crop&q=80&w=200",
            active: true,
          },
        ],
        services: [
          {
            id: serviceId,
            name: "Corte Clásico",
            price: "15",
            time: 30,
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
            Empieza gratis hoy mismo
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5"
        >
          <InputGroup
            label="Nombre de tu Barbería"
            name="businessName"
            placeholder="Ej: Barbería Deluxe"
            icon={<Store size={18} />}
            onChange={handleChange}
            required
          />
          <InputGroup
            label="Email de acceso"
            name="email"
            type="email"
            placeholder="tu@email.com"
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
            label="WhatsApp / Teléfono"
            name="phone"
            placeholder="09x xxx xxx"
            icon={<Phone size={18} />}
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Crear mi cuenta gratis <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600">
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
