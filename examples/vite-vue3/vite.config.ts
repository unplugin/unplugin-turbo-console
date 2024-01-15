import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import TurboConsole from 'unplugin-turbo-console/vite'
import inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    inspect(),
    TurboConsole({
      prefix: '🚀🚀🚀🚀🚀🚀',
      suffix: '💡💡💡💡💡',
      disableHighlight: true,
      disableLaunchEditor: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
