import { readFile, stat } from 'node:fs/promises'
import { defineEventHandler, serveStatic } from 'h3'
import { join } from 'pathe'
import { CLIENT_DIR } from '../dir'

export default defineEventHandler((event) => {
  return serveStatic(event, {
    getContents: id => readFile(join(CLIENT_DIR, id)),
    getMeta: async (id) => {
      const stats = await stat(join(CLIENT_DIR, id)).catch(() => {})

      if (!stats || !stats.isFile())
        return

      return {
        size: stats.size,
        mtime: stats.mtimeMs,
      }
    },
  })
})
