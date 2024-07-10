import { tConsole } from 'unplugin-turbo-console/helper'

export default defineEventHandler((event) => {
  tConsole.log('fff')

  return {
    test: 'test',
  }
})
