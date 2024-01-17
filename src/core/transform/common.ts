import { cwd } from 'node:process'
import { Buffer } from 'node:buffer'
import { basename, extname, relative } from 'pathe'
import type { Node } from '@babel/types'
import type { GenContext } from '../../types'
import { getConsoleStyle, launchEditorStyle } from '../utils'

export function genConsoleString(genContext: GenContext) {
  const { options, originalColumn, originalLine, argType, id } = genContext
  let { argsName } = genContext
  const { prefix, suffix, disableLaunchEditor, port, disableHighlight } = options
  const _prefix = prefix ? `console.log("${prefix}");` : ''
  const consoleEndString = suffix ? `;console.groupEnd();console.log("${suffix}")})()` : ';console.groupEnd()})()'

  const urlObject = new URL(id, 'file://')
  const filePath = urlObject.pathname
  const fileName = basename(filePath)
  const fileType = extname(filePath)

  if (argsName?.length > 30)
    argsName = `${argsName.slice(0, 30)}...`

  // not output when argtype is string or number
  const lineInfo = `%c🚀 ${fileName}:${originalLine}${['StringLiteral', 'NumericLiteral'].includes(argType) ? '' : ` ~ ${argsName}`}`
  const codePosition = `${relative(cwd(), filePath)}:${originalLine}:${(originalColumn || 0) + 1}`

  const launchEditorString = `%c🔦 http://localhost:${port}/client#${Buffer.from(codePosition, 'utf-8').toString('base64')}`
  let consoleStartString = ''

  if (!disableHighlight && !disableHighlight)
    consoleStartString = `-(()=>{${_prefix}console.group("${lineInfo}${launchEditorString}","${getConsoleStyle(fileType)}","${launchEditorStyle}");`

  else if (disableHighlight && !disableLaunchEditor)
    consoleStartString = `-(()=>{${_prefix}console.group("${launchEditorString}","${launchEditorStyle}");`

  else if (!disableHighlight && disableLaunchEditor)
    consoleStartString = `-(()=>{${_prefix}console.group("${lineInfo}","${getConsoleStyle(fileType)}");`
  else
    consoleStartString = `-(()=>{${_prefix}console.group();`

  return {
    consoleStartString,
    consoleEndString,
  }
}

export function isConsoleExpression(node: Node) {
  return node.type === 'CallExpression'
    && node.callee.type === 'MemberExpression'
    && node.callee.object.type === 'Identifier'
    && node.callee.object.name === 'console'
    && node.callee.property.type === 'Identifier'
    && node.callee.property.name === 'log'
    && node.arguments?.length > 0
}
