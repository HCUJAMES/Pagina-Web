import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Las librerías cambian poco: en un archivo aparte quedan
        // cacheadas en el navegador entre despliegues.
        manualChunks: {
          react: ['react', 'react-dom'],
          animacion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
})
