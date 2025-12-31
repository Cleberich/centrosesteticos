// "use client";

// import React, { useState, useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   LayoutDashboard,
//   Calendar,
//   Users,
//   UserCircle,
//   Scissors,
//   Settings,
//   LogOut,
//   BarChart3,
//   Loader2,
//   BadgeCheck,
//   Moon,
//   Sun,
// } from "lucide-react";
// import Link from "next/link";

// // Firebase
// import { auth, db } from "@/services/firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, getDoc, updateDoc } from "firebase/firestore";

// export default function DashboardLayout({ children }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);

//   // --- 1. CARGA DE DATOS DESDE FIREBASE ---
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const docRef = doc(db, "barberias", user.uid);
//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setUserData(data);

//             // Aplicar preferencia guardada en BD o por defecto false (claro)
//             const isDark = data.themePreference === "dark";
//             setDarkMode(isDark);

//             if (isDark) {
//               document.documentElement.classList.add("dark");
//             } else {
//               document.documentElement.classList.remove("dark");
//             }
//           }
//         } catch (error) {
//           console.error("Error cargando perfil:", error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         router.push("/login");
//       }
//     });
//     return () => unsubscribe();
//   }, [router]);

//   // --- FUNCIÓN PARA CAMBIAR TEMA Y ACTUALIZAR BASE DE DATOS ---
//   const toggleDarkMode = async () => {
//     if (!auth.currentUser) return;

//     // 1. Calculamos el nuevo modo basándonos en el estado actual
//     const newMode = !darkMode;
//     const themeString = newMode ? "dark" : "light";

//     // 2. CAMBIO VISUAL INMEDIATO (DOM + React)
//     // Esto hace que el usuario vea el cambio sin esperar a la base de datos
//     setDarkMode(newMode);
//     if (newMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }

//     // 3. ACTUALIZAR EN FIREBASE (Persistencia)
//     try {
//       const docRef = doc(db, "barberias", auth.currentUser.uid);
//       await updateDoc(docRef, {
//         themePreference: themeString,
//       });
//       // Opcional: También guardamos en localStorage para una carga ultra rápida la próxima vez
//       localStorage.setItem("theme", themeString);
//     } catch (error) {
//       console.error(
//         "Error al guardar la preferencia en la base de datos:",
//         error
//       );
//     }
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     router.push("/login");
//   };

//   const SidebarLink = ({ href, icon, label, variant = "default", onClick }) => {
//     const active = pathname === href;
//     const styles = active
//       ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
//       : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200";

//     const content = (
//       <div
//         className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm cursor-pointer ${styles} ${
//           variant === "danger"
//             ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
//             : ""
//         }`}
//       >
//         {icon}
//         <span className="font-bold tracking-tight">{label}</span>
//       </div>
//     );
//     if (onClick) return <div onClick={onClick}>{content}</div>;
//     return <Link href={href}>{content}</Link>;
//   };

//   return (
//     <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
//       <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full p-6">
//         <div className="flex flex-col h-full justify-between">
//           <div className="space-y-8">
//             {/* LOGO SECCIÓN */}
//             <div className="flex items-center gap-3 px-2">
//               <div className="size-12 rounded-full border-2 border-blue-600 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
//                 {loading ? (
//                   <Loader2 className="animate-spin text-blue-600" size={18} />
//                 ) : userData?.logo ? (
//                   <img
//                     src={userData.logo}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-xl font-black text-blue-600 ">
//                     {userData?.businessName?.charAt(0) || "B"}
//                   </span>
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h1 className="text-sm font-black truncate uppercase  dark:text-white">
//                   {userData?.businessName || "Barbería"}
//                 </h1>
//                 <div className="flex items-center gap-1">
//                   <BadgeCheck size={12} className="text-yellow-600" />
//                   <span className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">
//                     Plan {userData?.plan?.type || "free"}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <nav className="space-y-1">
//               <p className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 tracking-[0.2em]">
//                 Navegación
//               </p>
//               <SidebarLink
//                 href="/dashboard"
//                 icon={<LayoutDashboard size={20} />}
//                 label="Panel de Control"
//               />
//               <SidebarLink
//                 href="/dashboard/calendar"
//                 icon={<Calendar size={20} />}
//                 label="Calendario"
//               />
//               <p className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 mt-6 tracking-[0.2em]">
//                 Administración
//               </p>
//               <SidebarLink
//                 href="/dashboard/barberos"
//                 icon={<UserCircle size={20} />}
//                 label="Mi Equipo"
//               />
//               <SidebarLink
//                 href="/dashboard/clientes"
//                 icon={<Users size={20} />}
//                 label="Clientes"
//               />
//               <SidebarLink
//                 href="/dashboard/services"
//                 icon={<Scissors size={20} />}
//                 label="Servicios"
//               />
//               <SidebarLink
//                 href="/dashboard/accounting"
//                 icon={<BarChart3 size={20} />}
//                 label="Contabilidad"
//               />
//             </nav>
//           </div>

//           <div className="space-y-1 pt-6 border-t border-slate-100 dark:border-slate-800">
//             <SidebarLink
//               href="/dashboard/settings"
//               icon={<Settings size={20} />}
//               label="Configuración"
//             />
//             <SidebarLink
//               href="#"
//               icon={<LogOut size={20} />}
//               label="Cerrar Sesión"
//               variant="danger"
//               onClick={handleLogout}
//             />
//           </div>
//         </div>
//       </aside>

//       <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
//         {children}
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
  UserCircle,
  Scissors,
  Settings,
  LogOut,
  BarChart3,
  Loader2,
  BadgeCheck,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";

// Firebase
import { auth, db } from "@/services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cierra el menú móvil cuando cambias de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "barberias", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            const isDark = data.themePreference === "dark";
            setDarkMode(isDark);
            if (isDark) document.documentElement.classList.add("dark");
            else document.documentElement.classList.remove("dark");
          }
        } catch (error) {
          console.error("Error cargando perfil:", error);
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

  const SidebarLink = ({ href, icon, label, variant = "default", onClick }) => {
    const active = pathname === href;
    const styles = active
      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200";

    const content = (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm cursor-pointer ${styles} ${
          variant === "danger"
            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            : ""
        }`}
      >
        {icon}
        <span className="font-bold tracking-tight">{label}</span>
      </div>
    );
    if (onClick) return <div onClick={onClick}>{content}</div>;
    return <Link href={href}>{content}</Link>;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="size-10 rounded-full border-2 border-blue-600 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            {loading ? (
              <Loader2 className="animate-spin text-blue-600" size={16} />
            ) : userData?.logo ? (
              <img src={userData.logo} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-black text-blue-600">
                {userData?.businessName?.charAt(0) || "B"}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xs font-black truncate uppercase dark:text-white leading-none mb-1">
              {userData?.businessName || "Barbería"}
            </h1>
            <div className="flex items-center gap-1">
              <BadgeCheck size={10} className="text-yellow-600" />
              <span className="text-[8px] font-black text-yellow-600 uppercase tracking-widest">
                Plan {userData?.plan?.type || "free"}
              </span>
            </div>
          </div>
          <button
            className="lg:hidden text-slate-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          <p className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 tracking-[0.2em]">
            Navegación
          </p>
          <SidebarLink
            href="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Panel de Control"
          />
          <SidebarLink
            href="/dashboard/calendar"
            icon={<Calendar size={18} />}
            label="Calendario"
          />

          <p className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 mt-6 tracking-[0.2em]">
            Administración
          </p>
          <SidebarLink
            href="/dashboard/barberos"
            icon={<UserCircle size={18} />}
            label="Mi Equipo"
          />
          <SidebarLink
            href="/dashboard/clientes"
            icon={<Users size={18} />}
            label="Clientes"
          />
          <SidebarLink
            href="/dashboard/services"
            icon={<Scissors size={18} />}
            label="Servicios"
          />
          <SidebarLink
            href="/dashboard/accounting"
            icon={<BarChart3 size={18} />}
            label="Contabilidad"
          />
        </nav>
      </div>

      <div className="space-y-1 pt-6 border-t border-slate-100 dark:border-slate-800">
        <SidebarLink
          href="/dashboard/settings"
          icon={<Settings size={18} />}
          label="Configuración"
        />
        <SidebarLink
          href="#"
          icon={<LogOut size={18} />}
          label="Cerrar Sesión"
          variant="danger"
          onClick={handleLogout}
        />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full p-6">
        <SidebarContent />
      </aside>

      {/* MOBILE MENU (Hamburgesa) */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay oscuro */}
        <div
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Sidebar móvil */}
        <aside
          className={`absolute top-0 left-0 w-72 h-full bg-white dark:bg-slate-900 p-6 shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent />
        </aside>
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header móvil con botón hamburguesa */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase dark:text-white tracking-widest">
              {userData?.businessName}
            </span>
          </div>
          <div className="size-8 rounded-full overflow-hidden bg-slate-100">
            {userData?.logo && (
              <img src={userData.logo} className="w-full h-full object-cover" />
            )}
          </div>
        </header>

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
