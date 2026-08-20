"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
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

// Función Haversine para calcular distancia en KM
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  const R = 6371;
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
  const [modo, setModo] = useState("explorar");
  const [showLocationGuide, setShowLocationGuide] = useState(false);

  // Cargar datos de Firebase
  useEffect(() => {
    const fetchPropiedades = async () => {
      try {
        const snapshot = await getDocs(collection(db, "propiedades"));
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPropiedades(docs);
      } catch (err) {
        console.error("Error Firestore:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPropiedades();
  }, []);

  // FILTRADO DINÁMICO (Radio 1km)
  const propiedadesAMostrar = useMemo(() => {
    if (modo === "explorar" || !userLocation) return propiedades;

    return propiedades.filter((p) => {
      const d = calcularDistancia(
        userLocation.lat,
        userLocation.lng,
        p.lat,
        p.lng
      );
      return d <= 1; // Filtro estricto de 1 Kilómetro
    });
  }, [propiedades, modo, userLocation]);

  const handleBotonAccion = () => {
    if (modo === "cerca") {
      setModo("explorar");
      setUserLocation(null); // Esto quita el círculo celeste del mapa
      return;
    }

    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setMapCenter({
          lat: coords.lat,
          lng: coords.lng,
          zoom: 15, // Zoom ideal para ver el radio de 1km
          timestamp: Date.now(),
        });
        setModo("cerca");
        setIsLocating(false);
        setShowLocationGuide(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) setShowLocationGuide(true);
        else alert("Error al obtener ubicación.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
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
            <span className="text-xl font-bold tracking-tighter italic uppercase">
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
              propiedades={propiedadesAMostrar}
              centerOverride={mapCenter}
              userLocation={userLocation} // IMPORTANTE: Para dibujar el círculo celeste
            />

            {/* BOTÓN FLOTANTE ORIGINAL */}
            <button
              onClick={handleBotonAccion}
              disabled={isLocating}
              className="absolute right-4 bottom-[42vh] md:bottom-8 z-[1000] bg-white px-6 py-4 rounded-full shadow-2xl border border-gray-100 active:scale-95 transition-all flex items-center justify-center min-w-[180px]"
            >
              {isLocating ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div
                  className={`flex items-center gap-2 font-black text-[10px] tracking-[0.2em] uppercase ${
                    modo === "cerca" ? "text-red-500" : "text-blue-600"
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    {modo === "explorar" ? (
                      <circle cx="12" cy="12" r="10" />
                    ) : (
                      <path d="M18 6L6 18M6 6l12 12" />
                    )}
                  </svg>
                  <span>
                    {modo === "explorar" ? "EXPLORAR 1KM" : "VER TODAS"}
                  </span>
                </div>
              )}
            </button>
          </main>

          {/* ÁREA DE LISTADO */}
          <aside className="z-10 w-full md:w-[420px] lg:w-[480px] bg-white border-t md:border-t-0 md:border-l border-gray-100 absolute bottom-0 md:relative h-[40vh] md:h-full flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto my-3 md:hidden"></div>
            <div className="px-6 py-5 border-b border-gray-50 bg-white">
              <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">
                {modo === "explorar" ? "Explorar" : "Cerca de mí"}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                {modo === "explorar"
                  ? "Catálogo completo"
                  : "Dentro del radio de 1km"}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24 scrollbar-hide">
              {loading ? (
                <div className="text-center py-10 text-gray-300 font-bold uppercase text-xs tracking-widest animate-pulse">
                  Sincronizando...
                </div>
              ) : propiedadesAMostrar.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <p className="text-gray-400 font-bold italic text-sm">
                    No hay propiedades en 1km a la redonda.
                  </p>
                  <button
                    onClick={() => setModo("explorar")}
                    className="mt-4 text-[10px] font-black uppercase text-blue-600 border-b-2 border-blue-600 pb-1"
                  >
                    Mostrar todo
                  </button>
                </div>
              ) : (
                propiedadesAMostrar.map((p) => (
                  <div
                    key={p.id}
                    className="flex gap-4 group cursor-pointer active:scale-[0.98] transition-all"
                    onClick={() =>
                      setMapCenter({
                        lat: p.lat,
                        lng: p.lng,
                        zoom: 17,
                        timestamp: Date.now(),
                      })
                    }
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] overflow-hidden bg-gray-50 shrink-0 border border-gray-100 shadow-sm">
                      <img
                        src={p.fotos?.[0] || "/placeholder.jpg"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col justify-center py-1 flex-1">
                      <h3 className="font-bold text-sm leading-tight line-clamp-2 uppercase tracking-tighter">
                        {p.titulo}
                      </h3>
                      <p className="text-xl font-black tracking-tighter mt-1 italic">
                        USD {p.precio?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>

        {/* MODAL SAFARI */}
        {showLocationGuide && (
          <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-center mb-2 tracking-tighter italic uppercase">
                Acceso Denegado
              </h2>
              <p className="text-gray-500 text-center text-sm mb-6">
                Activa la ubicación en los ajustes de Safari para poder usar el
                radar de 1km.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
              >
                Recargar Página
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
