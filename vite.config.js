import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split CSS per chunk for better caching
    cssCodeSplit: true,
    // Raise the warning threshold (we're splitting anyway)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Supabase — large auth + realtime client (~300 KB)
          if (id.includes('@supabase')) {
            return 'vendor-supabase';
          }
          // jsPDF — heavy PDF generation lib (~200 KB), only needed on Admission page
          if (id.includes('jspdf') || id.includes('html2canvas')) {
            return 'vendor-pdf';
          }
          // React core runtime — cache independently from app code
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // All other node_modules → a generic vendors chunk
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
        }
      }
    }
  }
})
