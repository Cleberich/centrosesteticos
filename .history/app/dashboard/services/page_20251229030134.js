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
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    time: "",
    category: "Cabello",
  });

  const toggleService = (id) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const deleteService = (id) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const addService = (e) => {
    e.preventDefault();
    if (!newService.name || !newService.price) return;
    setServices([...services, { ...newService, id: Date.now(), active: true }]);
    setIsModalOpen(false);
    setNewService({ name: "", price: "", time: "", category: "Cabello" });
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
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Añadir Servicio
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((s) => (
            <div
              key={s.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all ${
                !s.active && "opacity-60 border-dashed"
              }`}
            >
              <div className="flex justify-between mb-6">
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-md">
                  {s.category}
                </span>
                <button
                  onClick={() => deleteService(s.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="text-base font-bold dark:text-white">{s.name}</h3>
              <p className="text-xs text-slate-400 mb-6">
                {s.time} min •{" "}
                <span className="text-slate-900 dark:text-white font-bold">
                  ${s.price}
                </span>
              </p>
              <button
                onClick={() => toggleService(s.id)}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
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

      {/* MODAL PARA NUEVO SERVICIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">
                Nuevo Servicio
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={addService} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre (Ej: Corte Degradado)"
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Precio ($)"
                  className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none"
                  onChange={(e) =>
                    setNewService({ ...newService, price: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Tiempo (Min)"
                  className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none"
                  onChange={(e) =>
                    setNewService({ ...newService, time: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
              >
                Guardar Servicio
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
