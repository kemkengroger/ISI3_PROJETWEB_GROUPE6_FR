 document.getElementById('form-inscription-enseignant').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Réinitialiser les messages d'erreur
        const form = this;
        form.classList.remove('was-validated');
        
        // Récupérer les valeurs
        const nom = document.getElementById('nom').value.trim();
        const email = document.getElementById('email').value.trim();
        const specialite = document.getElementById('specialite').value;
        const experience = document.getElementById('experience').value;
        const telephone = document.getElementById('telephone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validation du mot de passe
        if (password !== confirmPassword) {
            document.getElementById('confirm-password').classList.add('is-invalid');
            afficherMessage('Les mots de passe ne correspondent pas.', 'danger');
            return;
        }
        
        // Validation du formulaire Bootstrap
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        
        // Désactiver le bouton pendant le traitement
        const btnSubmit = document.getElementById('btn-submit');
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Inscription en cours...';
        
        // Simuler l'envoi au serveur
        setTimeout(() => {
            const enseignant = {
                nom,
                email,
                specialite,
                experience,
                telephone,
                type: 'enseignant',
                dateInscription: new Date().toISOString()
            };
            
            // Sauvegarder dans localStorage (en production, envoyer au backend)
            let enseignants = JSON.parse(localStorage.getItem('enseignants') || '[]');
            
            // Vérifier si l'email existe déjà
            if (enseignants.some(ens => ens.email === email)) {
                afficherMessage('Cet email est déjà utilisé.', 'danger');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = 'Créer mon compte enseignant';
                return;
            }
            
            enseignants.push(enseignant);
            localStorage.setItem('enseignants', JSON.stringify(enseignants));
            
            // Afficher le succès
            afficherMessage('Inscription réussie ! Redirection vers la page de connexion...', 'success');
            
            // Réinitialiser le formulaire
            form.reset();
            form.classList.remove('was-validated');
            
            // Rediriger après 2 secondes
            setTimeout(() => {
                window.location.href = 'connexion.html';
            }, 2000);
        }, 1500);
    });
    
    function afficherMessage(message, type) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
    
    // Validation en temps réel de la confirmation du mot de passe
    document.getElementById('confirm-password').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        if (this.value && this.value !== password) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });