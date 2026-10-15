import type { createServer } from '../src/core/server/index'
import { describe, expect, it, vi } from 'vite-plus/test'
import { unpluginFactory } from '../src'

vi.mock('../src/core/server/index', () => ({
  createServer: vi.fn<typeof createServer>(async () => ({
    port: 41731,
    close: vi.fn<() => Promise<void>>(async () => {}),
  })),
}))

type Tap = (...args: any[]) => any

function createCompiler(mode: string) {
  const taps: Record<string, Tap> = {}
  const hook = (name: string) => ({
    tap: (_: string, fn: Tap) => (taps[name] = fn),
    tapPromise: (_: string, fn: Tap) => (taps[name] = fn),
  })
  const compiler = {
    context: '/project',
    options: { mode },
    hooks: { shutdown: hook('shutdown'), done: hook('done') },
  }
  return { compiler, taps }
}

describe('webpack-like bundlers', () => {
  it.each(['webpack', 'rspack'] as const)(
    '%s production builds only keep the prefix and suffix',
    async framework => {
      const plugin = unpluginFactory({ prefix: 'P' }, { framework }) as any
      const { compiler, taps } = createCompiler('production')
      plugin[framework](compiler)
      const { code } = await plugin.transform.handler('console.log(value)', '/project/src/main.ts')
      expect(code).toBe('console.log("P\\n",value)')
      await taps.shutdown()
    },
  )
})
