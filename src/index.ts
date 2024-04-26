import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { checkPort, getRandomPort } from 'get-port-please'
import type { Context, Options } from './types'
import { PLUGIN_NAME } from './core/constants'
import { createServer } from './core/server/index'
import { filter, printInfo } from './core/utils'
import { resolveOptions } from './core/options'
import { transform } from './core/transform/index'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (rawOptions = {}) => {
  const options = resolveOptions(rawOptions)

  async function detectPort() {
    const isAvailable = await checkPort(options.port!)
    if (!isAvailable)
      options.port = await getRandomPort()
  }

  async function startLaunchServer() {
    // avoid start server multiple times
    if (!globalThis.UNPLUGIN_TURBO_CONSOLE_LAUNCH_SERVER) {
      await detectPort()
      printInfo(options.port!)
      createServer(options)
    }
  }

  return {
    name: PLUGIN_NAME,
    enforce: 'pre',
    transformInclude(id) {
      return filter(id)
    },
    async transform(code, id) {
      const context: Context = {
        code,
        id,
        options,
      }

      return await transform(context)
    },
    vite: {
      async configureServer(server) {
        if (options.disableLaunchEditor)
          return

        if (!globalThis.UNPLUGIN_TURBO_CONSOLE_LAUNCH_SERVER) {
          await detectPort()
          createServer(options)

          const _print = server.printUrls

          const NuxtKit = await import('@nuxt/kit')
          if (NuxtKit) {
            printInfo(options.port!)
          }
          else {
            server.printUrls = () => {
              _print()
              printInfo(options.port!)
            }
          }
        }
      },
    },
    farm: {
      configureDevServer() {
        if (options.disableLaunchEditor)
          return

        startLaunchServer()
      },
    },
    webpack(compiler) {
      if (options.disableLaunchEditor)
        return

      if (compiler.options.mode === 'development') {
        compiler.hooks.done.tap(PLUGIN_NAME, async (state) => {
          if (state.hasErrors())
            return

          startLaunchServer()
        })
      }
    },
    rspack(compiler) {
      if (options.disableLaunchEditor)
        return

      if (compiler.options.mode === 'development') {
        compiler.hooks.done.tap(PLUGIN_NAME, async (state) => {
          if (state.hasErrors())
            return

          startLaunchServer()
        })
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
