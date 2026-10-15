import { afterEach, expect, it, vi } from 'vite-plus/test'
import { resolveOptions } from '../src/core/options/resolve'
import { transform } from '../src/core/transform'
import { printInfo } from '../src/core/utils'
import {
  initVirtualModulesGenerator,
  viteDevToolsVirtualModuleGenerator,
} from '../src/core/utils/virtualModules'

vi.mock('@nuxt/kit', () => ({
  defineNuxtModule: (definition: unknown) => definition,
  addImports: vi.fn<() => void>(),
  addVitePlugin: vi.fn<() => void>(),
  addWebpackPlugin: vi.fn<() => void>(),
}))

vi.mock('get-port-please', () => ({
  getPort: vi.fn<(options: { port: number }) => Promise<number>>(async ({ port }) => port),
}))

afterEach(() => {
  vi.restoreAllMocks()
})

async function launchEditorUrl(host: string) {
  const result = await transform({
    code: 'console.log(a)',
    id: '/home/runner/host.ts',
    root: '/home/runner',
    filePaths: new Map(),
    options: resolveOptions({ server: { host, port: 3070 } }),
  })
  return /http:\/\/\S+:3070#/.exec(result!.code)?.[0]
}

it('brackets IPv6 hosts in launch editor links', async () => {
  expect(await launchEditorUrl('::1')).toBe('http://[::1]:3070#')
  expect(await launchEditorUrl('127.0.0.1')).toBe('http://127.1:3070#')
  expect(await launchEditorUrl('192.168.1.10')).toBe('http://192.168.1.10:3070#')
})

it('brackets IPv6 hosts in the printed Inspector URL', () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {})
  printInfo(resolveOptions({ server: { host: '::1', port: 3070 } }))
  expect(log.mock.calls[0]?.[0]).toContain('http://[::1]:3070/inspector')
})

it('brackets IPv6 hosts in virtual modules', () => {
  expect(initVirtualModulesGenerator('::1', 3070, false, 'token')).toContain(
    'http://[::1]:3070/__sse',
  )
  expect(viteDevToolsVirtualModuleGenerator('::1', 3070, false)).toContain(
    'http://[::1]:3070/inspector',
  )
})

it('brackets IPv6 hosts in the Nuxt DevTools tab', async () => {
  const { default: nuxtModule } = await import('../src/nuxt')
  const tabs: { view: { src: string } }[] = []
  const nuxt = {
    hook(name: string, callback: (value: unknown) => void) {
      if (name === 'devtools:customTabs') callback(tabs)
    },
  }
  await (nuxtModule as any).setup({ server: { host: '::1', port: 3070 } }, nuxt)
  expect(tabs[0]?.view.src).toBe('http://[::1]:3070/inspector')
})
