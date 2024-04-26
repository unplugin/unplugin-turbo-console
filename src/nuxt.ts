import { addVitePlugin, addWebpackPlugin, defineNuxtModule, logger } from '@nuxt/kit'
import vite from './vite'
import webpack from './webpack'
import type { Options } from './types'
import '@nuxt/schema'
import { NUXT_CONFIG_KEY, PLUGIN_NAME } from './core/constants'

export default defineNuxtModule<Options>({
  meta: {
    name: PLUGIN_NAME,
    configKey: NUXT_CONFIG_KEY,
  },
  defaults: {
    // ...default options
  },
  setup(options, _nuxt) {
    addVitePlugin(() => vite(options))
    addWebpackPlugin(() => webpack(options))

    // ...
  },
})
