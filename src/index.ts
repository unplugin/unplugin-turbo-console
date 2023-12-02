import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Context, Options } from './types'
import { DETAULT_OPTIONS, PLUGIN_NAME } from './core/constants'
import { startServer } from './core/server/index'
import { transformer } from './core/transform/transformer'
import { filter, getEnforce } from './core/utils'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}, meta) => {
  const mergedOptions = {
    ...DETAULT_OPTIONS,
    ...options,
  }
  return {
    name: PLUGIN_NAME,
    enforce: getEnforce[meta.framework] || 'post',
    transformInclude(id) {
      return id.includes('App.vue')
    },
    transform(code, id) {
      const context: Context = {
        options: mergedOptions,
        pluginContext: this,
        code,
        id,
        meta,
      }

      return transformer(context)
    },
    vite: {
      apply: 'serve',
      async configureServer() {
        startServer(mergedOptions.port)
      },
    },
    webpack(compiler) {
      if (compiler.options.mode === 'development') {
        compiler.hooks.done.tap(PLUGIN_NAME, async () => {
          startServer(mergedOptions.port)
        })
      }
    },
    rspack(compiler) {
      if (compiler.options.mode === 'development') {
        compiler.hooks.done.tap(PLUGIN_NAME, async () => {
          startServer(mergedOptions.port)
        })
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
