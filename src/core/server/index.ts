import { createServer } from 'node:http'
import { cwd } from 'node:process'
import { readFile, stat } from 'node:fs/promises'
import { join, resolve } from 'pathe'
import { createApp, eventHandler, getQuery, serveStatic, toNodeListener } from 'h3'

// @ts-expect-error any
import launch from 'launch-editor'
import { CLIENT_DIR } from '../dir'

export async function startServer(port: number = 3070) {
  try {
    await fetch(`http://localhost:${port}/health`)
  }
  catch (error) {
    const app = createApp()

    app.use('/health', eventHandler(() => {
      return {
        message: 'ok',
      }
    }))

    app.use('/__open-in-editor', eventHandler(async (event) => {
      try {
        const { file } = getQuery(event) as { file: string }
        launch(resolve(cwd(), file))
        return {
          message: 'ok',
        }
      }
      catch (error) {
        return {
          error: String(error),
        }
      }
    }))

    app.use('/', eventHandler((event) => {
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
    }))

    // @ts-expect-error any
    globalThis.UNPLUGIN_TURBO_CONSOLE_LAUNCH_SERVER = true

    createServer(toNodeListener(app)).listen(port)
  }
}
