import type { ExpressionMeta, InspectorState } from '../types'
import { randomUUID } from 'node:crypto'
import { cwd } from 'node:process'
import { resolve } from 'pathe'
import { defineDevframe } from 'devframe'
import { createSharedState } from 'devframe/utils/shared-state'
import { description, homepage, name, version } from '../../package.json'

export const INSPECTOR_BASE = '/'
export const INSPECTOR_STATE = 'turbo-console:expressions'

export function createInspector(root = cwd()) {
  const state = createSharedState<InspectorState>({
    initialValue: { timestamp: 0, version, expressionsMap: {} },
  })

  const definition = defineDevframe({
    id: 'turbo-console',
    name: 'Console Inspector',
    packageName: name,
    version,
    homepage,
    description,
    async setup(ctx) {
      await ctx.rpc.sharedState.get(INSPECTOR_STATE, {
        sharedState: {
          ...state,
          // Devframe 的客户端 set / patch 都通过此入口，表达式仅允许 Node 写入。
          patch() {
            throw new Error('Console Inspector state is read-only')
          },
        },
      })
    },
  })

  return {
    state,
    definition,
    addExpression(filePath: string, expression: ExpressionMeta) {
      state.mutate(draft => {
        const entry = draft.expressionsMap[filePath]
        if (
          entry?.expressions.some(
            item =>
              item.code === expression.code &&
              item.method === expression.method &&
              item.line === expression.line &&
              item.column === expression.column,
          )
        )
          return

        const file = entry ?? {
          id: randomUUID(),
          filePath: resolve(root, filePath),
          expressions: [],
        }
        file.expressions.push(expression)
        draft.expressionsMap[filePath] = file
        draft.timestamp = Date.now()
      })
    },
    invalidate(filePath: string) {
      state.mutate(draft => {
        if (!Object.hasOwn(draft.expressionsMap, filePath)) return
        delete draft.expressionsMap[filePath]
        draft.timestamp = Date.now()
      })
    },
    clear() {
      state.mutate(draft => {
        draft.expressionsMap = {}
        draft.timestamp = 0
      })
    },
  }
}

export type Inspector = ReturnType<typeof createInspector>
