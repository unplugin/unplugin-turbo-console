import { defineEventHandler } from 'h3'
import { version } from '../../../package.json'

export default defineEventHandler(async () => {
  try {
    const filePathMap = globalThis.TurboConsoleFilePathMap || new Map()
    return {
      status: 'success',
      filePathMap: Object.fromEntries(filePathMap),
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
