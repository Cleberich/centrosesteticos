// // "use client";

// import React, { useState, useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   LayoutDashboard,
//   Calendar,
//   Users,
//   UserCheck,
//   Sparkles,
//   Settings,
//   LogOut,
//   BarChart3,
//   Loader2,
//   Menu,
//   X,
//   CreditCard,
//   MessageSquare,
//   Clock,
//   Star,
// } from "lucide-react";
// import Link from "next/link";

// // Firebase
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// export default function DashboardLayout({ children }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//   }, [pathname]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const docRef = doc(db, "centros_estetica", user.uid);
//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             setUserData(docSnap.data());
//           }
//         } catch (error) {
//           console.error("Error cargando perfil estético:", error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         router.push("/login");
//       }
//     });
//     return () => unsubscribe();
//   }, [router]);

//   const handleLogout = async () => {
//     await signOut(auth);
//     router.push("/login");
//   };

//   const SidebarLink = ({ href, icon, label, badge, onClick }) => {
//     const active = pathname === href;
//     const styles = active
//       ? "bg-[#DCFCE7] text-[#15803D] font-bold"
//       : "text-slate-500 hover:bg-slate-200/40 hover:text-slate-800 font-semibold";

//     const content = (
//       <div
//         className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${styles}`}
//       >
//         <div className="flex items-center gap-3">
//           {React.cloneElement(icon, {
//             size: 16,
//             className: active ? "text-[#15803D]" : "text-slate-400",
//           })}
//           <span>{label}</span>
//         </div>
//         {badge && (
//           <span className="w-4 h-4 bg-rose-400 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
//             {badge}
//           </span>
//         )}
//       </div>
//     );

//     if (onClick) return <div onClick={onClick}>{content}</div>;
//     return <Link href={href}>{content}</Link>;
//   };

//   const SidebarContent = () => (
//     <div className="flex flex-col h-full justify-between">
//       <div className="space-y-6">
//         {/* LOGO BYUTIE STYLE */}
//         <div className="flex items-center justify-between px-2">
//           <div className="flex items-center gap-2.5">
//             <div className="w-6 h-6 rounded-md bg-[#d87cef] flex items-center justify-center text-slate-900 font-bold text-xs shadow-xs">
//               ✦
//             </div>
//             <span className="text-xl font-extrabold text-slate-800 tracking-tight">
//               {userData?.businessName?.toLowerCase() || "byutie"}
//             </span>
//           </div>
//           <button
//             className="lg:hidden text-slate-400"
//             onClick={() => setIsMobileMenuOpen(false)}
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* NAVEGACIÓN */}
//         <nav className="space-y-1">
//           <SidebarLink
//             href="/dashboard"
//             icon={<LayoutDashboard />}
//             label="Dashboard"
//           />
//           <SidebarLink
//             href="/dashboard/clientes"
//             icon={<Users />}
//             label="Patients"
//           />
//           <SidebarLink
//             href="/dashboard/especialistas"
//             icon={<UserCheck />}
//             label="Doctors"
//           />
//           <SidebarLink
//             href="/dashboard/calendar"
//             icon={<Calendar />}
//             label="Appointments"
//           />
//           <SidebarLink
//             href="/dashboard/schedules"
//             icon={<Clock />}
//             label="Surgery Schedule"
//           />
//           <SidebarLink
//             href="/dashboard/services"
//             icon={<Sparkles />}
//             label="Treatments"
//           />
//           <SidebarLink
//             href="/dashboard/reviews"
//             icon={<Star />}
//             label="Reviews"
//           />
//           <SidebarLink
//             href="/dashboard/accounting"
//             icon={<CreditCard />}
//             label="Payments"
//           />
//           <SidebarLink
//             href="/dashboard/messages"
//             icon={<MessageSquare />}
//             label="Messages"
//             badge="8"
//           />
//         </nav>
//       </div>

//       {/* PROMO WIDGET & LOGOUT */}
//       <div className="space-y-4 pt-4">
//         <div className="p-4 bg-gradient-to-br from-[#FFE4E6] to-[#FED7AA] rounded-2xl space-y-3">
//           <p className="text-[11px] font-medium text-slate-700 leading-snug">
//             Enjoy improved performance, new features, and a smoother interface.
//           </p>
//           <button className="w-full py-2 bg-[#d87cef] hover:bg-[#22C55E] text-slate-900 font-bold text-[10px] rounded-xl transition-colors shadow-xs">
//             Explore the Updates!
//           </button>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-2.5 text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 transition-colors w-full"
//         >
//           <LogOut size={16} />
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex h-screen w-full bg-[#FAF8F5] text-slate-700 font-sans antialiased overflow-hidden">
//       {/* SIDEBAR DESKTOP */}
//       <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/60 bg-[#FAF8F5] h-full p-6 shrink-0">
//         {loading ? (
//           <div className="flex h-full items-center justify-center">
//             <Loader2 className="animate-spin text-[#d87cef]" size={24} />
//           </div>
//         ) : (
//           <SidebarContent />
//         )}
//       </aside>

//       {/* MOBILE MENU */}
//       <div
//         className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
//           isMobileMenuOpen ? "visible" : "invisible"
//         }`}
//       >
//         <div
//           className={`absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity duration-300 ${
//             isMobileMenuOpen ? "opacity-100" : "opacity-0"
//           }`}
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//         <aside
//           className={`absolute top-0 left-0 w-64 h-full bg-[#FAF8F5] p-6 shadow-2xl transition-transform duration-300 ${
//             isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//         >
//           <SidebarContent />
//         </aside>
//       </div>

//       {/* CONTENIDO PRINCIPAL */}
//       <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#FAF8F5]">
//         {/* Header Móvil */}
//         <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#FAF8F5] border-b border-slate-200/60">
//           <button
//             onClick={() => setIsMobileMenuOpen(true)}
//             className="p-2 text-slate-700 bg-white border border-slate-200 rounded-xl"
//           >
//             <Menu size={18} />
//           </button>
//           <div className="flex items-center gap-2">
//             <div className="w-5 h-5 rounded-md bg-[#d87cef] flex items-center justify-center text-slate-900 font-bold text-[10px]">
//               ✦
//             </div>
//             <span className="text-sm font-bold text-slate-800">
//               {userData?.businessName || "byutie"}
//             </span>
//           </div>
//         </header>

//         {/* View Content */}
//         <div className="flex-1 overflow-y-auto relative">{children}</div>
//       </main>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Sparkles,
  Settings,
  LogOut,
  BarChart3,
  Loader2,
  Menu,
  X,
  CreditCard,
  MessageSquare,
  Clock,
  Star,
} from "lucide-react";
import Link from "next/link";

// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "centros_estetica", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error("Error cargando perfil estético:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const SidebarLink = ({ href, icon, label, badge, onClick }) => {
    const active = pathname === href;
    const styles = active
      ? "bg-[#d87cef] text-[#ffffff] font-bold"
      : "text-slate-500 hover:bg-slate-200/40 hover:text-slate-800 font-semibold";

    const content = (
      <div
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${styles}`}
      >
        <div className="flex items-center gap-3">
          {React.cloneElement(icon, {
            size: 16,
            className: active ? "text-[#15803D]" : "text-slate-400",
          })}
          <span>{label}</span>
        </div>
        {badge && (
          <span className="w-4 h-4 bg-rose-400 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
            {badge}
          </span>
        )}
      </div>
    );

    if (onClick) return <div onClick={onClick}>{content}</div>;
    return <Link href={href}>{content}</Link>;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* LOGO BYUTIE STYLE */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#d87cef] flex items-center justify-center text-slate-900 font-bold text-xs shadow-xs">
              ✦
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">
              {userData?.businessName?.toLowerCase() || "byutie"}
            </span>
          </div>
          <button
            className="lg:hidden text-slate-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="space-y-1">
          <SidebarLink
            href="/dashboard"
            icon={<LayoutDashboard />}
            label="Dashboard"
          />
          <SidebarLink
            href="/dashboard/clientes"
            icon={<Users />}
            label="Clientes"
          />
          <SidebarLink
            href="/dashboard/especialistas"
            icon={<UserCheck />}
            label="Especialistas"
          />
          <SidebarLink
            href="/dashboard/calendar"
            icon={<Calendar />}
            label="Turnos"
          />

          <SidebarLink
            href="/dashboard/services"
            icon={<Sparkles />}
            label="Servicios"
          />

          <SidebarLink
            href="/dashboard/accounting"
            icon={<CreditCard />}
            label="Contabilidad"
          />
          <SidebarLink
            href="/dashboard/settings"
            icon={<Settings />}
            label="Ajustes"
          />
        </nav>
      </div>

      {/* PROMO WIDGET & LOGOUT */}
      <div className="space-y-4 pt-4">
        <div className="p-4 bg-gradient-to-br from-[#FFE4E6] to-[#FED7AA] rounded-2xl space-y-3">
          <p className="text-[11px] font-medium text-slate-700 leading-snug">
            Enjoy improved performance, new features, and a smoother interface.
          </p>
          <button className="w-full py-2 bg-[#d87cef] hover:bg-[#22C55E] text-slate-900 font-bold text-[10px] rounded-xl transition-colors shadow-xs">
            Explore the Updates!
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 transition-colors w-full"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#FAF8F5] text-slate-700 font-sans antialiased overflow-hidden">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/60 bg-[#FAF8F5] h-full p-6 shrink-0">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="animate-spin text-[#d87cef]" size={24} />
          </div>
        ) : (
          <SidebarContent />
        )}
      </aside>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <aside
          className={`absolute top-0 left-0 w-64 h-full bg-[#FAF8F5] p-6 shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent />
        </aside>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#FAF8F5]">
        {/* Header Móvil */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#FAF8F5] border-b border-slate-200/60">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-700 bg-white border border-slate-200 rounded-xl"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#d87cef] flex items-center justify-center text-slate-900 font-bold text-[10px]">
              ✦
            </div>
            <span className="text-sm font-bold text-slate-800">
              {userData?.businessName || "byutie"}
            </span>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto relative">{children}</div>
      </main>
    </div>
  );
}
