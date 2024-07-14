import { ClientConsole } from 'unplugin-turbo-console/helper'

export function GET() {
  ClientConsole.log('xxx')
  return {
    body: 'test'
  }
}
