// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Search,
//   Phone,
//   ChevronRight,
//   Loader2,
//   X,
//   Save,
//   Mail,
//   User,
//   Sparkles,
//   Heart,
// } from "lucide-react";
// // Firebase
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// export default function CustomersPage() {
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [esteticaData, setEsteticaData] = useState(null);

//   // Estados para Edición
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [editForm, setEditForm] = useState({ name: "", phone: "", email: "" });

//   // --- 1. CARGA DE DATOS ---
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           // CAMBIO A COLECCIÓN centros_estetica
//           const docRef = doc(db, "centros_estetica", user.uid);
//           const docSnap = await getDoc(docRef);
//           if (docSnap.exists()) {
//             setEsteticaData(docSnap.data());
//           }
//         } catch (error) {
//           console.error("Error al cargar Clientas:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // --- 2. PROCESAMIENTO DE Clientas ---
//   const customers = useMemo(() => {
//     if (!esteticaData?.appointments) return [];
//     const customerMap = {};
//     const hoy = new Date();

//     esteticaData.appointments.forEach((app) => {
//       const nameKey = (app.customer || "Sin nombre").trim().toLowerCase();
//       if (!customerMap[nameKey]) {
//         customerMap[nameKey] = {
//           name: app.customer || "Sin nombre",
//           email: app.email || "",
//           phone: app.phone || "",
//           visits: 0,
//           totalSpend: 0,
//           lastVisitDate: new Date(0),
//         };
//       }
//       customerMap[nameKey].visits += 1;
//       // En estética solemos usar el precio del servicio si total no existe
//       customerMap[nameKey].totalSpend += Number(app.total || app.price || 0);

//       if (app.phone && !customerMap[nameKey].phone)
//         customerMap[nameKey].phone = app.phone;
//       if (app.email && !customerMap[nameKey].email)
//         customerMap[nameKey].email = app.email;

//       const appDate = new Date(app.paidAt || app.date || app.start);
//       if (appDate > customerMap[nameKey].lastVisitDate)
//         customerMap[nameKey].lastVisitDate = appDate;
//     });

//     return Object.values(customerMap)
//       .map((c) => {
//         const dias = (hoy - c.lastVisitDate) / (1000 * 60 * 60 * 24);
//         let status = "Nueva";
//         if (dias > 60 && c.visits > 1)
//           status = "Inactiva"; // Ciclo más largo en estética
//         else if (c.visits > 15) status = "VIP Diamond";
//         else if (c.visits > 5) status = "Frecuente";
//         return {
//           ...c,
//           status,
//           lastVisitDisplay:
//             c.lastVisitDate.getTime() === 0
//               ? "---"
//               : c.lastVisitDate.toLocaleDateString(),
//         };
//       })
//       .sort((a, b) => b.totalSpend - a.totalSpend);
//   }, [esteticaData]);

//   // --- 3. LÓGICA DE ACTUALIZACIÓN ---
//   const handleEditClick = (customer) => {
//     setSelectedCustomer(customer);
//     setEditForm({
//       name: customer.name,
//       phone: customer.phone,
//       email: customer.email,
//     });
//     setIsEditOpen(true);
//   };

//   const handleSaveCustomer = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const docRef = doc(db, "centros_estetica", auth.currentUser.uid);
//       const updatedAppointments = esteticaData.appointments.map((app) => {
//         if (
//           app.customer.trim().toLowerCase() ===
//           selectedCustomer.name.trim().toLowerCase()
//         ) {
//           return {
//             ...app,
//             customer: editForm.name,
//             phone: editForm.phone,
//             email: editForm.email,
//           };
//         }
//         return app;
//       });

//       await updateDoc(docRef, { appointments: updatedAppointments });
//       setEsteticaData((prev) => ({
//         ...prev,
//         appointments: updatedAppointments,
//       }));
//       setIsEditOpen(false);
//     } catch (error) {
//       alert("Error al actualizar datos de la paciente");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !esteticaData)
//     return (
//       <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#0a0f1a]">
//         <Loader2 className="text-pink-500 animate-spin" size={40} />
//       </div>
//     );

//   const filteredCustomers = customers.filter(
//     (c) =>
//       c.name.toLowerCase().includes(search.toLowerCase()) ||
//       c.phone.includes(search)
//   );

//   return (
//     <div className="flex flex-col h-full bg-[#FDF8FA] dark:bg-[#0a0f1a] relative overflow-hidden font-sans">
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-8 border-b border-pink-50 dark:border-slate-800 gap-4 bg-white dark:bg-slate-900">
//         <div>
//           <h1 className="text-2xl font-black uppercase tracking-tighter  dark:text-white">
//             Base de <span className="text-pink-500">Clientas</span>
//             <span className="ml-3 text-xs font-black bg-pink-50 text-pink-500 px-3 py-1 rounded-full border border-pink-100 uppercase tracking-widest">
//               {filteredCustomers.length} Total
//             </span>
//           </h1>
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 ">
//             Beauty Managment
//           </p>
//         </div>
//         <div className="relative">
//           <Search
//             className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300"
//             size={16}
//           />
//           <input
//             type="text"
//             placeholder="Buscar por nombre o WhatsApp..."
//             className="pl-12 pr-6 py-3.5 bg-pink-50/30 dark:bg-slate-800 border-2 border-transparent focus:border-pink-200 focus:bg-white text-pink-600 rounded-2xl text-xs  tracking-widest outline-none w-full md:w-96 dark:text-white placeholder:text-pink-300 focus:text-pink-800 transition-all"
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* TABLA ESTILO BOUTIQUE */}
//       <div className="flex-1 overflow-auto p-4 md:p-8">
//         <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-pink-50/20 dark:bg-slate-800/50 border-b border-pink-50">
//                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
//                   Paciente
//                 </th>
//                 <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
//                   Categoría
//                 </th>
//                 <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
//                   Sesiones
//                 </th>
//                 <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
//                   Inversión Total
//                 </th>
//                 <th className="px-8 py-5"></th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-pink-50/50 dark:divide-slate-800">
//               {filteredCustomers.map((customer, idx) => (
//                 <tr
//                   key={idx}
//                   onClick={() => handleEditClick(customer)}
//                   className="group hover:bg-pink-50/30 transition-all cursor-pointer"
//                 >
//                   <td className="px-8 py-5">
//                     <div className="flex items-center gap-4">
//                       <div className="size-10 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-50 flex items-center justify-center font-black text-xs text-pink-500 border border-pink-100">
//                         {customer.name.substring(0, 2).toUpperCase()}
//                       </div>
//                       <div>
//                         <p className="text-sm font-black text-slate-800 dark:text-white uppercase  group-hover:text-pink-600">
//                           {customer.name}
//                         </p>
//                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
//                           {customer.phone || "Sin WhatsApp"}
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-5">
//                     <span
//                       className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
//                         customer.status.includes("VIP")
//                           ? "bg-amber-100 text-amber-600 border border-amber-200"
//                           : customer.status === "Frecuente"
//                           ? "bg-pink-100 text-pink-600 border border-pink-200"
//                           : "bg-slate-100 text-slate-500 border border-slate-200"
//                       }`}
//                     >
//                       {customer.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-5 text-center text-sm font-black dark:text-white">
//                     {customer.visits}
//                   </td>
//                   <td className="px-4 py-5 text-sm font-black text-pink-500">
//                     ${customer.totalSpend.toLocaleString()}
//                   </td>
//                   <td className="px-8 py-5 text-right">
//                     <ChevronRight
//                       size={18}
//                       className="inline text-pink-100 group-hover:text-pink-500 transition-all transform group-hover:translate-x-1"
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* DRAWER DE EDICIÓN ESTILO SPA */}
//       {isEditOpen && (
//         <div className="fixed inset-0 z-[100] flex justify-end">
//           <div
//             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
//             onClick={() => setIsEditOpen(false)}
//           />
//           <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl p-10 flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[3rem]">
//             <div className="flex justify-between items-center mb-10">
//               <div className="flex items-center gap-2">
//                 <Heart className="text-pink-500" size={24} />
//                 <h2 className="text-xl font-black uppercase  tracking-tighter dark:text-white">
//                   Perfil de <span className="text-pink-500">Paciente</span>
//                 </h2>
//               </div>
//               <button
//                 onClick={() => setIsEditOpen(false)}
//                 className="p-3 bg-slate-50 rounded-2xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleSaveCustomer} className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
//                   Nombre Completo
//                 </label>
//                 <div className="relative group">
//                   <User
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-200 group-focus-within:text-pink-500 transition-colors"
//                     size={18}
//                   />
//                   <input
//                     required
//                     value={editForm.name}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, name: e.target.value })
//                     }
//                     className="w-full pl-12 pr-6 py-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none border-2 border-transparent focus:border-pink-200 transition-all uppercase"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
//                   WhatsApp Contacto
//                 </label>
//                 <div className="relative group">
//                   <Phone
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-200 group-focus-within:text-pink-500 transition-colors"
//                     size={18}
//                   />
//                   <input
//                     value={editForm.phone}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, phone: e.target.value })
//                     }
//                     className="w-full pl-12 pr-6 py-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none border-2 border-transparent focus:border-pink-200 transition-all"
//                     placeholder="09X XXX XXX"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
//                   Email Notificaciones
//                 </label>
//                 <div className="relative group">
//                   <Mail
//                     className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-200 group-focus-within:text-pink-500 transition-colors"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={editForm.email}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, email: e.target.value })
//                     }
//                     className="w-full pl-12 pr-6 py-4.5 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none border-2 border-transparent focus:border-pink-200 transition-all"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-pink-50">
//                 <div className="text-center p-4 bg-pink-50/30 rounded-3xl">
//                   <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
//                     Sesiones
//                   </p>
//                   <p className="text-2xl font-black text-slate-800 dark:text-white">
//                     {selectedCustomer?.visits}
//                   </p>
//                 </div>
//                 <div className="text-center p-4 bg-pink-500/10 rounded-3xl">
//                   <p className="text-[9px] font-black uppercase text-pink-400 tracking-widest">
//                     Inversión
//                   </p>
//                   <p className="text-2xl font-black text-pink-600">
//                     ${selectedCustomer?.totalSpend.toLocaleString()}
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full flex items-center justify-center gap-3 py-5 bg-pink-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-pink-500/20 hover:bg-pink-600 transition-all active:scale-95"
//               >
//                 <Save size={18} /> Actualizar Paciente
//               </button>
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
  Search,
  Phone,
  ChevronRight,
  Loader2,
  X,
  Save,
  Mail,
  User,
  Plus,
  Filter,
  Calendar,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [esteticaData, setEsteticaData] = useState(null);

  // Estados para Edición / Vista Detalle
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", email: "" });

  // --- 1. CARGA DE DATOS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "centros_estetica", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setEsteticaData(docSnap.data());
          }
        } catch (error) {
          console.error("Error al cargar pacientes:", error);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // --- 2. PROCESAMIENTO DE PACIENTES ---
  const customers = useMemo(() => {
    if (!esteticaData?.appointments) return [];
    const customerMap = {};
    const hoy = new Date();

    esteticaData.appointments.forEach((app) => {
      const nameKey = (app.customer || "Sin nombre").trim().toLowerCase();
      if (!customerMap[nameKey]) {
        customerMap[nameKey] = {
          id: app.id || nameKey,
          name: app.customer || "Sin nombre",
          email: app.email || "",
          phone: app.phone || "",
          visits: 0,
          totalSpend: 0,
          lastVisitDate: new Date(0),
        };
      }
      customerMap[nameKey].visits += 1;
      customerMap[nameKey].totalSpend += Number(app.total || app.price || 0);

      if (app.phone && !customerMap[nameKey].phone)
        customerMap[nameKey].phone = app.phone;
      if (app.email && !customerMap[nameKey].email)
        customerMap[nameKey].email = app.email;

      const appDate = new Date(app.paidAt || app.date || app.start);
      if (appDate > customerMap[nameKey].lastVisitDate)
        customerMap[nameKey].lastVisitDate = appDate;
    });

    return Object.values(customerMap)
      .map((c) => {
        const dias = (hoy - c.lastVisitDate) / (1000 * 60 * 60 * 24);
        let status = "Completado";
        let statusColor =
          "bg-emerald-50 text-emerald-700 border-emerald-200/60";

        if (dias > 60 && c.visits > 1) {
          status = "Inactivo";
          statusColor = "bg-slate-100 text-slate-600 border-slate-200/80";
        } else if (c.visits > 15) {
          status = "VIP Diamond";
          statusColor = "bg-amber-50 text-amber-700 border-amber-200/80";
        } else if (c.visits > 5) {
          status = "Frecuente";
          statusColor = "bg-teal-50 text-teal-700 border-teal-200/80";
        }

        return {
          ...c,
          status,
          statusColor,
          lastVisitDisplay:
            c.lastVisitDate.getTime() === 0
              ? "---"
              : c.lastVisitDate.toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }),
        };
      })
      .sort((a, b) => b.totalSpend - a.totalSpend);
  }, [esteticaData]);

  // --- 3. LÓGICA DE ACTUALIZACIÓN ---
  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    });
    setIsEditOpen(true);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, "centros_estetica", auth.currentUser.uid);
      const updatedAppointments = esteticaData.appointments.map((app) => {
        if (
          app.customer.trim().toLowerCase() ===
          selectedCustomer.name.trim().toLowerCase()
        ) {
          return {
            ...app,
            customer: editForm.name,
            phone: editForm.phone,
            email: editForm.email,
          };
        }
        return app;
      });

      await updateDoc(docRef, { appointments: updatedAppointments });
      setEsteticaData((prev) => ({
        ...prev,
        appointments: updatedAppointments,
      }));
      setIsEditOpen(false);
    } catch (error) {
      alert("Error al actualizar datos de la paciente");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !esteticaData)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#d87cef]/20 border-t-[#d87cef] rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-400">
            Cargando pacientes...
          </p>
        </div>
      </div>
    );

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased overflow-y-auto">
      {/* HEADER ESTILO BYUTIE */}
      <header className="px-8 py-5 bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-emerald-600 uppercase">
            Directorio Medico
          </span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pacientes & Clientes
          </h1>
        </div>

        {/* BÚSQUEDA Y ACCIONES */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={15}
            />
            <input
              type="text"
              placeholder="Buscar paciente, teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-[#d87cef] focus:bg-white transition-all"
            />
          </div>

          <button
            onClick={() => {
              setSelectedCustomer(null);
              setEditForm({ name: "", phone: "", email: "" });
              setIsEditOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-[#d87cef] hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-colors shadow-xs shrink-0"
          >
            <Plus size={16} />
            <span>Nuevo Paciente</span>
          </button>
        </div>
      </header>

      {/* CONTENEDOR DE TABLA DE PACIENTES */}
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Listado de Pacientes
            </h3>
            <span className="text-xs font-medium text-slate-400">
              Total: {filteredCustomers.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-semibold text-slate-400 border-b border-slate-100 bg-slate-50/30">
                  <th className="pl-6 py-3">Paciente</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Última Visita</th>
                  <th className="px-4 py-3 text-center">Sesiones</th>
                  <th className="px-4 py-3 text-right">Inversión Total</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="pr-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-slate-400"
                    >
                      No se encontraron registros de pacientes.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer, idx) => (
                    <tr
                      key={idx}
                      onClick={() => handleEditClick(customer)}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                    >
                      {/* Nombre y Avatar */}
                      <td className="pl-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                            {customer.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                            {customer.name}
                          </span>
                        </div>
                      </td>

                      {/* Teléfono & Email */}
                      <td className="px-4 py-3.5 text-slate-600">
                        <div>{customer.phone || "Sin teléfono"}</div>
                        <div className="text-[11px] text-slate-400">
                          {customer.email || "Sin correo"}
                        </div>
                      </td>

                      {/* Última Visita */}
                      <td className="px-4 py-3.5 text-slate-500 font-medium">
                        {customer.lastVisitDisplay}
                      </td>

                      {/* Cantidad de Sesiones */}
                      <td className="px-4 py-3.5 text-center font-medium text-slate-700">
                        {customer.visits}
                      </td>

                      {/* Total Invertido */}
                      <td className="px-4 py-3.5 text-right font-semibold text-slate-900">
                        ${customer.totalSpend.toLocaleString()}
                      </td>

                      {/* Badge de Estado */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium border ${customer.statusColor}`}
                        >
                          {customer.status}
                        </span>
                      </td>

                      {/* Acción / Chevron */}
                      <td className="pr-6 py-3.5 text-right">
                        <ChevronRight
                          size={16}
                          className="inline text-slate-300 group-hover:text-slate-500 transition-transform group-hover:translate-x-0.5"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DRAWER LATERAL DE PERFIL / EDICIÓN ESTILO BYUTIE */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex justify-end antialiased">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsEditOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between border-l border-slate-100">
            <div>
              {/* Header del Drawer */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Ficha del Paciente
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Modifique la información de contacto e historial
                  </p>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Formulario */}
              <form
                id="patient-form"
                onSubmit={handleSaveCustomer}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 block">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={15}
                    />
                    <input
                      required
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#d87cef] focus:bg-white transition-all"
                      placeholder="Ej. María García"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 block">
                    Teléfono / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={15}
                    />
                    <input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#d87cef] focus:bg-white transition-all"
                      placeholder="+598 99 123 456"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600 block">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={15}
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-[#d87cef] focus:bg-white transition-all"
                      placeholder="paciente@ejemplo.com"
                    />
                  </div>
                </div>

                {/* Métricas rápidas de la paciente dentro del Drawer */}
                {selectedCustomer && (
                  <div className="grid grid-cols-2 gap-3 pt-4 mt-6 border-t border-slate-100">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[11px] text-slate-400 font-medium">
                        Atenciones Realizadas
                      </p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">
                        {selectedCustomer.visits}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/80">
                      <p className="text-[11px] text-emerald-700 font-medium">
                        Total Invertido
                      </p>
                      <p className="text-lg font-bold text-emerald-700 mt-0.5">
                        ${selectedCustomer.totalSpend.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Botón de Guardar */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                form="patient-form"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#d87cef] hover:bg-emerald-600 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
              >
                <Save size={15} />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
