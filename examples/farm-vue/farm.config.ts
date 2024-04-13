import { defineConfig } from '@farmfe/core';
import vue from '@vitejs/plugin-vue';
import TurboConsole from 'unplugin-turbo-console/farm'

export default defineConfig({
  vitePlugins: [
    vue(),
  ],
  plugins: [
    TurboConsole()
  ]
});
