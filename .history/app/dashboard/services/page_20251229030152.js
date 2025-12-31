"use client";
import React, { useState } from "react";
import {
  Plus,
  Scissors,
  Clock,
  MoreVertical,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  X,
} from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Corte Clásico",
      price: 20,
      time: 30,
      active: true,
      category: "Cabello",
    },
    {
      id: 2,
      name: "Barba Royal",
      price: 15,
      time: 20,
      active: true,
      category: "Barba",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para el formulario (sirve para nuevo y para editar)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    time: "",
    category: "Cabello",
  });
  // Estado para saber qué ID estamos editando (null si es nuevo)
  const [editingId, setEditingId] = useState(null);

  const toggleService = (id) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const deleteService = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este servicio?")) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  // Abrir modal para NUEVO
  const handleOpenCreate = () => {
    setFormData({ name: "", price: "", time: "", category: "Cabello" });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Abrir modal para EDITAR
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingId) {
      // Lógica de EDITAR
      setServices(
        services.map((s) => (s.id === editingId ? { ...s, ...formData } : s))
      );
    } else {
      // Lógica de CREAR
      setServices([...services, { ...formData, id: Date.now(), active: true }]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-[#0a0f1a]">
      <header className="flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold dark:text-white">
            Catálogo de Servicios
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {services.length} servicios disponibles
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} /> Añadir Servicio
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((s) => (
            <div
              key={s.id}
              className={`group bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all hover:border-blue-500/30 ${
                !s.active && "opacity-60 border-dashed"
              }`}
            >
              <div className="flex justify-between mb-6">
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-md">
                  {s.category}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => deleteService(s.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold dark:text-white mb-1">
                {s.name}
              </h3>
              <div className="flex items-center gap-3 text-slate-400 mb-6">
                <div className="flex items-center gap-1 text-xs">
                  <Clock size={12} /> {s.time} min
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  ${s.price}
                </div>
              </div>

              <button
                onClick={() => toggleService(s.id)}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                  s.active ? "text-emerald-500" : "text-slate-300"
                }`}
              >
                {s.active ? <CheckCircle2 size={14} /> : <Circle size={14} />}{" "}
                {s.active ? "Activo" : "Pausado"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL UNIFICADO (NUEVO / EDITAR) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">
                {editingId ? "Editar Servicio" : "Nuevo Servicio"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Nombre del servicio
                </label>
                <input
                  type="text"
                  value={formData.name}
                  placeholder="Ej: Corte Degradado"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 border border-transparent focus:border-blue-600/50 transition-all dark:text-white"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    placeholder="20"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 transition-all dark:text-white"
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                    Tiempo (Min)
                  </label>
                  <input
                    type="number"
                    value={formData.time}
                    placeholder="30"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 transition-all dark:text-white"
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] mt-2"
              >
                {editingId ? "Guardar Cambios" : "Crear Servicio"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
