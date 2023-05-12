import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import TurboConsole from 'vite-plugin-turbo-console'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), TurboConsole()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
