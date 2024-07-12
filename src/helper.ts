/* eslint-disable no-console */
import { env } from 'node:process'
import { PLUGIN_NAME } from './core/constants'
import type { TCMethod } from './types'

function generateFetchUrl(args: any[], method: TCMethod) {
  const port = env.UNPLUGIN_TURBO_CONSOLE_SERVER_PORT

  if (!port)
    console.warn(`[${PLUGIN_NAME}]: UNPLUGIN_TURBO_CONSOLE_SERVER_PORT env not found`)

  return `http://localhost:${port || 3070}/send?m=${JSON.stringify(args)}&t=${method}`
}

export const ClientConsole: Record<TCMethod, (...args: any[]) => void> = {
  log: (...args: any[]) => {
    // turbo-console-disable-next-line
    console.log(...args)
    if (globalThis.window)
      return
    fetch(generateFetchUrl(args, 'log'))
  },
  error: (...args: any[]) => {
    console.error(...args)
    if (globalThis.window)
      return
    fetch(generateFetchUrl(args, 'error'))
  },
  warn: (...args: any[]) => {
    console.warn(...args)
    if (globalThis.window)
      return
    fetch(generateFetchUrl(args, 'warn'))
  },
  info: (...args: any[]) => {
    console.info(...args)
    if (globalThis.window)
      return
    fetch(generateFetchUrl(args, 'info'))
  },
}

const socket = (globalThis?.window as any)?.UNPLUGIN_TURBO_CONSOLE_CLIENT_SOCKET
export const ServerConsole: Record<TCMethod, (...args: any[]) => void> = {
  log: (...args: any[]) => {
    console.log(...args)
    if (socket) {
      socket.send(JSON.stringify({ m: JSON.stringify(args), t: 'log' }))
    }
  },
  error: (...args: any[]) => {
    console.error(...args)
    if (socket) {
      socket.send(JSON.stringify({ m: JSON.stringify(args), t: 'error' }))
    }
  },
  warn: (...args: any[]) => {
    console.warn(...args)
    if (socket) {
      socket.send(JSON.stringify({ m: JSON.stringify(args), t: 'warn' }))
    }
  },
  info: (...args: any[]) => {
    console.info(...args)
    if (socket) {
      socket.send(JSON.stringify({ m: JSON.stringify(args), t: 'info' }))
    }
  },
}
