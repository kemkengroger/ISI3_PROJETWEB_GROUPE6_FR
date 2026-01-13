<<<<<<< HEAD
/*import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
=======
 import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
>>>>>>> e8a1ecac6309d15372259abeb296c0cac7cc4d67
import { auth } from './firebase/config.js';

document.addEventListener('DOMContentLoaded', () => {
    const formulaire = document.getElementById('form-inscription');
    
    if (!formulaire) {
        console.error('Formulaire non trouvé');
        return;
    }
    
    formulaire.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bouton = formulaire.querySelector('button[type="submit"]');
        const texteOriginal = bouton.textContent;
        bouton.disabled = true;
        bouton.textContent = 'Inscription en cours...';
        
        const nom = document.getElementById('nom').value.trim();
        const email = document.getElementById('email').value.trim();
        const niveau = document.getElementById('niveau').value;
        const password = document.getElementById('password').value;
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            await updateProfile(userCredential.user, {
                displayName: nom,
                photoURL: niveau
            });
            
            localStorage.setItem('userInfo', JSON.stringify({
                nom: nom,
                email: email,
                niveau: niveau,
                dateInscription: new Date().toISOString()
            }));
            
            alert('Inscription réussie ! Bienvenue ' + nom);
            window.location.href = '/boardEtudiant.html';
            
        } catch (error) {
            console.error('Erreur inscription:', error);
            
            let message = 'Erreur lors de l\'inscription';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'Cet email est déjà utilisé';
                    break;
                case 'auth/weak-password':
                    message = 'Le mot de passe doit contenir au moins 6 caractères';
                    break;
                case 'auth/invalid-email':
                    message = 'Adresse email invalide';
                    break;
                default:
                    message = error.message;
            }
            
            alert(message);
            bouton.disabled = false;
            bouton.textContent = texteOriginal;
        }
    });
});
// inscriptionEtudiant.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Gestion du formulaire d'inscription
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-inscription');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Récupérer les valeurs du formulaire
    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();
    const niveau = document.getElementById('niveau').value;
    const password = document.getElementById('password').value;
    
    // Validation basique
    if (!nom || !email || !niveau || !password) {
      showAlert('Veuillez remplir tous les champs.', 'danger');
      return;
    }
    
    if (password.length < 6) {
      showAlert('Le mot de passe doit contenir au moins 6 caractères.', 'danger');
      return;
    }
    
    try {
      // Désactiver le bouton pendant le traitement
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Inscription en cours...';
      
      // 1. Créer l'utilisateur dans Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Mettre à jour le profil avec le nom
      await updateProfile(user, {
        displayName: nom
      });
      
      // 3. Stocker les informations supplémentaires dans Firestore
      await setDoc(doc(db, "etudiants", user.uid), {
        uid: user.uid,
        nom: nom,
        email: email,
        niveau: niveau,
        dateInscription: serverTimestamp(),
        role: "etudiant",
        statut: "actif",
        derniereConnexion: serverTimestamp()
      });
      
      // 4. Afficher un message de succès
      showAlert('Inscription réussie ! Redirection vers le tableau de bord...', 'success');
      
      // 5. Rediriger vers le tableau de bord après 2 secondes
      setTimeout(() => {
        window.location.href = 'boardEtudiant.html';
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      // Gestion des erreurs spécifiques
      let errorMessage = 'Une erreur est survenue lors de l\'inscription.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Cette adresse email est déjà utilisée.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe est trop faible.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erreur de connexion réseau.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      showAlert(errorMessage, 'danger');
      
      // Réactiver le bouton
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Créer mon compte';
    }
  });
});

// Fonction pour afficher les alertes
function showAlert(message, type) {
  // Supprimer les alertes existantes
  const existingAlert = document.querySelector('.custom-alert');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  // Créer la nouvelle alerte
  const alertDiv = document.createElement('div');
  alertDiv.className = `custom-alert alert alert-${type} alert-dismissible fade show position-fixed`;
  alertDiv.style.cssText = `
    top: 20px;
    right: 20px;
    z-index: 1050;
    min-width: 300px;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  // Ajouter l'alerte au document
  document.body.appendChild(alertDiv);
  
  // Auto-dismiss après 5 secondes
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

// Fonction pour valider l'email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}*/
// inscriptionEtudiant.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Variables globales
let app, auth, db;
let firebaseInitialized = false;

// Gestionnaire d'état de l'application
const AppStatus = {
  INITIALIZING: 'initializing',
  READY: 'ready',
  ERROR: 'error',
  OFFLINE: 'offline'
};

let currentAppStatus = AppStatus.INITIALIZING;

// Initialiser Firebase avec gestion d'erreurs
async function initializeFirebase() {
  try {
    // Vérifier la connexion Internet
    if (!navigator.onLine) {
      throw new Error('Pas de connexion Internet. Veuillez vérifier votre connexion.');
    }

    // Initialiser Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Tester la connexion à Firebase
    await testFirebaseConnection();
    
    firebaseInitialized = true;
    currentAppStatus = AppStatus.READY;
    
    // Afficher notification de succès
    showNotification('Connexion à Firebase établie avec succès', 'success', 3000);
    
    console.log('Firebase initialisé avec succès');
    return true;
    
  } catch (error) {
    console.error('Erreur d\'initialisation Firebase:', error);
    firebaseInitialized = false;
    currentAppStatus = AppStatus.ERROR;
    
    // Déterminer le type d'erreur
    let errorMessage = 'Impossible d\'initialiser Firebase';
    let errorType = 'error';
    
    if (error.message.includes('network') || error.message.includes('Internet')) {
      errorMessage = 'Erreur de connexion réseau. Veuillez vérifier votre connexion Internet.';
      errorType = 'warning';
      currentAppStatus = AppStatus.OFFLINE;
    } else if (error.message.includes('project') || error.message.includes('config')) {
      errorMessage = 'Erreur de configuration Firebase. Contactez l\'administrateur.';
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      errorMessage = 'Limite de requêtes atteinte. Veuillez réessayer plus tard.';
      errorType = 'warning';
    }
    
    showNotification(errorMessage, errorType, 5000);
    disableFormSubmission();
    return false;
  }
}

// Tester la connexion Firebase
async function testFirebaseConnection() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout: Impossible de se connecter à Firebase'));
    }, 10000);
    
    // Vérifier si auth est disponible
    if (!auth) {
      clearTimeout(timeout);
      reject(new Error('Service d\'authentification non disponible'));
    }
    
    // Essayer une opération simple pour tester la connexion
    try {
      // Vérifier l'état d'authentification comme test de connexion
      const unsubscribe = auth.onAuthStateChanged((user) => {
        clearTimeout(timeout);
        unsubscribe();
        resolve(true);
      }, (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

// Désactiver le formulaire en cas d'erreur
function disableFormSubmission() {
  const form = document.getElementById('form-inscription');
  if (form) {
    form.querySelector('button[type="submit"]').disabled = true;
    form.querySelector('button[type="submit"]').innerHTML = 
      '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Service indisponible';
  }
}

// Activer le formulaire
function enableFormSubmission() {
  const form = document.getElementById('form-inscription');
  if (form) {
    form.querySelector('button[type="submit"]').disabled = false;
    form.querySelector('button[type="submit"]').innerHTML = 'Créer mon compte';
  }
}

// Fonction pour afficher les notifications professionnelles
function showNotification(message, type = 'info', duration = 5000) {
  // Supprimer les notifications existantes du même type
  const existingNotifications = document.querySelectorAll(`.app-notification[data-type="${type}"]`);
  existingNotifications.forEach(notification => {
    notification.style.animation = 'slideOutRight 0.3s forwards';
    setTimeout(() => notification.remove(), 300);
  });
  
  // Créer la nouvelle notification
  const notification = document.createElement('div');
  notification.className = `app-notification alert alert-${getBootstrapAlertType(type)}`;
  notification.setAttribute('data-type', type);
  notification.setAttribute('role', 'alert');
  
  // Icônes selon le type
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };
  
  notification.innerHTML = `
    <div class="d-flex align-items-center">
      <span class="notification-icon me-3">${icons[type] || icons.info}</span>
      <div class="notification-content flex-grow-1">
        <strong class="notification-title">${getNotificationTitle(type)}</strong>
        <div class="notification-message">${message}</div>
      </div>
      <button type="button" class="btn-close ms-3" onclick="this.parentElement.parentElement.remove()"></button>
    </div>
    <div class="notification-progress">
      <div class="notification-progress-bar ${type}"></div>
    </div>
  `;
  
  // Ajouter des styles CSS si nécessaire
  if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
      .app-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 350px;
        max-width: 450px;
        border-radius: 8px;
        border: none;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        overflow: hidden;
        animation: slideInRight 0.3s ease-out;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      
      .notification-icon {
        font-size: 1.5rem;
        font-weight: bold;
      }
      
      .notification-title {
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 2px;
      }
      
      .notification-message {
        font-size: 0.95rem;
        line-height: 1.4;
      }
      
      .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(0,0,0,0.1);
      }
      
      .notification-progress-bar {
        height: 100%;
        width: 100%;
        animation: progress ${duration}ms linear;
      }
      
      .notification-progress-bar.success { background: var(--bs-success); }
      .notification-progress-bar.error { background: var(--bs-danger); }
      .notification-progress-bar.warning { background: var(--bs-warning); }
      .notification-progress-bar.info { background: var(--bs-info); }
      
      @keyframes progress {
        from { width: 100%; }
        to { width: 0%; }
      }
      
      .alert-success {
        background-color: #d4edda;
        color: #155724;
        border-left: 4px solid #28a745;
      }
      
      .alert-danger {
        background-color: #f8d7da;
        color: #721c24;
        border-left: 4px solid #dc3545;
      }
      
      .alert-warning {
        background-color: #fff3cd;
        color: #856404;
        border-left: 4px solid #ffc107;
      }
      
      .alert-info {
        background-color: #d1ecf1;
        color: #0c5460;
        border-left: 4px solid #17a2b8;
      }
    `;
    document.head.appendChild(styles);
  }
  
  document.body.appendChild(notification);
  
  // Supprimer automatiquement après la durée spécifiée
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, duration);
  
  return notification;
}

// Helper functions pour les notifications
function getBootstrapAlertType(type) {
  const typeMap = {
    success: 'success',
    error: 'danger',
    warning: 'warning',
    info: 'info'
  };
  return typeMap[type] || 'info';
}

function getNotificationTitle(type) {
  const titles = {
    success: 'Succès',
    error: 'Erreur',
    warning: 'Attention',
    info: 'Information'
  };
  return titles[type] || 'Notification';
}

// Vérifier les champs du formulaire
function validateForm(nom, email, niveau, password) {
  const errors = [];
  
  if (!nom.trim()) errors.push('Le nom est requis');
  if (!email.trim()) errors.push('L\'email est requis');
  if (!niveau) errors.push('Le niveau est requis');
  if (!password) errors.push('Le mot de passe est requis');
  
  if (email && !isValidEmail(email)) {
    errors.push('Format d\'email invalide');
  }
  
  if (password && password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  return errors;
}

// Fonction pour valider l'email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Gestionnaire principal du formulaire
async function handleFormSubmit(e) {
  e.preventDefault();
  
  // Vérifier l'état de l'application
  if (!firebaseInitialized || currentAppStatus !== AppStatus.READY) {
    showNotification(
      'Service temporairement indisponible. Veuillez rafraîchir la page.',
      'warning'
    );
    return;
  }
  
  // Récupérer les valeurs
  const nom = document.getElementById('nom').value;
  const email = document.getElementById('email').value;
  const niveau = document.getElementById('niveau').value;
  const password = document.getElementById('password').value;
  
  // Validation
  const validationErrors = validateForm(nom, email, niveau, password);
  if (validationErrors.length > 0) {
    validationErrors.forEach(error => {
      showNotification(error, 'warning', 4000);
    });
    return;
  }
  
  // Préparer l'interface
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = 
    '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Création du compte...';
  
  try {
    // Afficher notification de début
    showNotification('Création de votre compte en cours...', 'info', 3000);
    
    // 1. Créer l'utilisateur dans Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    showNotification('Authentification réussie. Mise à jour du profil...', 'info', 2000);
    
    // 2. Mettre à jour le profil
    await updateProfile(user, {
      displayName: nom
    });
    
    // 3. Enregistrer dans Firestore
    const userData = {
      uid: user.uid,
      nom: nom,
      email: email,
      niveau: niveau,
      dateInscription: serverTimestamp(),
      role: "etudiant",
      statut: "actif",
      derniereConnexion: serverTimestamp(),
      metadata: {
        createdFrom: 'web-app',
        appVersion: '1.0.0'
      }
    };
    
    await setDoc(doc(db, "etudiants", user.uid), userData);
    
    // Vérifier que les données ont bien été enregistrées
    showNotification('Données enregistrées avec succès dans la base de données.', 'success', 2000);
    
    // Stocker temporairement dans localStorage
    localStorage.setItem('userInfo', JSON.stringify({
      uid: user.uid,
      nom: nom,
      email: email,
      niveau: niveau,
      dateInscription: new Date().toISOString()
    }));
    
    // Message final de succès
    showNotification(
      `Inscription réussie ! Bienvenue ${nom}. Redirection vers votre tableau de bord...`,
      'success',
      3000
    );
    
    // Redirection
    setTimeout(() => {
      window.location.href = 'boardEtudiant.html';
    }, 2000);
    
  } catch (error) {
    console.error('Erreur détaillée:', error);
    
    // Réactiver le bouton
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    
    // Gestion détaillée des erreurs
    let errorMessage = 'Une erreur est survenue lors de l\'inscription';
    let errorType = 'error';
    let errorDetails = '';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Cette adresse email est déjà utilisée.';
        errorDetails = 'Veuillez utiliser une autre adresse email ou vous connecter.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Adresse email invalide.';
        errorDetails = 'Veuillez vérifier le format de votre email.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Mot de passe trop faible.';
        errorDetails = 'Utilisez au moins 6 caractères avec des lettres et chiffres.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Opération non autorisée.';
        errorDetails = 'L\'inscription par email/mot de passe est désactivée.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Erreur réseau.';
        errorDetails = 'Vérifiez votre connexion Internet et réessayez.';
        errorType = 'warning';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Trop de tentatives.';
        errorDetails = 'Veuillez réessayer dans quelques minutes.';
        errorType = 'warning';
        break;
      case 'firestore/unavailable':
      case 'firestore/permission-denied':
        errorMessage = 'Erreur d\'accès à la base de données.';
        errorDetails = 'Impossible d\'enregistrer vos données. Contactez l\'administrateur.';
        break;
      case 'firestore/deadline-exceeded':
        errorMessage = 'Délai d\'attente dépassé.';
        errorDetails = 'Le service met trop de temps à répondre. Réessayez.';
        errorType = 'warning';
        break;
      default:
        errorMessage = 'Erreur technique';
        errorDetails = error.message || 'Veuillez réessayer ou contacter le support.';
    }
    
    // Afficher l'erreur détaillée
    showNotification(
      `${errorMessage} ${errorDetails ? '<br><small>' + errorDetails + '</small>' : ''}`,
      errorType,
      6000
    );
    
    // Journaliser l'erreur pour le debug
    if (error.code && error.code.includes('firestore')) {
      console.error('Erreur Firestore:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
    }
  }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', async function() {
  // Afficher le statut de chargement
  showNotification('Initialisation de l\'application...', 'info', 2000);
  
  // Initialiser Firebase
  const initialized = await initializeFirebase();
  
  if (initialized) {
    // Attacher l'événement au formulaire
    const form = document.getElementById('form-inscription');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
      enableFormSubmission();
      
      // Ajouter un indicateur de statut dans le footer
      const statusIndicator = document.createElement('div');
      statusIndicator.id = 'app-status-indicator';
      statusIndicator.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #28a745;
        box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
        z-index: 9998;
      `;
      document.body.appendChild(statusIndicator);
    }
  }
  
  // Surveiller la connexion réseau
  window.addEventListener('online', async () => {
    if (!firebaseInitialized) {
      showNotification('Connexion rétablie. Reconnexion à Firebase...', 'info', 3000);
      await initializeFirebase();
    } else {
      showNotification('Connexion Internet rétablie', 'success', 2000);
    }
  });
  
  window.addEventListener('offline', () => {
    showNotification(
      'Vous êtes hors ligne. Certaines fonctionnalités sont limitées.',
      'warning',
      5000
    );
    currentAppStatus = AppStatus.OFFLINE;
    disableFormSubmission();
  });
  
  // Ajouter un style pour les champs invalides
  const style = document.createElement('style');
  style.textContent = `
    .is-invalid {
      border-color: #dc3545 !important;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right calc(0.375em + 0.1875rem) center;
      background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
    
    .is-invalid:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
    }
    
    .spinner-border {
      vertical-align: middle;
    }
  `;
  document.head.appendChild(style);
});