import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { checkPort, getRandomPort } from 'get-port-please'
import type { Context, Options } from './types'
import { PLUGIN_NAME } from './core/constants'
import { startServer } from './core/server/index'
import { transformer } from './core/transform/transformer'
import { filter, getEnforce, printInfo } from './core/utils'
import { resolveOptions } from './core/options'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (rawOptions = {}, meta) => {
  const options = resolveOptions(rawOptions)

  async function detectPort() {
    const isAvailable = await checkPort(options.port!)
    if (!isAvailable)
      options.port = await getRandomPort()
  }

  return {
    name: PLUGIN_NAME,
    enforce: getEnforce[meta.framework] || 'post',
    transformInclude(id) {
      return filter(id)
    },
    async transform(code, id) {
      const context: Context = {
        options,
        pluginContext: this,
        code,
        id,
        meta,
      }

      const result = await transformer(context)

      return result
    },
    vite: {
      async configureServer(server) {
        if (options.disableLaunchEditor)
          return

        await detectPort()

        const _print = server.printUrls
        server.printUrls = () => {
          _print()
          printInfo(options.port!)
        }

        startServer(options.port)
      },
    },
    async webpack(compiler) {
      if (options.disableLaunchEditor)
        return

      await detectPort()

      if (compiler.options.mode === 'development') {
        compiler.hooks.done.tap(PLUGIN_NAME, (state) => {
          if (state.hasErrors())
            return

          printInfo(options.port!)
          startServer(options.port)
        })
      }
    },
    async rspack(compiler) {
      if (options.disableLaunchEditor)
        return

      await detectPort()

      if (compiler.options.mode === 'development') {
        compiler.hooks.done.tap(PLUGIN_NAME, (state) => {
          if (state.hasErrors())
            return

          printInfo(options.port!)
          startServer(options.port)
        })
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
