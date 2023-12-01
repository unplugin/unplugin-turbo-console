import { basename, extname } from 'node:path'
import { parse } from '@vue/compiler-sfc'
import type { WithScope } from 'ast-kit'
import { babelParse, getLang, walkAST } from 'ast-kit'
import type { Node } from '@babel/types'
import MagicString from 'magic-string'
import type { Context } from '../../types'
import { genConsoleString, isConsoleExpress } from './common'

const vuePatterns = [/\.vue$/, /\.vue\?vue/, /\.vue\?v=/]

export function webpackTransform(context: Context) {
  const { id, code, options } = context
  let scriptString = code
  let scriptLang = getLang(context.id)
  let sfcLocInfo = {
    start: {
      line: 0,
      column: 0,
      offset: 0,
    },
    end: {
      line: 0,
      column: 0,
      offset: 0,
    },
  }
  const magicString = new MagicString(code)
  if (vuePatterns.some(pattern => pattern.test(id))) {
    const { descriptor, errors } = parse(code, {
      filename: id,
    })

    if (errors.length === 0) {
      if (descriptor.script) {
        scriptString = descriptor.script.content
        scriptLang = descriptor.script.lang || ''
        sfcLocInfo = descriptor.script.loc
      }

      else if (descriptor.scriptSetup) {
        scriptString = descriptor.scriptSetup.content
        scriptLang = descriptor.scriptSetup.lang || ''
        sfcLocInfo = descriptor.scriptSetup.loc
      }
    }
  }

  const program = babelParse(scriptString, scriptLang, {
    sourceFilename: id,
  })

  walkAST<WithScope<Node>>(program, {
    enter(node) {
      if (isConsoleExpress(node)) {
        const urlObject = new URL(id, 'file://')
        const fileName = basename(urlObject.pathname)
        const fileType = extname(urlObject.pathname)

        const { line, column } = node.loc!.start
        // @ts-expect-error any
        const args = node.arguments

        const argsStart = args[0].start! + sfcLocInfo.start.offset
        const argsEnd = args[args.length - 1].end! + sfcLocInfo.start.offset
        const argType = args[0].type

        const argsName = magicString.slice(argsStart, argsEnd)
          .toString()
          .replace(/`/g, '')
          .replace(/\n/g, '')
          .replace(/"/g, '')

        const originalLine = line + sfcLocInfo.start.line - 1
        const originalColumn = column

        const { consoleString, _suffix } = genConsoleString({
          options,
          fileName,
          originalLine,
          originalColumn,
          argType,
          filePath: urlObject.pathname,
          argsName,
          fileType,
        })

        magicString
          .appendLeft(argsStart, consoleString)
          .appendRight(argsEnd, `,"${_suffix}"`)
      }
    },
  })

  return {
    code: magicString.toString(),
    map: magicString.generateMap({ source: id }),
  }
}
