<p align='center'>
  <img src="https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/05/upgit_20230519_1684461689.png" >
</p>

<p align='center'>
<a href="https://www.npmjs.com/package/vite-plugin-turbo-console">
<img src="https://img.shields.io/npm/v/vite-plugin-turbo-console?color=a1b858&label=">
</a>
</p>

## 🔥 Features

- Support printing the file name, line number and variable name.

- Support background highlighting of different files. (Currently supporting `.js(x)`, `.ts(x)`, `.vue`, `.svelte`, and `.astro`)

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

**vite.config.ts**

```ts
import { defineConfig } from "vite";
import TurboConsole from "vite-plugin-turbo-console";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TurboConsole()],
});
```

## ❤️ Credits
Inspired by [babel-plugin-enhance-log](https://github.com/baozouai/babel-plugin-enhance-log) and [turbo-console-log](https://github.com/Chakroun-Anas/turbo-console-log)
