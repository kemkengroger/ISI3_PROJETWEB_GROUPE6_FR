import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createTutorProfile, createStudentProfile } from './firestore-service.js';

// Inscription d'un tuteur
async function registerTutor(email, password, name, subject) {
  try {
    // Créer le compte Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Créer le profil dans Firestore
    await createTutorProfile(user.uid, {
      name: name,
      email: email,
      subject: subject
    });

    alert('Inscription réussie !');
  } catch (error) {
    console.error('Erreur inscription:', error);
    alert('Erreur: ' + error.message);
  }
}

// Inscription d'un étudiant
async function registerStudent(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await createStudentProfile(user.uid, {
      name: name,
      email: email
    });

    alert('Inscription réussie !');
  } catch (error) {
    console.error('Erreur inscription:', error);
    alert('Erreur: ' + error.message);
  }
}