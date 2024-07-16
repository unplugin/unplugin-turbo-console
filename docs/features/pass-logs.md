# Pass Logs

The feature allows you to pass logs between server and client.

## TypeSciprt Configuration

Add the following configurations to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [
      "unplugin-turbo-console/client"
    ]
  }
}
```

## Initialization

Add `~console` to your project entry file.

Here are examples in some frameworks:

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

::: details What is `~console`?

Pass logs feature is based on `WebSocket` implementation. `~console` is a virtual module, it will establish a websocket connection between client and server.

More details can be found in [source code](https://github.com/unplugin/unplugin-turbo-console/blob/main/src/core/virtualModules.ts).

:::

## Server → Client

On the server side, replace `console` with `client`.

Here's an example in `Nuxt`:

```ts{2,9-11} twoslash
// server/api/test.ts
import { client } from 'unplugin-turbo-console/helper'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const raw = await fetch('https://jsonplaceholder.typicode.com/users')
  const data = await raw.json()

  client.log({ data })
  client.warn('A warning message from server!!')
  client.error('An error message from server!!')

  return {
    data
  }
})
```

![server-client](https://static.yuy1n.io/server-client.gif)

## Client → Server

On the client side, replace `console` with `server`.

For example:

```vue{2,9} twoslash
<script setup lang="ts">
import { server } from 'unplugin-turbo-console/helper'
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
  server.log(count.value)
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

![server-client](https://static.yuy1n.io/client-server.gif)

::: tip For Nuxt User
If you are using Nuxt, `client` and `server` is auto-imported. So you don't need to import them manually.
:::
