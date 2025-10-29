import { describe, expect, it } from 'vitest'
import { setFilePathMap } from '../src/core/utils'
import globalStore from '../src/core/utils/globalStore'

describe('file path map', () => {
  it('should generation', () => {
    setFilePathMap('src/app.vue')

    expect(globalStore.get<Map<string, string>>('filePathMap')?.get('src/app.vue')).toBeTruthy()
  })

  it('avoid duplicate generation', () => {
    const mockFilePathMap = new Map()
    mockFilePathMap.set('/home/runner/main.ts', 'commsx')

    globalStore.set('filePathMap', mockFilePathMap)

    setFilePathMap('/home/runner/main.ts')

    expect(globalStore.get<Map<string, string>>('filePathMap')?.get('/home/runner/main.ts')).toBe('commsx')
  })
})
