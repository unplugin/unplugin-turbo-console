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
