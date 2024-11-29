---
outline: deep
---

# Getting Started

**Unplugin Turbo Console** is a universal plugin designed to enhance the **Developer Experience** for front-end developers when using `console`. It offers many practical features and flexible options. Thanks to [Unplugin](https://unplugin.unjs.io), it is compatible with almost all modern front-end frameworks. You can see some of its features in the video below:

<video src="https://static.yuy1n.io/demo.mp4" controls />

<p align='center' flex gap-4 items-center>
<a href="https://www.npmjs.com/package/unplugin-turbo-console">
<img src="https://img.shields.io/npm/v/unplugin-turbo-console?style=flat&colorA=3f3f46&colorB=4FC08D">
</a>
<a href="https://www.npmjs.com/package/unplugin-turbo-console">
<img src="https://img.shields.io/npm/dm/unplugin-turbo-console?style=flat&colorA=3f3f46&colorB=4FC08D">
</a>
<a href="https://stackblitz.com/github/yuyinws/unplugin-turbo-console-online?file=src%2FApp.vue">
<img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg">
</a>
</p>

## Usage

### Install

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

### Integration

#### Build tools

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
    require('unplugin-turbo-console/webpack').default({ /* options */ }),
  ],
}
```

```js{6,9-11} [Vue CLI]
// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  parallel: false, // important!
  configureWebpack: {
    plugins: [
      require('unplugin-turbo-console/webpack').default({
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
    require('unplugin-turbo-console/rspack').default({
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

#### Meta-Framework

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
    TurboConsole(), // Please add this plugin before sveltekit
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
      require('unplugin-turbo-console/webpack').default()
    )

    return config
  }
}

module.exports = nextConfig
```

```ts{2,7} [SolidStart]
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
