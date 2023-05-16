<p align='center'>
  <img src="https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/05/upgit_20230516_1684200691.png" >
</p>

<p align='center'>
Enhance the readability of <code>console.log()</code>
</p>

<p align='center'>
<a href="https://www.npmjs.com/package/vite-plugin-turbo-console">
<img src="https://img.shields.io/npm/v/vite-plugin-turbo-console?color=a1b858&label=">
</a>
</p>

## Features

- Support printing the file name, line number and variable name.

- Support background highlighting of different files. (Currently supporting `.js(x)`, `.ts(x)`, `.vue`, `.svelte`, and `.astro`)

## Install

```shell
# npm
npm install -D vite-plugin-turbo-console
# yarn
yarn add -D vite-plugin-turbo-console
# pnpm
pnpm i -D vite-plugin-turbo-console
```

## Usage

**vite.config.ts**

```ts
import { defineConfig } from "vite";
import TurboConsole from "vite-plugin-turbo-console";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TurboConsole()],
});
```

> **Note**
> The code line will only be transformed when there is only one `console.log` expression. Such as `const foo = 'bar';console.log(foo);` will be ignored.
