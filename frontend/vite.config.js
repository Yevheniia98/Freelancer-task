import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3030,
    strictPort: true, // Don't automatically try other ports
    host: 'localhost', // Use localhost instead of 0.0.0.0 to fix ping issues
    cors: true,
    hmr: {
      port: 3030,
      host: 'localhost'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      },
      '/upload': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      }
    }
  },
  define: {
    // Prevent process is not defined errors
    global: 'globalThis',
    // Add process.env fallback for compatibility
    'process.env': {}
  },
  // Enable proper SPA routing
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
