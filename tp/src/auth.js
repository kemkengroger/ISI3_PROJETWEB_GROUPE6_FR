// src/auth.js
import { auth } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { createTutorProfile, createStudentProfile } from './firestore-service.js';

// Inscription d'un tuteur
async function registerTutor(email, password, name, subject) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await createTutorProfile(user.uid, {
      name: name,
      email: email,
      subject: subject
    });

    alert('Inscription réussie !');
    return user;
  } catch (error) {
    console.error('Erreur inscription:', error);
    throw error;
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
    return user;
  } catch (error) {
    console.error('Erreur inscription:', error);
    throw error;
  }
}

// Connexion
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erreur connexion:', error);
    throw error;
  }
}

// Déconnexion
async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    throw error;
  }
}

// Observer l'état d'authentification
function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Exporter
export { 
  registerTutor, 
  registerStudent, 
  loginUser, 
  logoutUser,
  onAuthChange,
  auth 
};