import { cwd } from 'node:process'
import { extname, relative } from 'pathe'
import { createFilter } from '@rollup/pluginutils'
import type { Comment, Node } from '@babel/types'
import type { Compiler, GenContext, Options } from '../types'
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

export function printInfo(options: Options, spacing: string = '  ') {
  if (options.disableLaunchEditor || options.silent)
    return false
  // eslint-disable-next-line no-console
  console.log(`  \x1B[32m➜\x1B[39m${spacing}\x1B[1mTurboConsole\x1B[22m: \x1B[36mhttp://localhost:\x1B[1m${options.port}\x1B[22m/inspect\x1B[39m`)
}

export function getFileNameWithoutExtension(fileName: string) {
  if (!fileName)
    return ''
  return fileName.replace(/\.[^/.]+$/, '')
}

export function getExtendedPath(filePath: string, extendedPathFileNames?: string[]) {
  const sep = filePath.includes('\\') ? '\\' : '/'
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

export async function getCompiler(id: string): Promise<Compiler | undefined> {
  const urlObject = new URL(id, 'file://')
  const fileType = extname(urlObject.pathname)

  switch (fileType) {
    case '.vue': {
      const Vue = await import('vue')
      if (!Vue || typeof Vue.version !== 'string') {
        console.warn(`[${PLUGIN_NAME}]: Vue is not installed`)
        return undefined
      }
      else if (Vue.version.startsWith('2.')) {
        return 'vue2'
      }
      else if (Vue.version.startsWith('3.')) {
        return 'vue3'
      }
      else {
        console.warn(`[${PLUGIN_NAME}]: Unsupported Vue version: ${Vue.version}`)
        return undefined
      }
    }
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
  compiler: Compiler
}) {
  const { comments, originalLine, type, compiler } = meta

  if (comments?.length === 0)
    return false

  if (type === 'top-file') {
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
  const fileType = extname(filePath)

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
  const lineInfo = `%c🚀 ${fileName}\u00B7${originalLine}${['StringLiteral', 'NumericLiteral'].includes(argType) ? '' : ` ~ ${argsName}`}`
  const codePosition = `${filePathMapString},${originalLine},${(originalColumn || 0) + 1}`

  const launchEditorString = `%c🔦 http://localhost:${port}#${codePosition}`

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

export async function loadPkg(pkg: string) {
  try {
    await import(pkg)
    return true
  }
  catch (error) {
    return false
  }
}
