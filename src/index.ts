import type { PluginOption } from 'vite'
import { transformCode } from './transform'

function VitePluginTurboConsole(): PluginOption {
  return {
    name: 'vite-plugin-turbo-console',
    enforce: 'pre',
    apply: 'serve',
    transform(code, id) {
      return transformCode(code, id)
    },
  }
}

export default VitePluginTurboConsole
export type { PluginOption }
