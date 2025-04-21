import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import TurboConsole from 'unplugin-turbo-console/vite'
import inspect from 'vite-plugin-inspect'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vueDevTools(),
    vue(),
    inspect(),
    TurboConsole({
      prefix: '🚀🚀🚀🚀🚀🚀',
      suffix: '💡💡💡💡💡',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
