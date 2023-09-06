import type { Options } from '../../src/types'

interface TestObj {
  id: string
  code: string
  options: Options
}

export const ts: TestObj = {
  id: '/text/index.ts',
  code: `
const foo:string = 'foo'
console.log(foo)
  `,
  options: {},

}

export const js: TestObj = {
  id: '/text/index.js',
  code: `
  const bar = 'bar'
  console.log(bar)
  `,
  options: {
    prefix: '🚀',
    suffix: '🐶',
  },
}

export const vue: TestObj = {
  id: '/text/index.vue',
  code: `

  <script setup lang="ts">


  const foooooo:string = 'foooooo'
  
  console.log('foooooo1111', foooooo)
  </script>
  
  <script lang="ts">
  
  
  const bar:string = 'barrrrrrr'
  
  console.log('barrrrrrr', bar)
  </script>
  
  <template>
    <div>
      Hi
    </div>
  </template>
  
  
  `,
  options: {},
}
