import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Context, Options } from './types'
import { PLUGIN_NAME } from './core/constants'
import { startServer } from './core/server/index'
import { transformer } from './core/transform/transformer'
import { filter } from './core/utils'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}, meta) => {
  return {
    name: PLUGIN_NAME,
    enforce: meta.framework === 'webpack' ? 'pre' : 'post',
    transformInclude(id) {
      return filter(id)
    },
    transform(code, id) {
      const context: Context = {
        options,
        pluginContext: this,
        code,
        id,
        meta,
      }

      return transformer(context)
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
