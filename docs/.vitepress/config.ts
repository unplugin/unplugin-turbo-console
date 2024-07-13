import { defineConfig } from 'vitepress'
import { zhCN } from './zhCN'
import { enUS } from './enUS'

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
    socialLinks: [
      { icon: 'github', link: 'https://github.com/unplugin/unplugin-turbo-console' },
    ],
  },
})
