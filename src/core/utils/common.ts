import { createFilter } from '@rollup/pluginutils'
import { extname } from 'pathe'
import type { Comment, Node } from '@babel/types'
import type { Compiler, Options } from '../../types'
import { PLUGIN_NAME } from '../constants'

export const filter = createFilter(
  [/\.vue$/, /\.vue\?vue/, /\.vue\?v=/, /\.ts$/, /\.tsx$/, /\.js$/, /\.jsx$/, /\.svelte$/, /\.astro$/],
  [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
)

export function printInfo(options: Options, spacing: string = '  ') {
  if (options.disableLaunchEditor || options.silent)
    return false
  // eslint-disable-next-line no-console
  console.log(`  \x1B[32m➜\x1B[39m${spacing}\x1B[1mTurboConsole\x1B[22m: \x1B[36mhttp://localhost:\x1B[1m${options.port}\x1B[22m/inspect\x1B[39m`)
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
