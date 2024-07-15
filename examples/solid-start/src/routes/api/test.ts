import { Client } from 'unplugin-turbo-console/helper'

export function GET() {
  Client.log('xxx')
  return {
    body: 'test'
  }
}
