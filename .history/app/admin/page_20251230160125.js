"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import {
  ShieldCheck,
  Search,
  ExternalLink,
  Loader2,
  AlertOctagon,
  CheckCircle2,
  CreditCard,
  Calendar,
  Lock,
} from "lucide-react";

export default function SuperAdminPage() {
  const [user, setUser] = useState(null);
  const [barberias, setBarberias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Usamos la variable de entorno para el correo del admin
  const ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "cleberich@gmail.com";

  /**
   * Formatea fechas provenientes de Firestore (Timestamps o Objetos con segundos)
   */
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    let date;

    // Caso 1: Timestamp oficial de Firebase (.toDate())
    if (typeof dateValue.toDate === "function") {
      date = dateValue.toDate();
    }
    // Caso 2: Objeto serializado de Firestore ({seconds, nanoseconds})
    else if (dateValue.seconds) {
      date = new Date(dateValue.seconds * 1000);
    }
    // Caso 3: String o instancia de Date
    else {
      date = new Date(dateValue);
    }

    // Validación de fecha correcta
    if (isNaN(date.getTime())) return "Fecha Inválida";

    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setUser(currentUser);
        setIsAuthorized(true);
        await fetchBarberias();
      } else {
        setIsAuthorized(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchBarberias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "barberias"));
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBarberias(docs);
    } catch (error) {
      console.error("Error cargando barberías:", error);
    }
  };

  const handleUpdatePayment = async (id, status) => {
    if (!window.confirm("¿Confirmar cambio de estado de pago?")) return;
    try {
      const docRef = doc(db, "barberias", id);
      // Actualizamos el estado de pago en la base de datos
      await updateDoc(docRef, { "plan.paymentStatus": status });
      // Recargamos los datos localmente
      await fetchBarberias();
    } catch (error) {
      alert("Error al actualizar el pago");
    }
  };

  const filteredBarberias = barberias.filter(
    (b) =>
      b.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0f1a]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  if (!isAuthorized)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0f1a] p-6 text-center">
        <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Lock className="text-red-500" size={40} />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
          Acceso Denegado
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Solo el administrador principal con el correo registrado puede ver
          esta página.
        </p>
        <a
          href="/login"
          className="mt-8 text-blue-500 font-bold uppercase text-[10px] tracking-widest hover:underline"
        >
          Volver al login
        </a>
      </div>
    );
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-100 p-6 md:p-12">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-blue-500" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              Super Admin Panel
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">
            Control de <span className="text-blue-500">Barberías</span>
          </h1>
        </div>

        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <input
            placeholder="BUSCAR POR NOMBRE O EMAIL..."
            className="bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-6 w-full md:w-80 text-xs font-bold outline-none focus:border-blue-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-4">
          {/* HEADER DE TABLA (Versión Desktop) */}
          <div className="hidden md:grid grid-cols-5 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Barbería / Dueño</span>
            <span>Plan Actual</span>
            <span>Estado de Pago</span>
            <span>Fecha de Vencimiento</span>
            <span className="text-right">Acciones</span>
          </div>

          {filteredBarberias.map((b) => (
            <div
              key={b.id}
              className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-6 md:px-8 flex flex-col md:grid md:grid-cols-5 items-center gap-6 hover:border-blue-500/30 transition-all"
            >
              {/* Info Principal */}
              <div className="flex items-center gap-4 w-full">
                <div className="size-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                  {b.logo ? (
                    <img src={b.logo} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-black text-blue-500">
                      {b.businessName?.[0]}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-black uppercase text-sm tracking-tight leading-none mb-1">
                    {b.businessName || "Sin Nombre"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold">
                    {b.email}
                  </p>
                </div>
              </div>

              {/* Plan */}
              <div className="w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase">
                  <CreditCard size={12} />
                  {b.plan?.type || "Inicial"}
                </div>
              </div>

              {/* Estado de Pago */}

              {/* Fecha de Pago / Vencimiento */}
              <div className="w-full flex items-center gap-2 text-slate-400 text-xs font-bold">
                <Calendar size={14} className="text-blue-500/50" />
                {/* Usamos la función de formateo aquí */}
                {formatDate(b.plan?.nextPayment || b.plan?.expirationDate)}
              </div>

              {/* Fecha de Pago */}
              <div className="w-full flex items-center gap-2 text-slate-400 text-xs font-bold">
                <Calendar size={14} />
                {b.plan?.nextPayment || "N/A"}
              </div>

              {/* Acciones */}
              <div className="flex justify-end w-full gap-2">
                <a
                  href={`/reserva/${b.id}`}
                  target="_blank"
                  className="p-3 bg-slate-800 hover:bg-blue-600 rounded-xl transition-all group"
                  title="Ver página pública"
                >
                  <ExternalLink
                    size={16}
                    className="text-slate-400 group-hover:text-white"
                  />
                </a>
              </div>
            </div>
          ))}

          {filteredBarberias.length === 0 && (
            <div className="py-20 text-center bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5">
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                No se encontraron barberías registradas
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
