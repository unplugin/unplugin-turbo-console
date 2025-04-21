import type { Options } from './core/options/type'
import unplugin from '.'
import { PLUGIN_NAME } from './core/constants'

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
