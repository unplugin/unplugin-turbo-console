import { cwd } from 'node:process'
import { defineEventHandler, getQuery } from 'h3'
// @ts-expect-error no types
import launch from 'launch-editor'
import { resolve } from 'pathe'
import { version } from '../../../package.json'
import type { Options } from './../../types'

export function launchEditor(specifiedEditor: Options['specifiedEditor']) {
  return defineEventHandler(async (event) => {
    try {
      const { position } = getQuery(event) as { position: string }
      const filePathMap = globalThis.TurboConsoleFilePathMap

      if (!filePathMap)
        throw new Error('filePathMap is undefined')

      const parsed = position.split(',')
      const filePathMapString = parsed[0]
      const line = parsed[1] || 1
      const column = parsed[2] || 1

      let filePath = ''

      for (const [key, value] of filePathMap) {
        if (value === filePathMapString) {
          filePath = key
          break
        }
      }

      launch(resolve(cwd(), `${filePath}:${line}:${column}`), specifiedEditor)
      return {
        status: 'success',
        version,
      }
    }
    catch (error) {
      return {
        status: 'error',
        version,
        message: String(error),
      }
    }
  })
}
