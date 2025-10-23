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
    host: '0.0.0.0', // Allow external connections
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true
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
