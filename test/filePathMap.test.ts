import { describe, expect, it } from 'vitest'
import { setFilePathMap } from '../src/core/utils'

describe('file path map', () => {
  it('should generation', () => {
    setFilePathMap('src/app.vue')

    expect(globalThis.TurboConsoleFilePathMap.get('src/app.vue')).toBeTruthy()
  })

  it('avoid duplicate generation', () => {
    const mockFilePathMap = new Map()
    mockFilePathMap.set('/home/runner/main.ts', 'commsx')

    globalThis.TurboConsoleFilePathMap = mockFilePathMap

    setFilePathMap('/home/runner/main.ts')

    expect(globalThis.TurboConsoleFilePathMap.get('/home/runner/main.ts')).toBe('commsx')
  })
})
