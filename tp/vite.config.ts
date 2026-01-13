import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        connexion: resolve(__dirname, 'connexionEnseignant.html'),
        inscription: resolve(__dirname, 'inscriptionEtudiant.html'),
        
        // Ajoute TOUS tes fichiers HTML
      }
    }
  }
})
