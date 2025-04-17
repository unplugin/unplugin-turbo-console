import { describe, expect, it } from 'vitest'
import { setFilePathMap } from '../src/core/utils'
import { filePathMapState } from '../src/core/utils/state'

describe('file path map', () => {
  it('should generation', () => {
    setFilePathMap('src/app.vue')

    expect(filePathMapState().get('src/app.vue')).toBeTruthy()
  })

  it('avoid duplicate generation', () => {
    const mockFilePathMap = new Map()
    mockFilePathMap.set('/home/runner/main.ts', 'commsx')

    filePathMapState(mockFilePathMap)

    setFilePathMap('/home/runner/main.ts')

    expect(filePathMapState().get('/home/runner/main.ts')).toBe('commsx')
  })
})
