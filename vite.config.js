import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/video-sharing-platform-react/',
  plugins: [react()],
});
