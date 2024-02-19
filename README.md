<p align='center'>
  <img src="https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/12/upgit_20231203_1701604926.png" >
</p>


<p align='center'>
<a href="https://www.npmjs.com/package/unplugin-turbo-console">
<img src="https://img.shields.io/npm/v/unplugin-turbo-console?style=flat&colorA=3f3f46&colorB=ff7151">
</a>
<a href="https://www.npmjs.com/package/unplugin-turbo-console">
<img src="https://img.shields.io/npm/dm/unplugin-turbo-console?style=flat&colorA=3f3f46&colorB=ff7151">
</a>
<a href="https://pkg-size.dev/unplugin-turbo-console"><img src="https://pkg-size.dev/badge/bundle/629859" title="Bundle size for unplugin-turbo-console"></a>
</p>

<p align="center">
<a href="https://stackblitz.com/github/yuyinws/stackblitz-demo?file=vite.config.ts"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg"></a>
</p>


## 🎥 Screen Recording

<p align='center'>
  <img src="https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/12/upgit_20231204_1701661126.gif" >
</p>

## 🔥 Features

- Support printing the file name, line number and variable name.

- Support insert custom prefix and suffix.

- Support highlight the console output based on different file types. (such as `js(x)`, `ts(x)`, `vue`, `svelte`, `astro`)

- Support jump to the editor source code from the console output with one click.

## 📦 Install

```shell
# npm
npm install -D unplugin-turbo-console
# yarn
yarn add -D unplugin-turbo-console
# pnpm
pnpm i -D unplugin-turbo-console
```

## 🦄 Usage

> [!TIP]
> You can view all project examples [here](https://github.com/yuyinws/vite-plugin-turbo-console/tree/main/examples).

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import TurboConsole from 'unplugin-turbo-console/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TurboConsole({
      /* options here */
    })
  ],
})
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'unplugin-turbo-console/nuxt'
  ],
  turboConsole: {
    /* options here */
  }
})
```

<br></details>


<details>
<summary>Webpack</summary><br>

```js
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-turbo-console/webpack')({ /* options */ }),
  ],
}
```

<br></details>


<details>
<summary>Vue CLI</summary><br>

```js
// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  parallel: false,
  configureWebpack: {
    plugins: [
      require('unplugin-turbo-console/webpack')({
        /* options here */
      })
    ]
  }
})
```

<br></details>

<details>
<summary>Astro</summary><br>

```js
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

<br></details>



<details>
<summary>Next.js</summary><br>

```js
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

<br></details>


<details>
<summary>Rspack (⚠️ unstable)</summary><br>

```js
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
    require('unplugin-turbo-console/rspack')(),
  ],

}
module.exports = config
```

<br></details>

### options

```ts
export interface Options {
  /**
   * Add a string prefix to the console log.
   *
   * @default ''
   */
  prefix?: string
  /**
   * Add a string suffix to the console log.
   *
   * @default ''
   */
  suffix?: string
  /**
   * Whether to disable the launch editor feature.
   *
   * @default false
   */
  disableLaunchEditor?: boolean
  /**
   * Whether to disable the highlight output feature.
   *
   * @default false
   */
  disableHighlight?: boolean
  /**
   * The specific service port of launch editor server.
   *
   * @default 3070
   */
  port?: number
  /**
   * Whether to show extended path name when the file's (or folder's) name contains an element in the array.
   *
   * @default []
   */
  extendedPathFileNames?: string[]
}
```

## Migrate from `vite-plugin-turbo-console`

`package.json`

```diff
{
  "devDependencies": {
-   "vite-plugin-turbo-console": "*",
+   "unplugin-turbo-console": "*",
  }
}
```

`vite.config.js`
```diff
import { defineConfig } from "vite";
- import TurboConsole from "vite-plugin-turbo-console";
+ import TurboConsole from 'unplugin-turbo-console/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TurboConsole({
      /* options here */
    })
  ],
});
```

## ❤️ Credits

Inspired by 

[babel-plugin-enhance-log](https://github.com/baozouai/babel-plugin-enhance-log)

[turbo-console-log](https://github.com/Chakroun-Anas/turbo-console-log)

[vite-plugin-console-line](https://github.com/lq9958/vite-plugin-console-line)
