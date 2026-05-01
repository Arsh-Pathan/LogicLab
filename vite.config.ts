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
  esbuild: {
    // Strip console + debugger statements from production builds
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Heavy vendor libs in separate cacheable chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-reactflow': ['reactflow'],
          'vendor-gsap': ['gsap'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
})
