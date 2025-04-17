import { defineEventHandler } from 'h3'
import { version } from '../../../package.json'
import { filePathMapState } from '../utils/state'

export default defineEventHandler(async () => {
  try {
    return {
      status: 'success',
      filePathMap: Object.fromEntries(filePathMapState()),
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
