import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'pathe'

export function getClientDir() {
  const dir = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url))
  return resolve(dir, './client/public')
}
