import type { Options } from './core/options/type'
import { addImports, addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import { NUXT_CONFIG_KEY, PLUGIN_NAME } from './core/constants'
import vite from './vite'
import webpack from './webpack'
import '@nuxt/schema'

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

    addVitePlugin(() => vite(options))
    addWebpackPlugin(() => webpack(options))
  },
})
