import { describe, expect, it, vi } from 'vitest'
import { webpackTransform } from '../src/core/transform/webpack'
import { webpackJS, webpackVue, webpackVueScriptSetup } from './fixtures'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn(() => '/mock/path'),
  }
})

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
