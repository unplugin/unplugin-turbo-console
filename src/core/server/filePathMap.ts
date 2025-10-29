import { defineEventHandler } from 'h3'
import { version } from '../../../package.json'
import globalStore from '../utils/globalStore'

export default defineEventHandler(async () => {
  try {
    const filePathMap = globalStore.get<Map<string, string>>('filePathMap')

    return {
      status: 'success',
      filePathMap: filePathMap ? Object.fromEntries(filePathMap) : {},
      version,
    }
  }
  catch (error) {
    return {
      status: 'error',
      filePathMap: {},
      version,
      message: String(error),
    }
  }
})
