import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { createApp, eventHandler, serveStatic, toNodeListener } from 'h3'
import { DIR_CLIENT } from './../dir'

export async function startServer() {
  try {
    await fetch(`http://localhost:${3000}/health`)
  }
  catch (error) {
    const app = createApp()
    app.use('/client', eventHandler(async (event) => {
      await serveStatic(event, {
        fallthrough: true,
        getContents: () => readFile(DIR_CLIENT),
        getMeta: async () => {
          return {
            type: 'text/html',
            encoding: 'utf8',
            size: (await stat(DIR_CLIENT)).size,
          }
        },
        indexNames: [`${DIR_CLIENT}/index.html`],
      })
    }))

    app.use('/health', eventHandler(() => {
      return {
        message: 'ok',
      }
    }))

    app.use('/__open-in-editor', eventHandler(async () => {
      return {
        body: 'ok',
      }
    }))
    createServer(toNodeListener(app)).listen(3000)
  }
}
