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
    hmr: {
      timeout: 60000,
      host: '192.168.10.52',
      port: 13001,
      protocol: 'wss'
    },
    allowedHosts: ["main.cherryon.art"],
    headers: {
      'Connection': 'keep-alive',
      'Keep-Alive': 'timeout=60',
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
    // // ========== ПРОКСИ ==========
    // proxy: {
    //   // Все запросы на /api перенаправляем на aut.cherryon.art
    //   '/api': {
    //     target: 'https://aut.cherryon.art',
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path, // не изменяем путь
    //     configure: (proxy, options) => {
    //       proxy.on('proxyReq', (proxyReq, req, res) => {
    //         console.log('[PROXY]', req.method, req.url, '->', 'https://aut.cherryon.art' + req.url);
    //       });
    //       proxy.on('proxyRes', (proxyRes, req, res) => {
    //         console.log('[PROXY] Response:', proxyRes.statusCode, req.url);
    //       });
    //       proxy.on('error', (err, req, res) => {
    //         console.error('[PROXY] Error:', err);
    //       });
    //     },
    //   },
    // },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})