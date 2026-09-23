import { mkdtemp, rm, writeFile, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { DevframeRpcServerFunctions, DevframeRpcClientFunctions } from 'devframe'
import { initDevframe } from 'devframe/initiate'
import { createRpcClient } from 'devframe/rpc/client'
import { createSseRpcChannel } from 'devframe/rpc/transports/sse-client'
import { describe, expect, it } from 'vite-plus/test'
import { normalize } from 'pathe'
import { createConsoleDevframe } from '../src/core/server/devframe'
import { resolveOptions } from '../src/core/options/resolve'
import { INSPECTOR_BASE } from '../src/core/inspector'

describe('Devframe Open', () => {
  it('supports short links and line-column locations only with the editor enabled, and restricts project paths and editors', async () => {
    const root = await mkdtemp(join(tmpdir(), 'turbo-open-'))
    await writeFile(join(root, 'main.ts'), '')
    await symlink(tmpdir(), join(root, 'outside'))
    const paths = new Map([['main.ts', 'abcd']])
    const options = resolveOptions({ inspector: false, launchEditor: { specifiedEditor: 'code' } })
    const instance = initDevframe(createConsoleDevframe(options, root, paths), {
      base: INSPECTOR_BASE,
      ws: false,
      mcp: false,
      auth: false,
    })
    try {
      await instance.ready
      const ctx = await instance.context
      expect(ctx.rpc.sharedState.keys()).not.toContain('turbo-console:expressions')
      expect(ctx.services.get('@devframes/service-open')).toBeDefined()
      expect((await ctx.rpc.sharedState.get('devframe:services')).value()).toHaveProperty(
        '@devframes/service-open',
      )
      expect(normalize(await ctx.rpc.invokeLocal('turbo-console:resolve-file', 'abcd'))).toBe(
        normalize(join(root, 'main.ts')),
      )
      await expect(ctx.rpc.invokeLocal('turbo-console:resolve-file', 'missing')).rejects.toThrow(
        'Unknown file',
      )
      await expect(
        ctx.rpc.invokeLocal('devframes:service:open:open-in-editor', { path: '../escape.ts' }),
      ).rejects.toThrow(/outside|Invalid/i)
      await expect(
        ctx.rpc.invokeLocal('devframes:service:open:open-in-editor', {
          path: join(root, 'outside/escape.ts'),
        }),
      ).rejects.toThrow(/outside|Invalid/i)
      await expect(
        ctx.rpc.invokeLocal('devframes:service:open:open-in-editor', {
          path: 'main.ts',
          editor: 'arbitrary-command' as any,
        }),
      ).rejects.toThrow(/outside|Invalid/i)
    } finally {
      await instance.close()
      await rm(root, { recursive: true, force: true })
    }
  })

  it('does not register the service when launchEditor is disabled and clearly errors for unsupported editors', async () => {
    const options = resolveOptions({ launchEditor: false, inspector: false })
    const instance = initDevframe(createConsoleDevframe(options, tmpdir(), new Map()), {
      base: INSPECTOR_BASE,
      ws: false,
      mcp: false,
      auth: false,
    })
    try {
      await instance.ready
      const ctx = await instance.context
      expect(ctx.services.get('@devframes/service-open')).toBeUndefined()
      expect(ctx.rpc.definitions.has('turbo-console:resolve-file')).toBe(false)
    } finally {
      await instance.close()
    }
    expect(() =>
      createConsoleDevframe(
        resolveOptions({ launchEditor: { specifiedEditor: 'custom' as any } }),
        tmpdir(),
        new Map(),
      ),
    ).toThrow('Unsupported editor')
  })

  it('requires authentication by default when the editor runs independently', async () => {
    const instance = initDevframe(
      createConsoleDevframe(resolveOptions({ inspector: false }), tmpdir(), new Map()),
      {
        base: INSPECTOR_BASE,
        ws: false,
        mcp: false,
      },
    )
    try {
      await instance.ready
      const channel = createSseRpcChannel({
        url: `http://localhost${INSPECTOR_BASE}__sse`,
        fetch: (input, init) => instance.handler(new Request(input, init)),
      })
      try {
        const rpc = createRpcClient<
          DevframeRpcServerFunctions,
          Partial<DevframeRpcClientFunctions>
        >({}, { channel, rpcOptions: { timeout: 1000 } })
        await expect(rpc.$call('turbo-console:resolve-file', 'abcd')).rejects.toThrow(/auth|trust/i)
      } finally {
        channel.close()
      }
    } finally {
      await instance.close()
    }
  })
})
