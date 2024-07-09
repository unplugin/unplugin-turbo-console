declare module '~console' {
  export const initWebSocket: () => void

  export const tConsole: {
    log: (...args: any[]) => void
    error: (...args: any[]) => void
    warn: (...args: any[]) => void
    info: (...args: any[]) => void
  }
}
