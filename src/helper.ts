import { env } from 'node:process'
import { PLUGIN_NAME } from './core/constants'
import type { TCMethod, TConsole } from './types'

function generateFetchUrl(args: any[], method: TCMethod) {
  const port = env.UNPLUGIN_TURBO_CONSOLE_SERVER_PORT

  if (!port)
    console.warn(`[${PLUGIN_NAME}]: UNPLUGIN_TURBO_CONSOLE_SERVER_PORT env not found`)

  return `http://localhost:${port || 3070}/send?m=${JSON.stringify(args)}&t=${method}`
}

function handleClientConsole(method: TCMethod, ...args: any[]) {
  (console as any)[method](...args)
  if (globalThis.window)
    return
  fetch(generateFetchUrl(args, method))
}

export const ClientConsole: TConsole = {
  log: (...args: any[]) => handleClientConsole('log', ...args),
  error: (...args: any[]) => handleClientConsole('error', ...args),
  warn: (...args: any[]) => handleClientConsole('warn', ...args),
  info: (...args: any[]) => handleClientConsole('info', ...args),
  table: (...args: any[]) => handleClientConsole('table', ...args),
  dir: (...args: any[]) => handleClientConsole('dir', ...args),
}

function handleServerConsole(method: TCMethod, ...args: any[]) {
  (console as any)[method](...args)
  const socket = (globalThis?.window as any)?.UNPLUGIN_TURBO_CONSOLE_CLIENT_SOCKET
  if (socket) {
    socket.send(JSON.stringify({ m: JSON.stringify(args), t: method }))
  }
}

export const ServerConsole: TConsole = {
  log: (...args: any[]) => handleServerConsole('log', ...args),
  error: (...args: any[]) => handleServerConsole('error', ...args),
  warn: (...args: any[]) => handleServerConsole('warn', ...args),
  info: (...args: any[]) => handleServerConsole('info', ...args),
  table: (...args: any[]) => handleServerConsole('table', ...args),
  dir: (...args: any[]) => handleServerConsole('dir', ...args),
}
