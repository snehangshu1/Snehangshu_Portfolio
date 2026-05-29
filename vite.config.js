import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning limit (three.js ecosystem is inherently large)
    chunkSizeWarningLimit: 2200,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy three.js core into its own chunk
          'three-core': ['three'],
          // Split three.js ecosystem (loaders, stdlib) separately
          'three-ecosystem': ['three-stdlib'],
          // Split React Three Fiber + Drei + Postprocessing
          'r3f': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          // Split physics engine (Rapier is very large)
          'physics': ['@react-three/rapier'],
          // Split GSAP animation library
          'gsap-vendor': ['gsap', '@gsap/react'],
          // Split React core
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Enable source map for debugging production issues (optional)
    sourcemap: false,
    // Minification
    minify: 'esbuild',
    // Target modern browsers for smaller output
    target: 'es2020',
  },
})
