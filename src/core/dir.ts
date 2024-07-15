import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'pathe'

function getImportMetaUrl() {
  return typeof document === 'undefined'
    ? new URL(`file:${__filename}`).href
    : (document.currentScript && (document.currentScript as any).src)
    || new URL('main.js', document.baseURI).href
}

export const importMetaUrl = /* @__PURE__ */ getImportMetaUrl()

export const DIR_DIST = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(importMetaUrl))

export const CLIENT_DIR = resolve(DIR_DIST, './client')
