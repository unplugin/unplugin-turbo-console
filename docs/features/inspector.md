# Console Inspector

The **Console Inspector** allows you to view console statements in your project in real-time and jump to the corresponding file by clicking.

![console inspector](https://static.yuy1n.io/console-inspector.png)

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

If you are using [Vue Devtools](https://devtools.vuejs.org/), you can view **Console Inspector** by the following configuration on Vue project:

```js [main.js]
import '~console/vue-devtools'
```

![console inspector vue devtools](https://static.yuy1n.io/console-inspector-vite-devtools.png)
