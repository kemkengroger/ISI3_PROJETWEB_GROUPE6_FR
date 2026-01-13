import { defineConfig } from 'vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  root: 'tp',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  // Important pour les SPA
  base: './',
  
  // Plugin pour copier tous les HTML
  plugins: [
    {
      name: 'copy-html-files',
      closeBundle() {
        const fs = require('fs')
        const path = require('path')
        
        // Liste tous les fichiers .html dans tp/
        const htmlFiles = fs.readdirSync('tp')
          .filter(file => file.endsWith('.html'))
        
        // Copie chaque fichier HTML
        htmlFiles.forEach(file => {
          const src = path.join('tp', file)
          const dest = path.join('../dist', file)
          fs.copyFileSync(src, dest)
        })
      }
    }
  ]
})
