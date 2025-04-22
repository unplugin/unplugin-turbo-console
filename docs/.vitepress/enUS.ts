import { defineConfig } from 'vitepress'

export const enUS = defineConfig({
  lang: 'en-US',
  title: 'Unplugin Turbo Console',
  description: 'Improve the Developer Experience of console',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide' },
      { text: 'Features', link: '/features/highlight', activeMatch: '/features' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Configurations', link: '/guide/configurations' },
          { text: 'Migration', link: '/guide/migration' },
        ],
      },
      {
        text: 'Features',
        items: [
          { text: '🎨 Highlight Output', link: '/features/highlight' },
          { text: '📝 Prefix & Suffix', link: '/features/custom-prefix' },
          { text: '🔦 Launch Editor', link: '/features/launch-editor' },
          { text: '🚚 Pass Logs', link: '/features/pass-logs' },
          { text: '🔍 Console Inspector', link: '/features/inspector' },
        ],
      },
      {
        text: 'Others',
        items: [
          { text: 'Troubleshooting', link: '/troubleshooting' },
        ],
      },
    ],
    footer: {
      message: 'Made with ❤️',
      copyright:
        'MIT License © 2023-PRESENT <a href="https://github.com/yuyinws">yuyinws</a>',
    },
    search: {
      provider: 'local',
    },
  },
})
