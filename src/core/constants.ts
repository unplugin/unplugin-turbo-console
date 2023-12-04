import type { Options } from '../types'

export const PLUGIN_NAME = 'unplugin-turbo-console'
export const NUXT_CONFIG_KEY = 'turboConsole'

export const DETAULT_OPTIONS: Options = {
  prefix: '',
  suffix: '',
  disableLaunchEditor: false,
  disableHighlight: false,
  port: 3070,
}
