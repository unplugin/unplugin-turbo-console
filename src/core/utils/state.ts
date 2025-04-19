import type { ExpressionMeta, ExpressionsMap } from '../../types'
import { randomUUID } from 'node:crypto'
import { signal } from 'alien-signals'

export const filePathMapState = signal(new Map<string, string>())

export const expressionsMapState = signal(new Map<string, ExpressionsMap>())

export function addExpression(relativePath: string, expressionMeta: ExpressionMeta) {
  const currentMap = expressionsMapState()
  const expressions = currentMap.get(relativePath)?.expressions || []

  if (!expressions.some((item: ExpressionMeta) =>
    item.code === expressionMeta.code
    && item.method === expressionMeta.method
    && item.line === expressionMeta.line
    && item.column === expressionMeta.column,
  )) {
    const newMap = new Map(currentMap)
    newMap.set(relativePath, {
      id: randomUUID(),
      filePath: relativePath,
      expressions: [...expressions, expressionMeta],
    })
    expressionsMapState(newMap)
  }
}

export const serverState = signal(false)
export const peersState = signal(new Set<any>())
