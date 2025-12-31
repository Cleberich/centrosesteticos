"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import {
  ShieldCheck,
  Search,
  Loader2,
  Edit2,
  Scissors,
  Sparkles,
  LayoutGrid,
  X,
  Trash2,
  Globe,
  Mail,
  Calendar,
  History,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function SuperAdminPage() {
  const [user, setUser] = useState(null);
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ businessName: "", email: "" });
  const [newLastPayment, setNewLastPayment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const ADMIN_EMAIL = "cleberich@gmail.com";

  // --- UTILIDADES ---
  const convertToDate = (dateValue) => {
    if (!dateValue) return null;
    if (typeof dateValue.toDate === "function") return dateValue.toDate();
    if (dateValue.seconds) return new Date(dateValue.seconds * 1000);
    return new Date(dateValue);
  };

  const formatDate = (dateValue) => {
    const date = convertToDate(dateValue);
    if (!date || isNaN(date.getTime())) return "--/--/----";
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --- LÓGICA DE SINCRONIZACIÓN MERCADO PAGO ---
  // Esta función detecta si hay un pago automático de MP que no ha sido historizado
  const syncAutomaticPayments = async (businesses) => {
    const syncPromises = businesses.map(async (b) => {
      const autoId = b.plan?.lastPaymentId; // ID que genera Mercado Pago
      const history = b.paymentHistory || [];

      // Si hay un ID de MP y NO existe ya en el historial, lo movemos
      if (autoId && !history.some((pay) => pay.paymentId === String(autoId))) {
        const docRef = doc(db, b.collectionName, b.id);
        const newRecord = {
          paymentId: String(autoId),
          date: b.plan.lastPayment || Timestamp.now(),
          amount: Number(b.plan.price) || 0,
          planType: b.plan.type || "Standard",
          registeredAt: new Date().toISOString(),
          method: "mercadopago_auto",
        };

        await updateDoc(docRef, {
          paymentHistory: arrayUnion(newRecord),
          // No borramos lastPaymentId por si tu webhook lo usa,
          // pero ya queda seguro en el historial.
        });

        // Actualizamos el objeto local para la vista actual
        return { ...b, paymentHistory: [...history, newRecord] };
      }
      return b;
    });
    return Promise.all(syncPromises);
  };

  const fetchAllData = async () => {
    try {
      const [barberSnap, esteticaSnap] = await Promise.all([
        getDocs(collection(db, "barberias")),
        getDocs(collection(db, "centros_estetica")),
      ]);

      const barberDocs = barberSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "barberia",
        collectionName: "barberias",
      }));

      const esteticaDocs = esteticaSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: "estetica",
        collectionName: "centros_estetica",
      }));

      let combined = [...barberDocs, ...esteticaDocs];

      // Sincronizar pagos automáticos detectados
      combined = await syncAutomaticPayments(combined);

      setAllBusinesses(
        combined.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        })
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (
        currentUser?.email?.toLowerCase().trim() ===
        ADMIN_EMAIL.toLowerCase().trim()
      ) {
        setUser(currentUser);
        setIsAuthorized(true);
        fetchAllData();
      } else {
        setIsAuthorized(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFullUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsUpdating(true);
    try {
      const docRef = doc(db, editingItem.collectionName, editingItem.id);
      let updateData = {
        businessName: editForm.businessName,
        email: editForm.email,
        "plan.updatedAt": new Date().toISOString(),
      };

      if (newLastPayment) {
        const lastPayDate = new Date(newLastPayment);
        lastPayDate.setHours(12, 0, 0, 0);
        const nextPayDate = new Date(lastPayDate);
        nextPayDate.setDate(lastPayDate.getDate() + 30);
        const expiresDate = new Date(nextPayDate);
        expiresDate.setDate(expiresDate.getDate() + 7);

        updateData["plan.lastPayment"] = Timestamp.fromDate(lastPayDate);
        updateData["plan.nextPayment"] = Timestamp.fromDate(nextPayDate);
        updateData["plan.expiresAt"] = expiresDate.toISOString().split("T")[0];
        updateData["plan.paymentStatus"] = "paid";
        updateData["plan.status"] = "active";

        const paymentRecord = {
          paymentId: `manual_${Math.random().toString(36).substring(2, 7)}`,
          date: Timestamp.fromDate(lastPayDate),
          amount: Number(editingItem.plan?.price) || 0,
          planType: editingItem.plan?.type || "Standard",
          registeredAt: new Date().toISOString(),
          method: "manual_admin",
        };

        await updateDoc(docRef, {
          ...updateData,
          paymentHistory: arrayUnion(paymentRecord),
        });
      } else {
        await updateDoc(docRef, updateData);
      }
      setEditingItem(null);
      await fetchAllData();
      alert("Sincronización completa.");
    } catch (error) {
      alert("Error al actualizar.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!editingItem) return;
    if (
      window.confirm(`¿Eliminar definitivamente a ${editingItem.businessName}?`)
    ) {
      setIsUpdating(true);
      await deleteDoc(doc(db, editingItem.collectionName, editingItem.id));
      setEditingItem(null);
      await fetchAllData();
      alert("Eliminado.");
      setIsUpdating(false);
    }
  };

  const filteredData = allBusinesses.filter((b) => {
    const matchesSearch =
      b.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" ? true : b.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-100 p-6 md:p-12">
      <header className="max-w-7xl mx-auto mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-blue-500" size={24} />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500">
              Aura Master Control
            </span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white italic">
            Panel Maestro
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-slate-900/80 p-1.5 rounded-[1.5rem] border border-white/5 flex">
            {[
              { id: "all", label: "Global", icon: <LayoutGrid size={14} /> },
              {
                id: "barberia",
                label: "Barberías",
                icon: <Scissors size={14} />,
              },
              {
                id: "estetica",
                label: "Estética",
                icon: <Sparkles size={14} />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  filterType === tab.id
                    ? "bg-blue-600 text-white shadow-xl"
                    : "text-slate-500 hover:text-slate-200"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              placeholder="BUSCAR..."
              className="bg-slate-900/80 border border-white/5 rounded-[1.5rem] py-4 pl-14 pr-6 w-full sm:w-80 text-xs font-bold outline-none focus:border-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-4">
        {filteredData.map((b) => (
          <div
            key={b.id}
            className={`group bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 md:px-10 flex flex-col md:grid md:grid-cols-10 items-center gap-6 hover:bg-slate-900/60 transition-all border-l-4 ${
              b.type === "barberia"
                ? "hover:border-l-blue-600"
                : "hover:border-l-pink-500"
            }`}
          >
            <div className="col-span-3 flex items-center gap-5 w-full">
              <div
                className={`size-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 ${
                  b.type === "barberia" ? "bg-blue-600/10" : "bg-pink-600/10"
                }`}
              >
                {b.type === "barberia" ? (
                  <Scissors size={20} className="text-blue-500" />
                ) : (
                  <Sparkles size={20} className="text-pink-500" />
                )}
              </div>
              <div className="truncate">
                <p className="font-black uppercase text-sm text-white truncate mb-1">
                  {b.businessName}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                      b.type === "barberia"
                        ? "bg-blue-600 text-white"
                        : "bg-pink-500 text-white"
                    }`}
                  >
                    {b.type}
                  </span>
                  {b.plan?.lastPaymentId && (
                    <span className="flex items-center gap-1 text-[8px] font-black text-amber-500 uppercase">
                      <Zap size={8} /> MP Activo
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-2 w-full text-[11px] text-slate-500 truncate">
              {b.email}
            </div>
            <div className="w-full text-[10px] font-black uppercase text-blue-400/80">
              {b.plan?.type || "Standard"}
            </div>
            <div className="w-full">
              <span
                className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${
                  b.plan?.status === "active"
                    ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/30"
                    : "text-rose-500 bg-rose-500/10 border-rose-500/30"
                }`}
              >
                {b.plan?.status === "active" ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="w-full text-xs font-black text-slate-200">
              {formatDate(b.plan?.nextPayment)}
            </div>
            <div className="flex justify-end w-full col-span-2">
              <button
                onClick={() => {
                  setEditingItem(b);
                  setEditForm({ businessName: b.businessName, email: b.email });
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white hover:bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
              >
                <Edit2 size={14} /> Gestionar
              </button>
            </div>
          </div>
        ))}
      </main>

      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            onClick={() => setEditingItem(null)}
          />
          <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[3.5rem] p-10 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-10">
              <h3 className="text-3xl font-black uppercase text-white tracking-tighter italic">
                Gestión Aura
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-500 hover:text-white p-3 bg-white/5 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleFullUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  value={editForm.businessName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, businessName: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-2 ring-blue-600"
                  placeholder="Nombre"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-2 ring-blue-600"
                  placeholder="Email"
                />
              </div>

              <div className="p-6 bg-blue-600/5 border border-blue-600/10 rounded-[2rem]">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-3 ml-2">
                  Registrar Pago Manual
                </p>
                <input
                  type="date"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white font-black outline-none"
                  style={{ colorScheme: "dark" }}
                  onChange={(e) => setNewLastPayment(e.target.value)}
                />
              </div>

              {editingItem.paymentHistory?.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                    <History size={14} /> Historial Reciente
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {editingItem.paymentHistory
                      .slice(-3)
                      .reverse()
                      .map((pay, i) => (
                        <div
                          key={i}
                          className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl shrink-0"
                        >
                          <p className="text-[10px] font-black text-emerald-500">
                            {formatDate(pay.date)}
                          </p>
                          <p className="text-[8px] font-bold text-slate-500 uppercase">
                            ${pay.amount} •{" "}
                            {pay.method === "mercadopago_auto"
                              ? "MP"
                              : "Manual"}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-[3] py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-xs hover:bg-blue-500 transition-all shadow-xl"
                >
                  {isUpdating ? "PROCESANDO..." : "Guardar Cambios"}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="flex-1 py-5 bg-rose-600/10 text-rose-500 rounded-[1.5rem] hover:bg-rose-600 hover:text-white transition-all"
                >
                  <Trash2 className="mx-auto" size={24} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
