import type { Options } from './core/options/type'
import { addImports, addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import { getPort } from 'get-port-please'
import { NUXT_CONFIG_KEY, PLUGIN_NAME, PLUGIN_SERVER_DEFAULT_PORT, PLUGIN_SERVER_PORT_RANGE } from './core/constants'
import vite from './vite'
import webpack from './webpack'

export default defineNuxtModule<Options>({
  meta: {
    name: PLUGIN_NAME,
    configKey: NUXT_CONFIG_KEY,
  },
  defaults: {},
  async setup(options, nuxt) {
    addImports({
      name: 'server',
      from: 'unplugin-turbo-console/helper',
    })

    nuxt.hook('nitro:config', (config) => {
      config.imports = config.imports || {}
      config.imports.imports = config.imports.imports || []
      config.imports.imports.push({
        name: 'client',
        from: 'unplugin-turbo-console/helper',
      })
    })

    options.server = {
      port: options.server?.port ?? PLUGIN_SERVER_DEFAULT_PORT,
      host: options.server?.host ?? '127.0.0.1',
    }

    options.server.port = await getPort({
      port: options.server.port!,
      portRange: PLUGIN_SERVER_PORT_RANGE,
    })

    // @ts-expect-error missing type
    nuxt.hook('devtools:customTabs', (tabs: any) => {
      tabs.push({
        name: 'unplugin-turbo-console-inspector',
        title: 'Console Inspector',
        icon: 'mdi:console',
        view: {
          type: 'iframe',
          src: `http://${options.server!.host}:${options.server!.port}/inspector`,
        },
      })
    })

    addVitePlugin(() => vite(options))
    addWebpackPlugin(() => webpack(options))
  },
})
