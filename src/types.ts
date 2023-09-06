import type MagicString from 'magic-string'

export interface Options {
  prefix?: string
  suffix?: string
}

export interface Position {
  offset: number
  line: number
}

export interface TraverseAST {
  node: any
  s: MagicString
  id: string
  options: Options
  offset?: number
}
