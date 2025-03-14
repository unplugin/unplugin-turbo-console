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
  },
  modules: [
    'reka-ui/nuxt',
    '@nuxtjs/color-mode',
    'unplugin-turbo-console/nuxt',
    '@nuxt/icon',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
