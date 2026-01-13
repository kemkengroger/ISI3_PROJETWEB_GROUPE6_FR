import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase/config.js';

document.addEventListener('DOMContentLoaded', () => {
    const formulaire = document.getElementById('form-inscription-enseignant');
    
    if (!formulaire) return;

    formulaire.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bouton = formulaire.querySelector('button[type=\"submit\"]');
        const texteOriginal = bouton.textContent;
        bouton.disabled = true;
        bouton.textContent = 'Inscription en cours...';
        
        const nom = document.getElementById('nom-enseignant').value.trim();
        const email = document.getElementById('email-enseignant').value.trim();
        const matiere = document.getElementById('matiere-enseignant').value;
        const password = document.getElementById('mot-passe-enseignant').value;
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Mise à jour profil (on stocke la matière dans photoURL comme le niveau pour l'étudiant)
            await updateProfile(userCredential.user, {
                displayName: nom,
                photoURL: matiere 
            });
            
            // Stockage local analogue à l'étudiant
            localStorage.setItem('infosEnseignant', JSON.stringify({
                nom: nom,
                email: email,
                matiere: matiere
            }));
            
            alert('Compte Enseignant créé ! Bienvenue Professeur ' + nom);
            // Redirection sans slash
            window.location.href = 'boardEnseignant.html';
            
        } catch (error) {
            console.error('Erreur:', error);
            alert("Erreur : " + error.message);
            bouton.disabled = false;
            bouton.textContent = texteOriginal;
        }
    });
});