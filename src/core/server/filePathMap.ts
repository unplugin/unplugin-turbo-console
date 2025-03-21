import { defineEventHandler } from 'h3'
import { version } from '../../../package.json'

export default defineEventHandler(async () => {
  try {
    const filePathMap = globalThis.TurboConsoleFilePathMap || new Map()
    const expressionsMap = globalThis.TurboConsoleExpressionsMap || new Map()

    return {
      status: 'success',
      filePathMap: Object.fromEntries(filePathMap),
      expressionsMap: Object.fromEntries(expressionsMap),
      version,
    }
  }
  catch (error) {
    return {
      status: 'error',
      filePathMap: {},
      version,
      message: String(error),
    }
  }
})
