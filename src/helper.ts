import type { TCMethod, TConsole } from './types'
import type { DevframeRpcServerFunctions, DevframeRpcClientFunctions } from 'devframe'
import { createRpcClient } from 'devframe/rpc/client'
import { createSseRpcChannel } from 'devframe/rpc/transports/sse-client'

export function connectLogs(
  url: string,
  token: string,
  receive?: (method: TCMethod, message: string) => void,
) {
  const channel = createSseRpcChannel({ url })
  const rpc = createRpcClient<DevframeRpcServerFunctions, Partial<DevframeRpcClientFunctions>>(
    receive ? { 'turbo-console:log': receive } : {},
    { channel, rpcOptions: { timeout: 3000 } },
  )
  const ready = receive
    ? rpc.$call('anonymous:turbo-console:subscribe-logs', token)
    : Promise.resolve()
  return {
    ready,
    close: () => channel.close(),
    async send(target: 'client' | 'server', method: TCMethod, args: any[]) {
      await ready
      await rpc.$call('anonymous:turbo-console:log', token, target, method, JSON.stringify(args))
    },
  }
}

async function handleClient(method: TCMethod, ...args: any[]) {
  ;(console as any)[method](...args)
  if (typeof window !== 'undefined') return
  const { env } = await import('node:process')
  if (env.NODE_ENV === 'production') return
  const url = env.UNPLUGIN_TURBO_CONSOLE_LOG_URL
  const token = env.UNPLUGIN_TURBO_CONSOLE_LOG_TOKEN
  if (!url || !token) return
  // ponytail: 每次转发使用短连接；高频日志需要时再复用连接并增加空闲回收。
  const connection = connectLogs(url, token)
  try {
    await connection.send('client', method, args)
  } catch {
    // 转发失败时，本地日志仍然保留。
  } finally {
    connection.close()
  }
}

export const client: TConsole = {
  log: (...args: any[]) => handleClient('log', ...args),
  error: (...args: any[]) => handleClient('error', ...args),
  warn: (...args: any[]) => handleClient('warn', ...args),
  info: (...args: any[]) => handleClient('info', ...args),
  table: (...args: any[]) => handleClient('table', ...args),
  dir: (...args: any[]) => handleClient('dir', ...args),
}

function handleServer(method: TCMethod, ...args: any[]) {
  ;(console as any)[method](...args)
  const connection: ReturnType<typeof connectLogs> | undefined = (globalThis.window as any)
    ?.UNPLUGIN_TURBO_CONSOLE_LOG_CLIENT
  void connection?.send('server', method, args).catch(() => {})
}

export const server: TConsole = {
  log: (...args: any[]) => handleServer('log', ...args),
  error: (...args: any[]) => handleServer('error', ...args),
  warn: (...args: any[]) => handleServer('warn', ...args),
  info: (...args: any[]) => handleServer('info', ...args),
  table: (...args: any[]) => handleServer('table', ...args),
  dir: (...args: any[]) => handleServer('dir', ...args),
}
