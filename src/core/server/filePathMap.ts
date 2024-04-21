import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const filePathMap = globalThis.TurboConsoleFilePathMap || new Map()
  return Object.fromEntries(filePathMap)
})
