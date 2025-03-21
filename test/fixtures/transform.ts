import type { Context } from '../../src/types'

export const VUE_SCRIPT_SETUP = {
  options: {},
  code: `<template>
  Hello World
</template>

<script setup lang="ts">
  const msg: string = "Hello World"
  console.log(msg)
</script>
`,
  id: '/home/runner/App.vue',
}

export const VUE_SETUP_NO_LANG = {
  options: {},
  code: `<template>
  Hello World
</template>

<script setup>
  const msg = "Hello World"
  console.log(msg)
</script>
`,
  id: '/home/runner/App.vue',
}

export const VUE_OPTIONS = {
  options: {},
  code: `<script>
  export default {
    data() {
      return {
        greeting: 'Hello World!'
      }
    },
    mounted() {
      const msg = "hello vue"
      console.log(msg)
    }
  }
  </script>
  
  <template>
    <p class="greeting">{{ greeting }}</p>
  </template>
`,
  id: '/home/runner/App.vue',
}

export const TYPESCRIPT = {
  options: {},
  code: `const msg: string = "hello TypeScript"
  console.log(msg)
  `,
  id: '/home/runner/main.ts',
}

export const TSX = {
  options: {},
  code: `"use client";

  export default function Home() {
    console.log("hello nextjs");
    function hello() {
      console.log("hello nextjs");
    }
  
    return <main>page.tsx</main>;
  }
  `,
  id: '/home/runner/page.tsx',
}

export const SVELTE = {
  options: {},
  code: `<script lang="ts">
  // xxxx
  const a: string = 'Hello'
  console.log(a)
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>`,
  id: '/home/runner/+page.svelte',
}

export const INCLUDES_HIGHLIGHT: Context = {
  options: {
    prefix: '',
    suffix: '',
    disableLaunchEditor: false,
    port: 3070,
  },
  code: `console.log('%cLog Message', 'color: orange');`,
  id: '/home/runner/main.js',
}

export const WIN_PATH = {
  options: {},
  code: `<template>
  Hello World
</template>

<script setup lang="ts">
  const msg: string = "Hello World"
  console.log(msg)
</script>
`,
  id: '\\home\\runner\\App.vue',
}

export const UTF_8 = {
  options: {},
  code: `const a = '你好' 
console.log(a)`,
  id: '/home/runner/main.js',
}
