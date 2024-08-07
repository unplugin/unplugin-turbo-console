import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const { m, t } = getQuery(event) as { m: string, t: string }

  const peers = globalThis.UNPLUGIN_TURBO_CONSOLE_PEERS_SET

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
