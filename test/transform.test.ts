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

  it('transforms every script block', async () => {
    const code = `<script lang="ts">
export default { name: 'X' }
</script>

<script setup lang="ts">
console.log(foo)
</script>
`
    const options = resolveOptions({})
    const context = { code, id: '/home/runner/X.vue', root: '/home/runner', options }
    expect((await transform(context)).code).toContain('console.log("%c🚀 X.vue·6 ~ foo')

    const disabled = code.replace("export default { name: 'X' }", '// turbo-console-disable')
    expect((await transform({ ...context, code: disabled })).code).toBe(disabled)
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

  it('transforms the instance script after a module script', async () => {
    const { code } = await transform({
      code: `<script module>
  export const x = 1
</script>

<script>
  console.log(bar)
</script>
`,
      id: '/home/runner/Y.svelte',
      root: '/home/runner',
      options: resolveOptions({}),
    })
    expect(code).toContain('console.log("%c🚀 Y.svelte·6 ~ bar')
    expect(code).toContain(',6,3"')
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

  it('skips console calls nested in a styled or disabled console', async () => {
    const cases = [
      `console.log('%cstyled', 'color: red', list.map(item => {
  console.log(item)
}))`,
      `// turbo-console-disable-next-line
console.log(list.map(item => {
  console.log(item)
}))`,
    ]
    for (const code of cases) {
      const result = await transform({
        code,
        id: '/home/runner/nested.ts',
        root: '/home/runner',
        filePaths: new Map(),
        options: resolveOptions({}),
      })
      expect(result.code).toBe(code)
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
