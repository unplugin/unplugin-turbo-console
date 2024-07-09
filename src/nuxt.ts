import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import { checkPort, getRandomPort } from 'get-port-please'
import vite from './vite'
import webpack from './webpack'
import type { Options } from './types'
import '@nuxt/schema'
import { NUXT_CONFIG_KEY, PLUGIN_NAME, virtualModuleId } from './core/constants'
import { virtualModulesGenerator } from './core/virtualModules'

export default defineNuxtModule<Options>({
  meta: {
    name: PLUGIN_NAME,
    configKey: NUXT_CONFIG_KEY,
  },
  defaults: {
    port: 3070,
  },
  async setup(options, nuxt) {
    options.port ||= 3070
    const isAvailable = await checkPort(options.port!)
    if (!isAvailable)
      options.port = await getRandomPort()

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.virtual = nitroConfig.virtual || {}
      nitroConfig.virtual[virtualModuleId]
        = virtualModulesGenerator(options.port!)
    })

    addVitePlugin(() => vite(options))
    addWebpackPlugin(() => webpack(options))
  },
})
