import { afterEach, expect, it, vi } from 'vite-plus/test'
import { ref, shallowRef } from 'vue'
import { initDevframe } from 'devframe/initiate'
import type * as DevframeClient from 'devframe/client'
import { connectDevframe } from 'devframe/client'
import { createConsoleDevframe } from '../src/core/server/devframe'
import { resolveOptions } from '../src/core/options/resolve'
import { useConsoleClient } from '../client/app/composables/useConsoleClient'

vi.mock('devframe/client', async importOriginal => ({
  ...(await importOriginal<typeof DevframeClient>()),
  connectDevframe: vi.fn<typeof connectDevframe>(),
}))

afterEach(() => vi.unstubAllGlobals())

it.each([true, false])(
  'the connection callback reads the server-side service list (launchEditor=%s)',
  async launchEditor => {
    vi.stubGlobal('location', new URL('http://localhost/'))
    vi.stubGlobal('ref', ref)
    vi.stubGlobal('shallowRef', shallowRef)
    let mount!: () => Promise<void>
    let unmount!: () => void
    vi.stubGlobal('onMounted', (fn: typeof mount) => {
      mount = fn
    })
    vi.stubGlobal('onBeforeUnmount', (fn: typeof unmount) => {
      unmount = fn
    })
    const instance = initDevframe(
      createConsoleDevframe(
        resolveOptions({ inspector: false, launchEditor }),
        process.cwd(),
        new Map(),
      ),
      { base: '/', ws: false, mcp: false, auth: false },
    )
    let client: Awaited<ReturnType<typeof connectDevframe>> | undefined
    try {
      await instance.ready
      const connectionMeta = await (
        await instance.handler(new Request('http://localhost/__connection.json'))
      ).json()
      const actual = await vi.importActual<typeof DevframeClient>('devframe/client')
      client = await actual.connectDevframe({
        baseURL: 'http://localhost/',
        connectionMeta,
        webmcp: false,
        simpleAuth: false,
        sseOptions: { fetch: (input, init) => instance.handler(new Request(input, init)) },
      })
      vi.mocked(connectDevframe).mockResolvedValue(client)
      const onConnected = vi.fn<Parameters<typeof useConsoleClient>[0]>(async current => {
        expect(current.services.keys()).toEqual(launchEditor ? ['@devframes/service-open'] : [])
        expect(!!current.services.get('@devframes/service-open')).toBe(launchEditor)
      })
      const result = useConsoleClient(onConnected)
      await mount()
      await vi.waitFor(() => expect(result.status.value).toBe('success'))
      expect(onConnected).toHaveBeenCalledOnce()
    } finally {
      unmount?.()
      client?.close?.()
      await instance.close()
    }
  },
)
