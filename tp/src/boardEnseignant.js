import { auth, db } from './firebase/config.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = 'connexionEnseignant.html';
            return;
        }

        // 1. Récupération du nom (soit de Firebase Auth, soit du LocalStorage, soit de Firestore)
        let nomEnseignant = user.displayName;
        let matiereEnseignant = "Enseignant";

        // Si le nom n'est pas dans Auth, on regarde dans Firestore
        if (!nomEnseignant) {
            try {
                const docRef = doc(db, "utilisateurs", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    nomEnseignant = docSnap.data().nom;
                    matiereEnseignant = docSnap.data().matiere || "Enseignant";
                }
            } catch (error) {
                console.error("Erreur Firestore:", error);
            }
        }

        // Valeur par défaut si rien n'est trouvé
        nomEnseignant = nomEnseignant || "Cher Professeur";

        // 2. MISE À JOUR DYNAMIQUE DE VOTRE HTML
        
        // Mise à jour du message de bienvenue (ex: "Bonjour, Jean 👋")
        const bienvenuEl = document.querySelector('h2.fw-bold');
        if (bienvenuEl) {
            bienvenuEl.textContent = `Bonjour, ${nomEnseignant} 👋`;
        }

        // Mise à jour du nom dans le header à côté de l'avatar
        const nomHeader = document.querySelector('h6.mb-0');
        if (nomHeader) {
            nomHeader.textContent = nomEnseignant;
        }

        // Mise à jour de la matière
        const matiereBadge = document.querySelector('.text-muted.small');
        if (matiereBadge && !matiereBadge.textContent.includes('aperçu')) {
            matiereBadge.textContent = matiereEnseignant;
        }

        // Mise à jour de l'initiale de l'avatar
        const avatarCircle = document.querySelector('.avatar-circle');
        if (avatarCircle) {
            avatarCircle.textContent = nomEnseignant.charAt(0).toUpperCase();
        }

        // Initialisation des stats à 0 (comme demandé précédemment)
        if (document.getElementById('stat-cours')) document.getElementById('stat-cours').textContent = "0";
        if (document.getElementById('stat-eleves')) document.getElementById('stat-eleves').textContent = "0";
        if (document.getElementById('stat-heures')) document.getElementById('stat-heures').textContent = "0";
    });

    // Gestion de la déconnexion
    window.deconnexion = async () => {
        try {
            await signOut(auth);
            localStorage.clear();
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Erreur déconnexion:", error);
        }
    };
});