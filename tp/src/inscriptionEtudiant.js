import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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