import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import MyPlugin from '../dist/index.mjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), MyPlugin(), Inspect()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
