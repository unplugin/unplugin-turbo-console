import { join } from 'pathe'
import { describe, expect, it, vi } from 'vitest'
import { webpackTransform } from '../src/core/transform/webpack'
import { emptyOption, optionWithDisableAll, optionWithDisableHightlight, optionWithDisableLaunchEditor, optionWithPrefix } from './fixtures/option'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn(() => join('/', 'mock', 'path')),
  }
})

describe('options', () => {
  it('empty option', async () => {
    expect(
      await webpackTransform(
        emptyOption,
      ),
    ).toMatchSnapshot()
  })

  it('perfix suffix', async () => {
    expect(
      await webpackTransform(
        optionWithPrefix,
      ),
    ).toMatchSnapshot()
  })

  it('disable launch editor', async () => {
    expect(
      await webpackTransform(
        optionWithDisableLaunchEditor,
      ),
    ).toMatchSnapshot()
  })

  it('disable highlight editor', async () => {
    expect(
      await webpackTransform(
        optionWithDisableHightlight,
      ),
    ).toMatchSnapshot()
  })

  it('disable all', async () => {
    expect(
      await webpackTransform(
        optionWithDisableAll,
      ),
    ).toMatchSnapshot()
  })
})
