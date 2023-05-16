import { basename, extname } from 'node:path'
import type { PluginOption } from 'vite'
import MagicString from 'magic-string'
import walk from 'acorn-walk'
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

        walk.simple(ast, {
          CallExpression: (node: any) => {
            const { callee, arguments: args } = node
            if (callee.type === 'MemberExpression'
                  && callee.object?.type === 'Identifier'
                  && callee.object?.name === 'console'
                  && callee.property.type === 'Identifier'
                  && callee.property?.name === 'log'
            ) {
              const fileName = basename(id)
              const fileType = extname(id)
              const argNames = args.map((item: any) => item.name)
              const { line, column } = node.loc.start

              const rawSourcemap = this.getCombinedSourcemap()

              const asyncOp = new SourceMapConsumer(rawSourcemap as RawSourceMap).then((consumer) => {
                const { line: originalLine } = consumer.originalPositionFor({
                  line,
                  column,
                })

                const argumentStart = args[0].start
                magicString.appendLeft(
                  argumentStart,
                  `"%c${fileName}:${originalLine} ~ ${String(argNames)}","${getConsoleStyle(fileType)}",`)
              })

              asyncOps.push(asyncOp)
            }
          },
        })

        await Promise.all(asyncOps)

        return {
          code: magicString.toString(),
        }
      }
    },
  }
}

export default VitePluginTurboConsole
export type { PluginOption }
