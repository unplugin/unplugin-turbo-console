import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  // 修复 Nuxt 4.4.4 SPA 开发模式未初始化 Vite Node IPC 的问题。
  experimental: { viteEnvironmentApi: true },
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
  modules: ['reka-ui/nuxt', '@nuxtjs/color-mode', '@nuxt/icon', '@vueuse/nuxt'],
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
