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
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Clock,
  Sparkles,
  Star,
  CreditCard,
  MessageSquare,
  LogOut,
  Plus,
  Search,
  Filter,
  Phone,
  MoreVertical,
  X,
  Camera,
  Loader2,
  AlertTriangle,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function SpecialistsByutiePage() {
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

  const PLAN_LIMITS = { Soft: 1, Radiance: 4, Diamond: Infinity };

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
            setPlan(data.plan?.type || "Soft");
          }
        } catch (error) {
          console.error("Error al cargar:", error);
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
      reviewsCount: s.reviewsCount || Math.floor(Math.random() * 500) + 100,
    }));

    try {
      const docRef = doc(db, "centros_estetica", user.uid);
      await updateDoc(docRef, { specialists: cleanedData });
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
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
        reviewsCount: 120,
      };
      updatedList = [...specialists, newSpecialist];
    }
    setSpecialists(updatedList);
    await saveToFirebase(updatedList);
    setIsModalOpen(false);
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

  const filteredSpecialists = specialists.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="animate-spin text-[#4ADE80]" size={32} />
      </div>
    );

  return (
    <div className="flex h-screen bg-[#FAF8F5] text-slate-700 font-sans antialiased overflow-hidden">
      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF8F5] overflow-y-auto">
        {/* Top Header */}
        <header className="flex items-center justify-between px-10 py-6 bg-[#FAF8F5]">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Especialistas
          </h1>
        </header>

        {/* Filter Controls & Search */}
        <div className="px-10 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs font-medium text-slate-600 shadow-xs">
              <span>Specialization</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs font-medium text-slate-600 shadow-xs">
              <span>Status</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search Doctor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs outline-none focus:border-[#4ADE80] w-60 shadow-xs"
              />
            </div>

            <button
              onClick={handleOpenCreate}
              className="bg-[#4ADE80] hover:bg-[#22C55E] text-slate-900 font-bold px-4 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={15} /> Add Doctor
            </button>
          </div>
        </div>

        {/* Doctor Grid (Fiel al Layout Byutie) */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSpecialists.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-slate-200/70 rounded-3xl p-6 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-shadow relative group"
            >
              {/* Botón Editar rápido */}
              <button
                onClick={() => handleOpenEdit(s)}
                className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical size={16} />
              </button>

              {/* Avatar circular perfecto */}
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-slate-100">
                <img
                  src={
                    s.imageUrl ||
                    `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80`
                  }
                  className="w-full h-full object-cover"
                  alt={s.name}
                />
              </div>

              {/* Nombre y Especialidad */}
              <h3 className="text-sm font-bold text-slate-800 leading-snug">
                Dr. {s.name}
              </h3>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-400 font-medium">
                  DB-00{s.id % 99}
                </span>
                <span className="text-[10px] text-slate-400">•</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {s.specialty}
                </span>
              </div>

              {/* Telefono */}
              <p className="text-[11px] text-slate-400 mt-1 font-normal">
                {s.phone || "(123) 456-7890"}
              </p>

              {/* Divider */}
              <div className="w-full h-px bg-slate-100 my-4" />

              {/* Rating & Reviews */}
              <div className="flex items-center justify-between w-full text-xs px-2">
                <div className="flex items-center gap-1">
                  <Star className="text-amber-400 fill-amber-400" size={13} />
                  <span className="font-bold text-slate-800">
                    {s.rating || "4.9"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  ({s.reviewsCount || "1,200"} reviews)
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL CREAR / EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl relative border border-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <h2 className="text-base font-bold text-slate-800 mb-4">
              {editingId ? "Edit Doctor" : "Add New Doctor"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="flex flex-col items-center gap-2">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer relative group flex items-center justify-center"
                >
                  <img
                    src={
                      formData.imageUrl ||
                      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200"
                    }
                    className="w-full h-full object-cover"
                    alt="Doctor"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="text-white" size={16} />
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
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  required
                  placeholder="Olivia Grant"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#4ADE80]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Specialty
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) =>
                      setFormData({ ...formData, specialty: e.target.value })
                    }
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#4ADE80]"
                  >
                    <option>Dermatology</option>
                    <option>Cosmetología</option>
                    <option>Peluquería</option>
                    <option>Manicuría</option>
                    <option>Pestañas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Commission %
                  </label>
                  <input
                    type="number"
                    value={formData.commission}
                    onChange={(e) =>
                      setFormData({ ...formData, commission: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#4ADE80]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Phone
                </label>
                <input
                  placeholder="(123) 456-7892"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#4ADE80]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4ADE80] hover:bg-[#22C55E] text-slate-900 font-bold rounded-xl text-xs transition-colors mt-2"
              >
                Save Doctor
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
