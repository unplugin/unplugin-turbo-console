import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'
import { enUS } from './enUS'
import { zhCN } from './zhCN'

const docsLink = 'https://utc.yuy1n.io'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  locales: {
    'root': {
      label: 'English',
      lang: 'en-US',
      ...enUS,
    },
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh-CN/',
      ...zhCN,
    },
  },
  themeConfig: {
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/unplugin/unplugin-turbo-console' },
    ],
  },
  markdown: {
    codeTransformers: [
      transformerTwoslash(),
    ],
    image: {
      lazyLoading: true,
    },
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  head: [
    ['meta', { property: 'og:title', content: 'Unplugin Turbo Console' }],
    ['meta', { property: 'og:description', content: 'Improve the Developer Experience of console' }],
    ['meta', { property: 'og:image', content: `${docsLink}/og.png` }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: docsLink }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:image', content: `${docsLink}/og.png` }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#4FC08D' }],
  ],
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          rspack: localIconLoader(import.meta.url, './assets/icons/rspack.svg'),
          farm: localIconLoader(import.meta.url, './assets/icons/farm.svg'),
        },
      }),
      Unocss(),
    ],
  },
})
