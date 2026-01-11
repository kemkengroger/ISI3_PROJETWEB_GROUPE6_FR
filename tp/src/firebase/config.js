import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAvjQaWPrA7M5b0XmDrrBwTKDlv5q-nXDM",
  authDomain: "isi3projetwebgroupe6fr.firebaseapp.com",
  projectId: "isi3projetwebgroupe6fr",
  storageBucket: "isi3projetwebgroupe6fr.firebasestorage.app",
  messagingSenderId: "1024122923638",
  appId: "1:1024122923638:web:f1a367d84a567449494d57",
  measurementId: "G-0S94T7XMYC"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser l'authentification et l'exporter
export const auth = getAuth(app);

export default app;
export const db = getFirestore(app);