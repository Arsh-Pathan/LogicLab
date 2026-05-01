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
        // Function form: we only chunk vendors that are eagerly needed.
        // Three.js, @react-three/* are intentionally NOT split here so Rollup
        // bundles them into the lazy Hero3D dynamic chunk — no modulepreload
        // tags emitted from the root HTML.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('three') || id.includes('@react-three')) return;
          if (id.match(/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/)) {
            return 'vendor-react';
          }
          if (id.includes('reactflow')) return 'vendor-reactflow';
          if (id.includes('gsap')) return 'vendor-gsap';
          if (id.includes('@supabase')) return 'vendor-supabase';
        },
      },
    },
  },
})
