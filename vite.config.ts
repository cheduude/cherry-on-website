import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCase',
    }
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 13001,
    strictPort: true,
    origin: 'http://main.cherryon.art:13001',
    allowedHosts: ['main.cherryon.art'],
    hmr: {
      host: 'main.cherryon.art',
      protocol: 'ws',
      clientPort: 13001,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
