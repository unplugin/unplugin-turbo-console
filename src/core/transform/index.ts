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

  const oxcParsedResult = parseSync(id, compileResult.script, {
    lang: (compileResult.lang || 'js') as 'js' | 'jsx' | 'ts' | 'tsx' | undefined,
    sourceType: 'module',
  })

  const { program, comments = [] } = oxcParsedResult

  if (isPluginDisable({
    comments,
    originalLine: 1,
    id,
    type: 'top-file',
    compiler,
    script: compileResult.script,
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

  await walk(program, {
    enter(node) {
      if (isConsoleExpression(node)) {
        const originalExpression = compileResult.script.slice(node.start, node.end)

        if (originalExpression.includes('%c'))
          return false

        const { line, column } = getLineAndColumn(compileResult.script, node.start)

        const originalLine = line + compileResult.line
        const originalColumn = column

        if (isPluginDisable({
          comments,
          originalLine: line,
          id,
          type: 'inline-file',
          compiler,
          script: compileResult.script,
        })) {
          return false
        }

        const consoleMethod = (node as any).callee.property.name
        const args = (node as any).arguments

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
          consoleMethod,
          originalLine,
          originalColumn,
          argType,
          argsName,
          id,
        })

        if (consoleString)
          magicString.appendLeft(argsStart, consoleString)
        if (_suffix)
          magicString.appendRight(argsEnd, `,"${_suffix}"`)
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
