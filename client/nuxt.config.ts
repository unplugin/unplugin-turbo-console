import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/main.css'],
  nitro: {
    preset: 'static',
    output: {
      dir: '../dist/client',
    },
    experimental: {
      websocket: true,
    },
  },
  hooks: {
    'nitro:config'(nitroConfig) {
      const imports = (nitroConfig as { imports?: { imports?: Array<{ name?: string }> } }).imports
      if (!imports?.imports) {
        return
      }
      imports.imports = imports.imports.filter(i => i?.name !== 'useAppConfig')
    },
  },
  icon: {
    clientBundle: {
      scan: true,
    },
  },
  colorMode: {
    preference: 'dark',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
