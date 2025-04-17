import type { Comment } from 'oxc-parser'
import type { Compiler, Options } from '../../types'
import type { Node } from '../utils/walker'
import { extname } from 'pathe'

export function printInfo(options: Options, spacing: string = '  ') {
  if (options.disableLaunchEditor || options.silent)
    return false
  // eslint-disable-next-line no-console
  console.log(`  \x1B[32m➜\x1B[39m${spacing}\x1B[1mConsole Inspector\x1B[22m: \x1B[36m\x1B[4mhttp://localhost:\x1B[1m${options.port}\x1B[22m/inspector\x1B[24m\x1B[39m`)
}

export async function getCompiler(id: string): Promise<Compiler | undefined> {
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

export function getLineAndColumn(code: string, start: number) {
  let line = 1
  let column = 0

  for (let i = 0; i < start; i++) {
    if (code[i] === '\n') {
      line++
      column = 0
    }
    else {
      column++
    }
  }

  return { line, column }
}

export function isPluginDisable(meta: {
  comments: Comment[]
  originalLine: number
  id: string
  type: 'top-file' | 'inline-file'
  compiler: Compiler
  script: string
}) {
  const { comments, originalLine, type, compiler, script } = meta

  if (comments?.length === 0)
    return false

  if (type === 'top-file') {
    const startLine = compiler === 'vanilla' ? 1 : 2

    const disablePluginComment = comments?.find(comment => comment.value.includes('turbo-console-disable') && !comment.value.includes('turbo-console-disable-'))

    const disableLine = getLineAndColumn(script, disablePluginComment?.start || 0).line
    if (disablePluginComment && disableLine <= startLine)
      return true
  }
  else if (type === 'inline-file') {
    const currentLineComment = comments?.find((comment) => {
      const { line } = getLineAndColumn(script, comment.start)
      return comment.value.includes('turbo-console-disable-line') && line === originalLine
    })
    const nextLineComment = comments?.find((comment) => {
      const { line } = getLineAndColumn(script, comment.start)
      return comment.value.includes('turbo-console-disable-next-line') && line === originalLine - 1
    })

    if (currentLineComment || nextLineComment)
      return true
  }

  return false
}

export function isConsoleExpression(node: Node) {
  return node.type === 'CallExpression'
    && node.callee.type === 'MemberExpression'
    && node.callee.object.type === 'Identifier'
    && node.callee.object.name === 'console'
    && node.callee.property.type === 'Identifier'
    && ['log', 'warn', 'error', 'info', 'debug'].includes(node.callee.property.name)
    && node.arguments?.length > 0
}

export async function loadPkg(pkg: string) {
  try {
    await import(pkg)
    return true
  }
  catch {
    return false
  }
}
