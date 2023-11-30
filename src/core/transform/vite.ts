import { basename, extname, relative } from 'node:path'
import { cwd } from 'node:process'
import { Buffer } from 'node:buffer'
import MagicString from 'magic-string'
import type { WithScope } from 'ast-kit'
import { babelParse, getLang, walkAST } from 'ast-kit'
import type { Node } from '@babel/types'
import { SourceMapConsumer } from 'source-map-js'
import type { Context } from '../../types'
import { getConsoleStyle, launchEditorStyle } from '../utils'

export function viteTransform(context: Context) {
  const { code, id, pluginContext, options } = context
  const magicString = new MagicString(code)
  const program = babelParse(code, getLang(id), {
    sourceFilename: id,
  })

  walkAST<WithScope<Node>>(program, {
    enter(node) {
      if (node.type === 'CallExpression'
        && node.callee.type === 'MemberExpression'
        && node.callee.object.type === 'Identifier'
        && node.callee.object.name === 'console'
        && node.callee.property.type === 'Identifier'
        && node.callee.property.name === 'log'
        && node.arguments?.length > 0
      ) {
        const fileName = basename(id)
        const fileType = extname(id)

        const { line, column } = node.loc!.start
        const args = node.arguments

        // @ts-expect-error any
        const sourceMap = pluginContext.getCombinedSourcemap()

        const consumer = new SourceMapConsumer(sourceMap)

        const { line: originalLine, column: originalColumn } = consumer.originalPositionFor({
          line,
          column,
        })

        const argsStart = args[0].start!
        const argsEnd = args[args.length - 1].end!
        const argType = args[0].type
        const { prefix, suffix, disableLaunchEditor } = options
        const _prefix = prefix ? `${prefix} \\n` : ''
        const _suffix = suffix ? `\\n ${suffix}` : ''

        const argsName = magicString.slice(argsStart, argsEnd)
          .toString()
          .replace(/`/g, '')
          .replace(/\n/g, '')
          .replace(/"/g, '')

        // not output when argtype is string or number
        const lineInfo = `${_prefix}%c🚀 ${fileName}:${originalLine}${['StringLiteral', 'NumericLiteral'].includes(argType) ? '' : ` ~ ${argsName}`}`
        const codePosition = `${relative(cwd(), id)}:${originalLine}:${(originalColumn || 0) + 1}`

        const launchEditorString = `%c🔦 Jump to Editor http://localhost:3000/client#${Buffer.from(codePosition, 'utf-8').toString('base64')}`

        let appendLeftString = ''

        if (!disableLaunchEditor)
          appendLeftString = `"${lineInfo} %c\\n${launchEditorString}","${getConsoleStyle(fileType)}","","${launchEditorStyle}","\\n",`

        else
          appendLeftString = `"${lineInfo} %c\\n","${getConsoleStyle(fileType)}","\\n",`

        magicString
          .appendLeft(argsStart, appendLeftString)
          .appendRight(argsEnd, `,"${_suffix}"`)
      }
    },
  })

  return {
    code: magicString.toString(),
    map: magicString.generateMap({ source: id }),
  }
}
