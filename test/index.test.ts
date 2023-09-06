import { describe, expect, it } from 'vitest'
import { transformer } from '../src/core/transform'
import { js, ts } from './fixtures/index'

describe('transformer', () => {
  it('transform js', () => {
    expect(transformer(js.code, js.id, js.options)).toMatchInlineSnapshot(`
      "
        const bar = 'bar'
        console.log(\\"🚀 \\\\n %cindex.js:3 ~ bar\\",\\"padding:4px; border-radius:5px; font-weight:600; color: #111827; background: #F7DF1E\\",bar,\\"\\\\n 🐶\\")
        "
    `)
  })

  it('transform ts', () => {
    expect(transformer(ts.code, ts.id, ts.options)).toMatchInlineSnapshot(`
      "
      const foo:string = 'foo'
      console.log(\\" %cindex.ts:3 ~ foo\\",\\"padding:4px; border-radius:5px; font-weight:600; color: #fff; background: #3178C6\\",foo,\\"\\")
        "
    `)
  })
})
