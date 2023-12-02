<p align='center'>
  <img src="https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/12/upgit_20231202_1701506091.png" >
</p>

<p align='center'>
<a href="https://www.npmjs.com/package/unplugin-turbo-console">
<img src="https://img.shields.io/npm/v/unplugin-turbo-console?color=a1b858&label=">
</a>
<img src="https://img.shields.io/npm/dm/unplugin-turbo-console">
</p>

<p align="center">
<a href="https://stackblitz.com/github/yuyinws/stackblitz-demo?file=vite.config.ts"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt=""></a>
</p>

## 🎥 Screen Recording

<p align='center'>
  <img src="https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/12/upgit_20231202_1701520681.gif" >
</p>

## 🔥 Features

- Support printing the file name, line number and variable name.

- Support insert custom prefix and suffix.

- Support background highlighting of different files. (Such as `.js(x)`, `.ts(x)`, `.vue`, `.svelte`)

- Support jump to editor source code from console by one click.

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
   * The specific service port of launch editor server.
   *
   * @default 3070
   */
  port?: number
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
