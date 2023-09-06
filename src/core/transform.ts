import { basename, extname } from 'node:path'
import { ScriptTarget, createSourceFile, forEachChild, isCallExpression } from 'typescript'
import MagicString from 'magic-string'
import { parse as vueParser } from 'vue/compiler-sfc'
import type { Options, TraverseAST } from '../types'
import { getConsoleStyle } from './utils'

function traverseAST(args: TraverseAST) {
  const { node, s, id, options, offset = 0 } = args
  const fileName = basename(id)
  const fileType = extname(id)

  if (isCallExpression(node) as any) {
    if (node?.expression?.expression?.escapedText === 'console' && node?.expression?.name?.escapedText === 'log') {
      const argumentStart = node.arguments[0].pos + offset
      const argumentEnd = node.arguments[node.arguments.length - 1].end + offset
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

  forEachChild(node, childNode => traverseAST({
    node: childNode,
    s,
    id,
    options,
    offset,
  }))
}

export function transformer(code: string, id: string, options: Options) {
  if (['.js', '.ts', '.tsx', '.jsx'].includes(extname(id))) {
    const ast = createSourceFile(id, code, ScriptTarget.Latest)
    const s = new MagicString(code)
    traverseAST({
      node: ast,
      s,
      id,
      options,
    })
    return s.toString()
  }
  else if (extname(id) === '.vue') {
    const { descriptor } = vueParser(code, {
      sourceMap: true,
    })
    const s = new MagicString(code)
    if (descriptor.scriptSetup?.content) {
      const ast = createSourceFile(id, descriptor.scriptSetup?.content, ScriptTarget.Latest)
      traverseAST({
        node: ast,
        s,
        id,
        options,
        offset: descriptor.scriptSetup.loc.start.offset,
      })
    }

    if (descriptor.script?.content) {
      const ast = createSourceFile(id, descriptor.script?.content, ScriptTarget.Latest)
      traverseAST({
        node: ast,
        s,
        id,
        options,
        offset: descriptor.script.loc.start.offset,
      })
    }

    return s.toString()
  }
  return code
}
