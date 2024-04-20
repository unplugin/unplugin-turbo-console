import { join } from 'pathe'
import { describe, expect, it, vi } from 'vitest'
import { transform } from '../src/core/transform'
import { resolveOptions } from '../src/core/options'
import { INCLUDES_HIGHLIGHT, SVELTE, TSX, TYPESCRIPT, VUE_OPTIONS, VUE_SCRIPT_SETUP } from './fixtures/transform'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn(() => join('/', 'mock', 'path')),
    env: {
      NODE_ENV: 'development',
    },
  }
})

const mockRouteMap = new Map()
mockRouteMap.set('../../home/runner/App.vue', 'appvue')
mockRouteMap.set('../../home/runner/main.ts', 'maints')
mockRouteMap.set('../../home/runner/main.js', 'mainjs')
mockRouteMap.set('../../home/runner/+page.svelte', 'pagtsx')
mockRouteMap.set('../../home/runner/page.tsx', 'svelte')

globalThis.TurboConsoleRouteMap = mockRouteMap

describe('vue transform', () => {
  it ('script setup', async () => {
    VUE_SCRIPT_SETUP.options = resolveOptions(VUE_SCRIPT_SETUP.options)
    expect(await transform(VUE_SCRIPT_SETUP)).matchSnapshot()
  })

  it('options', async () => {
    VUE_OPTIONS.options = resolveOptions(VUE_OPTIONS.options)
    expect(await transform(VUE_OPTIONS)).matchSnapshot()
  })
})

describe('vanilla transform', () => {
  it('typescript', async () => {
    TYPESCRIPT.options = resolveOptions(TYPESCRIPT.options)
    expect(await transform(TYPESCRIPT)).matchSnapshot()
  })

  it('tsx', async () => {
    TSX.options = resolveOptions(TSX.options)
    expect(await transform(TSX)).matchSnapshot()
  })
})

describe('svelte transform', () => {
  it('svelte', async () => {
    SVELTE.options = resolveOptions(SVELTE.options)
    expect(await transform(SVELTE)).matchSnapshot()
  })
})

describe('edge case', () => {
  it('includes highlight', async () => {
    INCLUDES_HIGHLIGHT.options = resolveOptions(INCLUDES_HIGHLIGHT.options)
    expect(await transform(INCLUDES_HIGHLIGHT)).matchSnapshot()
  })
})
