import { basename, extname, relative } from 'node:path'
import type { PluginOption } from 'vite'
import MagicString from 'magic-string'
import { simple } from 'acorn-walk'
import { SourceMapConsumer } from 'source-map'
import type { RawSourceMap } from 'source-map'
import sirv from 'sirv'
import { getConsoleStyle, launchEditorStyle, transformFileTypes } from './utils'
import { DIR_CLIENT } from './dir'

interface TurboConsoleOptions {
  /**
   * Add a string prefix to the console log.
   */
  prefix?: string
  /**
   * Add a string suffix to the console log.
   */
  suffix?: string
  /**
   * Whether to disable the launch editor feature.
   * default: false
   */
  disableLaunchEditor?: boolean
}

function VitePluginTurboConsole(option?: TurboConsoleOptions): PluginOption {
  let port = 5173
  let protocol = ''
  let base = ''

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
      port = config.server.port || 5173
      protocol = config.server.https ? 'https' : 'http'
      base = config.base
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
                  .replaceAll('`', '')
                  .replaceAll('\n', '')
                  .replaceAll('\"', '')
                const argumentStart = args[0].start
                const argumentEnd = args[args.length - 1].end
                const { prefix, suffix } = _option
                const _prefix = prefix ? `${prefix} \\n` : ''
                const _suffix = suffix ? `\\n ${suffix}` : ''

                const lineInfo = `${_prefix}%c🚀 ${fileName}:${originalLine} ~ ${argsName}`

                const filePath = relative(process.cwd(), id)
                let launchEditor = ''
                launchEditor = `%c🔦 Jump to Editor ${protocol}://localhost:${port}${base}__tc/i.html?f=${filePath}&l=${originalLine}&c=${originalColumn}`

                if (base !== '/')
                  launchEditor += `&b=${base}`

                let appendLeftString = ''

                if (!_option.disableLaunchEditor)
                  appendLeftString = `"${lineInfo} %c\\n${launchEditor}","${getConsoleStyle(fileType)}","","${launchEditorStyle}","\\n",`

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
      server.middlewares.use(`${base || '/'}__tc`, sirv(DIR_CLIENT, {
        single: true,
        dev: true,
      }))
    },
  }
}

export default VitePluginTurboConsole
export type { PluginOption }
