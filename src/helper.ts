/* eslint-disable no-console */

import { env } from 'node:process'

type TCMethod = 'log' | 'error' | 'warn' | 'info'

function generateFetchUrl(args: any[], method: TCMethod) {
  const port = env.UNPLUGIN_TURBO_CONSOLE_SERVER_PORT
  return `http://localhost:${port}/send?m=${JSON.stringify(args)}&t=${method}`
}

export const tConsole: Record<TCMethod, (...args: any[]) => void> = {
  log: (...args: any[]) => {
    console.log(...args)
    fetch(generateFetchUrl(args, 'log'))
  },
  error: (...args: any[]) => {
    console.error(...args)
    fetch(generateFetchUrl(args, 'error'))
  },
  warn: (...args: any[]) => {
    console.warn(...args)
    fetch(generateFetchUrl(args, 'warn'))
  },
  info: (...args: any[]) => {
    console.info(...args)
    fetch(generateFetchUrl(args, 'info'))
  },
}
