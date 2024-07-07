import type { Peer } from 'crossws'
import { defineWebSocketHandler } from 'h3'
import { PLUGIN_NAME } from '../constants'

if (globalThis.UNPLUGIN_TURBO_CONSOLE_PEERS_SET === undefined) {
  globalThis.UNPLUGIN_TURBO_CONSOLE_PEERS_SET = new Set<Peer>()
}

export default defineWebSocketHandler({
  open(peer) {
    globalThis.UNPLUGIN_TURBO_CONSOLE_PEERS_SET!.add(peer)
  },
  error(peer, error) {
    console.error(`${PLUGIN_NAME}: ${peer} connection error ${error}`)
  },
})
