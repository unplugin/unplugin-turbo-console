import { defineEventHandler, getQuery } from 'h3'
import { peersState } from '../utils/state'

export default defineEventHandler(async (event) => {
  const { m, t } = getQuery(event) as { m: string, t: string }

  const peers = peersState()

  if (peers) {
    for (const peer of peers) {
      peer.send({
        m,
        t,
      })
    }
  }

  return {
    message: 'ok',
  }
})
