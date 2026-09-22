import type { Inspector } from '../inspector'
import type { Options } from '../options/type'
import { defineDevframe, defineRpcFunction } from 'devframe'
import { KNOWN_EDITORS } from 'devframe/utils/launch-editor'
import { s } from 'devframe/utils/simple-schema'
import { description, homepage, name, version } from '../../../package.json'
import { resolve } from 'pathe'
import { CLIENT_DIR } from '../dir'
import { registerLogs } from './logs'

export function createConsoleDevframe(
  options: Options,
  root: string,
  filePaths: Map<string, string>,
  inspector?: Inspector,
  logToken?: string,
) {
  const editor =
    typeof options.launchEditor === 'object' ? options.launchEditor.specifiedEditor : undefined
  if (editor !== undefined && !KNOWN_EDITORS.includes(editor)) {
    throw new Error(`Unsupported editor: ${editor}`)
  }
  return defineDevframe({
    id: 'turbo-console',
    name: 'Console Inspector',
    packageName: name,
    version,
    importMetaUrl: import.meta.url,
    homepage,
    description,
    clientAssets: CLIENT_DIR,
    services:
      options.launchEditor === false
        ? []
        : [
            {
              package: '@devframes/service-open',
              options: { editor, roots: [root] },
            },
          ],
    async setup(ctx) {
      await inspector?.definition.setup(ctx)
      if (options.passLogs && logToken) registerLogs(ctx, logToken)
      if (options.launchEditor === false) return
      ctx.rpc.register(
        defineRpcFunction({
          name: 'turbo-console:resolve-file',
          type: 'query',
          args: [s.string()],
          returns: s.string(),
          handler: id => {
            for (const [path, key] of filePaths) {
              if (key === id) return resolve(root, path)
            }
            throw new Error('Unknown file link. Reload the application to generate a new link.')
          },
        }),
      )
    },
  })
}
