"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  MoreHorizontal,
  Phone,
  ChevronRight,
  Loader2,
  MessageSquare,
  X,
  Save,
  Mail,
  User,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [barberiaData, setBarberiaData] = useState(null);

  // Estados para Edición
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", email: "" });

  // --- 1. CARGA DE DATOS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "barberias", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBarberiaData(docSnap.data());
          }
        } catch (error) {
          console.error("Error al cargar clientes:", error);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // --- 2. PROCESAMIENTO DE CLIENTES ---
  const customers = useMemo(() => {
    if (!barberiaData?.appointments) return [];
    const customerMap = {};
    const hoy = new Date();

    barberiaData.appointments.forEach((app) => {
      const nameKey = (app.customer || "Sin nombre").trim().toLowerCase();
      if (!customerMap[nameKey]) {
        customerMap[nameKey] = {
          name: app.customer || "Sin nombre",
          email: app.email || "",
          phone: app.phone || "",
          visits: 0,
          totalSpend: 0,
          lastVisitDate: new Date(0),
        };
      }
      customerMap[nameKey].visits += 1;
      customerMap[nameKey].totalSpend += Number(app.total) || 0;
      if (app.phone && !customerMap[nameKey].phone)
        customerMap[nameKey].phone = app.phone;
      if (app.email && !customerMap[nameKey].email)
        customerMap[nameKey].email = app.email;
      const appDate = new Date(app.paidAt || app.start);
      if (appDate > customerMap[nameKey].lastVisitDate)
        customerMap[nameKey].lastVisitDate = appDate;
    });

    return Object.values(customerMap)
      .map((c) => {
        const dias = (hoy - c.lastVisitDate) / (1000 * 60 * 60 * 24);
        let status = "Nuevo";
        if (dias > 45 && c.visits > 1) status = "Inactivo";
        else if (c.visits > 10) status = "VIP";
        else if (c.visits > 3) status = "Activo";
        return {
          ...c,
          status,
          lastVisitDisplay:
            c.lastVisitDate.getTime() === 0
              ? "---"
              : c.lastVisitDate.toLocaleDateString(),
        };
      })
      .sort((a, b) => b.totalSpend - a.totalSpend);
  }, [barberiaData]);

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
      const docRef = doc(db, "barberias", auth.currentUser.uid);
      // Actualizamos todas las citas que pertenecían al nombre antiguo del cliente
      const updatedAppointments = barberiaData.appointments.map((app) => {
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
      setBarberiaData((prev) => ({
        ...prev,
        appointments: updatedAppointments,
      }));
      setIsEditOpen(false);
    } catch (error) {
      alert("Error al actualizar cliente");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !barberiaData)
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#0a0f1a]">
        <Loader2 className="text-blue-600 animate-spin" size={40} />
      </div>
    );

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a] relative overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight dark:text-white">
            Clientes{" "}
            <span className="text-blue-600 ml-2 text-sm font-bold bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
              {filteredCustomers.length}
            </span>
          </h1>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">
            Base de datos centralizada
          </p>
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 outline-none w-64 dark:text-white"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Cliente
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Estado
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                Visitas
              </th>
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Total Gastado
              </th>
              <th className="px-8 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredCustomers.map((customer, idx) => (
              <tr
                key={idx}
                onClick={() => handleEditClick(customer)}
                className="group hover:bg-slate-50/80 dark:hover:bg-blue-600/5 transition-colors cursor-pointer"
              >
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 italic">
                      {customer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {customer.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {customer.phone || customer.email || "Sin contacto"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                      customer.status === "VIP"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                        : customer.status === "Activo"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center text-sm font-bold dark:text-white">
                  {customer.visits}
                </td>
                <td className="px-4 py-4 text-sm font-black dark:text-white">
                  ${customer.totalSpend.toLocaleString()}
                </td>
                <td className="px-8 py-4 text-right">
                  <ChevronRight
                    size={14}
                    className="inline text-slate-200 group-hover:text-blue-600 transition-all"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DRAWER DE EDICIÓN */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsEditOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] h-full shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase italic dark:text-white">
                Perfil del <span className="text-blue-600">Cliente</span>
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full dark:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    required
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Teléfono WhatsApp
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-600/20"
                    placeholder="09xxxxxxxx"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-600/20"
                    placeholder="cliente@ejemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t dark:border-slate-800">
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Visitas
                  </p>
                  <p className="text-xl font-black dark:text-white">
                    {selectedCustomer?.visits}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Total
                  </p>
                  <p className="text-xl font-black text-blue-600">
                    ${selectedCustomer?.totalSpend.toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all mt-4"
              >
                <Save size={18} /> Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
