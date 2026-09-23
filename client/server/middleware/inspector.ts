import { cwd } from 'node:process'
import { resolve } from 'pathe'
import { createConsoleDevframe } from '../../../src/core/server/devframe'
import { resolveOptions } from '../../../src/core/options/resolve'
import { initDevframe } from 'devframe/initiate'
import { toWebRequest } from 'h3'
import { createInspector } from '../../../src/core/inspector'

const PREVIEW_BASE = '/__turbo_console/'

const defaultMessage = {
  timestamp: Date.now(),
  expressionsMap: {
    'src/App.vue': {
      id: '1',
      filePath: 'src/App.vue',
      expressions: [{ code: "'from vue'", method: 'log', line: 7, column: 2 }],
    },
    'src/jsLog.js': {
      id: '2',
      filePath: 'src/jsLog.js',
      expressions: [
        { code: "'from js'", method: 'info', line: 2, column: 2 },
        { code: "'from js'", method: 'warn', line: 4, column: 2 },
        { code: "'from js'", method: 'error', line: 6, column: 2 },
        { code: "'from js'", method: 'log', line: 8, column: 2 },
      ],
    },
    'src/tsLog.ts': {
      id: '3',
      filePath: 'src/tsLog.ts',
      expressions: [
        { code: 'abc', method: 'log', line: 3, column: 2 },
        { code: 'def', method: 'log', line: 6, column: 2 },
        { code: 'mno', method: 'log', line: 15, column: 8 },
      ],
    },
  },
  version: '1.11.3',
}

let devframe: ReturnType<typeof initDevframe> | undefined

export default defineEventHandler(event => {
  if (!event.path.startsWith(PREVIEW_BASE)) return
  if (!devframe) {
    const root = resolve(cwd(), '../examples/vite-vue3')
    const inspector = createInspector(root)
    for (const [path, file] of Object.entries(defaultMessage.expressionsMap)) {
      for (const expression of file.expressions) inspector.addExpression(path, expression)
    }
    devframe = initDevframe(createConsoleDevframe(resolveOptions({}), root, new Map(), inspector), {
      base: PREVIEW_BASE,
      ws: false,
      mcp: false,
    })
    useNitroApp().hooks.hook('close', async () => {
      await devframe?.close()
      inspector.clear()
      devframe = undefined
    })
  }
  return devframe.handler(toWebRequest(event))
})
