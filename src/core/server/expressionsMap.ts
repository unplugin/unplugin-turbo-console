import { defineEventHandler } from 'h3'
import { version } from '../../../package.json'

export default defineEventHandler(async () => {
  try {
    const expressionsMap = globalThis.TurboConsoleExpressionsMap || new Map()

    return {
      status: 'success',
      expressionsMap: Object.fromEntries(expressionsMap),
      version,
    }
  }
  catch (error) {
    return {
      status: 'error',
      version,
      message: String(error),
    }
  }
})
