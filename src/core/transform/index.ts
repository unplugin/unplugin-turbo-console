import type { Context } from './../../types'
import { MagicString } from 'magic-string'
import { parseSync } from 'oxc-parser'
import {
  genConsoleString,
  getCompiler,
  getLineAndColumn,
  getLineStarts,
  isConsoleExpression,
  isPluginDisable,
} from '../utils'
import { walk } from '../utils/walker'
import { compilers } from './compilers'

export async function transform(context: Context) {
  const { code, id, options } = context

  // Not `console.`: `console?.log()` and `console\n.log()` are transformed too.
  if (!code.includes('console')) return undefined

  const compiler = await getCompiler(id)

  if (!compiler) return undefined

  const magicString = new MagicString(code)

  const blocks = (await compilers[compiler](context)).map(compileResult => {
    const { program, comments = [] } = parseSync(id, compileResult.script, {
      lang: (compileResult.lang || 'js') as 'js' | 'jsx' | 'ts' | 'tsx' | undefined,
      sourceType: 'module',
    })
    return { compileResult, program, comments, lineStarts: getLineStarts(compileResult.script) }
  })

  // A disable comment at the top of any script block disables the whole file.
  if (
    blocks.some(({ comments, lineStarts }) =>
      isPluginDisable({
        comments,
        originalLine: 1,
        id,
        type: 'top-file',
        compiler,
        lineStarts,
      }),
    )
  ) {
    return undefined
  }

  for (const { compileResult, program, comments, lineStarts } of blocks) {
    await walk(program, {
      enter(node) {
        if (isConsoleExpression(node)) {
          const originalExpression = compileResult.script.slice(node.start, node.end)

          // Skip the whole call, including console calls nested in its arguments.
          if (originalExpression.includes('%c')) {
            this.skip()
            return
          }

          const { line, column } = getLineAndColumn(lineStarts, node.start)

          const originalLine = line + compileResult.line
          const originalColumn = column

          if (
            isPluginDisable({
              comments,
              originalLine: line,
              id,
              type: 'inline-file',
              compiler,
              lineStarts,
            })
          ) {
            this.skip()
            return
          }

          const consoleMethod = (node as any).callee.property.name
          const args = (node as any).arguments

          const argsStart = args[0].start! + compileResult.offset
          const argsEnd = args[args.length - 1].end! + compileResult.offset
          const argType = args[0].type

          const argsName = magicString
            .slice(argsStart, argsEnd)
            .toString()
            .replace(/`/g, '')
            .replace(/\n/g, '')
            .replace(/"/g, '')

          const { consoleString, _suffix } = genConsoleString({
            options,
            inspector: context.inspector,
            filePaths: context.filePaths,
            root: context.root,
            consoleMethod,
            originalLine,
            originalColumn,
            argType,
            argsName,
            id,
          })

          if (consoleString) magicString.appendLeft(argsStart, consoleString)
          if (_suffix) magicString.appendRight(argsEnd, `,"${_suffix}"`)
        }
      },
    })
  }

  if (!magicString.hasChanged()) return undefined

  return {
    code: magicString.toString(),
    map: magicString.generateMap({
      source: id,
      file: id,
      includeContent: true,
      hires: true,
    }),
  }
}
