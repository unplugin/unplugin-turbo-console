import { cwd } from 'node:process'
import { defineEventHandler, getQuery } from 'h3'
import launch from 'launch-editor'
import { resolve } from 'pathe'
import { version } from '../../../package.json'
import { filePathMapState } from '../utils/state'

export function launchEditor(specifiedEditor?: string) {
  return defineEventHandler(async (event) => {
    try {
      const { position, path } = getQuery(event) as { position?: string, path?: string }
      if (position) {
        const filePathMap = filePathMapState()

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

        launch(resolve(cwd(), `${filePath}:${line}:${column}`), specifiedEditor, (fileName: any, errorMsg: any) => {
          if (errorMsg)
            throw new Error(errorMsg)
          else if (fileName)
            throw new Error(`Could not open ${fileName}`)
        })
      }
      else if (path) {
        launch(resolve(cwd(), path), specifiedEditor, (fileName: any, errorMsg: any) => {
          if (errorMsg)
            throw new Error(errorMsg)
          else if (fileName)
            throw new Error(`Could not open ${fileName}`)
        })
      }
      else {
        throw new Error('No position or path provided')
      }

      return {
        status: 'success',
        version,
      }
    }
    catch (error: any) {
      return {
        status: 'error',
        version,
        message: error.message,
      }
    }
  })
}
