import { db } from './firebase-config.js';
import { collection, addDoc, setDoc, doc, updateDoc } from 'firebase/firestore';

// Créer un profil tuteur lors de l'inscription
export async function createTutorProfile(userId, tutorData) {
  try {
    await setDoc(doc(db, 'users', userId), {
      uid: userId,
      name: tutorData.name,
      email: tutorData.email,
      role: 'tuteur',
      subject: tutorData.subject,
      isOnline: false,
      peerId: userId,
      createdAt: new Date()
    });
    console.log('Profil tuteur créé avec succès');
  } catch (error) {
    console.error('Erreur création profil:', error);
  }
}

// Créer un profil étudiant
export async function createStudentProfile(userId, studentData) {
  try {
    await setDoc(doc(db, 'users', userId), {
      uid: userId,
      name: studentData.name,
      email: studentData.email,
      role: 'etudiant',
      peerId: userId,
      createdAt: new Date()
    });
    console.log('Profil étudiant créé avec succès');
  } catch (error) {
    console.error('Erreur création profil:', error);
  }
}

// Mettre à jour le statut en ligne du tuteur
export async function updateOnlineStatus(userId, isOnline) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isOnline: isOnline
    });
    console.log('Statut mis à jour:', isOnline);
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
  }
}