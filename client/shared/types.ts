export interface ExpressionItem {
  code: string
  method: string
  line: number
  column: number
}

export interface ExpressionsMap {
  [key: string]: {
    filePath: string
    expressions: ExpressionItem[]
  }
}
export interface ExpressionsMapResponse {
  status: 'success' | 'error'
  expressionsMap: ExpressionsMap
  version: string
}
