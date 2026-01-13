// src/firestore-service.js
import { db } from './firebase-config.js';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  arrayRemove,
  orderBy 
} from 'firebase/firestore';

// Créer un profil tuteur
async function createTutorProfile(userId, tutorData) {
  try {
    const tutorRef = doc(db, 'tutors', userId);
    await setDoc(tutorRef, {
      name: tutorData.name,
      email: tutorData.email,
      subjects: tutorData.subject ? [tutorData.subject] : [],
      description: tutorData.description || '',
      status: 'active',
      sessionsDone: 0,
      rating: 0,
      experience: tutorData.experience || 0,
      createdAt: new Date()
    });
    return tutorRef;
  } catch (error) {
    console.error('Erreur création profil tuteur:', error);
    throw error;
  }
}

// Créer un profil étudiant
async function createStudentProfile(userId, studentData) {
  try {
    const studentRef = doc(db, 'students', userId);
    await setDoc(studentRef, {
      name: studentData.name,
      email: studentData.email,
      favoriteTutors: [],
      createdAt: new Date()
    });
    return studentRef;
  } catch (error) {
    console.error('Erreur création profil étudiant:', error);
    throw error;
  }
}

// Récupérer tous les tuteurs
async function getAllTutors(subject = null) {
  try {
    let q;
    
    if (subject && subject !== 'all') {
      q = query(
        collection(db, "tutors"),
        where("subjects", "array-contains", subject),
        where("status", "==", "active"),
        orderBy("sessionsDone", "desc")
      );
    } else {
      q = query(
        collection(db, "tutors"),
        where("status", "==", "active"),
        orderBy("sessionsDone", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const tutors = [];
    
    querySnapshot.forEach((doc) => {
      tutors.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return tutors;
  } catch (error) {
    console.error("Erreur récupération tuteurs:", error);
    throw error;
  }
}

// Récupérer un tuteur par ID
async function getTutorById(tutorId) {
  try {
    const tutorRef = doc(db, "tutors", tutorId);
    const tutorDoc = await getDoc(tutorRef);
    
    if (tutorDoc.exists()) {
      return {
        id: tutorDoc.id,
        ...tutorDoc.data()
      };
    } else {
      throw new Error("Tuteur non trouvé");
    }
  } catch (error) {
    console.error("Erreur récupération tuteur:", error);
    throw error;
  }
}

// Ajouter un tuteur aux favoris
async function addToFavorites(studentId, tutorId) {
  try {
    const studentRef = doc(db, 'students', studentId);
    await updateDoc(studentRef, {
      favoriteTutors: arrayUnion(tutorId)
    });
  } catch (error) {
    console.error('Erreur ajout favoris:', error);
    throw error;
  }
}

// Vérifier si un tuteur est dans les favoris
async function isTutorFavorite(studentId, tutorId) {
  try {
    const studentRef = doc(db, 'students', studentId);
    const studentDoc = await getDoc(studentRef);
    
    if (studentDoc.exists()) {
      const favorites = studentDoc.data().favoriteTutors || [];
      return favorites.includes(tutorId);
    }
    return false;
  } catch (error) {
    console.error('Erreur vérification favoris:', error);
    return false;
  }
}

// Exporter
export { 
  createTutorProfile, 
  createStudentProfile,
  getAllTutors,
  getTutorById,
  addToFavorites,
  isTutorFavorite
};