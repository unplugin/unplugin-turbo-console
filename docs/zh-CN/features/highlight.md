# 高亮输出

基于文件类型（如`.js(x)`, `.ts(x)`, `.vue`, `.svelte`, `.astro`）高亮 Console 输出。并带有**文件名**，**行号**，**变量名**等信息。

![feature-highlight](/features/highlight.png)

> 可以通过配置项 `disableHighlight: true` 来禁用此功能。
>
> 此功能在打包时会自动被禁用。

## 拓展路径文件名

考虑有一个项目的文件目录如下：

```
pages
├── bar
│   └── index.vue
├── foo
│   └── index.vue
└── index.vue
```

并且在每个`index.vue`中都有一个`console`语句，在默认情况下，高亮输出中的文件名都是`index.vue`，这会导致输出结果的可读性变差。通过设置`extendedPathFileNames: ['index']`，可以让输出的文件名带上路径信息：

![extend-name](/features/extend-name.png)

## 黑暗模式

当系统处于黑暗模式时，优化高亮输出的视觉效果。

![dark](/features/highlight-dark.png)

### 设置

在你应用的入口文件中引入 `~console/theme-detect`，示例：

::: code-group

```ts [Vite]
// main.ts
import '~console/theme-detect'
```

```vue [Nuxt]
<!-- app.vue -->
<script setup lang="ts">
import '~console/theme-detect'
</script>
```

:::

> [TypeScript 配置](/zh-CN/guide/configurations.html#typescript)
