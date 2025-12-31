// firebase/config.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"; // <--- FALTABA IMPORTAR ESTO
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAF83FEXt1ek1qjSBZgtQEr_WSn4Pn6WLw",
  authDomain: "paito-601ff.firebaseapp.com",
  projectId: "paito-601ff",
  storageBucket: "paito-601ff.appspot.com",
  messagingSenderId: "739439353671",
  appId: "1:739439353671:web:8fe8e7fb1a30930118f662",
  measurementId: "G-EG7L8GJJ23",
};

// Inicialización segura para Next.js
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// EXPORTACIÓN CORRECTA
export {
  auth,
  db,
  storage,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
};
