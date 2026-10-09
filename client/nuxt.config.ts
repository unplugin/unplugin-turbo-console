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
  },
  icon: {
    clientBundle: {
      scan: true,
    },
  },
  modules: ['@nuxt/ui', '@vueuse/nuxt'],
  colorMode: {
    preference: 'dark',
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
