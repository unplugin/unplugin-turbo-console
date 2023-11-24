import type { Plugin } from 'vite'
import sirv from 'sirv'
import { createFilter } from 'vite'
import { transformCode } from './transform'
import { DIR_CLIENT } from './dir'
import type { Context, Extra, Options } from './types'

function VitePluginTurboConsole(option?: Options, extra?: Extra): Plugin {
  let port = 5173
  let protocol = 'http'
  let base = '/'

  const include = /\.(vue|ts|tsx|js|jsx|svelte)$/
  // const include = /main.ts/
  const exclude = /node_modules/
  const filter = createFilter(include, exclude)

  const _option = {
    prefix: option?.prefix || '',
    suffix: option?.suffix || '',
    disableLaunchEditor: option?.disableLaunchEditor || false,
  }

  return {
    name: 'vite-plugin-turbo-console',
    enforce: 'post',
    apply: 'serve',
    configResolved(config) {
      port = config.server.port || extra?.nuxtDevServerPort || 5173
      protocol = config.server.https ? 'https' : 'http'
      base = config.base || '/'
    },
    async transform(code, id) {
      if ((filter(id))) {
        const context: Context = {
          pluginContext: this,
          option: _option,
          network: {
            port,
            protocol,
            base,
          },
        }

        const transformResults = await transformCode(code, id, context)
        return {
          code: transformResults.code,
          map: transformResults.map as any,
        }
      }
    },
    configureServer(server) {
      server.middlewares.use(`${base}__tc`, sirv(DIR_CLIENT, {
        single: true,
        dev: true,
      }))
    },
  }
}

export default VitePluginTurboConsole
