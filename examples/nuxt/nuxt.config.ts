// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    'unplugin-turbo-console/nuxt',
  ],

  turboConsole: {

  },

  compatibilityDate: '2025-04-16',
})
