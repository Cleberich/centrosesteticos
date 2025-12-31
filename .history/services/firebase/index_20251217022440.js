// firebase/config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Si usas otros servicios, impórtalos aquí (ej. getFirestore, getStorage)

// Tus credenciales de configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAF83FEXt1ek1qjSBZgtQEr_WSn4Pn6WLw",
  authDomain: "paito-601ff.firebaseapp.com",
  projectId: "paito-601ff",
  storageBucket: "paito-601ff.appspot.com",
  messagingSenderId: "739439353671",
  appId: "1:739439353671:web:8fe8e7fb1a30930118f662",
  measurementId: "G-EG7L8GJJ23",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que necesitas
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Exporta la app para otros usos si es necesario
export default app;
