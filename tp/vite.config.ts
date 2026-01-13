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
        tuteurIA : resolve(__dirname, 'tuteur.html'),
        tuteurD : resolve(__dirname, 'tuteurD.html'),
        epreuve : resolve(__dirname, 'Ressouces/epreuve.html'),
        c6e : resolve(__dirname, 'Ressouces/6e.html'),
        c5e : resolve(__dirname, 'Ressouces/5e.html'),
        c4e : resolve(__dirname, 'Ressouces/4e.html'),
        c3e : resolve(__dirname, 'Ressouces/3e.html'),
        c2nde : resolve(__dirname, 'Ressouces/2nde.html'),
        c1ere : resolve(__dirname, 'Ressouces/1ere.html'),
        terminale : resolve(__dirname, 'Ressouces/terminale.html'),
        discussionPeerToPeer : resolve(__dirname, 'Ressouces/discussionPeerToPeer.html'),



        // Ajoute TOUS tes fichiers HTML
      }
    }
  }
})
