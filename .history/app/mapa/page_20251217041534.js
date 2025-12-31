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
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      Cargando mapa...
    </div>
  ),
});

const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
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

  useEffect(() => {
    const fetchPropiedades = async () => {
      try {
        const snapshot = await getDocs(collection(db, "propiedades"));
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Aseguramos que sean números
          lat: Number(doc.data().lat),
          lng: Number(doc.data().lng),
        }));
        setPropiedades(docs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPropiedades();
  }, []);

  const propiedadesAMostrar = useMemo(() => {
    if (modo === "explorar" || !userLocation) return propiedades;
    return propiedades.filter(
      (p) =>
        calcularDistancia(userLocation.lat, userLocation.lng, p.lat, p.lng) <= 1
    );
  }, [propiedades, modo, userLocation]);

  const handleBotonAccion = () => {
    if (modo === "cerca") {
      setModo("explorar");
      setUserLocation(null);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setMapCenter({ ...coords, zoom: 15, timestamp: Date.now() });
        setModo("cerca");
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true }
    );
  };

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen bg-white overflow-hidden text-black antialiased">
        <header className="h-16 border-b flex items-center justify-between px-6 z-20 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center italic text-white font-black text-xs">
              C
            </div>
            <span className="text-xl font-bold tracking-tighter italic">
              CERCANÍAS
            </span>
          </div>
          <Link
            href="/dashboard"
            className="bg-black text-white px-5 py-2 rounded-full text-xs font-black uppercase"
          >
            + Publicar
          </Link>
        </header>

        <div className="flex-1 flex flex-col md:flex-row relative">
          <main className="absolute inset-0 md:relative md:flex-1">
            <MapComponent
              propiedades={propiedadesAMostrar}
              centerOverride={mapCenter}
              userLocation={userLocation}
            />
            <button
              onClick={handleBotonAccion}
              className="absolute right-4 bottom-[42vh] md:bottom-8 z-[1000] bg-white px-6 py-4 rounded-full shadow-2xl border font-black text-[10px] tracking-widest uppercase text-blue-600 active:scale-95"
            >
              {isLocating
                ? "Localizando..."
                : modo === "explorar"
                ? "CERCA DE MÍ (1KM)"
                : "VER TODAS"}
            </button>
          </main>

          <aside className="z-10 w-full md:w-[420px] bg-white border-t md:border-l absolute bottom-0 md:relative h-[40vh] md:h-full flex flex-col">
            <div className="px-6 py-5 border-b">
              <h2 className="text-xl font-black italic uppercase">
                {modo === "explorar" ? "Explorar" : "Cerca de mí"}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {propiedadesAMostrar.length} resultados encontrados
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {propiedadesAMostrar.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-4 cursor-pointer"
                  onClick={() =>
                    setMapCenter({
                      lat: p.lat,
                      lng: p.lng,
                      zoom: 17,
                      timestamp: Date.now(),
                    })
                  }
                >
                  <img
                    src={p.fotos?.[0] || "/placeholder.jpg"}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-sm uppercase">{p.titulo}</h3>
                    <p className="text-lg font-black tracking-tighter italic">
                      USD {p.precio?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}
