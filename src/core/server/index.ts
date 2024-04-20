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

    app.use('/routeMap', eventHandler(() => {
      const routeMap = globalThis.TurboConsoleRouteMap || new Map()
      return Object.fromEntries(routeMap)
    }))

    app.use('/__open-in-editor', eventHandler(async (event) => {
      try {
        const { position } = getQuery(event) as { position: string }
        const routeMap = globalThis.TurboConsoleRouteMap

        if (!routeMap)
          throw new Error('routeMap is undefined')

        const parsed = position.split(',')
        const routeMapString = parsed[0]
        const line = parsed[1] || 1
        const column = parsed[2] || 1

        let filePath = ''

        for (const [key, value] of routeMap) {
          if (value === routeMapString) {
            filePath = key
            break
          }
        }

        launch(resolve(cwd(), `${filePath}:${line}:${column}`))
        return {
          status: 'success',
        }
      }
      catch (error) {
        return {
          status: 'error',
          message: String(error),
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
