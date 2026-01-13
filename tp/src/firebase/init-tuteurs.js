// Script pour initialiser des tuteurs de test (à exécuter une fois)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

async function initTuteursTest() {
  const tuteursTest = [
    {
      nom: "Prof. Jean Kamga",
      email: "kamga@tutoafrica.com",
      description: "Enseignant en mathématiques, 10 ans d'expérience",
      matieres: ["Mathématiques", "Physique"],
      experience: 10,
      sessionsEffectuees: 87,
      statut: "actif",
      note: 4.8,
      disponibilites: {
        lundi: ["09:00", "17:00"],
        mardi: ["09:00", "17:00"],
        mercredi: ["14:00", "20:00"]
      }
    },
    {
      nom: "Mme Clarisse Ndzié",
      email: "ndzie@tutoafrica.com",
      description: "Professeure de français et littérature",
      matieres: ["Français", "Littérature camerounaise"],
      experience: 8,
      sessionsEffectuees: 42,
      statut: "absent",
      note: 4.5,
      disponibilites: {
        jeudi: ["10:00", "16:00"],
        vendredi: ["10:00", "16:00"]
      }
    }
  ];

  try {
    for (let i = 0; i < tuteursTest.length; i++) {
      const tuteur = tuteursTest[i];
      const tuteurId = `tuteur_${i + 1}`;
      
      await setDoc(doc(db, "tuteurs", tuteurId), {
        ...tuteur,
        dateInscription: new Date(),
        derniereConnexion: new Date()
      });
      
      console.log(`Tuteur ${tuteur.nom} ajouté avec ID: ${tuteurId}`);
    }
    
    console.log("Initialisation des tuteurs terminée !");
    
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
  }
}

// Exécuter seulement si nécessaire
// initTuteursTest();