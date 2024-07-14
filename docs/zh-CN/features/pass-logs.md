# 传递日志

此功能可以让你在服务端和客户端之间传递日志内容。

## TypeSciprt 配置

在你项目中的`tsconfig.json`中增加以下配置：

```json
{
  "compilerOptions": {
    "types": [
      "unplugin-turbo-console/client"
    ]
  }
}
```

## 初始化

在项目的入口文件中引入`~console`进行初始化，以下是在一些框架中的示例：

::: code-group

```vue [Nuxt]
<!-- app.vue -->
<script setup lang="ts">
import '~console'
</script>
```

```svelte [SvelteKit]
<!-- +page.svelte -->
<script lang="ts">
import '~console'
</script>
```

```tsx{3} [SolidStart]
// entry-client.tsx
import { StartClient, mount } from '@solidjs/start/client'
import '~console'

mount(() => <StartClient />, document.getElementById('app')!)
```

:::

## 服务端 → 客户端

在服务端，用 `ClientConsole` 来替换`console`。

以下是在`Nuxt`中的示例：

```ts{2,9-11} twoslash
// server/api/test.ts
import { ClientConsole } from 'unplugin-turbo-console/helper'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const raw = await fetch('https://jsonplaceholder.typicode.com/users')
  const data = await raw.json()

  ClientConsole.log({ data })
  ClientConsole.warn('A warning message from server!!')
  ClientConsole.error('An error message from server!!')

  return {
    data
  }
})
```

![server-client](/features/server-client.gif)

## 客户端 → 服务端

在客户端，用 `ServerConsole` 来替换`console`。

示例：

```vue{2,9} twoslash
<script setup lang="ts">
import { ServerConsole } from 'unplugin-turbo-console/helper'
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
  ServerConsole.log(count.value)
}
</script>

<template>
  <div>
    {{ count }}
  </div>
  <button @click="increment">
    +
  </button>
</template>
```

![server-client](/features/client-server.gif)

<!-- ## 深入：它是如何工作的

服务端与客户端之间的通信是通过 `WebSocket` 实现的，在项目启动时，插件会启动一个WebSocket服务。

在第一步中引入的 `~console` 是一个虚拟模块，它是一个[IIFE](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE)，作用就是让客户端与服务端的`WebSocket`服务建立连接。[源代码](https://github.com/unplugin/unplugin-turbo-console/blob/main/src/core/virtualModules.ts) -->
