import { initDevframe } from 'devframe/initiate'
import { createRpcClient } from 'devframe/rpc/client'
import { createSseRpcChannel } from 'devframe/rpc/transports/sse-client'
import type { DevframeRpcServerFunctions, DevframeRpcClientFunctions } from 'devframe'
import { describe, expect, it, vi } from 'vite-plus/test'
import { createInspector, INSPECTOR_BASE, INSPECTOR_STATE } from '../src/core/inspector'
import { resolveOptions } from '../src/core/options/resolve'
import { transform } from '../src/core/transform'
import { createServer } from '../src/core/server/index'
import vite from '../src/vite'

vi.mock('../src/core/server/index', () => ({
  createServer: vi.fn<typeof createServer>(async () => ({
    port: 41731,
    close: vi.fn<() => Promise<void>>(async () => {}),
  })),
}))

const expression = { code: 'value', method: 'log', line: 1, column: 0 }

describe('Inspector Shared State', () => {
  it('syncs the initial snapshot, deduplicates and invalidates files, and isolates projects', async () => {
    const inspector = createInspector()
    const otherProject = createInspector()
    inspector.addExpression('src/main.ts', expression)
    const instance = initDevframe(inspector.definition, {
      base: INSPECTOR_BASE,
      ws: false,
      auth: false,
      mcp: false,
    })
    try {
      const ctx = await instance.context
      const shared = await ctx.rpc.sharedState.get(INSPECTOR_STATE)
      expect(shared.value()).toEqual(inspector.state.value())
      expect(shared.value().expressionsMap['src/main.ts'].expressions).toEqual([expression])
      let updates = 0
      const off = shared.on('updated', () => {
        updates++
      })
      inspector.addExpression('src/main.ts', expression)
      expect(updates).toBe(0)
      inspector.addExpression('src/main.ts', { ...expression, line: 2 })
      expect(updates).toBe(1)
      expect(otherProject.state.value().expressionsMap).toEqual({})
      inspector.invalidate('src/main.ts')
      expect(shared.value().expressionsMap).toEqual({})
      inspector.addExpression('src/main.ts', { ...expression, code: 'updated' })
      expect(shared.value().expressionsMap['src/main.ts'].expressions).toHaveLength(1)
      inspector.clear()
      expect(shared.value().expressionsMap).toEqual({})
      off()
    } finally {
      await instance.close()
    }
  })

  it('rejects client replacement and patches but allows Node updates', async () => {
    const inspector = createInspector()
    const instance = initDevframe(inspector.definition, {
      base: INSPECTOR_BASE,
      ws: false,
      auth: false,
      mcp: false,
    })
    try {
      const ctx = await instance.context
      await expect(
        ctx.rpc.invokeLocal('devframe:rpc:server-state:set', INSPECTOR_STATE, {}, 'replace'),
      ).rejects.toThrow('read-only')
      await expect(
        ctx.rpc.invokeLocal(
          'devframe:rpc:server-state:patch',
          INSPECTOR_STATE,
          [{ op: 'replace', path: ['version'], value: 'injected' }],
          'patch',
        ),
      ).rejects.toThrow('read-only')
      inspector.addExpression('src/main.ts', expression)
      expect(inspector.state.value().expressionsMap['src/main.ts'].expressions).toEqual([
        expression,
      ])
    } finally {
      await instance.close()
    }
  })

  it('broadcasts to multiple clients over SSE and provides the latest snapshot on reconnect', async () => {
    const inspector = createInspector()
    const instance = initDevframe(inspector.definition, {
      base: INSPECTOR_BASE,
      ws: false,
      auth: false,
      mcp: false,
    })
    const channels: ReturnType<typeof createSseRpcChannel>[] = []
    const snapshots: unknown[] = []
    function connect() {
      const channel = createSseRpcChannel({
        url: `http://localhost${INSPECTOR_BASE}__sse`,
        fetch: (input, init) => instance.handler(new Request(input, init)),
      })
      channels.push(channel)
      return createRpcClient<DevframeRpcServerFunctions, Partial<DevframeRpcClientFunctions>>(
        {
          'devframe:rpc:client-state:updated': async (_key, value) => {
            snapshots.push(value)
          },
        },
        { channel, rpcOptions: { timeout: 1000 } },
      )
    }
    try {
      await instance.ready
      inspector.addExpression('src/main.ts', expression)
      const first = connect()
      const second = connect()
      expect(await first.$call('devframe:rpc:server-state:get', INSPECTOR_STATE)).toEqual(
        inspector.state.value(),
      )
      await first.$call('devframe:rpc:server-state:subscribe', INSPECTOR_STATE)
      await second.$call('devframe:rpc:server-state:subscribe', INSPECTOR_STATE)
      inspector.invalidate('src/main.ts')
      await expect.poll(() => snapshots.length).toBe(2)
      expect(snapshots).toEqual([inspector.state.value(), inspector.state.value()])
      await expect(
        first.$call('devframe:rpc:server-state:set', INSPECTOR_STATE, {}, 'remote-write'),
      ).rejects.toThrow('read-only')
      channels[0].close()
      inspector.addExpression('src/new.ts', expression)
      const reconnected = connect()
      expect(await reconnected.$call('devframe:rpc:server-state:get', INSPECTOR_STATE)).toEqual(
        inspector.state.value(),
      )
    } finally {
      channels.forEach(channel => channel.close())
      await instance.close()
    }
  })

  it('reuses services per project, releases them after the last compiler closes, and skips disabled Inspector setup', async () => {
    function plugin(root: string, enabled = true) {
      const result = vite({ inspector: enabled }) as any
      result.configResolved({ root, command: 'serve' })
      return result
    }
    const first = plugin('/project-a')
    const second = plugin('/project-a')
    const other = plugin('/project-b')
    const disabled = plugin('/project-c', false)
    const host = { printUrls() {} }
    try {
      await first.configureServer(host)
      await second.configureServer(host)
      await other.configureServer(host)
      await disabled.configureServer(host)
      const calls = vi.mocked(createServer).mock.calls
      expect(calls).toHaveLength(3)
      const inspector = calls[0][2]!
      expect(calls[1][2]).not.toBe(inspector)
      expect(calls[2][2]).toBeUndefined()
      const filePaths = calls[0][4]!
      expect(filePaths).not.toBe(calls[1][4])
      await first.transform.handler('console.log(value)', '/project-a/src/main.ts')
      expect(inspector.state.value().expressionsMap['src/main.ts'].expressions).toEqual([
        expression,
      ])
      expect(filePaths.has('src/main.ts')).toBe(true)
      await first.closeWatcher()
      expect(filePaths.has('src/main.ts')).toBe(true)
      expect(inspector.state.value().expressionsMap['src/main.ts']).toBeDefined()
      await second.closeWatcher()
      expect(filePaths.size).toBe(0)
      expect(inspector.state.value().expressionsMap).toEqual({})
      const handle = await vi.mocked(createServer).mock.results[0].value
      expect(handle.close).toHaveBeenCalledOnce()
    } finally {
      await first.closeWatcher()
      await second.closeWatcher()
      await other.closeWatcher()
      await disabled.closeWatcher()
    }
  })

  it('collects expressions during transforms and skips collection when Inspector is disabled', async () => {
    const inspector = createInspector()
    const options = resolveOptions({ launchEditor: false })
    const context = {
      code: 'console.log(value)',
      id: '/project/src/main.ts',
      root: '/project',
      options,
      inspector,
    }
    await transform(context)
    expect(inspector.state.value().expressionsMap['src/main.ts'].expressions).toEqual([expression])
    inspector.clear()
    await transform({ ...context, options: { ...options, inspector: false } })
    expect(inspector.state.value().expressionsMap).toEqual({})
  })
})
