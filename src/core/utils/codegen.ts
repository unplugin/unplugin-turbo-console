import type { ExpressionMeta, GenContext } from '../../types'
import type { FileExt } from './themes'
import { cwd } from 'node:process'
import { extname, relative } from 'pathe'
import { PLUGIN_NAME } from '../constants'
import { addExpression, filePathMapState } from './state'
import { builtInThemes, getStyleCode } from './themes'

function getExtendedPath(filePath: string, extendedPathFileNames?: string[]) {
  const sep = filePath.includes('\\') ? '\\' : '/'
  const arr = filePath.split(sep)
  let basename = arr.pop() || ''
  const basenameWithoutExt = basename.replace(/\.[^/.]+$/, '').toLowerCase()
  if (extendedPathFileNames && extendedPathFileNames?.length > 0) {
    let isEnd = false
    if (extendedPathFileNames.some(name => basenameWithoutExt === name.toLowerCase())) {
      while (!isEnd) {
        const fileName = arr.pop()
        basename = `${fileName}/${basename}`
        if (extendedPathFileNames.every(name => name.toLowerCase() !== fileName?.toLowerCase()))
          isEnd = true
      }
    }
  }
  return basename
}

export function setFilePathMap(filePath: string): string {
  // 获取文件路径映射

  if (filePathMapState().has(filePath))
    return filePathMapState().get(filePath)!

  function getRandomString() {
    const randomString = Math.random().toString(20).substring(2, 6)

    for (const [_, value] of filePathMapState()) {
      if (value === randomString)
        return getRandomString()
    }

    return randomString
  }

  const randomString = getRandomString()

  filePathMapState(filePathMapState().set(filePath, randomString))

  return randomString
}

export function genConsoleString(genContext: GenContext) {
  const { options, originalColumn, originalLine, argType, id, consoleMethod } = genContext
  let { argsName } = genContext
  const { prefix, suffix, launchEditor, server, highlight } = options
  const { port, host } = server || { port: 3070, host: '127.0.0.1' }
  const extendedPathFileNames = typeof highlight === 'object' ? highlight.extendedPathFileNames : []
  const _prefix = prefix ? `${prefix}\\n` : ''
  const _suffix = suffix ? `\\n${suffix}` : ''

  const urlObject = new URL(id, 'file://')
  const filePath = urlObject.pathname
  const fileName = getExtendedPath(filePath, extendedPathFileNames)
  const fileType = extname(filePath).slice(1) as FileExt

  const relativePath = relative(cwd(), filePath)
  const filePathMapString = launchEditor === false ? '' : setFilePathMap(relativePath)

  const expressionMeta: ExpressionMeta = {
    code: argsName,
    method: consoleMethod,
    line: originalLine,
    column: originalColumn,
  }

  addExpression(relativePath, expressionMeta)

  // Parsing escaped unicode symbols
  try {
    argsName = JSON.parse(`"${argsName}"`)
  }
  catch (error) {
    console.error(`${PLUGIN_NAME}:${error}`)
  }

  if (argsName?.length > 30)
    argsName = `${argsName.slice(0, 30)}...`

  // not output when argtype is string or number
  const lineInfo = `%c${builtInThemes.highlight.icon} ${fileName}\u00B7${originalLine}${['Literal'].includes(argType) ? '' : ` ~ ${argsName}`}`
  const codePosition = `${filePathMapString},${originalLine},${(originalColumn || 0) + 1}`

  const launchEditorString = `%c${builtInThemes.launchEditor.icon} http://${host === '127.0.0.1' ? '127.1' : host}:${port}#${codePosition}`

  let consoleString = ''
  const lineWrap = `"\\n"`

  if (highlight && launchEditor) {
    consoleString = _prefix
      ? `"${_prefix}${lineInfo}${launchEditorString}",${getStyleCode(fileType).highlight},${getStyleCode(fileType).launchEditor},${lineWrap},`
      : `"${lineInfo}${launchEditorString}",${getStyleCode(fileType).highlight},${getStyleCode(fileType).launchEditor},${lineWrap},`
  }
  else if (highlight === false && launchEditor) {
    consoleString = _prefix
      ? `"${_prefix}${launchEditorString}",${getStyleCode(fileType).launchEditor},${lineWrap},`
      : `"${launchEditorString}",${getStyleCode(fileType).launchEditor},${lineWrap},`
  }
  else if (highlight && launchEditor === false) {
    consoleString = _prefix
      ? `"${_prefix}${lineInfo}",${getStyleCode(fileType).highlight},${lineWrap},`
      : `"${lineInfo}",${getStyleCode(fileType).highlight},${lineWrap},`
  }
  else if (highlight === false && launchEditor === false) {
    consoleString = _prefix
      ? `"${_prefix}",`
      : ''
  }

  return {
    consoleString,
    _suffix,
  }
}
