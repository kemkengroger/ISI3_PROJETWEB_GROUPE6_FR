// FICHIER : vite.config.js
// EMPLACEMENT : À LA RACINE DE TON DÉPÔT
import { defineConfig } from 'vite'

export default defineConfig({
  // Racine du projet = dossier 'tp'
  root: 'tp',
  
  // Configuration du build
  build: {
    // Où mettre les fichiers générés
    outDir: '../dist',
    
    // Vider le dossier dist avant build
    emptyOutDir: true,
    
    // Configuration supplémentaire pour éviter les erreurs
    rollupOptions: {
      input: {
        main: 'tp/index.html'
      }
    }
  },
  
  // Serveur de dev (optionnel)
  server: {
    open: '/tp/index.html'
  }
})