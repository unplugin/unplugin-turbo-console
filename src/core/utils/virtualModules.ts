export function initVirtualModulesGenerator(port: number, isProd: boolean, token?: string) {
  if (isProd || !token) return ''

  return /* js */ `
  import { connectLogs } from 'unplugin-turbo-console/helper'

  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    url.protocol = 'http:'
    url.port = '${port}'
    url.pathname = '/__sse'
    url.search = ''
    url.hash = ''
    window.UNPLUGIN_TURBO_CONSOLE_LOG_CLIENT?.close()
    const connection = connectLogs(url.href, ${JSON.stringify(token)}, (method, message) => {
      console[method]('%cServer Log', 'padding:3px 5px;border-radius:5px;background:#64748b;font-weight:600;color:white', ...JSON.parse(message))
    })
    window.UNPLUGIN_TURBO_CONSOLE_LOG_CLIENT = connection
    void connection.ready.catch(() => connection.close())
    window.addEventListener('pagehide', () => connection.close(), { once: true })
    if (import.meta.hot) import.meta.hot.dispose(() => connection.close())
  }
`
}

export function viteDevToolsVirtualModuleGenerator(port: number, isProd: boolean) {
  if (isProd) return ''

  return /* js */ `
  import { addCustomTab } from '@vue/devtools-api'

  const runtimeHost = globalThis.window.location.hostname

  addCustomTab({
    name: 'unplugin-turbo-console-inspector',
    title: 'Console Inspector',
    icon: 'baseline-terminal',
    view: {
      type: 'iframe',
      src: 'http://' + runtimeHost + ':${port}/inspector',
    },
    category: 'advanced',
  })
  `
}

export function themeDetectVirtualModule(isProd: boolean) {
  if (isProd) return ''

  return /* js */ `
  ;(() => {
    if (globalThis.matchMedia) {
      globalThis._UTC_DETECT_DARK = () => (globalThis.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  })()
  `
}

export function serverInfoVirtualModule(host: string, port: number) {
  return /* js */ `
  export const host = '${host}'
  export const port = ${port}
`
}
