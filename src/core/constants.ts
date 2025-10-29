export const PLUGIN_NAME = 'unplugin-turbo-console'
export const NUXT_CONFIG_KEY = 'turboConsole'

export const VirtualModules = {
  Init: '~console',
  ThemeDetect: '~console/theme-detect',
  VueDevTools: '~console/vue-devtools',
  ServerInfo: '~console/server-info',
}

export const PLUGIN_SERVER_DEFAULT_PORT = 3070
export const PLUGIN_SERVER_PORT_RANGE: [number, number] = [PLUGIN_SERVER_DEFAULT_PORT, 6000]
