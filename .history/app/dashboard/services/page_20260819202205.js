// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Plus,
//   Sparkles,
//   Clock,
//   Edit3,
//   Trash2,
//   Loader2,
//   Flower2,
// } from "lucide-react";
// // Firebase
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// export default function ServicesPage() {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     time: "",
//     category: "Facial",
//   });
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         // CAMBIO A COLECCIÓN centros_estetica
//         const docRef = doc(db, "centros_estetica", currentUser.uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           setServices(docSnap.data().services || []);
//         }
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const saveToFirebase = async (newServicesList) => {
//     if (!user) return;
//     try {
//       const docRef = doc(db, "centros_estetica", user.uid);
//       await updateDoc(docRef, { services: newServicesList });
//     } catch (error) {
//       console.error("Error al guardar en Firebase:", error);
//       alert("No se pudo guardar el cambio.");
//     }
//   };

//   const toggleService = async (id) => {
//     const updated = services.map((s) =>
//       String(s.id) === String(id) ? { ...s, active: !s.active } : s
//     );
//     setServices(updated);
//     await saveToFirebase(updated);
//   };

//   const deleteService = async (id) => {
//     if (window.confirm("¿Eliminar este tratamiento definitivamente?")) {
//       const updated = services.filter((s) => String(s.id) !== String(id));
//       setServices(updated);
//       await saveToFirebase(updated);
//     }
//   };

//   const handleOpenCreate = () => {
//     setFormData({ name: "", price: "", time: "", category: "Facial" });
//     setEditingId(null);
//     setIsModalOpen(true);
//   };

//   const handleOpenEdit = (service) => {
//     setFormData({
//       name: service.name,
//       price: service.price,
//       time: service.time,
//       category: service.category || "Facial",
//     });
//     setEditingId(service.id);
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let updatedList = [];

//     const cleanData = {
//       ...formData,
//       price: String(formData.price),
//       time: Number(formData.time),
//     };

//     if (editingId) {
//       updatedList = services.map((s) =>
//         String(s.id) === String(editingId) ? { ...s, ...cleanData } : s
//       );
//     } else {
//       const generateUID = () => Math.random().toString(36).substring(2, 15);
//       const newService = {
//         ...cleanData,
//         id: generateUID(),
//         active: true,
//       };
//       updatedList = [...services, newService];
//     }

//     setServices(updatedList);
//     await saveToFirebase(updatedList);
//     setIsModalOpen(false);
//     setEditingId(null);
//   };

//   if (loading)
//     return (
//       <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
//         <Loader2 className="animate-spin text-pink-500" size={32} />
//       </div>
//     );

//   return (
//     <div className="flex flex-col h-full bg-[#FDF8FA] dark:bg-slate-950">
//       <header className="flex items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-pink-50 dark:border-slate-800">
//         <div>
//           <h1 className="text-xl font-black dark:text-white uppercase tracking-tighter italic">
//             Mis <span className="text-pink-500">Tratamientos</span>
//           </h1>
//           <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-1">
//             {services.length} servicios de belleza configurados
//           </p>
//         </div>
//         <button
//           onClick={handleOpenCreate}
//           className="bg-pink-500 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-500/20"
//         >
//           <Plus size={16} /> Nuevo Servicio
//         </button>
//       </header>

//       <div className="flex-1 overflow-y-auto p-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {services.map((s) => (
//             <div
//               key={s.id}
//               className={`group bg-white dark:bg-slate-900 border border-pink-50 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all hover:border-pink-200 ${
//                 !s.active && "opacity-50 grayscale"
//               }`}
//             >
//               <div className="flex justify-between items-start mb-6">
//                 <div className="size-12 bg-pink-50 dark:bg-pink-900/20 rounded-2xl flex items-center justify-center text-pink-500">
//                   <Flower2 size={24} />
//                 </div>
//                 <div className="flex gap-1">
//                   <button
//                     onClick={() => handleOpenEdit(s)}
//                     className="p-2 text-slate-300 hover:text-pink-500 transition-colors"
//                   >
//                     <Edit3 size={18} />
//                   </button>
//                   <button
//                     onClick={() => deleteService(s.id)}
//                     className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>

//               <h3 className="text-lg font-black dark:text-white uppercase italic mb-2 tracking-tight">
//                 {s.name}
//               </h3>
//               <div className="flex items-center gap-4 mb-8">
//                 <span className="text-xl font-black text-pink-500">
//                   ${s.price}
//                 </span>
//                 <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
//                   <Clock size={14} /> {s.time} min
//                 </span>
//               </div>

//               <button
//                 onClick={() => toggleService(s.id)}
//                 className={`w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border-2 transition-all ${
//                   s.active
//                     ? "border-emerald-500/20 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-600 hover:text-white"
//                     : "border-slate-100 text-slate-400 bg-slate-50 hover:bg-slate-200"
//                 }`}
//               >
//                 {s.active ? "En catálogo" : "Oculto"}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
//           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-white/5">
//             <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white mb-8 italic">
//               {editingId ? "Actualizar" : "Nuevo"}{" "}
//               <span className="text-pink-500">Tratamiento</span>
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
//                   Nombre del Tratamiento
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Ej: Limpieza Facial profunda"
//                   value={formData.name}
//                   className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white border-2 border-transparent focus:border-pink-500/20 focus:bg-white transition-all"
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
//                     Inversión ($)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.price}
//                     className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white border-2 border-transparent focus:border-pink-500/20 focus:bg-white transition-all"
//                     onChange={(e) =>
//                       setFormData({ ...formData, price: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
//                     Duración (Min)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.time}
//                     className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white border-2 border-transparent focus:border-pink-500/20 focus:bg-white transition-all"
//                     onChange={(e) =>
//                       setFormData({ ...formData, time: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-4 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors"
//                 >
//                   Cerrar
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-[2] py-4 bg-pink-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-pink-500/30 hover:bg-pink-600 hover:scale-[1.02] active:scale-95 transition-all"
//                 >
//                   {editingId ? "Actualizar Datos" : "Crear Servicio"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Clock,
  Edit3,
  Trash2,
  Loader2,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const CATEGORIES = [
  "Todos",
  "Facial",
  "Corporal",
  "Capilar",
  "Depilación",
  "Masajes",
  "Otros",
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Modal
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
        try {
          const docRef = doc(db, "centros_estetica", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setServices(docSnap.data().services || []);
          }
        } catch (error) {
          console.error("Error al obtener servicios:", error);
        } finally {
          setLoading(false);
        }
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
      String(s.id) === String(id) ? { ...s, active: !s.active } : s,
    );
    setServices(updated);
    await saveToFirebase(updated);
  };

  const deleteService = async (id) => {
    if (window.confirm("¿Desea eliminar este tratamiento del catálogo?")) {
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
        String(s.id) === String(editingId) ? { ...s, ...cleanData } : s,
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

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch = s.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" ||
        (s.category || "Facial") === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-400">
            Cargando catálogo...
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased overflow-y-auto">
      {/* HEADER */}
      <header className="px-8 py-5 bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-emerald-600 uppercase">
            Gestión de Catálogo
          </span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Tratamientos & Servicios
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-colors shadow-xs"
        >
          <Plus size={16} />
          <span>Nuevo Tratamiento</span>
        </button>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Buscar tratamiento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    : "text-slate-500 hover:bg-slate-50 border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRID DE TRATAMIENTOS */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-2xs">
            <Sparkles className="mx-auto text-slate-300 mb-3" size={32} />
            <h3 className="text-sm font-semibold text-slate-700">
              No se encontraron tratamientos
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Intente ajustar los términos de búsqueda o modifique la categoría
              seleccionada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map((s) => (
              <div
                key={s.id}
                className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs flex flex-col justify-between transition-all hover:border-slate-200 ${
                  !s.active ? "opacity-60 bg-slate-50/50" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-100">
                      <Tag size={12} className="text-slate-400" />
                      {s.category || "Facial"}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => deleteService(s.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-3">
                    {s.name}
                  </h3>
                </div>

                <div>
                  <div className="flex items-baseline justify-between py-3 border-t border-slate-100 mb-3">
                    <span className="text-base font-bold text-slate-900">
                      ${s.price}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock size={13} /> {s.time} min
                    </span>
                  </div>

                  <button
                    onClick={() => toggleService(s.id)}
                    className={`w-full py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                      s.active
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200/80"
                    }`}
                  >
                    {s.active ? (
                      <>
                        <CheckCircle2 size={14} /> Activo en Catálogo
                      </>
                    ) : (
                      <>
                        <XCircle size={14} /> Desactivado
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL CREAR / EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 antialiased">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              {editingId ? "Editar Tratamiento" : "Nuevo Tratamiento"}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Complete los detalles del servicio para actualizar su oferta
              clínica.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Nombre del Tratamiento
                </label>
                <input
                  type="text"
                  placeholder="Ej: Limpieza Facial Profunda"
                  value={formData.name}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                >
                  {CATEGORIES.filter((c) => c !== "Todos").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    value={formData.time}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 py-2.5 rounded-xl text-xs font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-medium transition-colors shadow-xs"
                >
                  {editingId ? "Guardar Cambios" : "Crear Servicio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
