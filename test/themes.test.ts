import { describe, expect, it, vi } from 'vitest'
import { getStyleCode } from '../src/core/utils/themes'

describe('themes', () => {
  it('get style code', () => {
    expect(getStyleCode('vue')).toMatchInlineSnapshot(`"padding:2px 5px;border-radius:3px 0 0 3px;margin:0 0 5px 0;color:#fff;background:#4FC08D;"`)
  })
})
