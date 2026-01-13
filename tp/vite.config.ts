import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        connexion: resolve(__dirname, 'connexion.html'),
        inscription: resolve(__dirname, 'inscription.html'),
        // Ajoute TOUS tes fichiers HTML
      }
    }
  }
})
