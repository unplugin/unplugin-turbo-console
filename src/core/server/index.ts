import type { Options } from '../options/type'
import { createServer as _createServer } from 'node:http'
import { env } from 'node:process'
import wsAdapter from 'crossws/adapters/node'
import { createApp, toNodeListener } from 'h3'
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
    let _port = Number(port)!
    const specifiedEditor = typeof launchEditor === 'object' ? launchEditor.specifiedEditor : undefined

    // check port availability, if not available, try to find available port
    const findAvailablePort = async (startPort: number): Promise<number> => {
        let currentPort = startPort
        // try 10 times to find available port
        for (let i = 0; i < 10; i++) {
            try {
                await fetch(`http://${host}:${currentPort}/health`)
                currentPort++
            } catch {
                // useable
                return currentPort
            }
        }
        return startPort
    }

     _port = await findAvailablePort(_port)

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

        env.UNPLUGIN_TURBO_CONSOLE_SERVER_PORT = _port.toString()

        server.listen(_port)

        console.log(`[unplugin-turbo-console] Server running on http://${host}:${_port}`)
    }
}
