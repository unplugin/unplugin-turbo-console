import type { Context } from '../../src/types'

export const COMMENT_TOP_FILE: Context = {
  options: {},
  code: `// turbo-console-disable
  console.log('hello javascript')
  console.log('hello javascript2')
  `,
  id: '/home/runner/comments.js',
}

export const COMMENT_TOP_FILE_VUE: Context = {
  options: {},
  code: `<template>
  Hello World
</template>

<script setup lang="ts">
// turbo-console-disable
  const msg: string = "Hello World"
  console.log(msg)
</script>
`,
  id: '/home/runner/comments.vue',
}

export const COMMENT_TOP_FILE_SVELTE: Context = {
  options: {},
  code: `<script lang="ts">
// turbo-console-disable
  const a: string = 'Hello'
  console.log(a)
</script>


<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
`,
  id: '/home/runner/comments.svelte',
}

export const COMMENT_CURRENT_LINE: Context = {
  options: {},
  code: `console.log('hello javascript')
  console.log('hello javascript2') // turbo-console-disable-line
  `,
  id: '/home/runner/comments.js',
}

export const COMMENT_NEXT_LINE: Context = {
  options: {},
  code: `console.log('hello javascript')
  // turbo-console-disable-next-line
  console.log('hello javascript2')
  `,
  id: '/home/runner/comments.js',
}

export const COMMENT_CURRENT_FILE_VUE: Context = {
  options: {},
  code: `<template>
  Hello World
</template>

<script setup lang="ts">
  const msg: string = "Hello World"
  console.log(msg) // turbo-console-disable-line
</script>
`,
  id: '/home/runner/comments.vue',
}
