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
<a href="https://pkg-size.dev/unplugin-turbo-console"><img src="https://pkg-size.dev/badge/bundle/544318" title="Bundle size for unplugin-turbo-console"></a>
</p>

<p align="center">
<a href="https://stackblitz.com/github/yuyinws/stackblitz-demo?file=vite.config.ts"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg"></a>
</p>


## 🎥 Demo

<p align='center'>
  <img src="https://cdn.jsdelivr.net/gh/yuyinws/static@master/2024/04/upgit_20240421_1713682760.gif" >
</p>


## 🔥 Features

- Printing the file name, line number and variable name.

- Support inserting custom prefix and suffix strings in the console output.

- Support highlight the console output based on different file types. (such as `js(x)`, `ts(x)`, `vue`, `svelte`, `astro`)

- Allow jumping to the editor source code from the console output with one click.

- Pass server logs to client.

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
<summary>Sveltekit</summary><br>

⚠️ Please add TurboConsole plugin **before** Sveltekit plugin

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import TurboConsole from 'unplugin-turbo-console/vite'

export default defineConfig({
	plugins: [
		TurboConsole(),
		sveltekit()
	]
});

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
<summary>Farm</summary><br>

```ts
// farm.config.ts
import { defineConfig } from '@farmfe/core';
import vue from '@vitejs/plugin-vue';
import TurboConsole from 'unplugin-turbo-console/farm'

export default defineConfig({
  vitePlugins: [
    vue(),
  ],
  plugins: [
    TurboConsole()
  ]
});

```

<br></details>

<details>
<summary>Rspack (Experimental)</summary><br>

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

### Options

```ts
export interface Options {
  /**
   * Add a string prefix to the console log.
   *
   * @defaultValue ''
   */
  prefix?: string
  /**
   * Add a string suffix to the console log.
   *
   * @defaultValue ''
   */
  suffix?: string
  /**
   * Whether to disable the launch editor feature.
   *
   * @defaultValue false
   */
  disableLaunchEditor?: boolean
  /**
   * Whether to disable the highlight output feature.
   *
   * @defaultValue false
   */
  disableHighlight?: boolean
  /**
   * The specific service port of launch editor server.
   *
   * @defaultValue 3070
   */
  port?: number
}
```

> Refer all [options](https://github.com/unplugin/unplugin-turbo-console/blob/main/src/types.ts#L1).

### Disable plugin by comments

From `v1.5.0`, you can use code comments to make the plugin ignore specific console statements.

- One line disable

```js
// turbo-console-disable-next-line
console.log('foo')
console.log('bar') // turbo-console-disable-line
```

- Entire file disable

```js
/* turbo-console-disable (On top of file) */  
console.log('foo')
console.log('bar')
```

### Pass server logs to client

#### TypeSciprt

Add `unplugin-turbo-console/client` to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    // ...
    "types": [
      "unplugin-turbo-console/client"
    ],
  },
}
```

#### Client

Add it at your client entrance (Nuxt usage):

```vue
<script setup lang="ts">
# app.vue
import { initWebSocket } from '~console'

// Make sure initWebSocket() run on client environment.
if (import.meta.client)
  initWebSocket()
</script>
```

#### Server

On the server side, use `tConsole` instead of `console`

```ts
import { tConsole } from 'unplugin-turbo-console/helper'

export default defineEventHandler(async (event) => {
  const raw = await fetch('https://jsonplaceholder.typicode.com/users')
  const data = await raw.json()
  
  tConsole.log({data})
  tConsole.warn('A warning message from server!!')
  tConsole.error('An error message from server!!')
  
  return {
    data
  }
})

```

And These logs will be printed on your browser.

## Troubleshooting

### Jump to editor does't work

If you get errors like this:

> Could not open xxxx in the editor.
>
> The editor process exited with an error: spawn code ENOENT.

Please make sure the `code` command is installed. Check more details [here](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line).

## ❤️ Credits

Inspired by 

[babel-plugin-enhance-log](https://github.com/baozouai/babel-plugin-enhance-log)

[turbo-console-log](https://github.com/Chakroun-Anas/turbo-console-log)

[vite-plugin-console-line](https://github.com/lq9958/vite-plugin-console-line)
