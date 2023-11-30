import { createServer } from 'node:http'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { createApp, eventHandler, fromNodeMiddleware, getQuery, toNodeListener } from 'h3'
import serveStatic from 'serve-static'

// @ts-expect-error any
import launch from 'launch-editor'
import { DIR_CLIENT } from '../dir'

export async function startServer() {
  try {
    await fetch(`http://localhost:${3000}/health`)
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
          message: 'error',
        }
      }
    }))
    createServer(toNodeListener(app)).listen(3000)
  }
}
