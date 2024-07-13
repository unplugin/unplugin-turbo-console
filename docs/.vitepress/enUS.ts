import { defineConfig } from 'vitepress'

export const enUS = defineConfig({
  lang: 'en-US',
  title: 'Unplugin Turbo Console',
  description: 'Improve the Developer Experience of console',
  themeConfig: {
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide' },
          { text: 'Features', link: '/features' },
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
  },
})
