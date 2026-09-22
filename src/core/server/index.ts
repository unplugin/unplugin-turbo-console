import type { Inspector } from '../inspector'
import type { Options } from '../options/type'
import { randomUUID } from 'node:crypto'
import { cwd, env } from 'node:process'
import { createDevServer } from 'devframe/adapters/dev'
import { getPort } from 'get-port-please'
import { PLUGIN_SERVER_DEFAULT_PORT, PLUGIN_SERVER_PORT_RANGE } from '../constants'
import { INSPECTOR_BASE } from '../inspector'
import globalStore from '../utils/globalStore'
import { createConsoleDevframe } from './devframe'

export async function createServer(
  options: Options,
  printInfoFn: () => void,
  inspector?: Inspector,
  root = cwd(),
  filePaths = new Map<string, string>(),
  logToken: string = randomUUID(),
) {
  const { server, launchEditor, passLogs } = options
  if (launchEditor === false && passLogs === false && !inspector) return

  const { port, host } = server!
  const definition = createConsoleDevframe(options, root, filePaths, inspector, logToken)
  let currentPort = await getPort({
    host,
    port: port || PLUGIN_SERVER_DEFAULT_PORT,
    portRange: PLUGIN_SERVER_PORT_RANGE,
  })
  let started: Awaited<ReturnType<typeof createDevServer>>
  for (;;) {
    try {
      started = await createDevServer(definition, {
        host,
        port: currentPort,
        basePath: INSPECTOR_BASE,
        mcp: false,
        openBrowser: false,
      })
      break
    } catch (error) {
      const cause = error instanceof Error ? error.cause : undefined
      if ((cause as NodeJS.ErrnoException)?.code !== 'EADDRINUSE') throw error
      currentPort = await getPort({
        host,
        port: currentPort + 1,
        portRange: PLUGIN_SERVER_PORT_RANGE,
      })
    }
  }

  options.server!.port = currentPort
  globalStore.set('port', currentPort)
  env.UNPLUGIN_TURBO_CONSOLE_SERVER_PORT = currentPort.toString()
  if (passLogs) {
    env.UNPLUGIN_TURBO_CONSOLE_LOG_URL = `${started.origin}${INSPECTOR_BASE}__sse`
    env.UNPLUGIN_TURBO_CONSOLE_LOG_TOKEN = logToken
  }
  printInfoFn()

  return {
    port: currentPort,
    async close() {
      await started.close()
      if (env.UNPLUGIN_TURBO_CONSOLE_LOG_TOKEN === logToken) {
        delete env.UNPLUGIN_TURBO_CONSOLE_LOG_URL
        delete env.UNPLUGIN_TURBO_CONSOLE_LOG_TOKEN
      }
      inspector?.clear()
      filePaths.clear()
    },
  }
}
