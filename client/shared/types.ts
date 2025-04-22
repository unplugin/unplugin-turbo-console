export interface ExpressionItem {
  code: string
  method: string
  line: number
  column: number
}

export interface ExpressionsMap {
  [key: string]: {
    id: string
    filePath: string
    expressions: ExpressionItem[]
  }
}
export interface ExpressionsMapResponse {
  timestamp: number
  status: 'success' | 'error'
  expressionsMap: ExpressionsMap
  version: string
}
