import MagicString from 'magic-string'
import type { WithScope } from 'ast-kit'
import { babelParse, getLang, walkAST } from 'ast-kit'
import type { Node } from '@babel/types'
import { SourceMapConsumer } from 'source-map-js'
import type { Context } from '../../types'
import { isPluginDisable } from '../utils'
import { genConsoleString, isConsoleExpression } from './common'

export function viteTransform(context: Context) {
  const { code, id, pluginContext, options } = context
  const magicString = new MagicString(code)
  const program = babelParse(code, getLang(id), {
    sourceFilename: id,
  })

  walkAST<WithScope<Node>>(program, {
    enter(node) {
      if (isConsoleExpression(node)) {
        const expressionStart = node.start!
        const expressionEnd = node.end!

        const originalExpression = magicString.slice(expressionStart, expressionEnd)

        if (originalExpression.includes('%c'))
          return false

        const { line, column } = node.loc!.start
        // @ts-expect-error any
        const args = node.arguments
        // @ts-expect-error any
        const sourceMap = pluginContext.getCombinedSourcemap()

        const consumer = new SourceMapConsumer(sourceMap)

        const { line: originalLine, column: originalColumn } = consumer.originalPositionFor({
          line,
          column,
        })

        if (sourceMap.sourcesContent) {
          const lineContentArr = sourceMap.sourcesContent[0].split('\n')
          if (isPluginDisable({ lineContentArr, originalLine, id }))
            return
        }

        const argsStart = args[0].start!
        const argsEnd = args[args.length - 1].end!
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
    map: magicString.generateMap({ source: id }),
  }
}
