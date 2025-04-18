import type { Context } from './../../src/types'

const id = '/home/runner/main.js'

export const EMPTY: Context = {
  options: { server: { port: 3070 } },
  code: `console.log('hello javascript')`,
  id,
}

export const WITH_PREFIX: Context = {
  options: {
    prefix: '-------',
    suffix: '-------',
    launchEditor: false,
    highlight: false,
    server: { port: 3070 },
  },
  code: `console.log('hello javascript')`,
  id,
}

export const DISABLE_LAUNCH_EDITOR: Context = {
  options: {
    launchEditor: false,
    server: { port: 3070 },
  },
  code: `console.log('hello javascript')`,
  id,
}

export const DISABLE_HIGHLIGHT: Context = {
  options: {
    highlight: false,
    server: { port: 3070 },
  },
  code: `console.log('hello javascript')`,
  id,
}

export const DISABLE_ALL: Context = {
  options: {
    launchEditor: false,
    highlight: false,
    server: { port: 3070 },
  },
  code: `console.log('hello javascript')`,
  id,
}

export const EXTENDED_PATH: Context = {
  options: {
    highlight: { extendedPathFileNames: ['index'] },
    server: { port: 3070 },
  },
  code: `console.log('hello javascript')`,
  id: '/home/runner/index.js',
}
