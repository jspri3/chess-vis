import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: command === 'serve' ? '/' : '/chess-vis/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    hmr: {
      overlay: true,
      protocol: 'ws',
      host: 'localhost'
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  }
}))