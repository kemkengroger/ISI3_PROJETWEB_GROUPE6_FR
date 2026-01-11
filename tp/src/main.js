console.log('🔥 Main.js chargé !');
import './style.css'
import { signUp, signIn, signInWithGoogle, logOut, observeAuthState } from './firebase/auth'
// ... reste du code


import './style.css'
import { signUp, signIn, signInWithGoogle, logOut, observeAuthState } from './firebase/auth'

let currentUser = null;

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