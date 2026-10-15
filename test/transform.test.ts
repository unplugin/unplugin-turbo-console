import { parseSync } from 'oxc-parser'
import { join } from 'pathe'
import { describe, expect, it, vi } from 'vite-plus/test'
import { resolveOptions } from '../src/core/options/resolve'
import { transform } from '../src/core/transform'
import globalStore from '../src/core/utils/globalStore'
import {
  INCLUDES_HIGHLIGHT,
  SVELTE,
  THEME_DETECT,
  TSX,
  TYPESCRIPT,
  UTF_8,
  VUE_OPTIONS,
  VUE_SCRIPT_SETUP,
  VUE_SETUP_NO_LANG,
  WIN_PATH,
} from './fixtures/transform'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn<() => string>(() => join('/', 'mock', 'path')),
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

globalStore.set('port', 3070)
globalStore.set('filePathMap', mockFilePathMap)

describe('vue transform', () => {
  it('script setup', async () => {
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

  it('keeps non-ASCII, space and Windows paths unencoded', async () => {
    const cases = [
      {
        root: '/Users/张三/my app',
        id: '/Users/张三/my app/src/组件/a b.ts',
        path: 'src/组件/a b.ts',
      },
      { root: 'C:\\Users\\me\\proj', id: 'C:\\Users\\me\\proj\\src\\win.ts', path: 'src/win.ts' },
      { root: 'C:/Users/me/proj', id: 'C:/Users/me/proj/src/win.ts?v=1', path: 'src/win.ts' },
    ]
    for (const item of cases) {
      const filePaths = new Map<string, string>()
      const { code } = await transform({
        code: 'console.log(a)',
        id: item.id,
        root: item.root,
        filePaths,
        options: resolveOptions({}),
      })
      expect([...filePaths.keys()]).toEqual([item.path])
      expect(code).toContain(`${item.path.split('/').pop()}\u00B71`)
    }
  })

  it('escapes special characters in the generated string', async () => {
    const cases = [
      { code: String.raw`console.log(a, '\n')`, options: {} },
      { code: 'console.log(`${a}\\n`)', options: {} },
      { code: String.raw`console.log(a, "\\")`, options: { launchEditor: false } },
      { code: 'console.log(a)', options: { prefix: '"\n', suffix: '\\' } },
    ]
    for (const item of cases) {
      const { code } = await transform({
        code: item.code,
        id: '/home/runner/escape.ts',
        root: '/home/runner',
        filePaths: new Map(),
        options: resolveOptions(item.options),
      })
      expect(parseSync('escape.ts', code).errors).toEqual([])
    }
  })
})

describe('utf-8', () => {
  it('includes utf-8', async () => {
    UTF_8.options = resolveOptions(UTF_8.options)
    expect(await transform(UTF_8)).toMatchSnapshot()
  })
})

describe('theme-detect', () => {
  it('theme-detect', async () => {
    const options = resolveOptions(THEME_DETECT.options)
    expect(await transform({ ...THEME_DETECT, options })).toMatchSnapshot()
  })
})
