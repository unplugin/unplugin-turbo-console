import { basename, extname } from 'node:path'
import type { PluginOption } from 'vite'
import MagicString from 'magic-string'
import { simple } from 'acorn-walk'
import { SourceMapConsumer } from 'source-map'
import type { RawSourceMap } from 'source-map'
import { getConsoleStyle, transformFileTypes } from './utils'

function VitePluginTurboConsole(): PluginOption {
  return {
    name: 'vite-plugin-turbo-console',
    enforce: 'post',
    apply: 'serve',
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
                const { line: originalLine } = consumer.originalPositionFor({
                  line,
                  column,
                })

                const argsName = magicString.slice(args[0].start, args[args.length - 1].end).toString()
                  .replaceAll('`', '')
                  .replaceAll('\n', '')
                  .replaceAll('\"', '')

                const argumentStart = args[0].start
                magicString.appendLeft(
                  argumentStart,
                  `"%c${fileName}:${originalLine} ~ ${argsName}","${getConsoleStyle(fileType)}",`)
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
  }
}

export default VitePluginTurboConsole
export type { PluginOption }
