<p align='center'>
  <img src="https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/11/upgit_20231101_1698841113.png" >
</p>

<p align='center'>
<a href="https://www.npmjs.com/package/vite-plugin-turbo-console">
<img src="https://img.shields.io/npm/v/vite-plugin-turbo-console?color=a1b858&label=">
</a>
<img src="https://img.shields.io/npm/dm/vite-plugin-turbo-console">
</p>

## 🎥 Screen Recording

![gif](https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/11/upgit_20231101_1698844263.gif)

## 🔥 Features

- Support printing the file name, line number and variable name.

- Support background highlighting of different files. (Currently supporting `.js(x)`, `.ts(x)`, `.vue`, `.svelte`)

- Support jump to editor from console by simple click.

## 📦 Install

```shell
# npm
npm install -D vite-plugin-turbo-console
# yarn
yarn add -D vite-plugin-turbo-console
# pnpm
pnpm i -D vite-plugin-turbo-console
```

## 🦄 Usage

### Vite

**vite.config.ts**

```ts
import { defineConfig } from "vite";
import TurboConsole from "vite-plugin-turbo-console";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TurboConsole({
      /* options here */
    })
  ],
});
```

### Nuxt

**nuxt.config.ts**

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'vite-plugin-turbo-console/nuxt'
  ],
  turboConsole: {
    /* options here */
  }
})

```

**options**

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
}
```

## ❤️ Credits
Inspired by 

[babel-plugin-enhance-log](https://github.com/baozouai/babel-plugin-enhance-log)

[turbo-console-log](https://github.com/Chakroun-Anas/turbo-console-log)

[vite-plugin-console-line](https://github.com/lq9958/vite-plugin-console-line)
