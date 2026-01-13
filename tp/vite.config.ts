import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        connexionEnseignant: resolve(__dirname, 'connexionEnseignant.html'),
        connexion: resolve(__dirname, 'connexion.html'),
        inscriptionEtudiant: resolve(__dirname, 'inscriptionEtudiant.html'),
        inscriptionEnseignant: resolve(__dirname, 'inscriptionEnseignant.html'),
        boardEnseignant : resolve (__dirname, 'boardEnseignant.html'),
        boardEtudiant : resolve (__dirname, 'boardEtudiant.html'),
        tuteurIA : resolve(__dirname, 'tuteurIA.html'),
      
        epreuve : resolve(__dirname, 'Ressources/epreuve.html'),
        c6e : resolve(__dirname, 'Ressources/6e.html'),
        c5e : resolve(__dirname, 'Ressources/5e.html'),
        c4e : resolve(__dirname, 'Ressources/4e.html'),
        c3e : resolve(__dirname, 'Ressources/3e.html'),
        c2nde : resolve(__dirname, 'Ressources/2nde.html'),
        c1ere : resolve(__dirname, 'Ressources/1ere.html'),
        terminale : resolve(__dirname, 'Ressources/terminale.html'),
        discussionPeerToPeer : resolve(__dirname, 'discussionPeerToPeer.html'),



        // Ajoute TOUS tes fichiers HTML
      }
    }
  }
})
