import { basename, extname } from 'node:path'
import { ScriptTarget, createSourceFile, forEachChild, isCallExpression } from 'typescript'
import MagicString from 'magic-string'
import type { Options } from '../types'
import { getConsoleStyle } from './utils'

function traverseAST(node: any, s: MagicString, id: string, options: Options) {
  const fileName = basename(id)
  const fileType = extname(id)

  if (isCallExpression(node) as any) {
    if (node?.expression?.expression?.escapedText === 'console' && node?.expression?.name?.escapedText === 'log') {
      const argumentStart = node.arguments[0].pos
      const argumentEnd = node.arguments[node.arguments.length - 1].end
      const lineNumber = s.slice(0, argumentStart)?.split('\n').length
      const argsName = s.slice(argumentStart, argumentEnd).toString()
        .replaceAll('`', '')
        .replaceAll('\n', '')
        .replaceAll('\"', '')

      let { suffix, prefix } = options || {}
      suffix = suffix ? `\\n ${suffix}` : ''
      prefix = prefix ? `${prefix} \\n` : ''

      s.appendLeft(argumentStart, `"${prefix} %c${fileName}:${lineNumber} ~ ${argsName}","${getConsoleStyle(fileType)}",`)
      s.appendRight(argumentEnd, `,"${suffix}"`)
    }
  }

  forEachChild(node, childNode => traverseAST(childNode, s, id, options))
}

export function transformer(code: string, id: string, options: Options) {
  if (['.js', '.ts', '.tsx', '.jsx'].includes(extname(id))) {
    const ast = createSourceFile(id, code, ScriptTarget.Latest)
    const s = new MagicString(code)
    traverseAST(ast, s, id, options)
    return s.toString()
  }
  return code
}
