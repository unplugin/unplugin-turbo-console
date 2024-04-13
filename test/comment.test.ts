import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/core/options'
import { transform } from '../src/core/transform'
import { COMMENT_CURRENT_FILE_VUE, COMMENT_CURRENT_LINE, COMMENT_NEXT_LINE, COMMENT_TOP_FILE, COMMENT_TOP_FILE_SVELTE, COMMENT_TOP_FILE_VUE } from './fixtures/comments'

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
