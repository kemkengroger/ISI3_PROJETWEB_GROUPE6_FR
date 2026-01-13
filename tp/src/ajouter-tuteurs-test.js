// ajouter-tuteurs-test.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore,
  collection,
  addDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvjQaWPrA7M5b0XmDrrBwTKDlv5q-nXDM",
  authDomain: "isi3projetwebgroupe6fr.firebaseapp.com",
  projectId: "isi3projetwebgroupe6fr",
  storageBucket: "isi3projetwebgroupe6fr.firebasestorage.app",
  messagingSenderId: "1024122923638",
  appId: "1:1024122923638:web:f1a367d84a567449494d57",
  measurementId: "G-0S94T7XMYC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function ajouterTuteursTest() {
  const tuteursTest = [
    {
      nom: "Sophie Martin",
      description: "Professeur de mathématiques avec 5 ans d'expérience en tutorat en ligne. Spécialisée en algèbre et calcul.",
      matieres: ["Mathématiques", "Algèbre"],
      note: 4.8,
      sessionsEffectuees: 127,
      statut: "actif",
      experience: 5,
      disponibilites: {
        "lundi": ["14:00", "20:00"],
        "mercredi": ["09:00", "17:00"],
        "vendredi": ["10:00", "18:00"]
      }
    },
    {
      nom: "Thomas Bernard",
      description: "Ingénieur en informatique, passionné par l'enseignement. Cours de programmation Python et Java.",
      matieres: ["Informatique", "Programmation"],
      note: 4.6,
      sessionsEffectuees: 89,
      statut: "actif",
      experience: 3,
      disponibilites: {
        "mardi": ["16:00", "22:00"],
        "jeudi": ["16:00", "22:00"],
        "samedi": ["10:00", "16:00"]
      }
    },
    {
      nom: "Marie Dubois",
      description: "Professeur de physique-chimie. Méthodologie adaptée à chaque élève pour une compréhension profonde.",
      matieres: ["Physique", "Chimie"],
      note: 4.7,
      sessionsEffectuees: 156,
      statut: "actif",
      experience: 7,
      disponibilites: {
        "lundi": ["09:00", "12:00"],
        "mercredi": ["14:00", "18:00"],
        "vendredi": ["15:00", "19:00"]
      }
    },
    {
      nom: "Jean Dupont",
      description: "Doctorant en littérature française. Cours de français et méthodologie de dissertation.",
      matieres: ["Français", "Littérature"],
      note: 4.5,
      sessionsEffectuees: 65,
      statut: "inactif",
      experience: 2,
      disponibilites: {
        "mardi": ["10:00", "16:00"],
        "jeudi": ["10:00", "16:00"]
      }
    },
    {
      nom: "Sarah Johnson",
      description: "Native English teacher with TEFL certification. Business and conversational English.",
      matieres: ["Anglais", "Business English"],
      note: 4.9,
      sessionsEffectuees: 203,
      statut: "actif",
      experience: 8,
      disponibilites: {
        "lundi": ["08:00", "12:00"],
        "mercredi": ["08:00", "12:00"],
        "vendredi": ["08:00", "12:00"]
      }
    }
  ];

  try {
    for (const tuteur of tuteursTest) {
      const docRef = await addDoc(collection(db, "tuteurs"), tuteur);
      console.log("Tuteur ajouté avec ID:", docRef.id);
    }
    console.log("Tous les tuteurs de test ont été ajoutés!");
  } catch (error) {
    console.error("Erreur lors de l'ajout des tuteurs:", error);
  }
}

// Exécuter la fonction
ajouterTuteursTest();