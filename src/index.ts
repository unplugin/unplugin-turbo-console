import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Context, Options } from './types'
import { PLUGIN_NAME } from './core/constants'
import { filter } from './core/utils'
import { startServer } from './core/server/index'
import { viteTransform } from './core/transform'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}, meta) => {
  return {
    name: PLUGIN_NAME,
    enforce: meta.framework === 'vite' ? 'post' : 'pre',
    transformInclude(id) {
      return filter(id)
    },
    transform(code, id) {
      const context: Context = {
        options,
        pluginContext: this,
        code,
        id,
      }
      // return code
      return viteTransform(context)
    },
    vite: {
      apply: 'serve',
      configureServer() {
        startServer()
      },
    },
    webpack(compiler) {
      compiler.hooks.done.tap(PLUGIN_NAME, () => {
        startServer()
      })
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
