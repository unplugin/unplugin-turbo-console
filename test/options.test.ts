import { describe, expect, it } from 'vitest'
import { webpackTransform } from '../src/core/transform/webpack'
import { optionWithDisableLaunchEditor, optionWithPrefix } from './fixtures/option'

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
