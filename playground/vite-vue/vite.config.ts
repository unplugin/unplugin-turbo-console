import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import inspect from 'vite-plugin-inspect'

// @ts-expect-error
import TurboConsole from '../../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    inspect(),
    TurboConsole(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
