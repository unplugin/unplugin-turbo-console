import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { PLUGIN_NAME } from './core/constants'
import { filter } from './core/utils'
import { transformer } from './core/transform'

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
  name: PLUGIN_NAME,
  enforce: 'pre',
  transformInclude(id) {
    return filter(id)
  },
  transform(code, id) {
    return transformer(code, id, options || {})
  },
  vite: {
    apply: 'serve',
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
