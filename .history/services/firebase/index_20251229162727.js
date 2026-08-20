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

// Exporta los servicios que necesitas
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// EXPORTA LAS FUNCIONES Y OBJETOS
export { auth, db, signInWithEmailAndPassword, signInWithPopup };
