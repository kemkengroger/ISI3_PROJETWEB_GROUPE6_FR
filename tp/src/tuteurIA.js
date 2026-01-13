import { db, auth } from './firebase/config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ⚠️ À déplacer côté serveur en production
const GROQ_API_KEY = "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";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

/* =========================
   AFFICHAGE DES MESSAGES
========================= */
function appendMessage(text, role) {
  const div = document.createElement('div');
  div.className = `msg msg-${role}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================
   APPEL GROQ (SANS ASYNC)
========================= */
function appelerGroq(prompt, callback) {
  fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Tu es un tuteur pédagogique clair et précis." },
        { role: "user", content: prompt }
      ]
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur API Groq");
    }
    return response.json();
  })
  .then(data => {
    const reply = data.choices[0].message.content;
    callback(null, reply);
  })
  .catch(error => {
    console.error(error);
    callback("Erreur technique avec l’IA.", null);
  });
}

/* =========================
   ENVOI MESSAGE UTILISATEUR
========================= */
chatForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  userInput.value = "";

  appelerGroq(message, function (err, reponseIA) {
    if (err) {
      appendMessage(err, "bot");
      return;
    }

    appendMessage(reponseIA, "bot");

    // Sauvegarde Firestore
    addDoc(collection(db, "conversations"), {
      userMessage: message,
      botReply: reponseIA,
      createdAt: serverTimestamp(),
      uid: auth.currentUser ? auth.currentUser.uid : null
    });
  });
});
