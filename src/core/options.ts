import { env } from 'node:process'
import type { Options } from '../types'

const DETAULT_OPTIONS: Options = {
  prefix: '',
  suffix: '',
  disableLaunchEditor: false,
  disableHighlight: false,
  extendedPathFileNames: [],
  port: 3070,
}

export const BUILD_OPTIONS: Options = {
  disableLaunchEditor: true,
  disableHighlight: true,
}

export function resolveOptions(options: Options): Options {
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
