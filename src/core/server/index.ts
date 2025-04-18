import type { Options } from '../../types'
import { createServer as _createServer } from 'node:http'
import { env } from 'node:process'
import wsAdapter from 'crossws/adapters/node'
import { createApp, toNodeListener } from 'h3'
import inspectorHandler from './_ws/inspector'
import filePathMap from './filePathMap'
import health from './health'
import { launchEditor as launchEditorHandler } from './launchEditor'
import send from './send'
import serveStatic from './serveStatic'
import ws from './ws'

export async function createServer(options: Options) {
  const { server, launchEditor, passLogs, inspector } = options
  const { port, host } = server!
  const _port = Number(port)!
  const specifiedEditor = typeof launchEditor === 'object' ? launchEditor.specifiedEditor : undefined
  try {
    await fetch(`http://${host}:${_port}/health`)
  }
  catch {
    if (launchEditor === false && passLogs === false && inspector === false)
      return false

    const app = createApp()

    // health
    app.use('/health', health)

    if (inspector)
      app.use('/_ws/inspector', inspectorHandler)

    if (passLogs) {
    // Pass server log route
      app.use('/ws', ws)
        .use('/send', send)
    }

    // Launch Editor server
    if (launchEditor) {
      app.use('/filePathMap', filePathMap)
        .use('/launchEditor', launchEditorHandler(specifiedEditor))
        .use('/', serveStatic)
    }

    const server = _createServer(toNodeListener(app))

    const { handleUpgrade } = wsAdapter(app.websocket)

    server.on('upgrade', handleUpgrade)

    env.UNPLUGIN_TURBO_CONSOLE_SERVER_PORT = _port.toString()

    server.listen(_port)
  }
}
