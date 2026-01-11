import { auth, db } from './firebase/config.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {

    // 1. SURVEILLER LA CONNEXION
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // Si pas de compte connecté, on renvoie vers la page de connexion
            window.location.href = 'connexion.html';
            return;
        }

        // 2. RÉCUPÉRER LES INFOS DE L'UTILISATEUR
        // On regarde dans le localStorage ce qu'on a enregistré à l'inscription
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const nom = user.displayName || userInfo.nom || 'Étudiant';
        const niveau = userInfo.niveau || 'Non spécifié';

        // 3. METTRE À JOUR LE TEXTE SUR LA PAGE
        // On remplace "Étudiant Demo" par le vrai nom
        document.querySelectorAll('h1, h6').forEach(el => {
            if (el.textContent.includes('Étudiant Demo')) {
                el.textContent = el.textContent.replace('Étudiant Demo', nom);
            }
        });

        // On remplace "Terminale" par le vrai niveau
        document.querySelectorAll('small').forEach(el => {
            if (el.textContent.trim() === 'Terminale') {
                el.textContent = niveau;
            }
        });

        // Mettre l'initiale dans le cercle de l'avatar
        const avatar = document.querySelector('.avatar-circle');
        if (avatar) avatar.textContent = nom.charAt(0).toUpperCase();

        // 4. CHARGER L'HISTORIQUE DEPUIS FIREBASE
        await chargerHistoriqueFirebase(user.uid);
    });
});

// FONCTION POUR LIRE L'HISTORIQUE DANS FIRESTORE
async function chargerHistoriqueFirebase(uid) {
    const conteneur = document.getElementById('historique-ia-liste');
    if (!conteneur) return;

    try {
        // On demande à Firebase les messages de cet utilisateur précis (uid)
        const q = query(
            collection(db, "historique_ia"),
            where("uid", "==", uid),
            orderBy("date", "desc")
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            conteneur.innerHTML = '<p class="text-muted small">Aucune question posée pour le moment.</p>';
        } else {
            let html = "";
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                html += `
                    <div class="mb-3 p-2 border-bottom">
                        <p class="mb-1 fw-bold small text-primary">Question : ${data.question}</p>
                        <p class="mb-0 text-muted small">Réponse : ${data.reponse}</p>
                    </div>
                `;
            });
            conteneur.innerHTML = html;
        }
    } catch (error) {
        console.error("Erreur historique:", error);
        conteneur.innerHTML = "Impossible de charger l'historique.";
    }
}