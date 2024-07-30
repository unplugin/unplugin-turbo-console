import { cwd } from 'node:process'
import { extname, relative } from 'pathe'
import type { GenContext } from '../../types'
import { PLUGIN_NAME } from '../constants'
import type { FileExt } from './themes'
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
  let filePathMap = globalThis.TurboConsoleFilePathMap

  if (typeof filePathMap === 'undefined')
    filePathMap = new Map<string, string>()

  if (filePathMap.has(filePath))
    return filePathMap.get(filePath)!

  function getRandomString() {
    const randomString = Math.random().toString(20).substring(2, 6)

    for (const [_, value] of filePathMap) {
      if (value === randomString)
        return getRandomString()
    }

    return randomString
  }

  const randomString = getRandomString()
  filePathMap.set(filePath, randomString)
  globalThis.TurboConsoleFilePathMap = filePathMap

  return randomString
}

export function genConsoleString(genContext: GenContext) {
  const { options, originalColumn, originalLine, argType, id } = genContext
  let { argsName } = genContext
  const { prefix, suffix, disableLaunchEditor, port, disableHighlight, extendedPathFileNames } = options
  const _prefix = prefix ? `${prefix}\\n` : ''
  const _suffix = suffix ? `\\n${suffix}` : ''

  const urlObject = new URL(id, 'file://')
  const filePath = urlObject.pathname
  const fileName = getExtendedPath(filePath, extendedPathFileNames)
  const fileType = extname(filePath).slice(1) as FileExt

  const relativePath = relative(cwd(), filePath)
  const filePathMapString = disableLaunchEditor ? '' : setFilePathMap(relativePath)

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
  const lineInfo = `%c${builtInThemes.highlight.icon} ${fileName}\u00B7${originalLine}${['StringLiteral', 'NumericLiteral'].includes(argType) ? '' : ` ~ ${argsName}`}`
  const codePosition = `${filePathMapString},${originalLine},${(originalColumn || 0) + 1}`

  const launchEditorString = `%c${builtInThemes.launchEditor.icon} http://localhost:${port}#${codePosition}`

  let consoleString = ''
  const lineWrap = `"\\n"`

  if (!disableHighlight && !disableLaunchEditor) {
    consoleString = _prefix
      ? `"${_prefix}${lineInfo}${launchEditorString}",${getStyleCode(fileType).highlight},${getStyleCode(fileType).launchEditor},${lineWrap},`
      : `"${lineInfo}${launchEditorString}",${getStyleCode(fileType).highlight},${getStyleCode(fileType).launchEditor},${lineWrap},`
  }
  else if (disableHighlight && !disableLaunchEditor) {
    consoleString = _prefix
      ? `"${_prefix}${launchEditorString}",${getStyleCode(fileType).launchEditor},${lineWrap},`
      : `"${launchEditorString}",${getStyleCode(fileType).launchEditor},${lineWrap},`
  }
  else if (!disableHighlight && disableLaunchEditor) {
    consoleString = _prefix
      ? `"${_prefix}${lineInfo}",${getStyleCode(fileType).highlight},${lineWrap},`
      : `"${lineInfo}",${getStyleCode(fileType).highlight},${lineWrap},`
  }
  else if (disableHighlight && disableLaunchEditor) {
    consoleString = _prefix
      ? `"${_prefix}",`
      : ''
  }

  return {
    consoleString,
    _suffix,
  }
}
