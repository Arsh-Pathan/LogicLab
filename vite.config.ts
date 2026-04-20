import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import wasm from 'vite-plugin-wasm'
import path from 'path'

export default defineConfig({
  plugins: [wasm(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(new URL(import.meta.url).pathname), './src'),
    },
  },
  optimizeDeps: {
    exclude: ['logiclab-engine'],
  },
})
