"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Phone,
  ChevronRight,
  Loader2,
  MessageSquare,
} from "lucide-react";
// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [barberiaData, setBarberiaData] = useState(null);

  // --- 1. CARGA DE DATOS REALES ---
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

  // --- 2. PROCESAMIENTO AVANZADO DE CLIENTES ---
  const customers = useMemo(() => {
    if (!barberiaData?.appointments) return [];

    const customerMap = {};
    const hoy = new Date();

    barberiaData.appointments.forEach((app) => {
      // Normalizamos el nombre para evitar duplicados por mayúsculas/minúsculas
      const nameKey = (app.customer || "Sin nombre").trim().toLowerCase();
      const originalName = app.customer || "Sin nombre";

      if (!customerMap[nameKey]) {
        customerMap[nameKey] = {
          name: originalName,
          email: app.email || "Sin email",
          phone: app.phone || "",
          visits: 0,
          totalSpend: 0,
          lastVisitDate: new Date(0), // Fecha base para comparar
        };
      }

      // Sumar estadísticas
      customerMap[nameKey].visits += 1;
      customerMap[nameKey].totalSpend += Number(app.total) || 0;

      // Intentamos capturar el teléfono si no lo tiene (de citas anteriores)
      if (!customerMap[nameKey].phone && app.phone)
        customerMap[nameKey].phone = app.phone;
      if (!customerMap[nameKey].email && app.email)
        customerMap[nameKey].email = app.email;

      // Calcular última visita real
      const appDate = new Date(app.paidAt || app.start);
      if (appDate > customerMap[nameKey].lastVisitDate) {
        customerMap[nameKey].lastVisitDate = appDate;
      }
    });

    return (
      Object.values(customerMap)
        .map((c) => {
          // Lógica de estados avanzada
          const diasDesdeUltima =
            (hoy - c.lastVisitDate) / (1000 * 60 * 60 * 24);
          let status = "Nuevo";

          if (diasDesdeUltima > 45 && c.visits > 1) status = "Inactivo";
          else if (c.visits > 10 || c.totalSpend > 5000) status = "VIP";
          else if (c.visits > 3) status = "Activo";

          return {
            ...c,
            status,
            // Formateo de fecha para mostrar
            lastVisitDisplay:
              c.lastVisitDate.getTime() === 0
                ? "Sin registros"
                : c.lastVisitDate.toLocaleDateString("es-AR"),
          };
        })
        // Ordenar por gasto total y luego por estatus VIP
        .sort((a, b) => b.totalSpend - a.totalSpend)
    );
  }, [barberiaData]);

  if (loading)
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
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0f1a]">
      {/* HEADER COMPACTO */}
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

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Nombre o teléfono..."
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 outline-none w-64 transition-all dark:text-white"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLA ESTILO LISTADO */}
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
              <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Última Visita
              </th>
              <th className="px-8 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredCustomers.map((customer, idx) => (
              <tr
                key={idx}
                className="group hover:bg-slate-50/80 dark:hover:bg-blue-600/5 transition-colors cursor-pointer"
              >
                {/* Info Personal */}
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase italic">
                      {customer.name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {customer.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {customer.phone || customer.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                      customer.status === "VIP"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                        : customer.status === "Nuevo"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                        : customer.status === "Activo"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                        : "bg-rose-100 text-rose-500 dark:bg-rose-900/30"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>

                {/* Visitas */}
                <td className="px-4 py-4 text-center">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {customer.visits}
                  </span>
                </td>

                {/* Gasto */}
                <td className="px-4 py-4">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    ${customer.totalSpend.toLocaleString("es-AR")}
                  </span>
                </td>

                {/* Fecha */}
                <td className="px-4 py-4 text-sm text-slate-500 font-medium">
                  {customer.lastVisitDisplay}
                </td>

                {/* Acciones */}
                <td className="px-8 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {customer.phone && (
                      <>
                        <a
                          href={`tel:${customer.phone.replace(/\D/g, "")}`}
                          className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        >
                          <Phone size={14} />
                        </a>
                        <a
                          href={`https://wa.me/${customer.phone.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                        >
                          <MessageSquare size={14} />
                        </a>
                      </>
                    )}
                    <button className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-white rounded-lg transition-all">
                      <MoreHorizontal size={14} />
                    </button>
                    <ChevronRight
                      size={14}
                      className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
