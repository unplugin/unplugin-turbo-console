declare module '~console/client' {
  import type { TCMethod } from './types'

  export const initWebSocket: () => void
  export const tConsole: Record<TCMethod, (...args: any[]) => void>
}
