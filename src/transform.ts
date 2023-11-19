import { basename, extname, relative } from 'node:path'
import { cwd } from 'node:process'
import { Buffer } from 'node:buffer'
import type { WithScope } from 'ast-kit'
import { babelParse, getLang, walkAST } from 'ast-kit'
import type { Node } from '@babel/types'
import type { RawSourceMap } from 'source-map'
import { SourceMapConsumer } from 'source-map'
import MagicString from 'magic-string'
import { getConsoleStyle, launchEditorStyle } from './utils/style'
import type { Context } from './types'

export async function transformCode(code: string, id: string, context: Context) {
  try {
    const magicString = new MagicString(code)
    const program = babelParse(code, getLang(id), {
      sourceFilename: id,
    })
    const { port, protocol, base } = context.network

    const asyncOperations: Promise<void>[] = []

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

          const sourceMap = context.pluginContext.getCombinedSourcemap()
          const asyncOperation = new SourceMapConsumer(sourceMap as RawSourceMap).then((consumer) => {
            const { line: originalLine, column: originalColumn } = consumer.originalPositionFor({
              line,
              column,
            })

            const argsStart = args[0].start!
            const argsEnd = args[args.length - 1].end!
            const argType = args[0].type
            const { prefix, suffix, disableLaunchEditor } = context.option
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

            let launchEditorString = ''
            launchEditorString = `%c🔦 Jump to Editor ${protocol}://localhost:${port}${base}__tc/i.html`

            if (base !== '/')
              launchEditorString += `?b=${base}`

            launchEditorString += `#${Buffer.from(codePosition, 'utf-8').toString('base64')}`

            let appendLeftString = ''

            if (!disableLaunchEditor)
              appendLeftString = `"${lineInfo} %c\\n${launchEditorString}","${getConsoleStyle(fileType)}","","${launchEditorStyle}","\\n",`

            else
              appendLeftString = `"${lineInfo} %c\\n","${getConsoleStyle(fileType)}","\\n",`

            magicString
              .appendLeft(argsStart, appendLeftString)
              .appendRight(argsEnd, `,"${_suffix}"`)
          })

          asyncOperations.push(asyncOperation)
        }
      },
    })

    await Promise.all(asyncOperations)

    return {
      code: magicString.toString(),
      map: magicString.generateMap({ source: id, includeContent: true }),
    }
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw new Error(String(error))
  }
}
