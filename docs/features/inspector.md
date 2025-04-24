# Console Inspector

It enables real-time monitoring of console statements and with launch editor support.

<video src="https://static.yuy1n.io/console-inspector.mp4" controls />

## Options

```js
TurboConsole({
  // Disable inspector feature
  inspector: false,
})

TurboConsole({
  // Not print inspector url in the console when server start
  inspector: {
    printUrl: false,
  },
})
```

## Nuxt Devtools

If you are using Nuxt, You can also view **Console Inspector** from `Nuxt devtools`.

![console inspector nuxt devtools](https://static.yuy1n.io/console-inspector-nuxt-devtools.png)

## Vue Devtools

If you are using [Vue Devtools](https://devtools.vuejs.org/), you can view **Console Inspector** on devtools by the following configuration:

1. Install `@vue/devtools-api` first:

:::code-group

```shell [npm]
npm install -D @vue/devtools-api
```

```shell [pnpm]
pnpm install -D @vue/devtools-api
```

```shell [yarn]
yarn add -D @vue/devtools-api
```

```shell [bun]
bun install -D @vue/devtools-api
```

:::

2. Add the following code to your entry file:

```js [main.js]
import '~console/vue-devtools'
```

![console inspector vue devtools](https://static.yuy1n.io/console-inspector-vite-devtools.png)
