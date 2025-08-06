import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.nextTick': 'setTimeout'
  },
  resolve: {
    alias: {
      'buffer': 'buffer',
      'stream': 'stream-browserify',
      'util': 'util'
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['buffer', 'stream-browserify', 'util']
  },
  build: {
    rollupOptions: {
      external: ['@prisma/client', '.prisma/client/index-browser']
    }
  },
  server: {
    proxy: process.env.NODE_ENV === 'development' ? {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    } : undefined
  }
});
