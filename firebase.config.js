// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvjQaWPrA7M5b0XmDrrBwTKDlv5q-nXDM",
  authDomain: "isi3projetwebgroupe6fr.firebaseapp.com",
  projectId: "isi3projetwebgroupe6fr",
  storageBucket: "isi3projetwebgroupe6fr.firebasestorage.app",
  messagingSenderId: "1024122923638",
  appId: "1:1024122923638:web:f1a367d84a567449494d57",
  measurementId: "G-0S94T7XMYC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);