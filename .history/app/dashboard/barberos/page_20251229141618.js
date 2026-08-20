"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Users,
  Phone,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  X,
  Loader2,
  Award,
  Star,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function BarbersPage() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "Corte & Barba",
    phone: "",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState(null);

  // --- 1. CARGAR BARBEROS DESDE FIREBASE ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "barberias", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Extraemos el array 'barbers' del documento de la barbería
          setBarbers(docSnap.data().barbers || []);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- 2. SINCRONIZAR CON FIRESTORE ---
  const saveToFirebase = async (newBarbersList) => {
    if (!user) return;
    try {
      const docRef = doc(db, "barberias", user.uid);
      await updateDoc(docRef, { barbers: newBarbersList });
    } catch (error) {
      console.error("Error al guardar staff:", error);
      alert("Error al sincronizar con la base de datos");
    }
  };

  const toggleBarberStatus = async (id) => {
    const updated = barbers.map((b) =>
      b.id === id ? { ...b, active: !b.active } : b
    );
    setBarbers(updated);
    await saveToFirebase(updated);
  };

  const deleteBarber = async (id) => {
    if (window.confirm("¿Eliminar a este barbero del equipo?")) {
      const updated = barbers.filter((b) => b.id !== id);
      setBarbers(updated);
      await saveToFirebase(updated);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      specialty: "Corte & Barba",
      phone: "",
      imageUrl: "",
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (barber) => {
    setFormData({
      name: barber.name,
      specialty: barber.specialty,
      phone: barber.phone,
      imageUrl: barber.imageUrl,
    });
    setEditingId(barber.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedList = [];

    if (editingId) {
      updatedList = barbers.map((b) =>
        b.id === editingId ? { ...b, ...formData } : b
      );
    } else {
      const newBarber = {
        ...formData,
        id: Date.now(),
        active: true,
        rating: 5.0,
      };
      updatedList = [...barbers, newBarber];
    }

    setBarbers(updatedList);
    await saveToFirebase(updatedList);
    setIsModalOpen(false);
  };

  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-[#0a0f1a]">
      <header className="flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold dark:text-white italic uppercase tracking-tighter">
            Equipo de <span className="text-blue-600">Barberos</span>
          </h1>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            {barbers.length} profesionales activos
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20"
        >
          <Plus size={16} /> Reclutar Barbero
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {barbers.map((b) => (
            <div
              key={b.id}
              className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all hover:border-blue-500 ${
                !b.active && "opacity-50 grayscale"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="relative">
                  <div className="size-20 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-md">
                    <img
                      src={
                        b.imageUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.name}`
                      }
                      alt={b.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-lg border-4 border-white dark:border-slate-900">
                    <CheckCircle2 size={12} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 dark:bg-slate-800 rounded-xl"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteBarber(b.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 dark:bg-slate-800 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-black dark:text-white uppercase italic tracking-tighter">
                  {b.name}
                </h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                  {b.specialty}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                    Valoración
                  </p>
                  <div className="flex items-center gap-1 text-xs font-bold dark:text-white">
                    <Star size={12} className="text-amber-400 fill-amber-400" />{" "}
                    {b.rating || "5.0"}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                    Contacto
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold dark:text-white">
                    <Phone size={10} className="text-blue-600" />{" "}
                    {b.phone || "N/A"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleBarberStatus(b.id)}
                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-2 transition-all ${
                  b.active
                    ? "border-blue-600/10 text-blue-600 bg-blue-50/50 dark:bg-blue-600/5 hover:bg-blue-600 hover:text-white"
                    : "border-slate-200 text-slate-400 bg-slate-50"
                }`}
              >
                {b.active ? "En Turno" : "Fuera de Turno"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL PARA BARBEROS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-white/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <h2 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white mb-8">
              {editingId ? "Editar" : "Nuevo"}{" "}
              <span className="text-blue-600">Barbero</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="Ej. Miguel Angel"
                  value={formData.name}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white focus:ring-2 focus:ring-blue-600/20"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Especialidad
                </label>
                <select
                  value={formData.specialty}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                >
                  <option>Corte & Barba</option>
                  <option>Colorista</option>
                  <option>Experto en Degradados</option>
                  <option>Tratamientos Capilares</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  placeholder="+34 000 000 000"
                  value={formData.phone}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all mt-4"
              >
                Confirmar Registro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
