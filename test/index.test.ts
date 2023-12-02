import { describe, expect, it } from 'vitest'
import { webpackTransform } from '../src/core/transform/webpack'
import { webpackJS, webpackVue, webpackVueScriptSetup } from './fixtures'

describe('webpack vue transform', () => {
  it('script', () => {
    expect(
      webpackTransform(webpackVue),
    ).matchSnapshot()
  })

  it('script setup', () => {
    expect(
      webpackTransform(webpackVueScriptSetup),
    ).matchSnapshot()
  })
})

describe('webpack js transform', () => {
  it('script', () => {
    expect(
      webpackTransform(webpackJS),
    ).matchSnapshot()
  })
})
