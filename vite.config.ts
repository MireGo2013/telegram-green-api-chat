import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/telegram-green-api-chat/' : '/',
  plugins: [
    react(),
    checker({
      typescript: true,
      overlay: false,
    }),
  ],
  server: {
    port: 3000,
  },
}))
