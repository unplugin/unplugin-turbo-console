import type { Context } from './../../src/types'

const id = '/home/runner/main.js'

export const EMPTY: Context = {
  options: { port: 3070 },
  code: `console.log('hello javascript')`,
  id,
}

export const WITH_PREFIX: Context = {
  options: {
    prefix: '-------',
    suffix: '-------',
    disableLaunchEditor: false,
    disableHighlight: false,
    port: 3070,
  },
  code: `console.log('hello javascript')`,
  id,
}

export const DISABLE_LAUNCH_EDITOR: Context = {
  options: {
    disableLaunchEditor: true,
    port: 3070,
  },
  code: `console.log('hello javascript')`,
  id,
}

export const DISABLE_HIGHLIGHT: Context = {
  options: {
    disableHighlight: true,
    port: 3070,
  },
  code: `console.log('hello javascript')`,
  id,
}

export const DISABLE_ALL: Context = {
  options: {
    disableLaunchEditor: true,
    disableHighlight: true,
    port: 3070,
  },
  code: `console.log('hello javascript')`,
  id,
}

export const EXTENDED_PATH: Context = {
  options: {
    extendedPathFileNames: ['index'],
    port: 3070,
  },
  code: `console.log('hello javascript')`,
  id: '/home/runner/work/unplugin-turbo-console/src/index.js',
}
