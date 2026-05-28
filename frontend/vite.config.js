import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react-router-dom') || id.includes('react-router')) {
            return 'router-vendor';
          }

          if (id.includes('react-dom')) {
            return 'react-dom-vendor';
          }

          if (id.includes('react')) {
            return 'react-vendor';
          }

          if (id.includes('zustand')) {
            return 'state-vendor';
          }

          if (id.includes('leaflet')) {
            return 'leaflet-vendor';
          }
        },
      },
    },
  },
});
