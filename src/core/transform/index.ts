import type { Context } from './../../types'
import MagicString from 'magic-string'
import { parseSync } from 'oxc-parser'
import { calculateStart, genConsoleString, getCompiler, isConsoleExpression, isPluginDisable } from '../utils'
import { walk } from '../utils/walker'
import { compilers } from './compilers'

export async function transform(context: Context) {
  const { code, id, options } = context
  const magicString = new MagicString(code)

  const compiler = await getCompiler(id)

  if (!compiler) {
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

  const compileResult = await compilers[compiler](context)

  const oxcParsedResult = parseSync(id, compileResult.script, {
    lang: (compileResult.lang || 'js') as 'js' | 'jsx' | 'ts' | 'tsx' | undefined,
    sourceType: 'module',
  })

  const { program, comments = [], magicString: oxcMs } = oxcParsedResult

  if (isPluginDisable({
    comments,
    originalLine: 1,
    id,
    type: 'top-file',
    compiler,
    oxcMs,
  })) {
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

  walk(program, {
    enter(node) {
      if (isConsoleExpression(node)) {
        const originalExpression = oxcMs.getSourceText(node.start, node.end)

        if (originalExpression.includes('%c'))
          return false

        const { line, column } = oxcMs.getLineColumnNumber(node.start)

        const originalLine = line + compileResult.line + 1
        const originalColumn = column

        if (isPluginDisable({
          comments,
          originalLine: line,
          id,
          type: 'inline-file',
          compiler,
          oxcMs,
        })) {
          return false
        }

        const args = (node as any).arguments

        const argsStart = calculateStart(compileResult.script, oxcMs.getLineColumnNumber(args[0].start))
        const argsEnd = calculateStart(compileResult.script, oxcMs.getLineColumnNumber(args[args.length - 1].end))

        const argType = args[0].type

        const argsName = oxcMs.getSourceText(args[0].start, args[args.length - 1].end)
          .toString()
          .replace(/`/g, '')
          .replace(/\n/g, '')
          .replace(/"/g, '')

        const { consoleString, _suffix } = genConsoleString({
          options,
          originalLine,
          originalColumn,
          argType,
          argsName,
          id,
        })

        consoleString && magicString.appendLeft(argsStart + compileResult.offset, consoleString)
        _suffix && magicString.appendRight(argsEnd + compileResult.offset, `,"${_suffix}"`)
      }
    },
  })

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
