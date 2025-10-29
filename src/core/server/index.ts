import type { Options } from '../options/type'
import { createServer as _createServer } from 'node:http'
import { env } from 'node:process'
import wsAdapter from 'crossws/adapters/node'
import { getPort } from 'get-port-please'
import { createApp, toNodeListener } from 'h3'
import { PLUGIN_SERVER_DEFAULT_PORT, PLUGIN_SERVER_PORT_RANGE } from '../constants'
import globalStore from '../utils/globalStore'
import filePathMap from './filePathMap'
import health from './health'
import { launchEditor as launchEditorHandler } from './launchEditor'
import send from './send'
import serveStatic from './serveStatic'
import inspectorHandler from './ws/inspector'
import passLogsHandler from './ws/passLogs'

export async function createServer(options: Options) {
  const { server, launchEditor, passLogs, inspector } = options
  const { port, host } = server!
  const specifiedEditor = typeof launchEditor === 'object' ? launchEditor.specifiedEditor : undefined

  const safePort = await getPort({
    port: port || PLUGIN_SERVER_DEFAULT_PORT,
    portRange: PLUGIN_SERVER_PORT_RANGE,
  })

  try {
    await fetch(`http://${host}:${safePort}/health`)
  }
  catch {
    if (launchEditor === false && passLogs === false && inspector === false)
      return false

    const app = createApp()

    // health
    app.use('/health', health)

    if (inspector)
      app.use('/ws/inspector', inspectorHandler)

    if (passLogs) {
    // Pass server log route
      app.use('/ws/passLogs', passLogsHandler)
        .use('/send', send)
    }

    // Launch Editor server
    if (launchEditor) {
      app.use('/filePathMap', filePathMap)
        .use('/launchEditor', launchEditorHandler(specifiedEditor))
    }

    if (launchEditor || inspector)
      app.use('/', serveStatic)

    const server = _createServer(toNodeListener(app))

    const { handleUpgrade } = wsAdapter(app.websocket as any)

    server.on('upgrade', handleUpgrade)

    let currentPort = safePort

    server.on('error', async (error: any) => {
      if (error && error.code === 'EADDRINUSE') {
        currentPort = await getPort({
          port: currentPort || PLUGIN_SERVER_DEFAULT_PORT,
          portRange: PLUGIN_SERVER_PORT_RANGE,
        })
        server.listen(currentPort)
      }
    })

    server.on('listening', () => {
      // sync final bound port back to options and globals
      options.server!.port = currentPort
      globalStore.set('port', currentPort)
      env.UNPLUGIN_TURBO_CONSOLE_SERVER_PORT = currentPort.toString()
    })

    server.listen(currentPort)
  }
}
