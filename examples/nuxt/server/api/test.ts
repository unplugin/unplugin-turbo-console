import { ClientConsole } from 'unplugin-turbo-console/helper'

export default defineEventHandler((event) => {
  ClientConsole.log('fff')
  return {
    test: 'test',
  }
})
