console.log('Main.js chargé !');
import './style.css'
import { signUp, signIn, signInWithGoogle, logOut, observeAuthState } from './firebase/auth'
import { updateOnlineStatus } from './firestore-service.js';
import Whiteboard from './whiteboard.js';


import './style.css'
import { signUp, signIn, signInWithGoogle, logOut, observeAuthState } from './firebase/auth'
import peerService from './peer-service.js';
import { auth, db } from './firebase-config.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

let currentUser = null;
let whiteboard = null;
let chatMessages = [];

// Toggle tableau blanc
document.getElementById('toggle-whiteboard').addEventListener('click', () => {
  const whiteboardContainer = document.getElementById('whiteboard-container');
  
  if (whiteboardContainer.style.display === 'none') {
    whiteboardContainer.style.display = 'block';
    
    // Initialiser le tableau blanc si pas déjà fait
    if (!whiteboard) {
      whiteboard = new Whiteboard('whiteboard-canvas');
    }
  } else {
    whiteboardContainer.style.display = 'none';
  }
});

// Outils du tableau blanc
document.getElementById('pen-tool').addEventListener('click', () => {
  whiteboard.tool = 'pen';
  document.getElementById('pen-tool').classList.add('active');
  document.getElementById('eraser-tool').classList.remove('active');
});

document.getElementById('eraser-tool').addEventListener('click', () => {
  whiteboard.setEraser();
  document.getElementById('eraser-tool').classList.add('active');
  document.getElementById('pen-tool').classList.remove('active');
});

document.getElementById('color-picker').addEventListener('change', (e) => {
  whiteboard.setColor(e.target.value);
});

document.getElementById('line-width').addEventListener('input', (e) => {
  whiteboard.setLineWidth(e.target.value);
});

document.getElementById('clear-whiteboard').addEventListener('click', () => {
  if (confirm('Effacer tout le tableau ?')) {
    whiteboard.clear();
  }
});

document.getElementById('close-whiteboard').addEventListener('click', () => {
  document.getElementById('whiteboard-container').style.display = 'none';
});

// Gérer les données du tableau blanc reçues
function handleWhiteboardData(data) {
  if (!whiteboard) {
    whiteboard = new Whiteboard('whiteboard-canvas');
  }

  if (data.action === 'draw') {
    whiteboard.drawRemote(data);
  } else if (data.action === 'clear') {
    const canvas = document.getElementById('whiteboard-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Initialiser le chat lors de l'appel
window.startCall = async function(tutorId) {
  try {
    document.getElementById('tutors-list').style.display = 'none';
    document.getElementById('video-call-container').style.display = 'block';

    const localStream = await peerService.getLocalStream();
    document.getElementById('local-video').srcObject = localStream;

    const remoteStream = await peerService.callTutor(tutorId);
    document.getElementById('remote-video').srcObject = remoteStream;

    // Établir la connexion de données pour le chat
    peerService.connectForChat(tutorId);

  } catch (error) {
    console.error('Erreur lors de l\'appel:', error);
    alert('Impossible de démarrer l\'appel');
  }
};

// Écouter les connexions de données entrantes
peerService.peer?.on('open', () => {
  peerService.listenForDataConnections();
});

// Envoyer un message
document.getElementById('send-message').addEventListener('click', sendChatMessage);
document.getElementById('chat-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
});

auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    
    // Marquer l'utilisateur comme en ligne
    await updateOnlineStatus(user.uid, true);
    
    await peerService.initializePeer(user.uid);
    loadTutors();

    // Marquer comme hors ligne lors de la déconnexion
    window.addEventListener('beforeunload', () => {
      updateOnlineStatus(user.uid, false);
    });
  }
});

// Initialiser après connexion
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    // Initialiser le peer avec l'ID de l'utilisateur
    await peerService.initializePeer(user.uid);
    loadTutors();
  }
});

// Charger la liste des tuteurs depuis Firestore
async function loadTutors() {
  const tutorsRef = collection(db, 'users');
  const q = query(tutorsRef, where('role', '==', 'tuteur'));
  
  const snapshot = await getDocs(q);
  const tutorsContainer = document.getElementById('tutors-container');
  
  snapshot.forEach((doc) => {
    const tutor = doc.data();
    const tutorCard = createTutorCard(tutor, doc.id);
    tutorsContainer.appendChild(tutorCard);
  });
}

// Créer une carte pour chaque tuteur
function createTutorCard(tutor, tutorId) {
  const card = document.createElement('div');
  card.className = 'tutor-card';
  card.innerHTML = `
    <h3>${tutor.name}</h3>
    <p>Matière: ${tutor.subject}</p>
    <p>Disponible: ${tutor.isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}</p>
    <button onclick="startCall('${tutorId}')" ${!tutor.isOnline ? 'disabled' : ''}>
      Appeler
    </button>
  `;
  return card;
}

// Démarrer un appel avec un tuteur
window.startCall = async function(tutorId) {
  try {
    // Masquer la liste, afficher l'interface d'appel
    document.getElementById('tutors-list').style.display = 'none';
    document.getElementById('video-call-container').style.display = 'block';

    // Obtenir le stream local
    const localStream = await peerService.getLocalStream();
    document.getElementById('local-video').srcObject = localStream;

    // Appeler le tuteur
    const remoteStream = await peerService.callTutor(tutorId);
    document.getElementById('remote-video').srcObject = remoteStream;

  } catch (error) {
    console.error('Erreur lors de l\'appel:', error);
    alert('Impossible de démarrer l\'appel');
  }
};

// Écouter les streams distants entrants
window.addEventListener('remoteStreamReceived', (event) => {
  document.getElementById('remote-video').srcObject = event.detail.stream;
});

// Contrôles de l'appel
document.getElementById('end-call').addEventListener('click', () => {
  peerService.endCall();
  document.getElementById('video-call-container').style.display = 'none';
  document.getElementById('tutors-list').style.display = 'block';
});

document.getElementById('toggle-audio').addEventListener('click', (e) => {
  const audioTrack = peerService.localStream.getAudioTracks()[0];
  audioTrack.enabled = !audioTrack.enabled;
  e.target.textContent = audioTrack.enabled ? '🎤 Mute' : '🎤 Unmute';
});

document.getElementById('toggle-video').addEventListener('click', (e) => {
  const videoTrack = peerService.localStream.getVideoTracks()[0];
  videoTrack.enabled = !videoTrack.enabled;
  e.target.textContent = videoTrack.enabled ? '📹 Stop Video' : '📹 Start Video';
});

// Observer les changements d'état de connexion
observeAuthState((user) => {
  currentUser = user;
  renderApp();
});

function renderApp() {
  const app = document.querySelector('#app');
  
  if (currentUser) {
    // Utilisateur connecté
    app.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h1>Bienvenue !</h1>
        <div style="margin: 2rem 0; padding: 1rem; background: #f0f0f0; border-radius: 8px;">
          <p><strong>Email:</strong> ${currentUser.email}</p>
          <p><strong>UID:</strong> ${currentUser.uid}</p>
        </div>
        <button id="logout-btn" style="padding: 0.5rem 2rem; cursor: pointer;">
          Se déconnecter
        </button>
      </div>
    `;
    
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
  } else {
    // Utilisateur non connecté
    app.innerHTML = `
      <div style="max-width: 400px; margin: 2rem auto; padding: 2rem;">
        <h1 style="text-align: center;">Authentification Firebase</h1>
        
        <div style="margin: 2rem 0;">
          <h3>Inscription</h3>
          <input type="email" id="signup-email" placeholder="Email" style="width: 100%; padding: 0.5rem; margin: 0.5rem 0;">
          <input type="password" id="signup-password" placeholder="Mot de passe" style="width: 100%; padding: 0.5rem; margin: 0.5rem 0;">
          <button id="signup-btn" style="width: 100%; padding: 0.5rem; cursor: pointer; background: #4CAF50; color: white; border: none;">
            S'inscrire
          </button>
        </div>
        
        <hr>
        
        <div style="margin: 2rem 0;">
          <h3>Connexion</h3>
          <input type="email" id="signin-email" placeholder="Email" style="width: 100%; padding: 0.5rem; margin: 0.5rem 0;">
          <input type="password" id="signin-password" placeholder="Mot de passe" style="width: 100%; padding: 0.5rem; margin: 0.5rem 0;">
          <button id="signin-btn" style="width: 100%; padding: 0.5rem; cursor: pointer; background: #2196F3; color: white; border: none;">
            Se connecter
          </button>
        </div>
        
        <hr>
        
        <div style="margin: 2rem 0;">
          <button id="google-btn" style="width: 100%; padding: 0.5rem; cursor: pointer; background: #DB4437; color: white; border: none;">
            Se connecter avec Google
          </button>
        </div>
        
        <div id="message" style="margin-top: 1rem; padding: 0.5rem; border-radius: 4px;"></div>
      </div>
    `;
    
    // Event listeners
    document.getElementById('signup-btn').addEventListener('click', handleSignUp);
    document.getElementById('signin-btn').addEventListener('click', handleSignIn);
    document.getElementById('google-btn').addEventListener('click', handleGoogleSignIn);
  }
}

async function handleSignUp() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  
  const result = await signUp(email, password);
  showMessage(result.success ? 'Inscription réussie !' : result.error, result.success);
}

async function handleSignIn() {
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;
  
  const result = await signIn(email, password);
  showMessage(result.success ? 'Connexion réussie !' : result.error, result.success);
}

async function handleGoogleSignIn() {
  const result = await signInWithGoogle();
  showMessage(result.success ? 'Connexion Google réussie !' : result.error, result.success);
}

async function handleLogout() {
  const result = await logOut();
  showMessage(result.success ? 'Déconnexion réussie !' : result.error, result.success);
}

function showMessage(message, isSuccess) {
  const messageEl = document.getElementById('message');
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.style.background = isSuccess ? '#d4edda' : '#f8d7da';
    messageEl.style.color = isSuccess ? '#155724' : '#721c24';
  }
}

// Initialiser l'app
renderApp();