import type { Options } from '../types'
import { env } from 'node:process'

const DEFAULT_OPTIONS: Options = {
  prefix: '',
  suffix: '',
  disableLaunchEditor: false,
  disableHighlight: false,
  disablePassLogs: false,
  extendedPathFileNames: [],
  babelParserPlugins: ['typescript', 'jsx'],
  port: 3070,
  silent: false,
}

export const BUILD_OPTIONS: Options = {
  disableLaunchEditor: true,
  disableHighlight: true,
  disablePassLogs: true,
}

export function resolveOptions(options: Options): Options {
  // merge babel parser plugins
  if (options.babelParserPlugins) {
    options.babelParserPlugins = [
      ...DEFAULT_OPTIONS.babelParserPlugins!,
      ...options.babelParserPlugins,
    ]
  }

  let resolved = {
    ...DEFAULT_OPTIONS,
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
