"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";

// Componente de Mapa cargado dinámicamente para evitar errores de SSR con Leaflet/Google Maps
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-50 flex items-center justify-center text-gray-400 font-medium">
      Cargando mapa...
    </div>
  ),
});

/**
 * Función Haversine para calcular distancia entre dos puntos geográficos en KM
 */
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function MapaPage() {
  const [user] = useAuthState(auth);
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [modo, setModo] = useState("explorar"); // "explorar" o "cerca"
  const [showLocationGuide, setShowLocationGuide] = useState(false);

  // 1. Cargar datos de Firebase
  useEffect(() => {
    const fetchPropiedades = async () => {
      try {
        const snapshot = await getDocs(collection(db, "propiedades"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPropiedades(data);
      } catch (err) {
        console.error("Error Firestore:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPropiedades();
  }, []);

  // 2. Lógica de Filtrado Dinámico
  // Se recalculan las propiedades a mostrar cada vez que cambia el modo o la ubicación del usuario
  const propiedadesAMostrar = useMemo(() => {
    if (modo === "explorar" || !userLocation) {
      return propiedades;
    }
    // Si el modo es "cerca", filtramos las que están a menos de 10km (puedes ajustar este número)
    const RADIO_KM = 1;
    return propiedades.filter((p) => {
      if (!p.lat || !p.lng) return false;
      const d = calcularDistancia(
        userLocation.lat,
        userLocation.lng,
        p.lat,
        p.lng
      );
      return d <= RADIO_KM;
    });
  }, [propiedades, modo, userLocation]);

  // 3. Función para obtener ubicación real
  const handleObtenerUbicacion = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        setMapCenter({
          ...coords,
          zoom: 15,
          timestamp: Date.now(),
        });
        setModo("cerca"); // Activa automáticamente el modo "cerca"
        setIsLocating(false);
        setShowLocationGuide(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          setShowLocationGuide(true);
        } else {
          alert("Error al obtener ubicación. Intenta de nuevo.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen bg-white overflow-hidden text-black antialiased">
        {/* HEADER */}
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
            className="hidden md:block bg-black text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-transform active:scale-95"
          >
            + Publicar
          </Link>
        </header>

        <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
          {/* ÁREA DE MAPA */}
          <main className="absolute inset-0 md:relative md:flex-1 z-0">
            {/* Pasamos solo las propiedades filtradas al mapa */}
            <MapComponent
              propiedades={propiedadesAMostrar}
              centerOverride={mapCenter}
            />

            {/* BOTÓN FLOTANTE DE UBICACIÓN (Para refrescar o centrar) */}
            <button
              onClick={handleObtenerUbicacion}
              disabled={isLocating}
              className="absolute right-4 bottom-[42vh] md:bottom-8 z-30 bg-white p-4 rounded-full shadow-2xl border border-gray-100 active:scale-90 transition-all flex items-center justify-center disabled:opacity-70"
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
                </div>
              )}
            </button>
          </main>

          {/* ÁREA DE LISTADO */}
          <aside className="z-10 w-full md:w-[420px] lg:w-[480px] bg-white border-t md:border-t-0 md:border-l border-gray-100 absolute bottom-0 md:relative h-[40vh] md:h-full flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto my-3 md:hidden"></div>

            <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-gray-50">
              <div>
                <h2 className="text-xl font-black italic tracking-tighter uppercase">
                  {modo === "explorar" ? "Propiedades" : "Cerca de ti"}
                </h2>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  {modo === "explorar"
                    ? "Mostrando todo el catálogo"
                    : "Radio de búsqueda: 1km"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    modo === "cerca" ? "bg-blue-500" : "bg-green-500"
                  }`}
                ></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {propiedadesAMostrar.length} Resultados
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24 scrollbar-hide">
              {loading ? (
                <div className="text-center py-10 text-gray-300 font-medium animate-pulse">
                  Sincronizando...
                </div>
              ) : propiedadesAMostrar.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 font-bold italic">
                    No hay propiedades en esta zona.
                  </p>
                  <button
                    onClick={() => setModo("explorar")}
                    className="mt-4 text-xs font-black  tracking-tighter border-b-2 border-black"
                  >
                    Ver todas las propiedades
                  </button>
                </div>
              ) : (
                propiedadesAMostrar.map((p) => (
                  <div
                    key={p.id}
                    className="flex gap-4 group cursor-pointer active:opacity-60 transition-all"
                    onClick={() =>
                      setMapCenter({
                        lat: p.lat,
                        lng: p.lng,
                        zoom: 17,
                        timestamp: Date.now(),
                      })
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
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-end md:items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl">
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
                Ubicación desactivada
              </h2>
              <p className="text-gray-500 text-center text-sm mb-8 font-medium">
                Para ver lo que hay cerca, activa el permiso en Safari:
              </p>

              <div className="space-y-4 mb-8 text-gray-700">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 font-black">
                    1
                  </span>
                  <p className="text-sm font-bold">
                    Toca el icono <span className="text-blue-600">AA</span> o el
                    candado en la barra.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 font-black">
                    2
                  </span>
                  <p className="text-sm font-bold">
                    Entra a Configuración del sitio web.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 font-black">
                    3
                  </span>
                  <p className="text-sm font-bold uppercase">
                    Ubicación → <span className="text-green-600">Permitir</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
              >
                Ya lo hice, recargar
              </button>
              <button
                onClick={() => setShowLocationGuide(false)}
                className="w-full text-gray-400 py-3 mt-2 font-bold text-[10px] uppercase"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
