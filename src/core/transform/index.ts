import type { Context } from './../../types'
import MagicString from 'magic-string'
import { parseSync } from 'oxc-parser'
import { genConsoleString, getCompiler, getLineAndColumn, isConsoleExpression, isPluginDisable } from '../utils'
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

  const ast = parseSync(id, compileResult.script, {
    lang: (compileResult.lang || 'js') as 'js' | 'jsx' | 'ts' | 'tsx' | undefined,
    sourceType: 'module',
  })

  if (isPluginDisable({
    comments: ast.comments || [],
    originalLine: 1,
    script: compileResult.script,
    id,
    type: 'top-file',
    compiler,
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

  walk(ast.program, {
    enter(node) {
      if (isConsoleExpression(node)) {
        const expressionStart = node.start
        const expressionEnd = node.end

        const originalExpression = magicString.slice(expressionStart, expressionEnd)

        if (originalExpression.includes('%c'))
          return false

        const { line, column } = getLineAndColumn(compileResult.script, expressionStart)

        const originalLine = line + compileResult.line
        const originalColumn = column

        if (isPluginDisable({
          comments: ast.comments || [],
          script: compileResult.script,
          originalLine: line,
          id,
          type: 'inline-file',
          compiler,
        })) {
          return false
        }

        // @ts-expect-error any
        const args = node.arguments

        const argsStart = args[0].start! + compileResult.offset
        const argsEnd = args[args.length - 1].end! + compileResult.offset
        const argType = args[0].type

        const argsName = magicString.slice(argsStart, argsEnd)
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

        consoleString && magicString.appendLeft(argsStart, consoleString)
        _suffix && magicString.appendRight(argsEnd, `,"${_suffix}"`)
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
