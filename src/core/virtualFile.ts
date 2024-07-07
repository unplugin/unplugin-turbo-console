export function virtualFileGenerator(port: number) {
  return /* ts */`
export function initWebSocket() {
  const socket = new WebSocket('ws://localhost:${port}/ws')

  socket.addEventListener('message', (event) => {
    try {
    // turbo-console-disable-next-line
    console.log(JSON.parse(event.data))

    } catch (error) {
      console.log(event.data)
    }
  })
}

export function log(...args) {
  console.log(...args)
  fetch('http://localhost:${port}/send?m=' + JSON.stringify(args))
}
`
}
