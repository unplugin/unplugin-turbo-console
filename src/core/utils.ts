import { cwd } from 'node:process'
import { Buffer } from 'node:buffer'
import { extname, relative, sep } from 'pathe'
import { createFilter } from '@rollup/pluginutils'
import type { Comment, Node } from '@babel/types'
import type { Compiler, GenContext } from '../types'
import { PLUGIN_NAME } from './constants'

export const filter = createFilter(
  [/\.vue$/, /\.vue\?vue/, /\.vue\?v=/, /\.ts$/, /\.tsx$/, /\.js$/, /\.jsx$/, /\.svelte$/, /\.astro$/],
  [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
)

const commonStyle = 'padding:2px 5px; border-radius:3px 0 0 3px;margin-bottom:5px;'

const consoleStyles: Record<string, string> = {
  '.js': `${commonStyle}color: #111827; background: #F7DF1E`,
  '.jsx': `${commonStyle}color: #111827; background: #F7DF1E`,
  '.ts': `${commonStyle}color: #fff; background: #3178C6`,
  '.tsx': `${commonStyle}color: #fff; background: #3178C6`,
  '.vue': `${commonStyle}color: #fff; background: #4FC08D`,
  '.svelte': `${commonStyle}color: #fff; background: #FF3E00`,
  '.astro': `${commonStyle}color: #fff; background: #FF5D01`,
  'default': `${commonStyle}color: #111827; background: #F7DF1E`,
}

export function getConsoleStyle(fileType: string): string {
  return consoleStyles[fileType] ?? consoleStyles.default
}

export const launchEditorStyle = 'background: #00DC8250;padding:2px 5px;border-radius:0 3px 3px 0;margin-bottom:5px'

export function printInfo(port: number) {
  // eslint-disable-next-line no-console
  console.log('\x1B[32m%s\x1B[0m\x1B[1m%s\x1B[0m\x1B[36m%s\x1B[0m', '  ➜', `  TurboConsole:`, ` http://localhost:${port}/intro`)
}

export function getFileNameWithoutExtension(fileName: string) {
  if (!fileName)
    return ''
  return fileName.replace(/\.[^/.]+$/, '')
}

export function getExtendedPath(filePath: string, extendedPathFileNames?: string[]) {
  const arr = filePath.split(sep)
  let basename = arr.pop() || ''
  const basenameWithoutExt = getFileNameWithoutExtension(basename).toLowerCase()
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

export function getCompiler(id: string): Compiler | undefined {
  const urlObject = new URL(id, 'file://')
  const fileType = extname(urlObject.pathname)

  switch (fileType) {
    case '.vue':
      return 'vue'
    case '.svelte':
      return 'svelte'
    case '.js':
      return 'vanilla'
    case '.jsx':
      return 'vanilla'
    case '.ts':
      return 'vanilla'
    case '.tsx':
      return 'vanilla'
    case '.astro':
      return 'vanilla'
    default:
      return undefined
  }
}

export function isPluginDisable(meta: {
  comments: Comment[]
  originalLine: number
  id: string
  type: 'top-file' | 'inline-file'
}) {
  const { comments, originalLine, id, type } = meta

  if (comments?.length === 0)
    return false

  if (type === 'top-file') {
    const compiler = getCompiler(id)
    const startLine = compiler === 'vanilla' ? 1 : 2

    const disablePluginComment = comments?.find(comment => comment.value.includes('turbo-console-disable'))

    if (disablePluginComment && disablePluginComment.loc!.start.line <= startLine)
      return true
  }
  else if (type === 'inline-file') {
    const currentLineComment = comments?.find(comment => comment.value.includes('turbo-console-disable-line') && comment.loc!.start.line === originalLine)
    const nextLineComment = comments?.find(comment => comment.value.includes('turbo-console-disable-next-line') && comment.loc!.start.line === originalLine - 1)

    if (currentLineComment || nextLineComment)
      return true
  }

  return false
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
  const fileType = extname(filePath)

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
  const lineInfo = `%c🚀 ${fileName}\u00B7${originalLine}${['StringLiteral', 'NumericLiteral'].includes(argType) ? '' : ` ~ ${argsName}`}`
  const codePosition = `${relative(cwd(), filePath)}:${originalLine}:${(originalColumn || 0) + 1}`

  const launchEditorString = `%c🔦 http://localhost:${port}#${Buffer.from(codePosition, 'utf-8').toString('base64')}`

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
