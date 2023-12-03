import type { Options } from './types'
import { PLUGIN_NAME } from './core/constants'
import unplugin from '.'

export default function (options: Options) {
  return {
    name: PLUGIN_NAME,
    hooks: {
      'astro:config:setup': async (astro: any) => {
        astro.config.vite.plugins ||= []
        astro.config.vite.plugins.push(unplugin.vite(options))
      },
    },
  }
}
