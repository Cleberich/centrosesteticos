"use client";
import React, { useState } from "react";
import {
  Plus,
  Scissors,
  Clock,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  Circle,
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
  const [currentService, setCurrentService] = useState({
    name: "",
    price: "",
    time: "",
    category: "Cabello",
  });
  const [isEditing, setIsEditing] = useState(false);

  const openCreateModal = () => {
    setCurrentService({ name: "", price: "", time: "", category: "Cabello" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setCurrentService(service);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setServices(
        services.map((s) => (s.id === currentService.id ? currentService : s))
      );
    } else {
      setServices([
        ...services,
        { ...currentService, id: Date.now(), active: true },
      ]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-[#0a0f1a]">
      <header className="flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <h1 className="text-xl font-bold dark:text-white">Servicios</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Nuevo Servicio
        </button>
      </header>

      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((s) => (
          <div
            key={s.id}
            className="group bg-white dark:bg-slate-900 border rounded-2xl p-5 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                {s.category}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(s)}
                  className="p-1.5 text-slate-400 hover:text-blue-600"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() =>
                    setServices(services.filter((x) => x.id !== s.id))
                  }
                  className="p-1.5 text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="font-bold dark:text-white">{s.name}</h3>
            <p className="text-sm text-slate-500">
              ${s.price} • {s.time} min
            </p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 dark:text-white">
              {isEditing ? "Editar Servicio" : "Nuevo Servicio"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={currentService.name}
                onChange={(e) =>
                  setCurrentService({ ...currentService, name: e.target.value })
                }
                placeholder="Nombre"
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none"
                required
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  value={currentService.price}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      price: e.target.value,
                    })
                  }
                  placeholder="Precio"
                  className="w-1/2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none"
                  required
                />
                <input
                  type="number"
                  value={currentService.time}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      time: e.target.value,
                    })
                  }
                  placeholder="Minutos"
                  className="w-1/2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold"
              >
                {isEditing ? "Guardar Cambios" : "Crear Servicio"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
