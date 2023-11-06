// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'vite-plugin-turbo-console/nuxt',
  ],
  turboConsole: {
    prefix: 'xxxx',
  },
})
