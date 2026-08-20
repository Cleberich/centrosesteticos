// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Plus,
//   Phone,
//   Edit3,
//   Trash2,
//   X,
//   Loader2,
//   Star,
//   Camera,
//   Upload,
//   AlertTriangle,
//   Sparkles,
// } from "lucide-react";
// // Firebase
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// export default function SpecialistsPage() {
//   const [specialists, setSpecialists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [plan, setPlan] = useState("Soft");
//   const fileInputRef = useRef(null);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     specialty: "Cosmetología",
//     phone: "",
//     imageUrl: "",
//     commission: 40,
//   });
//   const [editingId, setEditingId] = useState(null);

//   const PLAN_LIMITS = {
//     Soft: 1,
//     Radiance: 4,
//     Diamond: Infinity,
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         try {
//           // CAMBIO A COLECCIÓN centros_estetica
//           const docRef = doc(db, "centros_estetica", currentUser.uid);
//           const docSnap = await getDoc(docRef);
//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setSpecialists(data.specialists || []);
//             const planType = data.plan?.type || "Soft";
//             setPlan(planType);
//           }
//         } catch (error) {
//           console.error("Error al cargar datos:", error);
//         }
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = (event) => {
//       const img = new Image();
//       img.src = event.target.result;
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         const MAX_WIDTH = 300;
//         const scaleSize = MAX_WIDTH / img.width;
//         canvas.width = MAX_WIDTH;
//         canvas.height = img.height * scaleSize;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
//         setFormData((prev) => ({ ...prev, imageUrl: compressedBase64 }));
//       };
//     };
//   };

//   const saveToFirebase = async (newList) => {
//     if (!user) return;

//     const cleanedData = newList.map((s) => ({
//       id: s.id || Date.now(),
//       name: s.name || "Sin nombre",
//       specialty: s.specialty || "Esteticista",
//       phone: s.phone || "",
//       imageUrl: s.imageUrl || "",
//       commission: Number(s.commission) || 0,
//       active: s.active ?? true,
//       rating: s.rating || 5.0,
//     }));

//     try {
//       const docRef = doc(db, "centros_estetica", user.uid);
//       await updateDoc(docRef, { specialists: cleanedData });
//     } catch (error) {
//       alert("Error al guardar: " + error.message);
//     }
//   };

//   const deleteSpecialist = async (id) => {
//     if (window.confirm("¿Eliminar este especialista del equipo?")) {
//       const updated = specialists.filter((s) => s.id !== id);
//       setSpecialists(updated);
//       await saveToFirebase(updated);
//     }
//   };

//   const handleOpenCreate = () => {
//     if (specialists.length >= (PLAN_LIMITS[plan] || 1)) {
//       alert(`Tu plan ${plan} tiene el cupo lleno.`);
//       return;
//     }
//     setFormData({
//       name: "",
//       specialty: "Cosmetología",
//       phone: "",
//       imageUrl: "",
//       commission: 40,
//     });
//     setEditingId(null);
//     setIsModalOpen(true);
//   };

//   const handleOpenEdit = (specialist) => {
//     setFormData({
//       name: specialist.name || "",
//       specialty: specialist.specialty || "Cosmetología",
//       phone: specialist.phone || "",
//       imageUrl: specialist.imageUrl || "",
//       commission: specialist.commission || 40,
//     });
//     setEditingId(specialist.id);
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let updatedList = [];

//     if (editingId) {
//       updatedList = specialists.map((s) =>
//         s.id === editingId ? { ...s, ...formData } : s
//       );
//     } else {
//       const newSpecialist = {
//         ...formData,
//         id: Date.now(),
//         active: true,
//         rating: 5.0,
//       };
//       updatedList = [...specialists, newSpecialist];
//     }

//     setSpecialists(updatedList);
//     await saveToFirebase(updatedList);
//     setIsModalOpen(false);
//   };

//   if (loading)
//     return (
//       <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
//         <Loader2 className="animate-spin text-pink-500" size={32} />
//       </div>
//     );

//   return (
//     <div className="flex flex-col h-full bg-[#FDF8FA] dark:bg-slate-950">
//       <header className="flex items-center justify-between px-8 py-8 bg-white dark:bg-slate-900 border-b border-pink-50 dark:border-slate-800">
//         <div>
//           <h1 className="text-xl font-black dark:text-white uppercase tracking-tighter italic leading-none">
//             Equipo de <span className="text-pink-500">Especialistas</span>
//           </h1>
//           <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-1">
//             Cupo: {specialists.length} de{" "}
//             {PLAN_LIMITS[plan] === Infinity ? "∞" : PLAN_LIMITS[plan]} ({plan})
//           </p>
//         </div>
//         <button
//           onClick={handleOpenCreate}
//           className="bg-pink-500 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-500/20 hover:bg-pink-600 transition-all flex items-center gap-2"
//         >
//           <Plus size={16} /> Agregar Profesional
//         </button>
//       </header>

//       {specialists.length >= (PLAN_LIMITS[plan] || 1) && (
//         <div className="mx-8 mt-6 p-4 bg-pink-50 border border-pink-100 rounded-2xl flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <AlertTriangle className="text-pink-500" size={18} />
//             <p className="text-[10px] font-black text-pink-700 uppercase tracking-widest">
//               Límite de especialistas alcanzado.
//             </p>
//           </div>
//           <a
//             href="/dashboard/settings"
//             className="text-[10px] font-black uppercase text-pink-600 hover:underline"
//           >
//             Subir de Plan
//           </a>
//         </div>
//       )}

//       <div className="flex-1 overflow-y-auto p-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//           {specialists.map((s) => (
//             <div
//               key={s.id}
//               className="bg-white dark:bg-slate-900 border border-pink-50 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm transition-all hover:border-pink-200"
//             >
//               <div className="flex justify-between items-start mb-8">
//                 <div className="size-24 rounded-[2rem] overflow-hidden bg-pink-50 border-4 border-white shadow-xl">
//                   <img
//                     src={
//                       s.imageUrl ||
//                       `https://api.dicebear.com/7.x/adventurer/svg?seed=${s.name}`
//                     }
//                     className="w-full h-full object-cover"
//                     alt={s.name}
//                   />
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleOpenEdit(s)}
//                     className="p-3 text-slate-400 hover:text-pink-500 bg-pink-50 dark:bg-slate-800 rounded-2xl transition-colors"
//                   >
//                     <Edit3 size={18} />
//                   </button>
//                   <button
//                     onClick={() => deleteSpecialist(s.id)}
//                     className="p-3 text-slate-400 hover:text-rose-500 bg-pink-50 dark:bg-slate-800 rounded-2xl transition-colors"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//               <h3 className="text-xl font-black dark:text-white uppercase italic tracking-tight">
//                 {s.name}
//               </h3>
//               <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mt-1">
//                 {s.specialty}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
//           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-10 right-10 text-slate-300 hover:text-pink-500"
//             >
//               <X size={24} />
//             </button>
//             <h2 className="text-2xl font-black uppercase dark:text-white mb-8 italic">
//               Ficha de <span className="text-pink-500">Especialista</span>
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="flex flex-col items-center gap-4 mb-6">
//                 <div
//                   onClick={() => fileInputRef.current.click()}
//                   className="group relative size-32 rounded-[2.5rem] overflow-hidden bg-pink-50 border-4 border-pink-500/20 cursor-pointer shadow-inner"
//                 >
//                   <img
//                     src={
//                       formData.imageUrl ||
//                       `https://api.dicebear.com/7.x/adventurer/svg?seed=${
//                         formData.name || "appestetica"
//                       }`
//                     }
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-pink-500/20 transition-all">
//                     <Camera className="text-white" size={28} />
//                   </div>
//                 </div>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleImageUpload}
//                   accept="image/*"
//                   className="hidden"
//                 />
//               </div>

//               <div className="space-y-4">
//                 <input
//                   required
//                   placeholder="Nombre Completo"
//                   value={formData.name}
//                   className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold uppercase tracking-tight text-sm"
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                 />

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-1.5">
//                     <label className="text-[9px] font-black text-slate-400 uppercase ml-2">
//                       Comisión %
//                     </label>
//                     <input
//                       type="number"
//                       placeholder="40"
//                       value={formData.commission}
//                       className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold"
//                       onChange={(e) =>
//                         setFormData({ ...formData, commission: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="text-[9px] font-black text-slate-400 uppercase ml-2">
//                       Especialidad
//                     </label>
//                     <select
//                       value={formData.specialty}
//                       className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-xs uppercase"
//                       onChange={(e) =>
//                         setFormData({ ...formData, specialty: e.target.value })
//                       }
//                     >
//                       <option>Cosmetología</option>
//                       <option>Manicuría</option>
//                       <option>Dermatología</option>
//                       <option>Masajes</option>
//                       <option>Pestañas & Cejas</option>
//                     </select>
//                   </div>
//                 </div>

//                 <input
//                   placeholder="WhatsApp de Contacto"
//                   value={formData.phone}
//                   className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold"
//                   onChange={(e) =>
//                     setFormData({ ...formData, phone: e.target.value })
//                   }
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full py-5 bg-pink-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-pink-500/20 hover:bg-pink-600 transition-all text-xs mt-4"
//               >
//                 Guardar Especialista
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Phone,
  Edit3,
  Trash2,
  X,
  Loader2,
  Camera,
  AlertTriangle,
  Star,
  Search,
  Filter,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState("Soft");
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "Cosmetología",
    phone: "",
    imageUrl: "",
    commission: 40,
  });
  const [editingId, setEditingId] = useState(null);

  const PLAN_LIMITS = {
    Soft: 1,
    Radiance: 4,
    Diamond: Infinity,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, "centros_estetica", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSpecialists(data.specialists || []);
            const planType = data.plan?.type || "Soft";
            setPlan(planType);
          }
        } catch (error) {
          console.error("Error al cargar datos:", error);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
        setFormData((prev) => ({ ...prev, imageUrl: compressedBase64 }));
      };
    };
  };

  const saveToFirebase = async (newList) => {
    if (!user) return;

    const cleanedData = newList.map((s) => ({
      id: s.id || Date.now(),
      name: s.name || "Sin nombre",
      specialty: s.specialty || "Esteticista",
      phone: s.phone || "",
      imageUrl: s.imageUrl || "",
      commission: Number(s.commission) || 0,
      active: s.active ?? true,
      rating: s.rating || 4.9,
    }));

    try {
      const docRef = doc(db, "centros_estetica", user.uid);
      await updateDoc(docRef, { specialists: cleanedData });
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  const deleteSpecialist = async (id) => {
    if (window.confirm("¿Eliminar este especialista del equipo?")) {
      const updated = specialists.filter((s) => s.id !== id);
      setSpecialists(updated);
      await saveToFirebase(updated);
    }
  };

  const handleOpenCreate = () => {
    if (specialists.length >= (PLAN_LIMITS[plan] || 1)) {
      alert(`Tu plan ${plan} tiene el cupo lleno.`);
      return;
    }
    setFormData({
      name: "",
      specialty: "Cosmetología",
      phone: "",
      imageUrl: "",
      commission: 40,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (specialist) => {
    setFormData({
      name: specialist.name || "",
      specialty: specialist.specialty || "Cosmetología",
      phone: specialist.phone || "",
      imageUrl: specialist.imageUrl || "",
      commission: specialist.commission || 40,
    });
    setEditingId(specialist.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedList = [];

    if (editingId) {
      updatedList = specialists.map((s) =>
        s.id === editingId ? { ...s, ...formData } : s,
      );
    } else {
      const newSpecialist = {
        ...formData,
        id: Date.now(),
        active: true,
        rating: 4.9,
      };
      updatedList = [...specialists, newSpecialist];
    }

    setSpecialists(updatedList);
    await saveToFirebase(updatedList);
    setIsModalOpen(false);
  };

  const filteredSpecialists = specialists.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9FAFB] dark:bg-slate-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] dark:bg-slate-950 text-slate-700 dark:text-slate-200">
      {/* Top Bar / Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            Especialistas
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-1">
            Cupo disponible: {specialists.length} de{" "}
            {PLAN_LIMITS[plan] === Infinity ? "∞" : PLAN_LIMITS[plan]} ({plan})
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-semibold px-5 py-2.5 rounded-full text-xs transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Agregar Profesional
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Banner de Límite de Plan */}
        {specialists.length >= (PLAN_LIMITS[plan] || 1) && (
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-400" size={18} />
              <p className="text-xs font-medium text-orange-800">
                Límite de especialistas alcanzado en tu plan actual.
              </p>
            </div>
            <a
              href="/dashboard/settings"
              className="text-xs font-semibold text-orange-600 hover:underline"
            >
              Mejorar Plan
            </a>
          </div>
        )}

        {/* Toolbar (Búsqueda) */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>

        {/* Grid de Especialistas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSpecialists.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center relative group"
            >
              {/* Acciones */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 dark:bg-slate-800 rounded-full"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => deleteSpecialist(s.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 bg-slate-50 dark:bg-slate-800 rounded-full"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Avatar */}
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4 border-2 border-slate-50 dark:border-slate-800">
                <img
                  src={
                    s.imageUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`
                  }
                  className="w-full h-full object-cover"
                  alt={s.name}
                />
              </div>

              {/* Datos principales */}
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                {s.name}
              </h3>

              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[11px] font-medium rounded-full mt-1">
                {s.specialty}
              </span>

              {/* Teléfono */}
              {s.phone && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
                  <Phone size={12} />
                  <span>{s.phone}</span>
                </div>
              )}

              {/* Rating & Comisión */}
              <div className="w-full mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {s.rating || "4.9"}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Comisión:{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {s.commission}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Crear / Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-xl relative border border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
              {editingId ? "Editar Especialista" : "Nuevo Especialista"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Foto Upload */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="group relative w-20 h-20 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 cursor-pointer flex items-center justify-center"
                >
                  <img
                    src={
                      formData.imageUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                        formData.name || "estetica"
                      }`
                    }
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={20} />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <span className="text-[11px] text-slate-400">
                  Subir foto de perfil
                </span>
              </div>

              {/* Form Inputs */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Nombre Completo
                </label>
                <input
                  required
                  placeholder="Ej: Sofía Martínez"
                  value={formData.name}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-400"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Especialidad
                  </label>
                  <select
                    value={formData.specialty}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-400"
                    onChange={(e) =>
                      setFormData({ ...formData, specialty: e.target.value })
                    }
                  >
                    <option>Peluquería</option>
                    <option>Manicuría</option>
                    <option>Pestañas & Cejas</option>
                    <option>Cosmetología</option>
                    <option>Masajes</option>
                    <option>Dermatología</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Comisión %
                  </label>
                  <input
                    type="number"
                    placeholder="40"
                    value={formData.commission}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-400"
                    onChange={(e) =>
                      setFormData({ ...formData, commission: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  placeholder="+598 99 123 456"
                  value={formData.phone}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-400"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-semibold rounded-xl text-xs transition-all shadow-sm"
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
