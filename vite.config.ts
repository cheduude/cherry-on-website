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
  plugins: 
  [
  react(),
  tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',  
    port: 13001,
    hmr: {      
      timeout: 60000,
      host: '192.168.10.52',
      port: 13001,
      protocol: 'wss'},
    allowedHosts: ["main.cherryon.art"],
        // Добавляем заголовки для предотвращения закрытия соединений
    headers: {
      'Connection': 'keep-alive',
      'Keep-Alive': 'timeout=60',
    },
    // Включаем watch с usePolling для мобильных (не обязательно, но может помочь)
    watch: {
      usePolling: true,
      interval: 1000,
    }
  },
	resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // ← именно это
    },
  },
})
