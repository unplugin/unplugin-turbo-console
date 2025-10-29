import { effect } from 'alien-signals'
import { defineWebSocketHandler } from 'h3'
import { version } from '../../../../package.json'
import { expressionsMapState } from '../../utils/signal'

const connections = new Map<string, any>()

function formatedResponse(expressionsMap: any) {
  return {
    timestamp: Date.now(),
    expressionsMap,
    version,
  }
}

effect(() => {
  const expressionsMap = expressionsMapState()
  connections.forEach((peer) => {
    peer.send(formatedResponse(Object.fromEntries(expressionsMap)))
  })
})

export default defineWebSocketHandler({
  open(peer) {
    connections.set(peer.id, peer)
    peer.send(formatedResponse(Object.fromEntries(expressionsMapState())))
  },
})
