import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': `${import.meta.dirname}/src`,
    },
  },
  server: {
    proxy: {
      '/nekos-proxy': {
        target:       'https://api.nekosapi.com',
        changeOrigin: true,
        secure:       true,
        rewrite:      (path) => path.replace(/^\/nekos-proxy/, '/v4'),
      },
    },
  },
  // preview is used by "vite preview" — the Docker serve command
  preview: {
    host: '0.0.0.0',   // listen on all interfaces so Docker can expose the port
    port: 4173,         // default vite preview port
    strictPort: true,   // fail if port is already taken
  },
})
