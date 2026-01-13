// trouver-tuteur.js
import { TuteurManager } from "./src/tuteurs-backend.js";

document.addEventListener('DOMContentLoaded', async function() {
  // Initialiser le gestionnaire de tuteurs
  const tuteurManager = new TuteurManager();
  
  // Éléments DOM
  const listestuteur = document.getElementById("listestuteur");
  const nbre_enseignant = document.getElementById("nbre_enseignant");
  const sujetFiltrer = document.getElementById("subjectFilter");
  
  // Charger les tuteurs
  async function chargerTuteurs(matiere = "all") {
    try {
      // Afficher un indicateur de chargement
      listestuteur.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <p class="mt-3">Chargement des tuteurs...</p>
        </div>
      `;
      
      // Récupérer les tuteurs depuis Firestore
      const tuteurs = await tuteurManager.getAllTuteurs(matiere);
      
      // Afficher le nombre de tuteurs
      nbre_enseignant.textContent = `${tuteurs.length} enseignant(s) disponible(s)`;
      
      // Afficher les tuteurs
      afficherTuteurs(tuteurs);
      
    } catch (error) {
      console.error("Erreur lors du chargement des tuteurs:", error);
      
      // Afficher un message d'erreur
      listestuteur.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">
            <strong>Erreur:</strong> Impossible de charger les tuteurs. ${error.message}
          </div>
          <button class="btn btn-primary" onclick="location.reload()">
            Réessayer
          </button>
        </div>
      `;
    }
  }
  
  // Fonction pour afficher les tuteurs
  function afficherTuteurs(tuteurs) {
    if (tuteurs.length === 0) {
      listestuteur.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info">
            <strong>Info:</strong> Aucun tuteur disponible pour le moment.
          </div>
        </div>
      `;
      return;
    }
    
    listestuteur.innerHTML = "";
    
    tuteurs.forEach(tuteur => {
      const estActif = tuteur.statut === "actif";
      
      const tuteurCard = document.createElement("div");
      tuteurCard.className = "col-12 col-md-6 col-lg-4";
      tuteurCard.innerHTML = `
        <div class="tuteur-carre">
          <div>
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="avatar">
                ${tuteur.nom ? tuteur.nom.charAt(0).toUpperCase() : '👤'}
              </div>
              <div>
                <div class="fw-bold">${tuteur.nom || "Tuteur"}</div>
                <span class="badge status-badge ${estActif ? "active" : "absent"}">
                  ${estActif ? "Actif" : "Absent"}
                </span>
              </div>
            </div>
            
            <p class="mb-1">
              <strong>${tuteur.sessionsEffectuees || 0}</strong> sessions
              ${tuteur.experience ? ` • ${tuteur.experience} ans d'exp` : ''}
            </p>
            
            <p class="text-muted mb-2">${tuteur.description || ""}</p>
            
            ${tuteur.note ? `
              <div class="mb-2">
                <small>Note: </small>
                ${'⭐'.repeat(Math.round(tuteur.note))}
                <small class="text-muted">(${tuteur.note.toFixed(1)})</small>
              </div>
            ` : ''}
            
            <div class="mb-3">
              ${(tuteur.matieres || []).map(matiere => 
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
            
            <button class="btn btn-outline-primary btn-sm btn-favori" 
                    data-tuteur-id="${tuteur.id}">
              ❤️ Ajouter aux favoris
            </button>
          </div>
        </div>
      `;
      
      listestuteur.appendChild(tuteurCard);
    });
    
    // Ajouter les écouteurs d'événements
    ajouterEcouteursEvenements();
  }
  
  // Ajouter les écouteurs d'événements
  function ajouterEcouteursEvenements() {
    // Boutons pour démarrer une session
    document.querySelectorAll('.btn-session').forEach(btn => {
      btn.addEventListener('click', async function() {
        const tuteurId = this.getAttribute('data-tuteur-id');
        
        try {
          // Vérifier la disponibilité avant de démarrer
          const disponibilite = await tuteurManager.verifierDisponibilite(tuteurId);
          
          if (!disponibilite.disponible) {
            alert(`Ce tuteur n'est pas disponible actuellement.\n${disponibilite.message}`);
            return;
          }
          
          // Demander confirmation
          const confirmer = confirm(
            "Êtes-vous sûr de vouloir démarrer une session avec ce tuteur?\n" +
            "Vous serez redirigé vers la salle de tutorat."
          );
          
          if (confirmer) {
            // Démarrer la session
            const result = await tuteurManager.demarrerSession(tuteurId);
            alert(result.message);
            
            // Rediriger vers la session (à implémenter)
            // window.location.href = `session.html?sessionId=${result.sessionId}`;
          }
          
        } catch (error) {
          alert(`Erreur: ${error.message}`);
        }
      });
    });
    
    // Boutons favoris
    document.querySelectorAll('.btn-favori').forEach(btn => {
      btn.addEventListener('click', async function() {
        const tuteurId = this.getAttribute('data-tuteur-id');
        
        try {
          await tuteurManager.ajouterAuxFavoris(tuteurId);
          this.innerHTML = '❤️ Ajouté aux favoris';
          this.disabled = true;
          this.classList.remove('btn-outline-primary');
          this.classList.add('btn-success');
        } catch (error) {
          alert(`Erreur: ${error.message}`);
        }
      });
    });
  }
  
  // Filtrer par matière
  sujetFiltrer.addEventListener("change", function(e) {
    chargerTuteurs(e.target.value);
  });
  
  // Initialisation: charger tous les tuteurs
  chargerTuteurs("all");
  
  // Ajouter un champ de recherche
  ajouterChampRecherche();
  
  function ajouterChampRecherche() {
    const searchContainer = document.querySelector('.carre-filter');
    
    const searchHTML = `
      <div class="mb-3">
        <label for="searchTuteur" class="form-label fw-semibold">Rechercher un tuteur</label>
        <div class="input-group">
          <input type="text" 
                 id="searchTuteur" 
                 class="form-control" 
                 placeholder="Nom ou matière...">
          <button class="btn btn-outline-secondary" id="btnSearch">
            🔍
          </button>
        </div>
      </div>
    `;
    
    searchContainer.insertAdjacentHTML('afterbegin', searchHTML);
    
    // Recherche en temps réel avec debounce
    let searchTimeout;
    const searchInput = document.getElementById('searchTuteur');
    
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        const searchTerm = this.value.trim();
        if (searchTerm.length > 2) {
          try {
            const results = await tuteurManager.searchTuteurs(searchTerm);
            afficherTuteurs(results);
          } catch (error) {
            console.error("Erreur recherche:", error);
          }
        } else if (searchTerm.length === 0) {
          chargerTuteurs(sujetFiltrer.value);
        }
      }, 500);
    });
    
    document.getElementById('btnSearch').addEventListener('click', function() {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        tuteurManager.searchTuteurs(searchTerm).then(afficherTuteurs);
      }
    });
  }
});