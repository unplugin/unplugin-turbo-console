import { client } from 'unplugin-turbo-console/helper'

export function GET() {
  client.log('xxx')
  return {
    body: 'test'
  }
}
