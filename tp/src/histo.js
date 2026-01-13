// histo.js
import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("conversationList");
const userId = etudiant_001; // simulé

async function loadConversations() {
  try {
    console.log("Chargement des conversations...");
    
    const q = query(
      collection(db, "conversations"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);
    console.log("Nombre de conversations trouvées:", snapshot.size);

    if (snapshot.empty) {
      container.innerHTML = "<p class='no-data'>Aucune conversation trouvée.</p>";
      console.log("Aucune donnée dans Firestore");
      return;
    }

    // Nettoyer le container
    container.innerHTML = "";

    snapshot.forEach(doc => {
      const conv = doc.data();
      console.log("Conversation chargée:", conv);

      const card = document.createElement("div");
      card.className = `conversation ${conv.type}`;
      card.dataset.id = doc.id; // Stocker l'ID du document

      card.innerHTML = `
        <div class="conversation-titre">${conv.title}</div>
        <div class="conversation-date">${conv.date}</div>
        <div class="conversation-desc">${conv.description}</div>
      `;

      // Ajouter l'événement click
      card.addEventListener("click", () => {
        console.log("Conversation cliquée:", doc.id);
        alert(`Ouverture de la conversation:\n${conv.title}\nID: ${doc.id}`);
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Erreur lors du chargement:", error);
    container.innerHTML = `
      <p class="error">Erreur de chargement: ${error.message}</p>
      <p>Vérifiez la console pour plus de détails.</p>
    `;
  }
}

// Version de secours avec données statiques si Firebase échoue
function loadStaticConversations() {
  console.log("Chargement des données statiques...");
  
  const conversations = [
    {
      type: "ia",
      title: "Session IA – Mathématiques",
      date: "14 Déc 2024",
      description: "Équations du second degré"
    },
    {
      type: "tutorat",
      title: "Session Tutorat – Physique",
      date: "12 Déc 2024",
      description: "Avec Prof. Kamga"
    },
    {
      type: "ia",
      title: "Session IA – Informatique",
      date: "10 Déc 2024",
      description: "Algorithmes de tri"
    },
    {
      type: "tutorat",
      title: "Session Tutorat – Analyse",
      date: "08 Déc 2024",
      description: "Avec Prof. Ndzi"
    }
  ];

  container.innerHTML = "";

  conversations.forEach((conv, index) => {
    const card = document.createElement("div");
    card.className = `conversation ${conv.type}`;
    
    card.innerHTML = `
      <div class="conversation-titre">${conv.title}</div>
      <div class="conversation-date">${conv.date}</div>
      <div class="conversation-desc">${conv.description}</div>
    `;

    card.addEventListener("click", () => {
      console.log("Conversation statique cliquée:", conv.title);
      alert(`Ouverture de la conversation:\n${conv.title}`);
    });

    container.appendChild(card);
  });
}

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM chargé, initialisation...");
  
  // Essayer d'abord avec Firebase, sinon utiliser les données statiques
  loadConversations().catch(error => {
    console.warn("Firebase échoué, utilisation des données statiques:", error);
    loadStaticConversations();
  });
});



// histo.js (version simplifiée sans Firebase)
document.addEventListener("DOMContentLoaded", () => {
  const conversations = [
    {
      type: "ia",
      title: "Session IA – Mathématiques",
      date: "14 Déc 2024",
      description: "Équations du second degré"
    },
    {
      type: "tutorat",
      title: "Session Tutorat – Physique",
      date: "12 Déc 2024",
      description: "Avec Prof. Kamga"
    }
  ];

  const container = document.getElementById("conversationList");
  
  conversations.forEach(conv => {
    const card = document.createElement("div");
    card.className = `conversation ${conv.type}`;
    
    card.innerHTML = `
      <div class="conversation-titre">${conv.title}</div>
      <div class="conversation-date">${conv.date}</div>
      <div class="conversation-desc">${conv.description}</div>
    `;
    
    card.addEventListener("click", () => {
      alert(`Conversation: ${conv.title}`);
    });
    
    container.appendChild(card);
  });
});