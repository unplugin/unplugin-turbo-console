import { join } from 'pathe'
import { describe, expect, it, vi } from 'vitest'
import { webpackTransform } from '../src/core/transform/webpack'
import { optionWithDisableLaunchEditor, optionWithPrefix } from './fixtures/option'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn(() => join('/', 'mock', 'path')),
  }
})

describe('options', () => {
  it('perfix suffix', () => {
    expect(
      webpackTransform(
        optionWithPrefix,
      ),
    ).toMatchSnapshot()
  })

  it('disable launch editor', () => {
    expect(
      webpackTransform(
        optionWithDisableLaunchEditor,
      ),
    ).toMatchSnapshot()
  })
})
