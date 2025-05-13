import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/gallery/',
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['oneplate-cloud.duckdns.org'],
    host: true,
    port: 5173,
  },
});
