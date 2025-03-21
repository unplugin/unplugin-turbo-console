import { join } from 'pathe'
import { describe, expect, it, vi } from 'vitest'
import { resolveOptions } from '../src/core/options'
import { transform } from '../src/core/transform'
import { INCLUDES_HIGHLIGHT, SVELTE, TSX, TYPESCRIPT, UTF_8, VUE_OPTIONS, VUE_SCRIPT_SETUP, VUE_SETUP_NO_LANG, WIN_PATH } from './fixtures/transform'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn(() => join('/', 'mock', 'path')),
    env: {
      NODE_ENV: 'development',
    },
  }
})

const mockFilePathMap = new Map()
mockFilePathMap.set('../../home/runner/App.vue', 'appvue')
mockFilePathMap.set('../../home/runner/main.ts', 'maints')
mockFilePathMap.set('../../home/runner/main.js', 'mainjs')
mockFilePathMap.set('../../home/runner/+page.svelte', 'pagtsx')
mockFilePathMap.set('../../home/runner/page.tsx', 'svelte')

globalThis.TurboConsoleFilePathMap = mockFilePathMap

describe('vue transform', () => {
  it ('script setup', async () => {
    VUE_SCRIPT_SETUP.options = resolveOptions(VUE_SCRIPT_SETUP.options)
    expect(await transform(VUE_SCRIPT_SETUP)).matchSnapshot()
  })

  it('options', async () => {
    VUE_OPTIONS.options = resolveOptions(VUE_OPTIONS.options)
    expect(await transform(VUE_OPTIONS)).matchSnapshot()
  })

  it('script setup no lang', async () => {
    VUE_SETUP_NO_LANG.options = resolveOptions(VUE_SETUP_NO_LANG.options)
    expect(await transform(VUE_SETUP_NO_LANG)).matchSnapshot()
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

  it('win path', async () => {
    WIN_PATH.options = resolveOptions(WIN_PATH.options)
    expect(await transform(WIN_PATH)).matchSnapshot()
  })
})

describe('utf-8', () => {
  it('includes utf-8', async () => {
    UTF_8.options = resolveOptions(UTF_8.options)
    expect(await transform(UTF_8)).toMatchSnapshot()
  })
})
