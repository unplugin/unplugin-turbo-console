import { describe, expect, it, vi } from 'vitest'
import { getStyleCode } from '../src/core/utils'

describe('themes', () => {
  it('get style code', () => {
    expect(getStyleCode('vue')).toMatchInlineSnapshot(`
      {
        "highlight": "padding:2px 5px;border-radius:3px 0 0 3px;margin:0 0 5px 0;color:#fff;background:#4FC08D;",
        "launchEditor": "background:#00DC8250;padding:2px 5px;border-radius:0 3px 3px 0;margin:0 0 5px 0;",
      }
    `)
  })
})
