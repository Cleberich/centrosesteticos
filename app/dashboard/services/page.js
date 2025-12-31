"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Sparkles,
  Clock,
  Edit3,
  Trash2,
  Loader2,
  Flower2,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    time: "",
    category: "Facial",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // CAMBIO A COLECCIÓN centros_estetica
        const docRef = doc(db, "centros_estetica", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setServices(docSnap.data().services || []);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const saveToFirebase = async (newServicesList) => {
    if (!user) return;
    try {
      const docRef = doc(db, "centros_estetica", user.uid);
      await updateDoc(docRef, { services: newServicesList });
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      alert("No se pudo guardar el cambio.");
    }
  };

  const toggleService = async (id) => {
    const updated = services.map((s) =>
      String(s.id) === String(id) ? { ...s, active: !s.active } : s
    );
    setServices(updated);
    await saveToFirebase(updated);
  };

  const deleteService = async (id) => {
    if (window.confirm("¿Eliminar este tratamiento definitivamente?")) {
      const updated = services.filter((s) => String(s.id) !== String(id));
      setServices(updated);
      await saveToFirebase(updated);
    }
  };

  const handleOpenCreate = () => {
    setFormData({ name: "", price: "", time: "", category: "Facial" });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setFormData({
      name: service.name,
      price: service.price,
      time: service.time,
      category: service.category || "Facial",
    });
    setEditingId(service.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedList = [];

    const cleanData = {
      ...formData,
      price: String(formData.price),
      time: Number(formData.time),
    };

    if (editingId) {
      updatedList = services.map((s) =>
        String(s.id) === String(editingId) ? { ...s, ...cleanData } : s
      );
    } else {
      const generateUID = () => Math.random().toString(36).substring(2, 15);
      const newService = {
        ...cleanData,
        id: generateUID(),
        active: true,
      };
      updatedList = [...services, newService];
    }

    setServices(updatedList);
    await saveToFirebase(updatedList);
    setIsModalOpen(false);
    setEditingId(null);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-pink-500" size={32} />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-[#FDF8FA] dark:bg-slate-950">
      <header className="flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-pink-50 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black dark:text-white uppercase tracking-tighter italic">
            Mis <span className="text-pink-500">Tratamientos</span>
          </h1>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-1">
            {services.length} servicios de belleza configurados
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-pink-500 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-500/20"
        >
          <Plus size={16} /> Nuevo Servicio
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className={`group bg-white dark:bg-slate-900 border border-pink-50 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all hover:border-pink-200 ${
                !s.active && "opacity-50 grayscale"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="size-12 bg-pink-50 dark:bg-pink-900/20 rounded-2xl flex items-center justify-center text-pink-500">
                  <Flower2 size={24} />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-2 text-slate-300 hover:text-pink-500 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => deleteService(s.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-black dark:text-white uppercase italic mb-2 tracking-tight">
                {s.name}
              </h3>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xl font-black text-pink-500">
                  ${s.price}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Clock size={14} /> {s.time} min
                </span>
              </div>

              <button
                onClick={() => toggleService(s.id)}
                className={`w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border-2 transition-all ${
                  s.active
                    ? "border-emerald-500/20 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-600 hover:text-white"
                    : "border-slate-100 text-slate-400 bg-slate-50 hover:bg-slate-200"
                }`}
              >
                {s.active ? "En catálogo" : "Oculto"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-white/5">
            <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white mb-8 italic">
              {editingId ? "Actualizar" : "Nuevo"}{" "}
              <span className="text-pink-500">Tratamiento</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Nombre del Tratamiento
                </label>
                <input
                  type="text"
                  placeholder="Ej: Limpieza Facial profunda"
                  value={formData.name}
                  className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white border-2 border-transparent focus:border-pink-500/20 focus:bg-white transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Inversión ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white border-2 border-transparent focus:border-pink-500/20 focus:bg-white transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Duración (Min)
                  </label>
                  <input
                    type="number"
                    value={formData.time}
                    className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white border-2 border-transparent focus:border-pink-500/20 focus:bg-white transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-pink-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-pink-500/30 hover:bg-pink-600 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {editingId ? "Actualizar Datos" : "Crear Servicio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
