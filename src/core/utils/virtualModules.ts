export function initVirtualModulesGenerator(host: string, port: number, isProd: boolean) {
  if (isProd)
    return ''

  return /* js */`
  ;(() => {
    if (globalThis.window) {
      const socket = new WebSocket('ws://${host}:${port}/ws/passLogs')
      globalThis.window.UNPLUGIN_TURBO_CONSOLE_CLIENT_SOCKET = socket
      socket.addEventListener('message', (event) => {
        try {
          const { m, t } = JSON.parse(event.data)
  
          console[t]('%cServer Log', 'padding:3px 5px;border-radius:5px;background:#64748b;font-weight:600;color:white', ...JSON.parse(m))
        }
        catch (error) {
          console.log(error)
        }
      })
    }
  })()
`
}

export function viteDevToolsVirtualModuleGenerator(host: string, port: number, isProd: boolean) {
  if (isProd)
    return ''

  return /* js */`
  import { addCustomTab } from '@vue/devtools-api'

  addCustomTab({
    name: 'unplugin-turbo-console-inspector',
    title: 'Console Inspector',
    icon: 'baseline-terminal',
    view: {
      type: 'iframe',
      src: 'http://${host}:${port}/inspector',
    },
    category: 'advanced',
  })
  `
}

export function themeDetectVirtualModule(isProd: boolean) {
  if (isProd)
    return ''

  return /* js */`
  ;(() => {
    if (globalThis.matchMedia) {
      globalThis._UTC_DETECT_DARK = () => (globalThis.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  })()
  `
}

export function serverInfoVirtualModule(host: string, port: number) {
  return /* js */`
  export const host = '${host}'
  export const port = ${port}
`
}
