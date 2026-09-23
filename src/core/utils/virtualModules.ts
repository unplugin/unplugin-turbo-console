export function initVirtualModulesGenerator(
  host: string,
  port: number,
  isProd: boolean,
  token?: string,
) {
  if (isProd || !token) return ''

  return /* js */ `
  import { connectLogs } from 'unplugin-turbo-console/helper'

  if (typeof window !== 'undefined') {
    const url = ${JSON.stringify(`http://${host.includes(':') ? `[${host}]` : host}:${port}/__sse`)}
    window.UNPLUGIN_TURBO_CONSOLE_LOG_CLIENT?.close()
    const connection = connectLogs(url, ${JSON.stringify(token)}, (method, message) => {
      console[method]('%cServer Log', 'padding:3px 5px;border-radius:5px;background:#64748b;font-weight:600;color:white', ...JSON.parse(message))
    })
    window.UNPLUGIN_TURBO_CONSOLE_LOG_CLIENT = connection
    void connection.ready.catch(() => connection.close())
    window.addEventListener('pagehide', () => connection.close(), { once: true })
    if (import.meta.hot) import.meta.hot.dispose(() => connection.close())
  }
`
}

export function viteDevToolsVirtualModuleGenerator(host: string, port: number, isProd: boolean) {
  if (isProd) return ''

  return /* js */ `
  import { addCustomTab } from '@vue/devtools-api'

  addCustomTab({
    name: 'unplugin-turbo-console-inspector',
    title: 'Console Inspector',
    icon: 'baseline-terminal',
    view: {
      type: 'iframe',
      src: ${JSON.stringify(`http://${host.includes(':') ? `[${host}]` : host}:${port}/inspector`)},
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
