import type { Comment } from 'oxc-parser'
import type { Compiler } from '../../types'
import type { Options } from '../options/type'
import type { Node } from '../utils/walker'
import { extname, normalize } from 'pathe'

export function printInfo(options: Options, spacing: string = '  ') {
  if (options.inspector === false) return false

  if (typeof options.inspector === 'object' && options.inspector.printUrl === false) return false

  const port = options.server!.port
  const { host } = options.server!

  // oxlint-disable-next-line no-console
  console.log(
    `  \x1B[32m➜\x1B[39m${spacing}\x1B[1mConsole Inspector\x1B[22m: \x1B[36m\x1B[4mhttp://${host}:${port}/inspector\x1B[24m\x1B[39m`,
  )
  return undefined
}

// Strip the query and normalize separators; unlike URL#pathname this keeps the path unencoded.
export function getFilePath(id: string) {
  return normalize(id.split('?')[0]!)
}

export async function getCompiler(id: string): Promise<Compiler | undefined> {
  const fileType = extname(getFilePath(id))

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

// Offsets at which each line starts, computed once per script so lookups can binary-search them.
export function getLineStarts(code: string) {
  const lineStarts = [0]
  for (let i = code.indexOf('\n'); i !== -1; i = code.indexOf('\n', i + 1)) {
    lineStarts.push(i + 1)
  }
  return lineStarts
}

export function getLineAndColumn(lineStarts: number[], offset: number) {
  let low = 0
  let high = lineStarts.length - 1

  while (low < high) {
    const mid = (low + high + 1) >> 1
    if (lineStarts[mid]! <= offset) low = mid
    else high = mid - 1
  }

  return { line: low + 1, column: offset - lineStarts[low]! }
}

export function isPluginDisable(meta: {
  comments: Comment[]
  originalLine: number
  id: string
  type: 'top-file' | 'inline-file'
  compiler: Compiler
  lineStarts: number[]
}) {
  const { comments, originalLine, type, compiler, lineStarts } = meta

  if (comments?.length === 0) return false

  if (type === 'top-file') {
    const startLine = compiler === 'vanilla' ? 1 : 2

    const disablePluginComment = comments?.find(
      comment =>
        comment.value.includes('turbo-console-disable') &&
        !comment.value.includes('turbo-console-disable-'),
    )

    const disableLine = getLineAndColumn(lineStarts, disablePluginComment?.start || 0).line
    if (disablePluginComment && disableLine <= startLine) return true
  } else if (type === 'inline-file') {
    const currentLineComment = comments?.find(
      comment =>
        comment.value.includes('turbo-console-disable-line') &&
        getLineAndColumn(lineStarts, comment.start).line === originalLine,
    )
    const nextLineComment = comments?.find(
      comment =>
        comment.value.includes('turbo-console-disable-next-line') &&
        getLineAndColumn(lineStarts, comment.start).line === originalLine - 1,
    )

    if (currentLineComment || nextLineComment) return true
  }

  return false
}

export function isConsoleExpression(node: Node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'console' &&
    node.callee.property.type === 'Identifier' &&
    ['log', 'warn', 'error', 'info', 'debug'].includes(node.callee.property.name) &&
    node.arguments?.length > 0
  )
}

export async function loadPkg(pkg: string) {
  try {
    await import(pkg)
    return true
  } catch {
    return false
  }
}
