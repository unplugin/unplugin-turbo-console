/* eslint-disable no-console */
import { defineWebSocketHandler } from 'h3'
import { PLUGIN_NAME } from '../../constants'
import globalStore from '../../utils/globalStore'

export default defineWebSocketHandler({
  open(peer) {
    const peers = globalStore.get<Set<any>>('peers')
    if (peers) {
      peers.add(peer)
      globalStore.set('peers', peers)
    }
  },
  message(_peer, message) {
    try {
      const { m, t } = JSON.parse(message.toString())
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      console[t]('\x1B[30m\x1B[106m Client Log \x1B[49m\x1B[39m', ...JSON.parse(m))
    }
    catch (error) {
      console.error(error)
    }
  },
  error(peer, error) {
    console.error(`${PLUGIN_NAME}: ${peer} connection error ${error}`)
  },
})
