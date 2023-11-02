import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import type { Options } from './types'
import plugin from './index'

export {
  Options as ModuleOptions,
}

export default defineNuxtModule<Options>({
  meta: {
    name: 'vite-plugin-turbo-console',
    configKey: 'turboConsole',
  },
  setup(moduleOptions, nuxt) {
    addVitePlugin(() => plugin(moduleOptions, {
      nuxtDevServerPort: nuxt.options.devServer.port,
    }))
  },
}) as any
