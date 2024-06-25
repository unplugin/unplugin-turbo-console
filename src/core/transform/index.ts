import type { WithScope } from 'ast-kit'
import { babelParse, getLang, walkAST } from 'ast-kit'
import type { Node } from '@babel/types'
import MagicString from 'magic-string'
import { genConsoleString, getCompiler, isConsoleExpression, isPluginDisable } from '../utils'
import type { Context } from './../../types'
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

  const program = babelParse(compileResult.script, getLang(id), {
    sourceFilename: id,
    plugins: ['jsx', 'typescript', 'importAttributes'],
  })

  if (isPluginDisable({
    comments: program.comments || [],
    originalLine: 1,
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

  walkAST<WithScope<Node>>(program, {
    enter(node) {
      if (isConsoleExpression(node)) {
        const expressionStart = node.start!
        const expressionEnd = node.end!

        const originalExpression = magicString.slice(expressionStart, expressionEnd)

        if (originalExpression.includes('%c'))
          return false

        const { line, column } = node.loc!.start
        const originalLine = line + compileResult.line
        const originalColumn = column

        if (isPluginDisable({
          comments: program.comments || [],
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
