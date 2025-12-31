// app/page.js
"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function HomePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/mapa");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  // Mientras decide la redirección, muestra un splash simple
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Cercanías Inmobiliarias UY</p>
      </div>
    </div>
  );
}
