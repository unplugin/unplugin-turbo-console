export function virtualModulesGenerator(port: number) {
  return /* ts */`
export function initWebSocket() {
  
  const socket = new WebSocket('ws://localhost:${port}/ws')

  socket.addEventListener('message', (event) => {
    try {
      const { m, t } = JSON.parse(event.data)
      
      console[t]('%cServer Log','padding:4px;border-radius:3px;background:#9ca3af;font-weight:600;color:white',...JSON.parse(m))

    } catch (error) {
      console.log(error)
    }
  })
}

const generateFetchUrl = (args, method) => {
  return 'http://localhost:${port}/send?m=' + JSON.stringify(args) + '&t=' + method
}

export const tConsole = {};

['log', 'error', 'warn', 'info'].forEach(method => {
  tConsole[method] = (...args) => {
    console[method](...args);
    fetch(generateFetchUrl(args, method))
  };
});
`
}
