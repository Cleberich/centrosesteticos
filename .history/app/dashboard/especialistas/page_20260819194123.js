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
  Star,
  Camera,
  AlertTriangle,
  Search,
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
      <div className="flex h-screen items-center justify-center bg-[#FAF8F5] dark:bg-slate-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] dark:bg-slate-950 font-sans text-slate-700 dark:text-slate-200">
      {/* Header Estilo Byutie */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between px-8 py-6 gap-4 bg-transparent">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-white tracking-tight">
            Doctors & Specialists
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cupo disponible: {specialists.length} /{" "}
            {PLAN_LIMITS[plan] === Infinity ? "∞" : PLAN_LIMITS[plan]} (Plan{" "}
            {plan})
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-full text-xs outline-none focus:border-emerald-400 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-xs font-medium shadow-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus size={16} /> Add Doctor
          </button>
        </div>
      </header>

      {/* Banner de Límite de Plan */}
      {specialists.length >= (PLAN_LIMITS[plan] || 1) && (
        <div className="mx-8 mb-4 p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle
              className="text-amber-600 dark:text-amber-400"
              size={16}
            />
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              Has alcanzado el límite de especialistas de tu plan.
            </p>
          </div>
          <a
            href="/dashboard/settings"
            className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
          >
            Upgrade Plan
          </a>
        </div>
      )}

      {/* Grid de Doctores */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredSpecialists.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center relative group"
            >
              {/* Menú de Acciones Rápido */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => deleteSpecialist(s.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Avatar Redondeado */}
              <div className="relative mb-3">
                <div className="size-20 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-50 dark:border-slate-800 shadow-inner">
                  <img
                    src={
                      s.imageUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`
                    }
                    className="w-full h-full object-cover"
                    alt={s.name}
                  />
                </div>
              </div>

              {/* Info Principal */}
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight">
                Dr. {s.name}
              </h3>

              {/* Badge de Especialidad */}
              <span className="mt-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium rounded-full">
                {s.specialty}
              </span>

              {/* Detalle Teléfono y Comisión */}
              <div className="mt-3 pt-3 w-full border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  {s.phone || "N/A"}
                </span>
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  {s.commission}% Com.
                </span>
              </div>

              {/* Valoración Estrellas */}
              <div className="mt-2 flex items-center gap-1 text-amber-400 text-xs">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {s.rating || 4.9}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Estilo Byutie */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative border border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
              {editingId ? "Editar Especialista" : "Agregar Especialista"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-2 mb-2">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="group relative size-20 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <img
                    src={
                      formData.imageUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                        formData.name || "doctor"
                      }`
                    }
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
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
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Nombre Completo
                </label>
                <input
                  required
                  placeholder="Ej. Olivia Grant"
                  value={formData.name}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Especialidad
                  </label>
                  <select
                    value={formData.specialty}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                    onChange={(e) =>
                      setFormData({ ...formData, specialty: e.target.value })
                    }
                  >
                    <option>Cosmetología</option>
                    <option>Manicuría</option>
                    <option>Dermatología</option>
                    <option>Masajes</option>
                    <option>Pestañas & Cejas</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Comisión %
                  </label>
                  <input
                    type="number"
                    placeholder="40"
                    value={formData.commission}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                    onChange={(e) =>
                      setFormData({ ...formData, commission: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  placeholder="+123 456-7890"
                  value={formData.phone}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-xs shadow-sm transition-all mt-2"
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
