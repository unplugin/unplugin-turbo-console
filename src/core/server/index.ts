import { createServer as _createServer } from 'node:http'
import { createApp, toNodeListener } from 'h3'
import serveStatic from './serveStatic'
import launchEditor from './launchEditor'
import filePathMap from './filePathMap'
import health from './health'

export async function createServer(port: number = 3070) {
  try {
    await fetch(`http://localhost:${port}/health`)
  }
  catch (error) {
    const app = createApp()

    app.use('/health', health)
      .use('/filePathMap', filePathMap)
      .use('/launchEditor', launchEditor)
      .use('/', serveStatic)

    globalThis.UNPLUGIN_TURBO_CONSOLE_LAUNCH_SERVER = true

    _createServer(toNodeListener(app)).listen(port)
  }
}
