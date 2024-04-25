import { createServer as _createServer } from 'node:http'
import { createApp, toNodeListener } from 'h3'
import type { Options } from '../../types'
import serveStatic from './serveStatic'
import { launchEditor } from './launchEditor'
import filePathMap from './filePathMap'
import health from './health'

export async function createServer(options: Options) {
  const { port, specifiedEditor } = options
  const _port = Number(port) || 3070
  try {
    await fetch(`http://localhost:${_port}/health`)
  }
  catch (error) {
    const app = createApp()

    app.use('/health', health)
      .use('/filePathMap', filePathMap)
      .use('/launchEditor', launchEditor(specifiedEditor))
      .use('/', serveStatic)

    globalThis.UNPLUGIN_TURBO_CONSOLE_LAUNCH_SERVER = true

    _createServer(toNodeListener(app)).listen(_port)
  }
}
