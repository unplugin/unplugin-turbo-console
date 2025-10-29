import { join } from 'pathe'
import { describe, expect, it, vi } from 'vitest'
import { resolveOptions } from '../src/core/options/resolve'
import { transform } from '../src/core/transform'
import globalStore from '../src/core/utils/globalStore'
import { COMMENT_CURRENT_FILE_VUE, COMMENT_CURRENT_LINE, COMMENT_NEXT_LINE, COMMENT_TOP_FILE, COMMENT_TOP_FILE_SVELTE, COMMENT_TOP_FILE_VUE } from './fixtures/comments'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn(() => join('/', 'mock', 'path')),
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
  it ('on top of file', async () => {
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
})
