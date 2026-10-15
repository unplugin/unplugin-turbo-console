import { join } from 'pathe'
import { describe, expect, it, vi } from 'vite-plus/test'
import { resolveOptions } from '../src/core/options/resolve'
import { transform } from '../src/core/transform'
import { getLineAndColumn, getLineStarts } from '../src/core/utils'
import globalStore from '../src/core/utils/globalStore'
import {
  COMMENT_CURRENT_FILE_VUE,
  COMMENT_CURRENT_LINE,
  COMMENT_NEXT_LINE,
  COMMENT_TOP_FILE,
  COMMENT_TOP_FILE_SVELTE,
  COMMENT_TOP_FILE_VUE,
} from './fixtures/comments'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn<() => string>(() => join('/', 'mock', 'path')),
    env: {
      NODE_ENV: 'development',
    },
  }
})

const mockFilePathMap = new Map()
mockFilePathMap.set('../../home/runner/comments.js', 'commsx')
mockFilePathMap.set('../../home/runner/comments.vue', 'zsdgg')
mockFilePathMap.set('../../home/runner/comments.svelte', 'xcvgg')

globalStore.set('port', 3070)
globalStore.set('filePathMap', mockFilePathMap)

describe('disable by comments', () => {
  it('on top of file', async () => {
    COMMENT_TOP_FILE.options = resolveOptions(COMMENT_TOP_FILE.options)

    expect(await transform(COMMENT_TOP_FILE)).toMatchSnapshot()
  })

  it('on top of vue file', async () => {
    COMMENT_TOP_FILE_VUE.options = resolveOptions(COMMENT_TOP_FILE_VUE.options)
    expect(await transform(COMMENT_TOP_FILE_VUE)).toMatchSnapshot()
  })

  it('on top of svelte file', async () => {
    COMMENT_TOP_FILE_SVELTE.options = resolveOptions(COMMENT_TOP_FILE_SVELTE.options)
    expect(await transform(COMMENT_TOP_FILE_SVELTE)).toMatchSnapshot()
  })

  it('on current line', async () => {
    COMMENT_CURRENT_LINE.options = resolveOptions(COMMENT_CURRENT_LINE.options)
    expect(await transform(COMMENT_CURRENT_LINE)).toMatchSnapshot()
  })

  it('on next line', async () => {
    COMMENT_NEXT_LINE.options = resolveOptions(COMMENT_NEXT_LINE.options)
    expect(await transform(COMMENT_NEXT_LINE)).toMatchSnapshot()
  })

  it('on next line vue', async () => {
    COMMENT_CURRENT_FILE_VUE.options = resolveOptions(COMMENT_CURRENT_FILE_VUE.options)
    expect(await transform(COMMENT_CURRENT_FILE_VUE)).toMatchSnapshot()
  })

  it('on the right lines of a long file', async () => {
    const lines = Array.from({ length: 400 }, (_, index) => {
      if (index % 4 === 1) return `console.log(a${index}) // turbo-console-disable-line`
      if (index % 4 === 2) return '// turbo-console-disable-next-line'
      return `console.log(a${index})`
    })
    const result = await transform({
      code: lines.join('\n'),
      id: '/home/runner/long.ts',
      root: '/home/runner',
      filePaths: new Map(),
      options: resolveOptions({}),
    })
    // Transformed lines are reduced to the line number and argument they print.
    const output = result!.code
      .split('\n')
      .map(line => /long\.ts·(\d+) ~ (\w+)/.exec(line)?.slice(1).join(' ') ?? line)
    const expected = lines.map((line, index) => (index % 4 === 0 ? `${index + 1} a${index}` : line))

    expect(output).toEqual(expected)
  })
})

describe('line lookup', () => {
  it('matches a linear scan at every offset', () => {
    const code = '\nconst a = 1\r\n\n  console.log(a)\n'
    const lineStarts = getLineStarts(code)
    let line = 1
    let column = 0
    for (let offset = 0; offset <= code.length; offset++) {
      expect(getLineAndColumn(lineStarts, offset)).toEqual({ line, column })
      if (code[offset] === '\n') {
        line++
        column = 0
      } else {
        column++
      }
    }
  })
})
