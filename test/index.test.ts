import { describe, expect, test } from 'vitest'
import { transformCode } from '../src/transform'

const jsTest = {
  code: 'console.log(foo,bar)',
  path: '/path/to/main.js',
}

const tsTest = {
  code: 'console.log(foo,bar)',
  path: '/path/to/main.ts',
}

const vueTest = {
  code: 'console.log(foo,bar)',
  path: '/path/to/main.vue',
}

describe('transformCode', () => {
  test('jsCode', () => {
    expect(transformCode(jsTest.code, jsTest.path)).toMatchSnapshot()
  })

  test('tsCode', () => {
    expect(transformCode(tsTest.code, tsTest.path)).toMatchSnapshot()
  })

  test('vueCode', () => {
    expect(transformCode(vueTest.code, vueTest.path)).toMatchSnapshot()
  })
})
