import type { UnpluginFactory } from 'unplugin'
import type { Context, Options } from './types'
import { cwd, env } from 'node:process'
import { checkPort, getRandomPort } from 'get-port-please'
import { relative } from 'pathe'
import { createUnplugin } from 'unplugin'
import { v4 as uuidv4 } from 'uuid'
import { PLUGIN_NAME, VirtualModules } from './core/constants'
import { resolveOptions } from './core/options'
import { createServer } from './core/server/index'
import { transform } from './core/transform/index'
import { loadPkg, printInfo } from './core/utils'
import { expressionsMapState, serverState } from './core/utils/state'
import { initVirtualModulesGenerator, themeDetectVirtualModule } from './core/utils/virtualModules'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (rawOptions = {}) => {
  const options = resolveOptions(rawOptions)

  async function detectPort() {
    const isAvailable = await checkPort(options.server.port!)
    if (!isAvailable)
      options.server.port = await getRandomPort()
  }

  async function startTurboConsoleServer() {
    // Avoid start server multiple times
    if (!serverState()) {
      serverState(true)
      await detectPort()
      printInfo(options)
      createServer(options)
    }
  }

  return {
    name: PLUGIN_NAME,
    enforce: 'pre',
    resolveId(id) {
      if (Object.values(VirtualModules).includes(id)) {
        return `\0${id}`
      }
    },
    loadInclude(id) {
      if (!id.startsWith('\0'))
        return false
      id = id.slice(1)
      return Object.values(VirtualModules).includes(id)
    },
    load(id) {
      if (!id.startsWith('\0'))
        return
      id = id.slice(1)

      if (id === VirtualModules.Init) {
        return initVirtualModulesGenerator(options.server.port!, env.NODE_ENV === 'production')
      }
      else if (id === VirtualModules.ThemeDetect) {
        return themeDetectVirtualModule(env.NODE_ENV === 'production')
      }
    },
    transform: {
      filter: {
        id: {
          include: [/\.vue$/, /\.vue(\.[tj]sx?)?\?vue/, /\.vue\?v=/, /\.ts$/, /\.tsx$/, /\.js$/, /\.jsx$/, /\.svelte$/, /\.astro$/],
          exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
        },
      },
      async handler(code, id) {
        try {
          const context: Context = {
            code,
            id,
            options,
          }

          return await transform(context)
        }
        catch (error) {
          console.error(`[${PLUGIN_NAME}]`, `Transform ${relative(cwd(), id)} error:`, error)
          return code
        }
      },
    },
    vite: {
      async configureServer(server) {
        // Avoid start server multiple times
        if (!serverState()) {
          serverState(true)
          await detectPort()
          createServer(options)

          const _print = server.printUrls

          const NuxtKit = await loadPkg('@nuxt/kit')
          if (NuxtKit) {
            printInfo(options, ' ')
          }
          else {
            server.printUrls = () => {
              _print()
              printInfo(options)
            }
          }
        }
      },
    },
    farm: {
      configureDevServer() {
        startTurboConsoleServer()
      },
    },
    webpack(compiler) {
      if (compiler.options.mode === 'development') {
        compiler.hooks.done.tap(PLUGIN_NAME, async (state) => {
          if (state.hasErrors())
            return

          startTurboConsoleServer()
        })
      }
    },
    rspack(compiler) {
      if (compiler.options.mode === 'development') {
        compiler.hooks.done.tap(PLUGIN_NAME, async (state) => {
          if (state.hasErrors())
            return

          startTurboConsoleServer()
        })
      }
    },
    watchChange(id, change) {
      const urlObject = new URL(id, 'file://')
      const filePath = urlObject.pathname
      const relativePath = relative(cwd(), filePath)

      if (change.event === 'update') {
        const currentMap = expressionsMapState()
        const newMap = new Map(currentMap)
        newMap.set(relativePath, {
          id: uuidv4(),
          filePath: relativePath,
          expressions: [],
        })
        expressionsMapState(newMap)
      }
      else if (change.event === 'delete') {
        const currentMap = expressionsMapState()
        const newMap = new Map(currentMap)
        newMap.delete(relativePath)
        expressionsMapState(newMap)
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin

export * from './types'
