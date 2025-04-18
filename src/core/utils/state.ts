import type { Peer } from 'crossws'
import type { ExpressionMeta, ExpressionsMap } from '../../types'
import { signal } from 'alien-signals'
import { v4 as uuidv4 } from 'uuid'

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
      id: uuidv4(),
      filePath: relativePath,
      expressions: [...expressions, expressionMeta],
    })
    expressionsMapState(newMap)
  }
}

export const serverState = signal(false)
export const peersState = signal(new Set<Peer>())
