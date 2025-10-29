import { defineEventHandler, getQuery } from 'h3'
import globalStore from '../utils/globalStore'

export default defineEventHandler(async (event) => {
  const { m, t } = getQuery(event) as { m: string, t: string }

  const peers = globalStore.get<Set<any>>('peers')

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
