import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'tp'),
  build: {
    outDir: resolve(__dirname, 'dist'),
  }
})