# vite-plugin-turbo-console

[![NPM version](https://img.shields.io/npm/v/vite-plugin-turbo-console?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-turbo-console)

**Enhance `console.log` functionality for better code intuition**.

## Before

![image-20230512134725034](https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/05/upgit_20230512_1683870450.png)

## After

![image-20230512134909008](https://cdn.jsdelivr.net/gh/yuyinws/static@master/2023/05/upgit_20230512_1683870549.png)

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
  plugins: [
    TurboConsole()
  ]
});
```



