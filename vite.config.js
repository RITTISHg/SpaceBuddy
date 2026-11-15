import { defineConfig } from 'vite';
// In development, forward /api calls to the Node backend (npm run server).
export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: { outDir: '../dist', emptyOutDir: true, target: 'es2020' },
  server: { port: 3000, open: true, proxy: { '/api': 'http://localhost:8787' } }
});
