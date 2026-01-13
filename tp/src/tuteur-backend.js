// src/tuteurs-backend.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Configuration Firebase
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
const db = getFirestore(app);
const auth = getAuth(app);

// Classe pour gérer les tuteurs
class TuteurManager {
  constructor() {
    this.currentUser = null;
    this.initAuth();
  }

  // Initialiser l'authentification
  initAuth() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      console.log('Utilisateur auth:', user ? user.uid : 'Non connecté');
    });
  }

  // Récupérer tous les tuteurs
  async getAllTuteurs(matiere = null) {
    try {
      let q;
      
      if (matiere && matiere !== 'all') {
        // Filtrer par matière
        q = query(
          collection(db, "tuteurs"),
          where("matieres", "array-contains", matiere),
          where("statut", "==", "actif"),
          orderBy("sessionsEffectuees", "desc")
        );
      } else {
        // Tous les tuteurs actifs
        q = query(
          collection(db, "tuteurs"),
          where("statut", "==", "actif"),
          orderBy("sessionsEffectuees", "desc")
        );
      }

      const querySnapshot = await getDocs(q);
      const tuteurs = [];
      
      querySnapshot.forEach((doc) => {
        tuteurs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return tuteurs;
      
    } catch (error) {
      console.error("Erreur lors de la récupération des tuteurs:", error);
      throw error;
    }
  }

  // Récupérer un tuteur par son ID
  async getTuteurById(tuteurId) {
    try {
      const tuteurRef = doc(db, "tuteurs", tuteurId);
      const tuteurDoc = await getDoc(tuteurRef);
      
      if (tuteurDoc.exists()) {
        return {
          id: tuteurDoc.id,
          ...tuteurDoc.data()
        };
      } else {
        throw new Error("Tuteur non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du tuteur:", error);
      throw error;
    }
  }

  // Rechercher des tuteurs par nom ou matière
  async searchTuteurs(searchTerm) {
    try {
      // Note: Firestore ne supporte pas la recherche textuelle native
      // Dans une vraie app, utilisez Algolia/ElasticSearch ou Firebase Extension
      
      // Solution simple: récupérer tous et filtrer côté client
      const allTuteurs = await this.getAllTuteurs();
      
      return allTuteurs.filter(tuteur => 
        tuteur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tuteur.matieres.some(matiere => 
          matiere.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      throw error;
    }
  }

  // Démarer une session avec un tuteur
  async demarrerSession(tuteurId) {
    try {
      if (!this.currentUser) {
        throw new Error("Vous devez être connecté pour démarrer une session");
      }

      // 1. Vérifier que le tuteur existe et est actif
      const tuteur = await this.getTuteurById(tuteurId);
      
      if (tuteur.statut !== 'actif') {
        throw new Error("Ce tuteur n'est pas disponible actuellement");
      }

      // 2. Créer une session dans Firestore
      const sessionData = {
        tuteurId: tuteurId,
        tuteurNom: tuteur.nom,
        etudiantId: this.currentUser.uid,
        etudiantEmail: this.currentUser.email,
        etudiantNom: this.currentUser.displayName || "Étudiant",
        matiere: tuteur.matieres[0], // Première matière par défaut
        dateDebut: serverTimestamp(),
        statut: "en_cours",
        type: "tutorat"
      };

      // Ajouter ici le code pour créer la session dans la collection 'sessions'
      // const sessionRef = await addDoc(collection(db, "sessions"), sessionData);
      
      // 3. Mettre à jour le compteur de sessions du tuteur
      const tuteurRef = doc(db, "tuteurs", tuteurId);
      await updateDoc(tuteurRef, {
        sessionsEffectuees: tuteur.sessionsEffectuees + 1
      });

      return {
        success: true,
        message: "Session démarrée avec succès",
        sessionData: sessionData
        // sessionId: sessionRef.id
      };

    } catch (error) {
      console.error("Erreur lors du démarrage de la session:", error);
      throw error;
    }
  }

  // Ajouter un tuteur aux favoris
  async ajouterAuxFavoris(tuteurId) {
    try {
      if (!this.currentUser) {
        throw new Error("Connectez-vous pour ajouter aux favoris");
      }

      const userRef = doc(db, "etudiants", this.currentUser.uid);
      
      await updateDoc(userRef, {
        tuteursFavoris: arrayUnion(tuteurId)
      });

      return { success: true, message: "Tuteur ajouté aux favoris" };
      
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
      throw error;
    }
  }

  // Noter un tuteur
  async noterTuteur(tuteurId, note, commentaire = "") {
    try {
      if (!this.currentUser) {
        throw new Error("Connectez-vous pour noter un tuteur");
      }

      if (note < 1 || note > 5) {
        throw new Error("La note doit être entre 1 et 5");
      }

      const evaluationData = {
        tuteurId: tuteurId,
        etudiantId: this.currentUser.uid,
        etudiantNom: this.currentUser.displayName,
        note: note,
        commentaire: commentaire,
        date: serverTimestamp()
      };

      // Ajouter l'évaluation
      // const evalRef = await addDoc(collection(db, "evaluations"), evaluationData);
      
      // Mettre à jour la note moyenne du tuteur (calcul côté serveur recommandé)
      // Cette partie nécessite une Cloud Function pour un calcul précis
      
      return { 
        success: true, 
        message: "Merci pour votre évaluation",
        // evaluationId: evalRef.id
      };

    } catch (error) {
      console.error("Erreur lors de l'évaluation:", error);
      throw error;
    }
  }

  // Vérifier la disponibilité d'un tuteur
  async verifierDisponibilite(tuteurId) {
    try {
      const tuteur = await this.getTuteurById(tuteurId);
      
      const maintenant = new Date();
      const jour = maintenant.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
      const heure = maintenant.getHours() + ':' + maintenant.getMinutes();
      
      if (tuteur.disponibilites && tuteur.disponibilites[jour]) {
        const [debut, fin] = tuteur.disponibilites[jour];
        return {
          disponible: heure >= debut && heure <= fin,
          horaires: tuteur.disponibilites[jour],
          message: `Disponible aujourd'hui de ${debut} à ${fin}`
        };
      }
      
      return {
        disponible: tuteur.statut === 'actif',
        message: tuteur.statut === 'actif' ? 'Disponible' : 'Non disponible'
      };
      
    } catch (error) {
      console.error("Erreur vérification disponibilité:", error);
      throw error;
    }
  }
}

// Exporter la classe
export { TuteurManager };