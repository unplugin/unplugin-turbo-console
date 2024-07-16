import { PLUGIN_NAME } from './core/constants'
import type { TCMethod, TConsole } from './types'

async function generateFetchUrl(args: any[], method: TCMethod) {
  const { env } = await import('node:process')
  const port = env.UNPLUGIN_TURBO_CONSOLE_SERVER_PORT

  if (!port)
    console.warn(`[${PLUGIN_NAME}]: UNPLUGIN_TURBO_CONSOLE_SERVER_PORT env not found`)

  return `http://localhost:${port || 3070}/send?m=${JSON.stringify(args)}&t=${method}`
}

async function handleClient(method: TCMethod, ...args: any[]) {
  (console as any)[method](...args)
  const { env } = await import('node:process')
  if (globalThis.window || env.NODE_ENV === 'production')
    return

  generateFetchUrl(args, method).then((url) => {
    fetch(url).catch(() => {})
  })
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
  (console as any)[method](...args)
  const socket: WebSocket | undefined = (globalThis?.window as any)?.UNPLUGIN_TURBO_CONSOLE_CLIENT_SOCKET
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ m: JSON.stringify(args), t: method }))
  }
}

export const server: TConsole = {
  log: (...args: any[]) => handleServer('log', ...args),
  error: (...args: any[]) => handleServer('error', ...args),
  warn: (...args: any[]) => handleServer('warn', ...args),
  info: (...args: any[]) => handleServer('info', ...args),
  table: (...args: any[]) => handleServer('table', ...args),
  dir: (...args: any[]) => handleServer('dir', ...args),
}
