import type { ExpressionMeta, GenContext } from '../../types'
import type { FileExt } from './themes'
import { cwd } from 'node:process'
import { extname, relative } from 'pathe'
import { formatHost, getFilePath } from './common'
import globalStore from './globalStore'
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

// Escape text embedded in the generated double-quoted string literal
function escapeString(value: string) {
  return JSON.stringify(value).slice(1, -1)
}

// Text embedded in the console format string: a literal `%` must not start a format specifier
function escapeFormat(value: string) {
  return escapeString(value).replace(/%/g, '%%')
}

export function setFilePathMap(filePath: string, filePaths?: Map<string, string>): string {
  // 获取文件路径映射
  let filePathMap = filePaths ?? globalStore.get<Map<string, string>>('filePathMap')
  if (!filePathMap) {
    filePathMap = new Map()
    globalStore.set('filePathMap', filePathMap)
  }
  if (filePathMap.has(filePath)) return filePathMap.get(filePath)!

  function getRandomString() {
    const randomString = Math.random().toString(20).substring(2, 6)

    for (const [_, value] of filePathMap!) {
      if (value === randomString) return getRandomString()
    }

    return randomString
  }

  const randomString = getRandomString()

  filePathMap.set(filePath, randomString)
  if (!filePaths) globalStore.set('filePathMap', filePathMap)

  return randomString
}

export function genConsoleString(genContext: GenContext) {
  const { options, originalColumn, originalLine, argType, id, consoleMethod } = genContext
  let { argsName } = genContext
  const { prefix, suffix, launchEditor, server, highlight } = options
  const { host } = server!
  const port = options.server!.port
  const extendedPathFileNames = typeof highlight === 'object' ? highlight.extendedPathFileNames : []
  const themeDetect = typeof highlight === 'object' ? highlight.themeDetect : false
  const prefixString = prefix ? `${escapeString(prefix)}\\n` : ''
  const suffixString = suffix ? `\\n${escapeString(suffix)}` : ''

  const filePath = getFilePath(id)
  const fileName = getExtendedPath(filePath, extendedPathFileNames)
  const fileType = extname(filePath).slice(1) as FileExt

  const relativePath = relative(genContext.root ?? cwd(), filePath)
  const filePathMapString =
    launchEditor === false ? '' : setFilePathMap(relativePath, genContext.filePaths)

  const expressionMeta: ExpressionMeta = {
    code: argsName,
    method: consoleMethod,
    line: originalLine,
    column: originalColumn,
  }

  if (options.inspector !== false) genContext.inspector?.addExpression(relativePath, expressionMeta)

  // Decode escaped unicode symbols (e.g. emitted by an earlier transform) so the label stays readable
  argsName = argsName.replace(/\\u([0-9a-f]{4})/gi, (_, hex: string) =>
    String.fromCharCode(Number.parseInt(hex, 16)),
  )

  if (argsName?.length > 30) argsName = `${argsName.slice(0, 30)}...`

  // not output when argtype is string or number
  const lineInfo = `%c${builtInThemes.highlight.icon} ${escapeFormat(fileName)}\u00B7${originalLine}${['Literal'].includes(argType) ? '' : ` ~ ${escapeFormat(argsName)}`}`
  const codePosition = `${filePathMapString},${originalLine},${(originalColumn || 0) + 1}`

  const launchEditorString = `%c${builtInThemes.launchEditor.icon} http://${host === '127.0.0.1' ? '127.1' : formatHost(host!)}:${port}#${codePosition}`

  let consoleString = ''
  const lineWrap = `"\\n"`

  if (highlight && launchEditor) {
    consoleString = prefixString
      ? `"${prefixString}${lineInfo}${launchEditorString}",${getStyleCode(fileType, themeDetect).highlight},${getStyleCode(fileType, themeDetect).launchEditor},${lineWrap},`
      : `"${lineInfo}${launchEditorString}",${getStyleCode(fileType, themeDetect).highlight},${getStyleCode(fileType, themeDetect).launchEditor},${lineWrap},`
  } else if (highlight === false && launchEditor) {
    consoleString = prefixString
      ? `"${prefixString}${launchEditorString}",${getStyleCode(fileType, themeDetect).launchEditor},${lineWrap},`
      : `"${launchEditorString}",${getStyleCode(fileType, themeDetect).launchEditor},${lineWrap},`
  } else if (highlight && launchEditor === false) {
    consoleString = prefixString
      ? `"${prefixString}${lineInfo}",${getStyleCode(fileType, themeDetect).highlight},${lineWrap},`
      : `"${lineInfo}",${getStyleCode(fileType, themeDetect).highlight},${lineWrap},`
  } else if (highlight === false && launchEditor === false) {
    consoleString = prefixString ? `"${prefixString}",` : ''
  }

  return {
    consoleString,
    suffixString,
  }
}
