import { basename, extname, relative } from 'node:path'
import { Buffer } from 'node:buffer'
import { cwd } from 'node:process'
import type { Plugin } from 'vite'
import MagicString from 'magic-string'
import { simple } from 'acorn-walk'
import { SourceMapConsumer } from 'source-map'
import type { RawSourceMap } from 'source-map'
import sirv from 'sirv'
import { getConsoleStyle, launchEditorStyle, transformFileTypes } from './utils'
import { DIR_CLIENT } from './dir'
import type { Extra, Options } from './types'

function VitePluginTurboConsole(option?: Options, extra?: Extra): Plugin {
  let port = 5173
  let protocol = 'http'
  let base = '/'

  const _option = {
    prefix: option?.prefix || '',
    suffix: option?.suffix || '',
    disableLaunchEditor: option?.disableLaunchEditor || false,
  }
  return {
    name: 'vite-plugin-turbo-console',
    enforce: 'post',
    apply: 'serve',
    configResolved(config) {
      port = config.server.port || extra?.nuxtDevServerPort || 5173
      protocol = config.server.https ? 'https' : 'http'
      base = config.base || '/'
    },
    async transform(code, id) {
      if (transformFileTypes.includes(extname(id)) && !id.includes('node_modules')) {
        const magicString = new MagicString(code)
        const asyncOps: any[] = []

        const ast = this.parse(code, {
          locations: true,
        })

        simple(ast, {
          CallExpression: (node: any) => {
            const { callee, arguments: args, loc } = node
            if (callee.type === 'MemberExpression'
                && callee.object?.type === 'Identifier'
                && callee.object?.name === 'console'
                && callee.property?.type === 'Identifier'
                && callee.property?.name === 'log'
            ) {
              const fileName = basename(id)
              const fileType = extname(id)

              const { line, column } = loc.start

              const rawSourcemap = this.getCombinedSourcemap()

              const asyncOp = new SourceMapConsumer(rawSourcemap as RawSourceMap).then((consumer) => {
                const { line: originalLine, column: originalColumn } = consumer.originalPositionFor({
                  line,
                  column,
                })

                const argsName = magicString.slice(args[0].start, args[args.length - 1].end)
                  .toString()
                  .replace(/`/g, '')
                  .replace(/\n/g, '')
                  .replace(/"/g, '')

                const argumentStart = args[0].start
                const argumentEnd = args[args.length - 1].end
                const { prefix, suffix } = _option
                const _prefix = prefix ? `${prefix} \\n` : ''
                const _suffix = suffix ? `\\n ${suffix}` : ''

                const lineInfo = `${_prefix}%c🚀 ${fileName}:${originalLine} ~ ${argsName}`

                const codePosition = `${relative(cwd(), id)}:${originalLine}:${(originalColumn || 0) + 1}`
                let launchEditorString = ''
                launchEditorString = `%c🔦 Jump to Editor ${protocol}://localhost:${port}${base}__tc/i.html`

                if (base !== '/')
                  launchEditorString += `?b=${base}`

                launchEditorString += `#${Buffer.from(codePosition, 'utf-8').toString('base64')}`

                let appendLeftString = ''

                if (!_option.disableLaunchEditor)
                  appendLeftString = `"${lineInfo} %c\\n${launchEditorString}","${getConsoleStyle(fileType)}","","${launchEditorStyle}","\\n",`

                else
                  appendLeftString = `"${lineInfo} %c\\n","${getConsoleStyle(fileType)}","\\n",`

                magicString
                  .appendLeft(argumentStart, appendLeftString)
                  .appendRight(argumentEnd, `,"${_suffix}"`)
              })

              asyncOps.push(asyncOp)
            }
          },
        })

        await Promise.all(asyncOps)

        return {
          code: magicString.toString(),
          map: magicString.generateMap({ source: id, includeContent: true }),
        }
      }
    },
    configureServer(server) {
      server.middlewares.use(`${base}__tc`, sirv(DIR_CLIENT, {
        single: true,
        dev: true,
      }))
    },
  }
}

export default VitePluginTurboConsole
