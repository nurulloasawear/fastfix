import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    host: '0.0.0.0', // barcha IP'lardan kirishga ruxsat
    port: 5173,
    strictPort: true,
    cors: true,
    hmr: {
      host: '0.0.0.0',
    },
    allowedHosts: true, // barcha hostlarni qabul qiladi
  },

  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/testing/setup.ts',
    css: false,
  },
})