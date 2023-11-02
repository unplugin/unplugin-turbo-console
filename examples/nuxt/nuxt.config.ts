// https://nuxt.com/docs/api/configuration/nuxt-config
import TurboConsole from 'vite-plugin-turbo-console'

export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    plugins: [
      TurboConsole(),
    ],
  },
})
