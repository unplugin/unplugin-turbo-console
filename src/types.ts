import { Options } from "./core/options/type"

export interface GenContext {
  options: Options
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
