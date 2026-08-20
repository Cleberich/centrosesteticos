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

// Función Haversine corregida
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
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

  // Lógica de filtrado con salvaguarda para que los marcadores no desaparezcan
  const propiedadesAMostrar = useMemo(() => {
    // Si no hay ubicación o estamos explorando, mostrar TODO
    if (modo === "explorar" || !userLocation) {
      return propiedades;
    }
    // Radio de 1km para ser más generosos
    return propiedades.filter((p) => {
      const d = calcularDistancia(
        userLocation.lat,
        userLocation.lng,
        p.lat,
        p.lng
      );
      return d <= 1;
    });
  }, [propiedades, modo, userLocation]);

  const handleBotonAccion = () => {
    if (modo === "cerca") {
      setModo("explorar");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocalización no soportada");
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
          zoom: 15,
          timestamp: Date.now(),
        });
        setModo("cerca");
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) setShowLocationGuide(true);
        else alert("Error al obtener ubicación");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen bg-white overflow-hidden text-black antialiased">
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
            className="bg-black text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest"
          >
            + Publicar
          </Link>
        </header>

        <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
          <main className="absolute inset-0 md:relative md:flex-1 z-0">
            {/* IMPORTANTE: Pasamos propiedadesAMostrar para que el mapa se actualice */}
            <MapComponent
              propiedades={propiedadesAMostrar}
              centerOverride={mapCenter}
            />

            <button
              onClick={handleBotonAccion}
              disabled={isLocating}
              className="absolute right-4 bottom-[42vh] md:bottom-8 z-[1000] bg-white px-6 py-4 rounded-full shadow-2xl border border-gray-100 active:scale-95 transition-all flex items-center justify-center min-w-[160px]"
            >
              {isLocating ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div
                  className={`flex items-center gap-2 font-black text-xs tracking-widest uppercase ${
                    modo === "cerca" ? "text-red-500" : "text-blue-600"
                  }`}
                >
                  <span>
                    {modo === "explorar" ? "CERCA DE MÍ" : "EXPLORAR TODAS"}
                  </span>
                </div>
              )}
            </button>
          </main>

          <aside className="z-10 w-full md:w-[420px] bg-white border-t md:border-l border-gray-100 absolute bottom-0 md:relative h-[40vh] md:h-full flex flex-col shadow-2xl">
            <div className="px-6 py-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-black italic uppercase tracking-tighter">
                {modo === "explorar" ? "Todas" : "Cercanas"}
              </h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {propiedadesAMostrar.length} Activas
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24 scrollbar-hide">
              {loading ? (
                <div className="text-center py-10 text-gray-300">
                  Cargando...
                </div>
              ) : (
                propiedadesAMostrar.map((p) => (
                  <div
                    key={p.id}
                    className="flex gap-4 group cursor-pointer"
                    onClick={() =>
                      setMapCenter({
                        lat: p.lat,
                        lng: p.lng,
                        zoom: 17,
                        timestamp: Date.now(),
                      })
                    }
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                      <img
                        src={p.fotos?.[0] || "/placeholder.jpg"}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-sm leading-tight line-clamp-2">
                        {p.titulo}
                      </h3>
                      <p className="text-lg font-black tracking-tighter mt-1">
                        USD {p.precio?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>

        {/* Modal Safari se mantiene igual... */}
        {showLocationGuide && (
          <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-[40px] p-8">
              <h2 className="text-xl font-black uppercase text-center mb-4">
                Activa el GPS
              </h2>
              <p className="text-sm text-center mb-6 text-gray-500">
                Ve a configuración del sitio y permite la ubicación.
              </p>
              <button
                onClick={() => setShowLocationGuide(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold uppercase"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
