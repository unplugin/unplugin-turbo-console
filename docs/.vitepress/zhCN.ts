import { defineConfig } from 'vitepress'

export const zhCN = defineConfig({
  lang: 'zh-CN',
  title: 'Unplugin Turbo Console',
  description: '增强 Console 的开发者体验',
  themeConfig: {
    nav: [
      { text: '指南', link: '/zh-CN/guide/getting-started', activeMatch: '/zh-CN/guide' },
      { text: '特性', link: '/zh-CN/features/highlight', activeMatch: '/zh-CN/features' },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '入门', link: '/zh-CN/guide/getting-started' },
          { text: '配置', link: '/zh-CN/guide/configurations' },
          { text: '迁移', link: '/zh-CN/guide/migration' },
        ],
      },
      {
        text: '特性',
        items: [
          { text: '🎨 高亮输出', link: '/zh-CN/features/highlight' },
          { text: '📝 前后缀', link: '/zh-CN/features/custom-prefix' },
          { text: '🔦 编辑器跳转', link: '/zh-CN/features/launch-editor' },
          { text: '🚚 传递日志', link: '/zh-CN/features/pass-logs' },
          { text: '🔍 Console Inspector', link: '/zh-CN/features/inspector' },
        ],
      },
      {
        text: '其他',
        items: [
          { text: '常见问题', link: '/zh-CN/troubleshooting' },
        ],
      },
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '没有找到结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    footer: {
      message: '用 ❤️ 发电',
      copyright:
        'MIT License © 2023-PRESENT <a href="https://github.com/yuyinws">yuyinws</a>',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outline: {
      label: '页面导航',
    },
  },
})
