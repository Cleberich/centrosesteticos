"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Phone,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  Star,
  Percent,
  Camera,
  Upload,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function BarbersPage() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "Corte & Barba",
    phone: "",
    imageUrl: "",
    commission: 50,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "barberias", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBarbers(docSnap.data().barbers || []);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- LÓGICA PARA PROCESAR IMAGEN LOCAL ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000000) {
        // Limite 1MB para Firestore
        alert("La imagen es muy pesada. Intenta con una más pequeña.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToFirebase = async (newBarbersList) => {
    if (!user) return;
    try {
      const docRef = doc(db, "barberias", user.uid);
      await updateDoc(docRef, { barbers: newBarbersList });
    } catch (error) {
      alert("Error al guardar cambios");
    }
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
      commission: 50,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (barber) => {
    setFormData({
      name: barber.name,
      specialty: barber.specialty,
      phone: barber.phone,
      imageUrl: barber.imageUrl || "",
      commission: barber.commission || 50,
    });
    setEditingId(barber.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedList = [];
    if (editingId) {
      updatedList = barbers.map((b) =>
        b.id === editingId
          ? { ...b, ...formData, commission: Number(formData.commission) }
          : b
      );
    } else {
      const newBarber = {
        ...formData,
        id: Date.now(),
        active: true,
        rating: 5.0,
        commission: Number(formData.commission),
      };
      updatedList = [...barbers, newBarber];
    }
    setBarbers(updatedList);
    await saveToFirebase(updatedList);
    setIsModalOpen(false);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-[#0a0f1a]">
      <header className="flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold dark:text-white  uppercase tracking-tighter">
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
          <Plus size={16} /> Reclutar
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {barbers.map((b) => (
            <div
              key={b.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all hover:border-blue-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="size-20 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-md">
                  <img
                    src={
                      b.imageUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.name}`
                    }
                    className="w-full h-full object-cover"
                    alt={b.name}
                  />
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
                <h3 className="text-xl font-black dark:text-white uppercase  tracking-tighter">
                  {b.name}
                </h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                  {b.specialty}
                </p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <div className="flex-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    Comisión
                  </p>
                  <p className="text-sm font-bold dark:text-white">
                    {b.commission || 50}%
                  </p>
                </div>
                <div className="flex-1 border-l border-slate-200 dark:border-slate-700 pl-4">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    Rating
                  </p>
                  <p className="text-sm font-bold dark:text-white flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />{" "}
                    5.0
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative border border-white/5">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black  uppercase tracking-tighter dark:text-white mb-8">
              Ficha del <span className="text-blue-600">Barbero</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col items-center gap-4">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="group relative size-28 rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-blue-600/20 cursor-pointer"
                >
                  <img
                    src={
                      formData.imageUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                        formData.name || "default"
                      }`
                    }
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-40"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-blue-600" size={24} />
                    <span className="text-[8px] font-black uppercase text-blue-600 mt-1">
                      Subir Foto
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                  Nombre del Barbero
                </label>
                <input
                  required
                  value={formData.name}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                    Comisión %
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.commission}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white"
                    onChange={(e) =>
                      setFormData({ ...formData, commission: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                    Especialidad
                  </label>
                  <select
                    value={formData.specialty}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white appearance-none"
                    onChange={(e) =>
                      setFormData({ ...formData, specialty: e.target.value })
                    }
                  >
                    <option>Corte & Barba</option>
                    <option>Colorista</option>
                    <option>Diseños/Tribales</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 pb-4">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                  WhatsApp
                </label>
                <input
                  value={formData.phone}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white"
                  placeholder="Ej. 099 123 456"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Upload size={18} /> Confirmar Datos
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
