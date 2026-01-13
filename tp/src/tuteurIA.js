   class TuteurIA {
        constructor(apiKey) {
            this.apiKey = apiKey;
            this.contexte = {
                subjects: ['Mathématiques', 'Physique', 'Français'],
                level: 'Lycée'
            };
        }

        async callAI(prompt, langue = 'fr') {
            try {
                const systemPrompt = langue === 'fr' 
                    ? `Tu es un assistant pédagogique intelligent pour la plateforme TutoAfrica.
                       Ton rôle est d'aider les étudiants africains dans leur apprentissage.
                       
                       Contexte utilisateur:
                       - Matières suivies: ${this.contexte.subjects.join(", ")}
                       - Niveau: ${this.contexte.level}
                       
                       Règles de réponse:
                       1. Sois pédagogique et encourageant
                       2. Explique les concepts de manière simple et claire
                       3. Propose des exemples concrets adaptés au contexte africain
                       4. Reste dans le domaine éducatif
                       5. Réponds en français de manière structurée`
                    : `You are an intelligent educational assistant for the TutoAfrica platform.
                       Your role is to help African students in their learning.
                       
                       User context:
                       - Subjects: ${this.contexte.subjects.join(", ")}
                       - Level: ${this.contexte.level}
                       
                       Response rules:
                       1. Be educational and encouraging
                       2. Explain concepts in a simple and clear way
                       3. Provide concrete examples adapted to the African context
                       4. Stay within the educational domain
                       5. Respond in English in a structured manner`;

                const response = await fetch(
                    "https://api.groq.com/openai/v1/chat/completions",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${this.apiKey}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            model: "llama-3.3-70b-versatile",
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: prompt },
                            ],
                            temperature: 0.7,
                            max_tokens: 1000,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                return data.choices[0].message.content;
            } catch (error) {
                console.error("Erreur API Groq:", error);
                const messageErreur = langue === 'fr' 
                    ? "Désolé, je rencontre des difficultés techniques. Réessayez dans quelques instants."
                    : "Sorry, I'm experiencing technical difficulties. Please try again in a few moments.";
                throw new Error(messageErreur);
            }
        }
    }

    // IMPORTANT: Remplacez 'VOTRE_CLE_API_GROQ' par votre vraie clé API
    const tuteur = new TuteurIA('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');

    // Fonctions de thème et traduction
    function rafraichirTheme() {
        const estSombre = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-bs-theme', estSombre ? 'dark' : 'light');
    }

    function changerSysteme(langue) {
        localStorage.setItem('langueApp', langue);
        appliquerTraduction(langue);
    }

    function appliquerTraduction(langue) {
        $('[data-en]').each(function() {
            $(this).text($(this).data(langue));
        });
        const placeholder = langue === 'fr' 
            ? 'Pose ta question (ex: Explique-moi le théorème de Pythagore)...' 
            : 'Ask your question (e.g. Explain Pythagoras theorem)...';
        document.getElementById('entree-utilisateur').placeholder = placeholder;
    }

    // Gestion du chat
    const formulaire = document.getElementById('formulaire-chat');
    const boiteMsg = document.getElementById('boite-discussion');
    const saisie = document.getElementById('entree-utilisateur');
    const boutonEnvoi = document.getElementById('bouton-envoi');

    function ajouterMessage(texte, estUtilisateur = false, estErreur = false) {
        const bulle = document.createElement('div');
        bulle.className = `message ${estUtilisateur ? 'message-utilisateur' : 'message-ia'} ${estErreur ? 'message-erreur' : ''} shadow-sm`;
        bulle.textContent = texte;
        boiteMsg.appendChild(bulle);
        boiteMsg.scrollTop = boiteMsg.scrollHeight;
        return bulle;
    }

    function afficherChargement() {
        const bulle = document.createElement('div');
        bulle.className = 'message message-ia shadow-sm';
        bulle.innerHTML = `<div class="spinner-border spinner-border-sm text-success" role="status"></div>`;
        boiteMsg.appendChild(bulle);
        boiteMsg.scrollTop = boiteMsg.scrollHeight;
        return bulle;
    }

    formulaire.addEventListener('submit', async (evenement) => {
        evenement.preventDefault();
        const texte = saisie.value.trim();
        if(!texte) return;

        // Désactiver le bouton pendant le traitement
        boutonEnvoi.disabled = true;
        saisie.disabled = true;

        // Ajouter le message de l'utilisateur
        ajouterMessage(texte, true);
        saisie.value = '';

        // Afficher le loader
        const bulleChargement = afficherChargement();

        try {
            // Obtenir la langue actuelle
            const langue = localStorage.getItem('langueApp') || 'fr';
            
            // Appeler l'API Groq
            const reponse = await tuteur.callAI(texte, langue);
            
            // Supprimer le loader
            bulleChargement.remove();
            
            // Afficher la réponse
            ajouterMessage(reponse, false);
        } catch (error) {
            // Supprimer le loader
            bulleChargement.remove();
            
            // Afficher le message d'erreur
            ajouterMessage(error.message, false, true);
        } finally {
            // Réactiver le bouton
            boutonEnvoi.disabled = false;
            saisie.disabled = false;
            saisie.focus();
        }
    });

    // Initialisation
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', rafraichirTheme);
    
    window.onload = () => {
        rafraichirTheme();
        const languePreferee = localStorage.getItem('langueApp') || 'fr';
        document.getElementById('selecteurLangue').value = languePreferee;
        appliquerTraduction(languePreferee);
    };