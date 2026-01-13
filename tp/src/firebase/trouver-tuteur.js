// src/trouver-tuteur.js
import { onAuthChange, logoutUser } from './auth.js';
import { getAllTutors, getTutorById, addToFavorites, isTutorFavorite } from './firestore-service.js';

// Gestionnaire principal
class TuteurManager {
  constructor() {
    this.currentUser = null;
    this.userProfile = null;
    this.initAuth();
  }

  // Initialiser l'authentification
  initAuth() {
    onAuthChange(async (user) => {
      this.currentUser = user;
      console.log('Utilisateur:', user ? user.email : 'Non connecté');
      this.updateUIAfterAuth();
    });
  }

  // Mettre à jour l'interface après authentification
  updateUIAfterAuth() {
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    
    if (this.currentUser) {
      // Masquer boutons connexion/inscription
      if (authButtons) authButtons.style.display = 'none';
      
      // Afficher info utilisateur
      if (userInfo) {
        userInfo.style.display = 'flex';
        userInfo.innerHTML = `
          <span class="me-2">👤 ${this.currentUser.email}</span>
          <button class="btn btn-outline-danger btn-sm" id="logoutBtn">
            Déconnexion
          </button>
        `;
        
        // Ajouter écouteur pour déconnexion
        document.getElementById('logoutBtn').addEventListener('click', async () => {
          try {
            await logoutUser();
            window.location.reload();
          } catch (error) {
            alert('Erreur déconnexion: ' + error.message);
          }
        });
      }
    } else {
      // Afficher boutons connexion/inscription
      if (authButtons) authButtons.style.display = 'block';
      if (userInfo) userInfo.style.display = 'none';
    }
  }

  // Récupérer tous les tuteurs
  async getAllTuteurs(matiere = null) {
    try {
      return await getAllTutors(matiere);
    } catch (error) {
      console.error("Erreur récupération tuteurs:", error);
      throw error;
    }
  }

  // Ajouter aux favoris
  async ajouterAuxFavoris(tuteurId) {
    try {
      if (!this.currentUser) {
        throw new Error("Connectez-vous pour ajouter aux favoris");
      }

      await addToFavorites(this.currentUser.uid, tuteurId);
      return { success: true, message: "Tuteur ajouté aux favoris" };
    } catch (error) {
      console.error("Erreur ajout favoris:", error);
      throw error;
    }
  }

  // Vérifier si un tuteur est dans les favoris
  async isFavorite(tuteurId) {
    if (!this.currentUser) return false;
    
    try {
      return await isTutorFavorite(this.currentUser.uid, tuteurId);
    } catch (error) {
      console.error("Erreur vérification favoris:", error);
      return false;
    }
  }
}

// Initialiser quand la page est chargée
document.addEventListener('DOMContentLoaded', async function() {
  const tuteurManager = new TuteurManager();
  
  // Éléments DOM
  const listestuteur = document.getElementById("listestuteur");
  const nbre_enseignant = document.getElementById("nbre_enseignant");
  const sujetFiltrer = document.getElementById("subjectFilter");
  
  // Charger les tuteurs
  async function chargerTuteurs(matiere = "all") {
    try {
      listestuteur.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <p class="mt-3">Chargement des tuteurs...</p>
        </div>
      `;
      
      const tuteurs = await tuteurManager.getAllTuteurs(matiere);
      
      if (nbre_enseignant) {
        nbre_enseignant.textContent = `${tuteurs.length} enseignant(s) disponible(s)`;
      }
      
      await afficherTuteurs(tuteurs);
      
    } catch (error) {
      console.error("Erreur chargement tuteurs:", error);
      
      listestuteur.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">
            <strong>Erreur:</strong> ${error.message}
          </div>
        </div>
      `;
    }
  }
  
  // Afficher les tuteurs
  async function afficherTuteurs(tuteurs) {
    if (!listestuteur) return;
    
    if (tuteurs.length === 0) {
      listestuteur.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info">
            <strong>Info:</strong> Aucun tuteur disponible.
          </div>
        </div>
      `;
      return;
    }
    
    listestuteur.innerHTML = "";
    
    for (const tuteur of tuteurs) {
      const estActif = tuteur.status === "active";
      const isFavorite = await tuteurManager.isFavorite(tuteur.id);
      
      const tuteurCard = document.createElement("div");
      tuteurCard.className = "col-12 col-md-6 col-lg-4 mb-4";
      tuteurCard.innerHTML = `
        <div class="tuteur-carre">
          <div>
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="avatar">
                ${tuteur.name ? tuteur.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <div>
                <div class="fw-bold">${tuteur.name || "Tuteur"}</div>
                <span class="badge status-badge ${estActif ? "active" : "absent"}">
                  ${estActif ? "Actif" : "Absent"}
                </span>
              </div>
            </div>
            
            <p class="mb-2">
              <strong>${tuteur.sessionsDone || 0}</strong> sessions
              ${tuteur.experience ? ` • ${tuteur.experience} ans d'exp` : ''}
            </p>
            
            <p class="text-muted mb-2 small">${tuteur.description || ""}</p>
            
            ${tuteur.rating ? `
              <div class="mb-3">
                <small>Note: </small>
                ${'⭐'.repeat(Math.round(tuteur.rating))}
                <small class="text-muted">(${tuteur.rating.toFixed(1)})</small>
              </div>
            ` : ''}
            
            <div class="mb-3">
              ${(tuteur.subjects || []).map(matiere => 
                `<span class="subject-badge">${matiere}</span>`
              ).join("")}
            </div>
          </div>
          
          <div class="d-grid gap-2">
            ${estActif ? 
              `<button class="btn-session" data-tuteur-id="${tuteur.id}">
                🎥 Démarrer une session
              </button>` : 
              `<button class="btn-absent" disabled>Non disponible</button>`
            }
            
            <button class="btn ${isFavorite ? 'btn-danger' : 'btn-outline-primary'} btn-sm btn-favori" 
                    data-tuteur-id="${tuteur.id}"
                    ${!tuteurManager.currentUser ? 'disabled' : ''}>
              ${isFavorite ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
            </button>
            
            ${!tuteurManager.currentUser ? 
              `<small class="text-muted text-center">Connectez-vous pour ajouter aux favoris</small>` : 
              ''}
          </div>
        </div>
      `;
      
      listestuteur.appendChild(tuteurCard);
    }
    
    ajouterEcouteursEvenements();
  }
  
  // Ajouter les écouteurs d'événements
  function ajouterEcouteursEvenements() {
    // Boutons session
    document.querySelectorAll('.btn-session').forEach(btn => {
      btn.addEventListener('click', function() {
        const tuteurId = this.getAttribute('data-tuteur-id');
        
        if (!tuteurManager.currentUser) {
          alert("Connectez-vous pour démarrer une session");
          window.location.href = 'connexion.html';
          return;
        }
        
        const confirmer = confirm("Démarrer une session avec ce tuteur?");
        if (confirmer) {
          alert("Session démarrée! (Fonctionnalité à implémenter)");
        }
      });
    });
    
    // Boutons favoris
    document.querySelectorAll('.btn-favori').forEach(btn => {
      btn.addEventListener('click', async function() {
        const tuteurId = this.getAttribute('data-tuteur-id');
        
        try {
          await tuteurManager.ajouterAuxFavoris(tuteurId);
          
          // Basculer l'état du bouton
          if (this.classList.contains('btn-outline-primary')) {
            this.classList.remove('btn-outline-primary');
            this.classList.add('btn-danger');
            this.innerHTML = '❤️ Retirer des favoris';
          } else {
            this.classList.remove('btn-danger');
            this.classList.add('btn-outline-primary');
            this.innerHTML = '🤍 Ajouter aux favoris';
          }
        } catch (error) {
          alert(`Erreur: ${error.message}`);
        }
      });
    });
  }
  
  // Filtrer par matière
  if (sujetFiltrer) {
    sujetFiltrer.addEventListener("change", function(e) {
      chargerTuteurs(e.target.value);
    });
  }
  
  // Initialisation
  chargerTuteurs("all");
});