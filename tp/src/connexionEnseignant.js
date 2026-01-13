import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase/config.js';

document.addEventListener('DOMContentLoaded', () => {
    const formulaireConnexion = document.getElementById('formulaire-connexion-enseignant');
    
    if (!formulaireConnexion) return;

    // Gestion de la connexion par Email/Mot de passe
    formulaireConnexion.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bouton = formulaireConnexion.querySelector('button[type="submit"]');
        const texteOriginal = bouton.textContent;
        
        // Désactiver le bouton pendant le chargement
        bouton.disabled = true;
        bouton.textContent = 'Connexion en cours...';
        
        const email = document.getElementById('email-connexion-enseignant').value.trim();
        const password = document.getElementById('passe-connexion-enseignant').value;
        
        try {
            // 1. Connexion à Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Initialisation des paramètres de l'enseignant à 0
            // Ces données seront lues par le boardEnseignant.html
            const infosInitiales = {
                nom: user.displayName || "Professeur",
                email: user.email,
                matiere: user.photoURL || "Non définie", // On récupère la matière stockée à l'inscription
                coursDonnes: 0,   // Initialisation à 0
                elevesSuivis: 0,  // Initialisation à 0
                heuresTuto: 0,    // Initialisation à 0
                role: 'enseignant',
                derniereConnexion: new Date().toISOString()
            };

            // 3. Sauvegarde dans le localStorage
            localStorage.setItem('infosEnseignant', JSON.stringify(infosInitiales));
            
            // 4. Redirection vers le tableau de bord enseignant
            window.location.href = 'boardEnseignant.html';
            
        } catch (erreur) {
            console.error("Erreur de connexion:", erreur);
            
            let message = "Erreur lors de la connexion.";
            if (erreur.code === 'auth/user-not-found' || erreur.code === 'auth/wrong-password' || erreur.code === 'auth/invalid-credential') {
                message = "Email ou mot de passe incorrect.";
            }
            
            alert(message);
            
            // Réactiver le bouton en cas d'erreur
            bouton.disabled = false;
            bouton.textContent = texteOriginal;
        }
    });
});