import { join } from 'pathe'
import { describe, expect, it, vi } from 'vitest'
import { webpackTransform } from '../src/core/transform/webpack'
import { includesHightlight } from './fixtures/edgecase'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn(() => join('/', 'mock', 'path')),
  }
})

describe('includes hightlight', () => {
  it('script', async () => {
    expect(
      await webpackTransform(includesHightlight),
    ).matchSnapshot()
  })
})
