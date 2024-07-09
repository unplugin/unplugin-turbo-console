import { env } from 'node:process'
import type { Options } from '../types'

const DETAULT_OPTIONS: Options = {
  prefix: '',
  suffix: '',
  disableLaunchEditor: false,
  disableHighlight: false,
  extendedPathFileNames: [],
  babelParserPlugins: ['typescript', 'jsx'],
  port: 3070,
  passServerLogs: true,
}

export const BUILD_OPTIONS: Options = {
  disableLaunchEditor: true,
  disableHighlight: true,
  passServerLogs: false,
}

export function resolveOptions(options: Options): Options {
  // merge babel parser plugins
  if (options.babelParserPlugins) {
    options.babelParserPlugins = [
      ...DETAULT_OPTIONS.babelParserPlugins!,
      ...options.babelParserPlugins,
    ]
  }

  let resolved = {
    ...DETAULT_OPTIONS,
    ...options,
  }

  if (env.NODE_ENV === 'production') {
    resolved = {
      ...resolved,
      ...BUILD_OPTIONS,
    }
  }

  return resolved
}
