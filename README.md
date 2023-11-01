<p align='center'>
  <img src="https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/11/upgit_20231101_1698841113.png" >
</p>

<p align='center'>
<a href="https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/11/upgit_20231101_1698841113.png">
<img src="https://img.shields.io/npm/v/vite-plugin-turbo-console?color=a1b858&label=">
</a>
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
Inspired by 

[babel-plugin-enhance-log](https://github.com/baozouai/babel-plugin-enhance-log)

 [turbo-console-log](https://github.com/Chakroun-Anas/turbo-console-log)

[vite-plugin-console-line](https://github.com/lq9958/vite-plugin-console-line)
