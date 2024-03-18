import { join } from 'pathe'
import { describe, expect, it, vi } from 'vitest'
import { webpackTransform } from '../src/core/transform/webpack'
import { disabledFile, disabledFileInWrongWay, disabledLines, disabledLinesInWrongWay, disabledNextLine } from './fixtures/disabledByComments'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn(() => join('/', 'mock', 'path')),
  }
})

describe('disabled file highlight', () => {
  it('script', async () => {
    expect(
      await webpackTransform(disabledFile),
    ).matchSnapshot()
  })
})

describe('disabled next line', () => {
  it('script', async () => {
    expect(
      await webpackTransform(disabledNextLine),
    ).matchSnapshot()
  })
})

describe('disabled file highlight in a wrong way', () => {
  it('script', async () => {
    expect(
      await webpackTransform(disabledFileInWrongWay),
    ).matchSnapshot()
  })
})

describe('disabled lines in a wrong way', () => {
  it('script', async () => {
    expect(
      await webpackTransform(disabledLinesInWrongWay),
    ).matchSnapshot()
  })
})

describe('disabled lines', () => {
  it('script', async () => {
    expect(
      await webpackTransform(disabledLines),
    ).matchSnapshot()
  })
})
