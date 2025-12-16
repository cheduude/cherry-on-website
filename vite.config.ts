import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    css: {
    modules: {
      localsConvention: 'camelCase',
    }
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'  // Для backend
    }
  }
	
})
