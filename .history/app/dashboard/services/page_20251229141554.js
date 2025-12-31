"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Scissors,
  Clock,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  X,
  Loader2,
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
    category: "Cabello",
  });
  const [editingId, setEditingId] = useState(null);

  // --- 1. CARGAR SERVICIOS DESDE FIREBASE ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "barberias", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setServices(docSnap.data().services || []);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- 2. FUNCIÓN PARA GUARDAR EN CLOUD ---
  const saveToFirebase = async (newServicesList) => {
    if (!user) return;
    const docRef = doc(db, "barberias", user.uid);
    await updateDoc(docRef, { services: newServicesList });
  };

  const toggleService = async (id) => {
    const updated = services.map((s) =>
      s.id === id ? { ...s, active: !s.active } : s
    );
    setServices(updated);
    await saveToFirebase(updated);
  };

  const deleteService = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este servicio?")) {
      const updated = services.filter((s) => s.id !== id);
      setServices(updated);
      await saveToFirebase(updated);
    }
  };

  const handleOpenCreate = () => {
    setFormData({ name: "", price: "", time: "", category: "Cabello" });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setFormData({
      name: service.name,
      price: service.price,
      time: service.time,
      category: service.category,
    });
    setEditingId(service.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedList = [];

    if (editingId) {
      updatedList = services.map((s) =>
        s.id === editingId ? { ...s, ...formData } : s
      );
    } else {
      const newService = {
        ...formData,
        id: Date.now(),
        active: true,
      };
      updatedList = [...services, newService];
    }

    setServices(updatedList);
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
            Mis <span className="text-blue-600">Servicios</span>
          </h1>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            {services.length} servicios en catálogo
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20"
        >
          <Plus size={16} /> Añadir Servicio
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-all hover:border-blue-500 ${
                !s.active && "opacity-50 grayscale"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="size-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                  <Scissors size={20} />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteService(s.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-black dark:text-white uppercase italic mb-1">
                {s.name}
              </h3>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-black text-blue-600">
                  ${s.price}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Clock size={12} /> {s.time} min
                </span>
              </div>

              <button
                onClick={() => toggleService(s.id)}
                className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border-2 transition-all ${
                  s.active
                    ? "border-emerald-500/20 text-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5 hover:bg-emerald-500 hover:text-white"
                    : "border-slate-200 text-slate-400 bg-slate-50 hover:bg-slate-200"
                }`}
              >
                {s.active ? "Activo" : "Inactivo"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-white/10">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white mb-8">
              {editingId ? "Editar" : "Nuevo"}{" "}
              <span className="text-blue-600">Servicio</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white"
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Minutos
                  </label>
                  <input
                    type="number"
                    value={formData.time}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white"
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
                  className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
