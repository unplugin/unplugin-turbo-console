/// <reference types="node" />
import { createServer as createHttpServer } from 'node:http'
import { initDevframe } from 'devframe/initiate'
import type { DevframeRpcServerFunctions, DevframeRpcClientFunctions } from 'devframe'
import { createRpcClient } from 'devframe/rpc/client'
import { createSseRpcChannel } from 'devframe/rpc/transports/sse-client'
import { afterEach, expect, it, vi } from 'vite-plus/test'
import { createConsoleDevframe } from '../src/core/server/devframe'
import { createServer } from '../src/core/server'
import { resolveOptions } from '../src/core/options/resolve'
import { client, connectLogs, server } from '../src/helper'
import {
  initVirtualModulesGenerator,
  viteDevToolsVirtualModuleGenerator,
} from '../src/core/utils/virtualModules'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

it('allows log tokens only for forwarding and subscriptions; unsubscribed connections receive no logs', async () => {
  const instance = initDevframe(
    createConsoleDevframe(resolveOptions({}), process.cwd(), new Map(), undefined, 'test-token'),
    { base: '/', ws: false, mcp: false },
  )
  const channels: ReturnType<typeof createSseRpcChannel>[] = []
  function connect(receive: (method: string, message: string) => void) {
    const channel = createSseRpcChannel({
      url: 'http://localhost/__sse',
      fetch: (input, init) => instance.handler(new Request(input, init)),
    })
    channels.push(channel)
    return createRpcClient<DevframeRpcServerFunctions, Partial<DevframeRpcClientFunctions>>(
      { 'turbo-console:log': receive },
      { channel, rpcOptions: { timeout: 1000 } },
    )
  }
  const receive = vi.fn<(method: string, message: string) => void>()
  const otherReceive = vi.fn<(method: string, message: string) => void>()
  const log = vi.spyOn(console, 'info').mockImplementation(() => {})
  try {
    await instance.ready
    const rpc = connect(receive)
    const other = connect(otherReceive)
    await expect(other.$call('anonymous:turbo-console:subscribe-logs', 'wrong')).rejects.toThrow(
      'Invalid log token',
    )
    await rpc.$call('anonymous:turbo-console:subscribe-logs', 'test-token')
    await rpc.$call(
      'anonymous:turbo-console:log',
      'test-token',
      'client',
      'info',
      '["hello & # Chinese"]',
    )
    await vi.waitFor(() => expect(receive).toHaveBeenCalledWith('info', '["hello & # Chinese"]'))
    expect(otherReceive).not.toHaveBeenCalled()
    await rpc.$call('anonymous:turbo-console:log', 'test-token', 'server', 'info', '["hello"]')
    expect(log).toHaveBeenCalledWith(expect.any(String), 'hello')
    await expect(
      rpc.$call('anonymous:turbo-console:log', 'wrong', 'server', 'info', '[]'),
    ).rejects.toThrow('Invalid log token')
    await expect(
      rpc.$call('anonymous:turbo-console:log', 'test-token', 'server', 'info', '{}'),
    ).rejects.toThrow('array')
    await expect(
      rpc.$call('anonymous:turbo-console:log', 'test-token', 'server', 'clear' as any, '[]'),
    ).rejects.toThrow(/Invalid|Expected|validation/i)
    await expect(rpc.$call('turbo-console:resolve-file', 'file')).rejects.toThrow(/auth|trust/i)
  } finally {
    channels.forEach(channel => channel.close())
    await instance.close()
  }
})

it('falls back when the port is occupied, forwards helper logs both ways, and releases the port and token on close', async () => {
  vi.stubEnv('UNPLUGIN_TURBO_CONSOLE_LOG_URL', '')
  vi.stubEnv('UNPLUGIN_TURBO_CONSOLE_LOG_TOKEN', '')
  vi.stubEnv('UNPLUGIN_TURBO_CONSOLE_SERVER_PORT', '')
  const occupied = createHttpServer()
  await new Promise<void>((resolve, reject) => {
    occupied.once('error', reject)
    occupied.listen(0, '::1', resolve)
  })
  const port = (occupied.address() as { port: number }).port
  const options = resolveOptions({
    inspector: false,
    launchEditor: false,
    server: { host: '::1', port, allowedOrigins: ['http://192.168.1.10:5173'] },
  })
  let instance: Awaited<ReturnType<typeof createServer>>
  let browser: ReturnType<typeof connectLogs> | undefined
  try {
    instance = await createServer(options, () => {})
    expect(instance!.port).not.toBe(port)
    const url = process.env.UNPLUGIN_TURBO_CONSOLE_LOG_URL!
    const token = process.env.UNPLUGIN_TURBO_CONSOLE_LOG_TOKEN!
    const preflight = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'origin': 'http://localhost:5173',
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'content-type,x-birpc-session',
      },
    })
    expect(preflight.status).toBe(204)
    expect(preflight.headers.get('access-control-allow-origin')).toBe('http://localhost:5173')
    for (const [origin, status] of [
      ['http://192.168.1.10:5173', 204],
      ['http://192.168.1.10:5174', 403],
      ['https://untrusted.example', 403],
    ] as const) {
      const response = await fetch(url, {
        method: 'OPTIONS',
        headers: { origin, 'access-control-request-method': 'POST' },
      })
      expect(response.status).toBe(status)
      expect(response.headers.get('access-control-allow-origin')).toBe(
        status === 204 ? origin : null,
      )
    }
    const receive = vi.fn<(method: string, message: string) => void>()
    browser = connectLogs(url, token, receive)
    await browser.ready
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    await client.info('hello & # Chinese')
    await vi.waitFor(() => expect(receive).toHaveBeenCalledWith('info', '["hello & # Chinese"]'))
    vi.stubGlobal('window', { UNPLUGIN_TURBO_CONSOLE_LOG_CLIENT: browser })
    server.info('browser message')
    await vi.waitFor(() =>
      expect(info).toHaveBeenCalledWith(expect.stringContaining('Client Log'), 'browser message'),
    )
    const releasedPort = instance!.port
    await instance!.close()
    instance = undefined
    expect(process.env.UNPLUGIN_TURBO_CONSOLE_LOG_TOKEN).toBeUndefined()
    const rebound = createHttpServer()
    try {
      await new Promise<void>((resolve, reject) => {
        rebound.once('error', reject)
        rebound.listen(releasedPort, '::1', resolve)
      })
    } finally {
      await new Promise<void>(resolve => rebound.close(() => resolve()))
    }
  } finally {
    browser?.close()
    await instance?.close()
    await new Promise<void>(resolve => occupied.close(() => resolve()))
  }
})

it('does not inject the log connection when passLogs is disabled or in production', async () => {
  expect(initVirtualModulesGenerator('127.0.0.1', 3070, true, 'token')).toBe('')
  expect(initVirtualModulesGenerator('127.0.0.1', 3070, false)).toBe('')
  const instance = initDevframe(
    createConsoleDevframe(
      resolveOptions({ passLogs: false, launchEditor: false }),
      process.cwd(),
      new Map(),
      undefined,
      'token',
    ),
    { base: '/', ws: false, mcp: false },
  )
  try {
    const ctx = await instance.context
    expect(ctx.rpc.definitions.has('anonymous:turbo-console:log')).toBe(false)
  } finally {
    await instance.close()
  }
})

it('connects an app page to the configured server host', () => {
  const code = initVirtualModulesGenerator('192.168.1.10', 3070, false, 'token')
  expect(code).toContain('http://192.168.1.10:3070/__sse')
  expect(code).not.toContain('window.location')
  expect(viteDevToolsVirtualModuleGenerator('192.168.1.10', 3070, false)).toContain(
    'http://192.168.1.10:3070/inspector',
  )
})
