import { join } from 'pathe'
import { describe, expect, it, vi } from 'vitest'
import { webpackTransform } from '../src/core/transform/webpack'
import { webpackJS, webpackVue, webpackVueScriptSetup } from './fixtures'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn(() => join('/', 'mock', 'path')),
  }
})
describe('webpack vue transform', () => {
  it('script', async () => {
    expect(
      await webpackTransform(webpackVue),
    ).matchSnapshot()
  })

  it('script setup', async () => {
    expect(
      await webpackTransform(webpackVueScriptSetup),
    ).matchSnapshot()
  })
})

describe('webpack js transform', () => {
  it('script', async () => {
    expect(
      await webpackTransform(webpackJS),
    ).matchSnapshot()
  })
})
