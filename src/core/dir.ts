import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'node:url'

export const DIR_DIST = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url))

export const DIR_CLIENT = resolve(DIR_DIST, './client/index.html')
