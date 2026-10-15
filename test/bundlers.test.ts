import type { createServer } from '../src/core/server/index'
import { describe, expect, it, vi } from 'vite-plus/test'
import { unpluginFactory } from '../src'

vi.mock('../src/core/server/index', () => ({
  createServer: vi.fn<typeof createServer>(async (_options, print) => {
    print()
    return { port: 41731, close: vi.fn<() => Promise<void>>(async () => {}) }
  }),
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
    hooks: { shutdown: hook('shutdown'), beforeCompile: hook('beforeCompile'), done: hook('done') },
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

  it.each(['webpack', 'rspack'] as const)(
    '%s dev builds use the bound server port and print it after a successful build',
    async framework => {
      const log = vi.spyOn(console, 'log').mockImplementation(() => {})
      const plugin = unpluginFactory({}, { framework }) as any
      const { compiler, taps } = createCompiler('development')
      plugin[framework](compiler)
      try {
        await taps.beforeCompile()
        const { code } = await plugin.transform.handler(
          'console.log(value)',
          '/project/src/main.ts',
        )
        expect(code).toContain('http://127.1:41731#')
        taps.done({ hasErrors: () => true })
        expect(log).not.toHaveBeenCalled()
        taps.done({ hasErrors: () => false })
        taps.done({ hasErrors: () => false })
        expect(log).toHaveBeenCalledOnce()
        expect(log.mock.calls[0]![0]).toContain(':41731/inspector')
      } finally {
        await taps.shutdown()
        log.mockRestore()
      }
    },
  )
})

describe('bundlers without a dev server', () => {
  it.each(['rollup', 'rolldown', 'esbuild'] as const)(
    '%s keeps highlight but skips server features',
    async framework => {
      const plugin = unpluginFactory({}, { framework }) as any
      const { code } = await plugin.transform.handler('console.log(value)', '/project/src/main.ts')
      expect(code).toContain('%c🚀 main.ts·1 ~ value')
      expect(code).not.toContain('http://')
      expect(plugin.load('\0~console')).toBe('')
    },
  )
})
