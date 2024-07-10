import { createServer as _createServer } from 'node:http'
import { env } from 'node:process'
import { createApp, toNodeListener } from 'h3'
import wsAdapter from 'crossws/adapters/node'
import type { Options } from '../../types'
import serveStatic from './serveStatic'
import { launchEditor } from './launchEditor'
import filePathMap from './filePathMap'
import health from './health'
import ws from './ws'
import send from './send'

export async function createServer(options: Options) {
  const { port, specifiedEditor } = options
  const _port = Number(port) || 3070
  try {
    await fetch(`http://localhost:${_port}/health`)
  }
  catch (error) {
    const app = createApp()

    if (options.passServerLogs === false && options.disableLaunchEditor === true)
      return false

    // health
    app.use('/health', health)

    if (options.passServerLogs) {
    // Pass server log route
      app.use('/ws', ws)
        .use('/send', send)
    }

    // Launch Editor server
    if (!options.disableLaunchEditor) {
      app.use('/filePathMap', filePathMap)
        .use('/launchEditor', launchEditor(specifiedEditor))
        .use('/', serveStatic)
    }

    const server = _createServer(toNodeListener(app))

    const { handleUpgrade } = wsAdapter(app.websocket)

    server.on('upgrade', handleUpgrade)

    env.UNPLUGIN_TURBO_CONSOLE_SERVER_PORT = _port.toString()

    server.listen(_port)
  }
}
