import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // <-- AQUÍ PON EL PUERTO DONDE CORRE TU BACKEND (ej: 3000 o 5000)
        changeOrigin: true,
        secure: false
      }
    }
  }
})