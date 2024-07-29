import { describe, expect, it } from 'vitest'
import { getStyleCode } from '../src/core/utils'

describe('themes', () => {
  it('get style code', () => {
    expect(getStyleCode('vue')).toMatchInlineSnapshot(`
      {
        "highlight": "\`padding:2px 5px;border-radius:3px 0 0 3px;margin:0 0 5px 0;color:#fff;background:\${globalThis._UTC_DETECT_DARK && globalThis._UTC_DETECT_DARK() ? '#4FC08D90;' : '#4FC08D;'}\`",
        "launchEditor": "\`background:#00DC8250;padding:2px 5px;border-radius:0 3px 3px 0;margin:0 0 5px 0;\`",
      }
    `)
  })
})
