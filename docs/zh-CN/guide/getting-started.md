---
outline: deep
---

# 入门

**Unplugin Torbo Console** 是一个通用型插件，旨在增强前端开发人员在使用 `console` 时的开发者体验(DX)。它拥有许多实用的功能与灵活的可配置项，得益于[Unplugin](https://unplugin.unjs.io)，它几乎适用于所有现代前端框架。你可以从下面的视频中看到它的部分功能：

<video src="https://pub-bdb09f95de1146ed89704863f954c1c3.r2.dev/demo.mp4" controls />

<p align='center' flex gap-4 items-center>
<a href="https://www.npmjs.com/package/unplugin-turbo-console">
<img src="https://img.shields.io/npm/v/unplugin-turbo-console?style=flat&colorA=3f3f46&colorB=4FC08D">
</a>
<a href="https://www.npmjs.com/package/unplugin-turbo-console">
<img src="https://img.shields.io/npm/dm/unplugin-turbo-console?style=flat&colorA=3f3f46&colorB=4FC08D">
</a>
<a href="https://stackblitz.com/github/yuyinws/stackblitz-demo?file=src%2FApp.vue">
<img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg">
</a>
</p>

## 使用

### 安装

::: code-group

```bash [pnpm]
pnpm add -D unplugin-turbo-console
```

```bash [yarn]
yarn add unplugin-turbo-console -D
```

```bash [npm]
npm i unplugin-turbo-console --save-dev
```

```bash [bun]
bun add unplugin-turbo-console -d
```

:::

### 集成

#### 打包工具

::: code-group

```ts{3,7-9} twoslash [Vite]
// vite.config.ts
import { defineConfig } from 'vite'
import TurboConsole from 'unplugin-turbo-console/vite'

export default defineConfig({
  plugins: [
    TurboConsole({
      /* options here */
    })
  ],
})
```

```js{5} [webpack]
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-turbo-console/webpack')({ /* options */ }),
  ],
}
```

```js{6,9-11} [Vue CLI]
// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  parallel: false, // 重要！
  configureWebpack: {
    plugins: [
      require('unplugin-turbo-console/webpack')({
        /* options here */
      })
    ]
  }
})
```

```js{12-14} [Rspack]
// rspack.config.js
const rspack = require('@rspack/core')
const { VueLoaderPlugin } = require('vue-loader')
/** @type {import('@rspack/cli').Configuration} */

const config = {
  plugins: [
    new VueLoaderPlugin(),
    new rspack.HtmlRspackPlugin({
      template: './index.html'
    }),
    require('unplugin-turbo-console/rspack')({
        /* options here */
    }),
  ],

}
module.exports = config
```

```ts{4,11-13} twoslash [Farm]
// farm.config.ts
import { defineConfig } from '@farmfe/core'
import vue from '@vitejs/plugin-vue'
import TurboConsole from 'unplugin-turbo-console/farm'

export default defineConfig({
  vitePlugins: [
    vue(),
  ],
  plugins: [
    TurboConsole({
        /* options here */
    })
  ]
})
```

:::

#### 元框架（Meta-Framework）

::: code-group

``` ts{4} [Nuxt]
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    'unplugin-turbo-console/nuxt'
  ],
  turboConsole: {
    /* options here */
  }
})
```

```ts{3,7} [SvelteKit]
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import TurboConsole from 'unplugin-turbo-console/vite'

export default defineConfig({
  plugins: [
    TurboConsole(), // 请把本插件放在 sveltekit() 之前
    sveltekit()
  ]
})
```

```js{3,8} [Astro]
// astro.config.mjs
import { defineConfig } from 'astro/config'
import TurboConsole from 'unplugin-turbo-console/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [
    TurboConsole()
  ]
})
```

```js{6} [Next.js]
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.plugins.push(
      require('unplugin-turbo-console/webpack')()
    )

    return config
  }
}

module.exports = nextConfig
```

```ts{2,7} twoslash [SolidStart]
import { defineConfig } from '@solidjs/start/config'
import TurboConsole from 'unplugin-turbo-console/vite'

export default defineConfig({
  vite: {
    plugins: [
      TurboConsole()
    ]
  },
})
```

:::
