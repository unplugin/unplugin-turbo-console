import { createServer } from 'node:http'
import { cwd } from 'node:process'
import { resolve } from 'pathe'
import { createApp, eventHandler, fromNodeMiddleware, getQuery, toNodeListener } from 'h3'
import serveStatic from 'serve-static'

// @ts-expect-error any
import launch from 'launch-editor'
import { DIR_CLIENT } from '../dir'

export async function startServer(port: number = 3070) {
  try {
    await fetch(`http://localhost:${port}/health`)
  }
  catch (error) {
    const app = createApp()

    app.use('/client', fromNodeMiddleware(serveStatic(DIR_CLIENT)))

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
    createServer(toNodeListener(app)).listen(port)
  }
}
