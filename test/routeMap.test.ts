import { describe, expect, it } from 'vitest'
import { setRouteMap } from '../src/core/utils'

describe('route map', () => {
  it('should work', () => {
    setRouteMap('src/app.vue')

    expect(globalThis.TurboConsoleRouteMap instanceof Map).toMatchInlineSnapshot(`true`)
  })
})
