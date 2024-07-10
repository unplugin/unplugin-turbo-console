import { tConsole } from 'unplugin-turbo-console/helper'

export function GET() {
  tConsole.log('xxx')
  return {
    body: 'test'
  }
}
