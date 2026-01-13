const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Remplacez par votre clé API Groq
const GROQ_API_KEY = "VOTRE_CLE_API_GROQ_ICI";

exports.chatAvecGroq = onRequest({ cors: true }, async (req, res) => {
    try {
        if (req.method !== "POST") {
            return res.status(405).send("Méthode non autorisée");
        }

        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).send("Prompt manquant");
        }

        logger.info("Appel à Groq pour :", prompt);

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-70b-versatile",
                messages: [
                    { role: "system", content: "Tu es un tuteur pédagogique expert et bienveillant." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            throw new Error("Réponse de Groq invalide");
        }

    } catch (error) {
        logger.error("Erreur Groq:", error);
        res.status(500).json({ error: "L'IA n'a pas pu répondre." });
    }
});