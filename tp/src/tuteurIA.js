import { db, auth } from './firebase/config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// CONFIGURATION DIRECTE (Sans passer par le SDK qui cause le 404)
const API_KEY = "AIzaSyBVBMdsUt-N6JNYrIdeWBP-24YZHBuPiKE";
const URL_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Fonction pour afficher les messages
function appendMessage(text, role) {
    const div = document.createElement('div');
    div.className = `msg msg-${role} shadow-sm`;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    userInput.value = '';

    // Indicateur de chargement
    const loadingId = "load-" + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = "msg msg-ai shadow-sm";
    loadingDiv.textContent = "Le tuteur réfléchit...";
    chatBox.appendChild(loadingDiv);

    try {
        // APPEL API DIRECT
        const response = await fetch(URL_GEMINI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Tu es un tuteur pour un élève en Afrique. Réponds simplement à : ${message}` }] }]
            })
        });

        const data = await response.json();
        
        // On retire le chargement
        if(document.getElementById(loadingId)) document.getElementById(loadingId).remove();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const reponseIA = data.candidates[0].content.parts[0].text;
            appendMessage(reponseIA, 'ai');

            // SAUVEGARDE FIREBASE
            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, "historique_ia"), {
                    uid: user.uid,
                    question: message,
                    reponse: reponseIA,
                    date: serverTimestamp()
                });
            }
        } else {
            throw new Error("Format de réponse invalide");
        }

    } catch (error) {
        console.error("Erreur détaillée:", error);
        if(document.getElementById(loadingId)) document.getElementById(loadingId).remove();
        appendMessage("Désolé, le service est momentanément indisponible. Vérifie ta clé API.", "ai");
    }
});