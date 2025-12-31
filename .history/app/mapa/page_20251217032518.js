"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-50 flex items-center justify-center text-gray-400 font-medium">
      Cargando mapa...
    </div>
  ),
});

export default function MapaPage() {
  const [user] = useAuthState(auth);
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [showLocationGuide, setShowLocationGuide] = useState(false);

  // Cargar datos de Firebase
  useEffect(() => {
    const fetchPropiedades = async () => {
      try {
        const snapshot = await getDocs(collection(db, "propiedades"));
        setPropiedades(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        console.error("Error Firestore:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPropiedades();
  }, []);

  const handleCenterLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsLocating(true);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 15000, // 15 segundos (ideal para iPhone en interiores)
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMapCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          zoom: 16,
          timestamp: Date.now(),
        });
        setIsLocating(false);
        setShowLocationGuide(false);
      },
      (err) => {
        setIsLocating(false); // Detenemos el spinner siempre
        console.error("Geo Error:", err);

        if (err.code === 1) {
          // Permiso denegado - Mostrar Guía Safari
          setShowLocationGuide(true);
        } else if (err.code === 3) {
          alert(
            "Tiempo de espera agotado. Intenta de nuevo en un lugar abierto."
          );
        } else {
          alert("No se pudo obtener la ubicación. Revisa tu GPS.");
        }
      },
      geoOptions
    );
  };

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen bg-white overflow-hidden text-black antialiased">
        {/* HEADER MINIMALISTA */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 z-20 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-white rotate-45"></div>
            </div>
            <span className="text-xl font-bold tracking-tighter italic">
              CERCANÍAS
            </span>
          </div>
          <Link
            href="/dashboard"
            className="bg-black text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-transform active:scale-95"
          >
            + Publicar
          </Link>
        </header>

        <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
          {/* ÁREA DE MAPA */}
          <main className="absolute inset-0 md:relative md:flex-1 z-0">
            <MapComponent
              propiedades={propiedades}
              centerOverride={mapCenter}
            />

            {/* BOTÓN UBICACIÓN (Elevado en mobile para no chocar con la lista) */}
            <button
              onClick={handleCenterLocation}
              disabled={isLocating}
              className="absolute right-4 bottom-[38vh] md:bottom-8 z-30 bg-white p-4 rounded-full shadow-2xl border border-gray-100 active:scale-90 transition-all flex items-center justify-center disabled:opacity-70"
            >
              {isLocating ? (
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  <span className="hidden md:inline text-sm">CERCA DE MÍ</span>
                </div>
              )}
            </button>
          </main>

          {/* ÁREA DE LISTADO */}
          <aside className="z-10 w-full md:w-[420px] lg:w-[480px] bg-white border-t md:border-t-0 md:border-l border-gray-100 absolute bottom-0 md:relative h-[35vh] md:h-full flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto my-3 md:hidden"></div>
            <div className="px-6 py-4 flex justify-between items-center bg-white">
              <h2 className="text-xl font-black italic tracking-tighter uppercase">
                Propiedades
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {propiedades.length} Activas
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24 scrollbar-hide">
              {loading ? (
                <div className="text-center py-10 text-gray-300 font-medium">
                  Sincronizando...
                </div>
              ) : (
                propiedades.map((p) => (
                  <div
                    key={p.id}
                    className="flex gap-4 group cursor-pointer active:opacity-60 transition-all"
                    onClick={() =>
                      setMapCenter({ lat: p.lat, lng: p.lng, zoom: 17 })
                    }
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                      <img
                        src={p.fotos?.[0] || "/placeholder.jpg"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-1">
                      <div>
                        <h3 className="font-bold text-[15px] leading-tight line-clamp-2">
                          {p.titulo}
                        </h3>
                        <p className="text-gray-400 text-[10px] mt-1 uppercase font-bold tracking-wider">
                          {p.barrio || "Uruguay"}
                        </p>
                      </div>
                      <p className="text-lg font-black tracking-tighter">
                        USD {p.precio?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>

        {/* MODAL EDUCATIVO SAFARI IPHONE */}
        {showLocationGuide && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500">
              <div className="flex justify-center mb-6 text-blue-600 bg-blue-50 w-20 h-20 rounded-full mx-auto items-center">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 7.2c0 7.3-8 11.8-8 11.8z" />
                  <circle cx="12" cy="9" r="3" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-center mb-2 tracking-tighter italic uppercase leading-none">
                Acceso bloqueado
              </h2>
              <p className="text-gray-500 text-center text-sm mb-8 font-medium">
                Safari ha bloqueado tu ubicación. Actívala así de fácil:
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-2xl bg-gray-100 text-black flex items-center justify-center shrink-0 font-black italic text-sm italic">
                    01
                  </span>
                  <p className="text-sm font-bold leading-tight text-gray-700">
                    Toca el icono{" "}
                    <span className="text-blue-600 uppercase">AA</span> o el{" "}
                    <span className="text-blue-600 uppercase">Candado</span> en
                    la barra de arriba.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className="w-8 h-8 rounded-2xl bg-gray-100 text-black flex items-center justify-center shrink-0 font-black italic text-sm italic">
                    02
                  </span>
                  <p className="text-sm font-bold leading-tight text-gray-700">
                    Entra a{" "}
                    <span className="bg-gray-100 px-1 rounded italic uppercase text-[11px]">
                      Configuración del sitio web
                    </span>
                    .
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className="w-8 h-8 rounded-2xl bg-gray-100 text-black flex items-center justify-center shrink-0 font-black italic text-sm italic">
                    03
                  </span>
                  <p className="text-sm font-bold leading-tight text-gray-700 font-bold uppercase tracking-tighter">
                    Cambia ubicación a{" "}
                    <span className="text-green-600">PERMITIR</span>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-95 transition-all"
                >
                  Ya lo hice, recargar página
                </button>
                <button
                  onClick={() => setShowLocationGuide(false)}
                  className="w-full bg-transparent text-gray-400 py-2 rounded-2xl font-bold text-[10px] uppercase tracking-widest"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
