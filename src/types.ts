import type { Inspector } from './core/inspector'
import type { Options } from './core/options/type'

export interface GenContext {
  options: Options
  filePaths?: Map<string, string>
  inspector?: Inspector
  root?: string
  originalLine: number
  originalColumn: number
  argsName: string
  argType: string
  id: string
  consoleMethod: string
}

export type Compiler = 'vanilla' | 'vue' | 'svelte'

export interface Context {
  code: string
  id: string
  options: Options
  filePaths?: Map<string, string>
  inspector?: Inspector
  root?: string
}

export type Lang = 'js' | 'jsx' | 'ts' | 'tsx' | undefined

export interface CompileResult {
  script: string
  lang: Lang
  offset: number
  line: number
}

export type TCMethod = 'log' | 'error' | 'warn' | 'info' | 'table' | 'dir'

export type TConsole = Record<TCMethod, (...args: any[]) => void>

export interface ExpressionMeta {
  code: string
  method: string
  line: number
  column: number
}

export interface ExpressionsMap {
  id: string
  filePath: string
  expressions: ExpressionMeta[]
}

export interface InspectorState {
  timestamp: number
  version: string
  expressionsMap: Record<string, ExpressionsMap>
}

declare module 'devframe' {
  interface DevframeRpcServerFunctions {
    'anonymous:turbo-console:subscribe-logs': (token: string) => void
    'anonymous:turbo-console:log': (
      token: string,
      target: 'client' | 'server',
      method: TCMethod,
      message: string,
    ) => Promise<void>
    'turbo-console:resolve-file': (id: string) => string
  }
  interface DevframeRpcClientFunctions {
    'turbo-console:log': (method: TCMethod, message: string) => void
  }
  interface DevframeRpcSharedStates {
    'turbo-console:expressions': InspectorState
  }
}
