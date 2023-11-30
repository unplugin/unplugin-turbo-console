import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { PLUGIN_NAME } from './core/constants'
import { filter } from './core/utils'
import { startServer } from './core/server/index'

export const unpluginFactory: UnpluginFactory<Options | undefined> = _options => ({
  name: PLUGIN_NAME,
  enforce: 'pre',
  transformInclude(id) {
    return filter(id)
  },
  transform(code, _id) {
    return code
    // return transformer(code, id, options || {})
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
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
