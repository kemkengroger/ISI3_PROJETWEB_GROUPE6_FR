import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase/config.js';

document.addEventListener('DOMContentLoaded', () => {
    const formulaire = document.getElementById('form-connexion');
    const boutonGoogle = document.getElementById('bouton-google');
    
    if (!formulaire) {
        console.error('Formulaire de connexion non trouvé');
        return;
    }
    
    // Connexion avec email/password
    formulaire.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bouton = formulaire.querySelector('button[type="submit"]');
        const texteOriginal = bouton.textContent;
        bouton.disabled = true;
        bouton.textContent = 'Connexion en cours...';
        
        const email = document.getElementById('email-connexion').value.trim();
        const password = document.getElementById('password-connexion').value;
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            alert('Connexion réussie !');
            window.location.href = '/boardEtudiant.html';
            
        } catch (error) {
            console.error('Erreur connexion:', error);
            
            let message = 'Erreur de connexion';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    message = 'Aucun compte trouvé avec cet email';
                    break;
                case 'auth/wrong-password':
                    message = 'Mot de passe incorrect';
                    break;
                case 'auth/invalid-credential':
                    message = 'Email ou mot de passe incorrect';
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
    
    // Connexion avec Google
    if (boutonGoogle) {
        boutonGoogle.addEventListener('click', async () => {
            const texteOriginal = boutonGoogle.textContent;
            boutonGoogle.disabled = true;
            boutonGoogle.textContent = 'Connexion en cours...';
            
            try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                
                localStorage.setItem('userInfo', JSON.stringify({
                    nom: result.user.displayName,
                    email: result.user.email,
                    niveau: 'Non spécifié',
                    dateInscription: new Date().toISOString()
                }));
                
                alert('Connexion Google réussie !');
                window.location.href = '/boardEtudiant.html';
                
            } catch (error) {
                console.error('Erreur connexion Google:', error);
                
                let message = 'Erreur lors de la connexion avec Google';
                
                if (error.code === 'auth/popup-closed-by-user') {
                    message = 'Connexion annulée';
                } else if (error.code === 'auth/popup-blocked') {
                    message = 'Pop-up bloquée par le navigateur';
                }
                
                alert(message);
                boutonGoogle.disabled = false;
                boutonGoogle.textContent = texteOriginal;
            }
        });
    }
});