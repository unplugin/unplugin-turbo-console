import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { checkPort, getRandomPort } from 'get-port-please'
import type { Context, Options } from './types'
import { DETAULT_OPTIONS, PLUGIN_NAME } from './core/constants'
import { startServer } from './core/server/index'
import { transformer } from './core/transform/transformer'
import { filter, getEnforce, printInfo } from './core/utils'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}, meta) => {
  const mergedOptions = {
    ...DETAULT_OPTIONS,
    ...options,
  }

  async function detectPort() {
    const isAvailable = await checkPort(mergedOptions.port!)
    if (!isAvailable)
      mergedOptions.port = await getRandomPort()
  }

  return {
    name: PLUGIN_NAME,
    enforce: getEnforce[meta.framework] || 'post',
    transformInclude(id) {
      return filter(id)
    },
    async transform(code, id) {
      const context: Context = {
        options: mergedOptions,
        pluginContext: this,
        code,
        id,
        meta,
      }

      const result = await transformer(context)

      return result
    },
    vite: {
      apply: 'serve',
      async configureServer(server) {
        if (options.disableLaunchEditor)
          return

        await detectPort()

        const _print = server.printUrls
        server.printUrls = () => {
          _print()
          printInfo(mergedOptions.port!)
        }

        startServer(mergedOptions.port)
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

          printInfo(mergedOptions.port!)
          startServer(mergedOptions.port)
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

          printInfo(mergedOptions.port!)
          startServer(mergedOptions.port)
        })
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
