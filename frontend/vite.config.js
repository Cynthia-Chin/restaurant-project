import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Frontend dev server configuration
  server: {
    port: 5173,       // Dev server port (default 5173)
    open: true,       // Automatically opens the browser
    proxy: {
      // Proxy all /api requests to backend at localhost:3000
      '/api': 'http://localhost:3000'
    }
  },

  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': '/src'    // Use "@/..." to import from frontend/src
    }
  }
});

