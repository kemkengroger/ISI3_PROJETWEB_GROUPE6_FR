import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'tp', // Indique que la racine est le dossier 'tp'
  build: {
    outDir: '../dist', // Génère le build à la racine
    emptyOutDir: true,
  }
})