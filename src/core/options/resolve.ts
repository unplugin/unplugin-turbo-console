import type { Options } from './type'
import { env } from 'node:process'

export function resolveOptions(options: Partial<Options> = {}): Required<Options> {
  const resolved = {
    launchEditor: options.launchEditor ?? true,
    highlight: options.highlight ?? true,
    passLogs: options.passLogs ?? true,
    inspector: options.inspector ?? { printUrl: true },
    server: {
      port: options.server?.port ?? 3070,
      host: options.server?.host ?? '127.0.0.1',
    },
    prefix: options.prefix ?? '',
    suffix: options.suffix ?? '',
  }

  if (env.NODE_ENV === 'production') {
    resolved.launchEditor = false
    resolved.highlight = false
    resolved.passLogs = false
    resolved.inspector = false
  }

  return resolved
}
