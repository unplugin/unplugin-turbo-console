import { cwd } from 'node:process'
import { Buffer } from 'node:buffer'
import { extname, relative } from 'pathe'
import type { Node } from '@babel/types'
import type { GenContext } from '../../types'
import { getConsoleStyle, getSemanticPath, launchEditorStyle } from '../utils'

export function genConsoleString(genContext: GenContext) {
  const { options, originalColumn, originalLine, argType, id } = genContext
  let { argsName } = genContext
  const { prefix, suffix, disableLaunchEditor, port, disableHighlight, showSemanticPath } = options
  const _prefix = prefix ? `${prefix}\\n` : ''
  const _suffix = suffix ? `\\n${suffix}` : ''

  const urlObject = new URL(id, 'file://')
  const filePath = urlObject.pathname
  const fileName = getSemanticPath(filePath, showSemanticPath)
  const fileType = extname(filePath)

  if (argsName?.length > 30)
    argsName = `${argsName.slice(0, 30)}...`

  // not output when argtype is string or number
  const lineInfo = `%c🚀 ${fileName}\u00B7${originalLine}${['StringLiteral', 'NumericLiteral'].includes(argType) ? '' : ` ~ ${argsName}`}`
  const codePosition = `${relative(cwd(), filePath)}:${originalLine}:${(originalColumn || 0) + 1}`

  const launchEditorString = `%c🔦 http://localhost:${port}/client#${Buffer.from(codePosition, 'utf-8').toString('base64')}`

  let consoleString = ''

  if (!disableHighlight && !disableHighlight) {
    consoleString = _prefix
      ? `"${_prefix}${lineInfo}${launchEditorString}","${getConsoleStyle(fileType)}","${launchEditorStyle}","\\n",`
      : `"${lineInfo}${launchEditorString}","${getConsoleStyle(fileType)}","${launchEditorStyle}","\\n",`
  }

  if (disableHighlight && !disableLaunchEditor) {
    consoleString = _prefix
      ? `"${_prefix}${launchEditorString}","${launchEditorStyle}","\\n",`
      : `"${launchEditorString}","${launchEditorStyle}","\\n",`
  }

  if (!disableHighlight && disableLaunchEditor) {
    consoleString = _prefix
      ? `"${_prefix}${lineInfo}","${getConsoleStyle(fileType)}","\\n",`
      : `"${lineInfo}","${getConsoleStyle(fileType)}","\\n",`
  }

  if (disableHighlight && disableLaunchEditor) {
    consoleString = _prefix
      ? `"${_prefix}",`
      : ''
  }

  return {
    consoleString,
    _suffix,
  }
}

export function isConsoleExpression(node: Node) {
  return node.type === 'CallExpression'
    && node.callee.type === 'MemberExpression'
    && node.callee.object.type === 'Identifier'
    && node.callee.object.name === 'console'
    && node.callee.property.type === 'Identifier'
    && node.arguments?.length > 0
}
