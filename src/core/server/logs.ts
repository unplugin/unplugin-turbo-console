import type { DevframeNodeContext } from 'devframe'
import { timingSafeEqual } from 'node:crypto'
import { defineRpcFunction } from 'devframe'
import { s } from 'devframe/utils/simple-schema'

export function registerLogs(ctx: DevframeNodeContext, token: string) {
  const subscribers = new WeakSet<object>()
  function verify(value: string) {
    const received = Buffer.from(value)
    const expected = Buffer.from(token)
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
      throw new Error('Invalid log token')
    }
  }
  ctx.rpc.register(
    defineRpcFunction({
      name: 'anonymous:turbo-console:subscribe-logs',
      type: 'action',
      returns: s.void(),
      args: [s.string()] as const,
      handler: value => {
        verify(value)
        const session = ctx.rpc.getCurrentRpcSession()
        if (session) subscribers.add(session.rpc)
      },
    }),
  )
  ctx.rpc.register(
    defineRpcFunction({
      name: 'anonymous:turbo-console:log',
      type: 'action',
      returns: s.void(),
      args: [
        s.string(),
        s.picklist(['client', 'server']),
        s.picklist(['log', 'error', 'warn', 'info', 'table', 'dir']),
        s.string(),
      ] as const,
      handler: async (value, target, method, message) => {
        verify(value)
        const args = JSON.parse(message)
        if (!Array.isArray(args)) throw new Error('Log arguments must be an array')
        if (target === 'server') {
          console[method]('\x1B[30m\x1B[106m Client Log \x1B[49m\x1B[39m', ...args)
        } else {
          await ctx.rpc.broadcast({
            method: 'turbo-console:log',
            args: [method, message],
            filter: client => subscribers.has(client),
          })
        }
      },
    }),
  )
}
