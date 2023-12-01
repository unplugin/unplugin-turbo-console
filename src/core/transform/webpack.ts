import { basename, extname, relative } from 'node:path'
import { cwd } from 'node:process'
import { Buffer } from 'node:buffer'
import { parse } from '@vue/compiler-sfc'
import type { WithScope } from 'ast-kit'
import { babelParse, getLang, walkAST } from 'ast-kit'
import type { Node } from '@babel/types'
import MagicString from 'magic-string'
import type { Context } from '../../types'
import { getConsoleStyle, launchEditorStyle } from '../utils'

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
      if (node.type === 'CallExpression'
        && node.callee.type === 'MemberExpression'
        && node.callee.object.type === 'Identifier'
        && node.callee.object.name === 'console'
        && node.callee.property.type === 'Identifier'
        && node.callee.property.name === 'log'
        && node.arguments?.length > 0
      ) {
        const urlObject = new URL(id, 'file://')
        const fileName = basename(urlObject.pathname)
        const fileType = extname(urlObject.pathname)

        const { line, column } = node.loc!.start
        const args = node.arguments

        const argsStart = args[0].start! + sfcLocInfo.start.offset
        const argsEnd = args[args.length - 1].end! + sfcLocInfo.start.offset
        const argType = args[0].type
        const { prefix, suffix, disableLaunchEditor } = options
        const _prefix = prefix ? `${prefix} \\n` : ''
        const _suffix = suffix ? `\\n ${suffix}` : ''

        const argsName = magicString.slice(argsStart, argsEnd)
          .toString()
          .replace(/`/g, '')
          .replace(/\n/g, '')
          .replace(/"/g, '')

        const originalLine = line + sfcLocInfo.start.line - 1
        const originalColumn = column

        // not output when argtype is string or number
        const lineInfo = `${_prefix}%c🚀 ${fileName}:${originalLine}${['StringLiteral', 'NumericLiteral'].includes(argType) ? '' : ` ~ ${argsName}`}`
        const codePosition = `${relative(cwd(), urlObject.pathname)}:${originalLine}:${(originalColumn || 0) + 1}`

        const launchEditorString = `%c🔦 Jump to Editor http://localhost:3000/client#${Buffer.from(codePosition, 'utf-8').toString('base64')}`
        let appendLeftString = ''

        if (!disableLaunchEditor)
          appendLeftString = `"${lineInfo} %c\\n${launchEditorString}","${getConsoleStyle(fileType)}","","${launchEditorStyle}","\\n",`

        else
          appendLeftString = `"${lineInfo} %c\\n","${getConsoleStyle(fileType)}","\\n",`

        magicString
          .appendLeft(argsStart, appendLeftString)
          .appendRight(argsEnd, `,"${_suffix}"`)
      }
    },
  })

  return {
    code: magicString.toString(),
    map: magicString.generateMap({ source: id }),
  }
}
