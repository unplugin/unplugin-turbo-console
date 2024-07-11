export function clientVirtualModulesGenerator(port: number) {
  return /* js */`
  ;(() => {
    if (globalThis.window) {
      const socket = new WebSocket('ws://localhost:${port}/ws')
      globalThis.window.UNPLUGIN_TURBO_CONSOLE_CLIENT_SOCKET = socket
      socket.addEventListener('message', (event) => {
        try {
          const { m, t } = JSON.parse(event.data)
  
          console[t]('%cServer Log', 'padding:4px;border-radius:3px;background:#9ca3af;font-weight:600;color:white', ...JSON.parse(m))
        }
        catch (error) {
          console.log(error)
        }
      })
    }
  })()
`
}

export function helperVirtualModulesGenerator() {
  return /* js */`
  const socket = globalThis?.window?.UNPLUGIN_TURBO_CONSOLE_CLIENT_SOCKET

  export const tConsole = {
    log(...args) {
      console.log(...args)
      if (socket) {
        socket.send(JSON.stringify({ m: JSON.stringify(args), t: 'log' }))
      }
    },
    error(...args) {
      console.error(...args)
      if (socket) {
        socket.send(JSON.stringify({ m: JSON.stringify(args), t: 'error' }))
      }
    },
    warn(...args) {
      console.warn(...args)
      if (socket) {
        socket.send(JSON.stringify({ m: JSON.stringify(args), t: 'warn' }))
      }
    },
    info(...args) {
      console.info(...args)
      if (socket) {
        socket.send(JSON.stringify({ m: JSON.stringify(args), t: 'info' }))
      }
    },
  }
  `
}
