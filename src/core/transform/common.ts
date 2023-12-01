import { relative } from 'node:path'
import { cwd } from 'node:process'
import { Buffer } from 'node:buffer'
import type { Node } from '@babel/types'
import type { GenContext } from '../../types'
import { getConsoleStyle, launchEditorStyle } from '../utils'

export function genConsoleString(genContext: GenContext) {
  const { options, fileName, originalColumn, originalLine, argType, filePath, argsName, fileType } = genContext
  const { prefix, suffix, disableLaunchEditor } = options

  const _prefix = prefix ? `${prefix} \\n` : ''
  const _suffix = suffix ? `\\n ${suffix}` : ''

  // not output when argtype is string or number
  const lineInfo = `${_prefix}%c🚀 ${fileName}:${originalLine}${['StringLiteral', 'NumericLiteral'].includes(argType) ? '' : ` ~ ${argsName}`}`
  const codePosition = `${relative(cwd(), filePath)}:${originalLine}:${(originalColumn || 0) + 1}`

  const launchEditorString = `%c🔦 Jump to Editor http://localhost:3000/client#${Buffer.from(codePosition, 'utf-8').toString('base64')}`

  let consoleString = ''

  if (!disableLaunchEditor)
    consoleString = `"${lineInfo} %c\\n${launchEditorString}","${getConsoleStyle(fileType)}","","${launchEditorStyle}","\\n",`

  else
    consoleString = `"${lineInfo} %c\\n","${getConsoleStyle(fileType)}","\\n",`

  return {
    consoleString,
    _suffix,
  }
}

export function isConsoleExpress(node: Node) {
  return node.type === 'CallExpression'
    && node.callee.type === 'MemberExpression'
    && node.callee.object.type === 'Identifier'
    && node.callee.object.name === 'console'
    && node.callee.property.type === 'Identifier'
    && node.callee.property.name === 'log'
    && node.arguments?.length > 0
}
