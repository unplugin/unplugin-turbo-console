import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  future: {
    compatibilityVersion: 4,
  },
  css: ['./app/assets/main.css'],
  nitro: {
    preset: 'static',
    output: {
      dir: '../dist/client',
    },
    experimental: {
      websocket: true,
    },
  },
  modules: [
    'reka-ui/nuxt',
    '@nuxtjs/color-mode',
    'unplugin-turbo-console/nuxt',
    '@nuxt/icon',
    '@vueuse/nuxt',
  ],
  icon: {
    clientBundle: {
      scan: true,
    },
  },
  colorMode: {
    preference: 'dark',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

})
