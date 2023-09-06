import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import TurboConsole from '../../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    TurboConsole()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
