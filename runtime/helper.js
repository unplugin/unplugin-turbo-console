// turbo-console-disable
/* eslint-disable no-console */
import { env } from 'node:process'

/**
 * @typedef {'log' | 'error' | 'warn' | 'info' | 'table' | 'dir'} TCMethod
 */

/**
 * @typedef {Record<TCMethod, (...args: any[]) => void>} TConsole
 */

/**
 * Generates a fetch URL for logging messages.
 * @param {any[]} args - The arguments to log.
 * @param {TCMethod} method - The logging method.
 * @returns {string} The generated fetch URL.
 */
function generateFetchUrl(args, method) {
  const port = env.UNPLUGIN_TURBO_CONSOLE_SERVER_PORT

  if (!port) {
    console.warn(`[UNPLUGIN_TURBO_CONSOLE]: UNPLUGIN_TURBO_CONSOLE_SERVER_PORT env not found`)
  }

  return `http://localhost:${port || 3070}/send?m=${JSON.stringify(args)}&t=${method}`
}

/**
 * Handles client-side logging.
 * @param {TCMethod} method - The logging method.
 * @param {...any} args - The arguments to log.
 */
function handleClient(method, ...args) {
  console[method](...args)
  if (globalThis.window || env.NODE_ENV === 'production') {
    return
  }

  fetch(generateFetchUrl(args, method)).catch(() => {})
}

/** @type {TConsole} */
const client = {
  log: (...args) => handleClient('log', ...args),
  error: (...args) => handleClient('error', ...args),
  warn: (...args) => handleClient('warn', ...args),
  info: (...args) => handleClient('info', ...args),
  table: (...args) => handleClient('table', ...args),
  dir: (...args) => handleClient('dir', ...args),
}

/**
 * Handles server-side logging.
 * @param {TCMethod} method - The logging method.
 * @param {...any} args - The arguments to log.
 */
function handleServer(method, ...args) {
  console[method](...args)
  const socket = globalThis?.window?.UNPLUGIN_TURBO_CONSOLE_CLIENT_SOCKET
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ m: JSON.stringify(args), t: method }))
  }
}

/** @type {TConsole} */
const server = {
  log: (...args) => handleServer('log', ...args),
  error: (...args) => handleServer('error', ...args),
  warn: (...args) => handleServer('warn', ...args),
  info: (...args) => handleServer('info', ...args),
  table: (...args) => handleServer('table', ...args),
  dir: (...args) => handleServer('dir', ...args),
}

export { client, server }
