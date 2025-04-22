# Console Inspector

它能够让你实时查看你的项目中的 console 语句，并通过点击跳转到对应文件的所在行。

![console inspector](https://static.yuy1n.io/console-inspector.png)

## 配置项

```js
TurboConsole({
  // 禁用检查器功能
  inspector: false,
})

TurboConsole({
  // 在启动服务时不在控制台打印 inspector 的 url
  inspector: {
    printUrl: false,
  },
})
```

## Nuxt Devtools

如果你使用的是 Nuxt，你也可以在 `Nuxt devtools` 中查看 **Console Inspector**。

![console inspector nuxt devtools](https://static.yuy1n.io/console-inspector-nuxt-devtools.png)

## Vue Devtools

如果你使用的是 [Vue Devtools](https://devtools.vuejs.org/)，你可以通过以下配置在 devtools 中查看 **Console Inspector**。

```js [main.js]
import '~console/vue-devtools'
```

![console inspector vue devtools](https://static.yuy1n.io/console-inspector-vite-devtools.png)
