type TCMethod = 'log' | 'error' | 'warn' | 'info' | 'table' | 'dir'

type TConsole = Record<TCMethod, (...args: any[]) => void>

export const client: TConsole
export const server: TConsole
