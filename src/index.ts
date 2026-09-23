import type { UnpluginFactory } from 'unplugin'
import type { Options } from './core/options/type'
import type { Context } from './types'
import { cwd, env } from 'node:process'
import { randomUUID } from 'node:crypto'
import { relative } from 'pathe'
import { createUnplugin } from 'unplugin'
import { PLUGIN_NAME, VirtualModules } from './core/constants'
import { resolveOptions } from './core/options/resolve'
import { createServer } from './core/server/index'
import { transform } from './core/transform/index'
import { loadPkg, printInfo } from './core/utils'
import { createInspector } from './core/inspector'
import {
  initVirtualModulesGenerator,
  serverInfoVirtualModule,
  themeDetectVirtualModule,
  viteDevToolsVirtualModuleGenerator,
} from './core/utils/virtualModules'

// 同一项目的多个编译实例共用状态与服务，不同项目按根目录隔离。
const projects = new Map<
  string,
  {
    inspector?: ReturnType<typeof createInspector>
    server?: ReturnType<typeof createServer>
    filePaths: Map<string, string>
    users: number
    logToken: string
  }
>()

export const unpluginFactory: UnpluginFactory<Options | undefined> = (rawOptions = {}) => {
  const options = resolveOptions(rawOptions)

  let root = cwd()
  let project: ReturnType<typeof projects.get>

  function getProject() {
    if (!project) {
      project = projects.get(root) ?? { users: 0, filePaths: new Map(), logToken: randomUUID() }
      project.users++
      projects.set(root, project)
    }
    return project
  }

  function getInspector() {
    if (options.inspector === false) return undefined
    return (getProject().inspector ??= createInspector(root))
  }

  async function startTurboConsoleServer(print = () => printInfo(options)) {
    const current = getProject()
    current.server ??= createServer(
      options,
      print,
      getInspector(),
      root,
      current.filePaths,
      current.logToken,
    ).catch(error => {
      current.server = undefined
      throw error
    })
    const server = await current.server
    if (server) options.server.port = server.port
  }

  async function closeServer() {
    const current = project
    project = undefined
    if (!current || --current.users > 0) return
    projects.delete(root)
    await (await current.server)?.close()
    current.inspector?.clear()
    current.filePaths.clear()
  }

  return {
    name: PLUGIN_NAME,
    enforce: 'pre',
    resolveId(id) {
      if (Object.values(VirtualModules).includes(id)) {
        return `\0${id}`
      }
      return undefined
    },
    loadInclude(id) {
      if (!id.startsWith('\0')) return false
      id = id.slice(1)
      return Object.values(VirtualModules).includes(id)
    },
    load(id) {
      if (!id.startsWith('\0')) return
      id = id.slice(1)

      if (id === VirtualModules.Init) {
        return initVirtualModulesGenerator(
          options.server.port!,
          env.NODE_ENV === 'production',
          options.passLogs ? getProject().logToken : undefined,
        )
      } else if (id === VirtualModules.ThemeDetect) {
        return themeDetectVirtualModule(env.NODE_ENV === 'production')
      } else if (id === VirtualModules.VueDevTools) {
        return viteDevToolsVirtualModuleGenerator(
          options.server.port!,
          env.NODE_ENV === 'production',
        )
      } else if (id === VirtualModules.ServerInfo) {
        return serverInfoVirtualModule(options.server.host!, options.server.port!)
      }
      return undefined
    },
    transform: {
      filter: {
        id: {
          include: [
            /\.vue$/,
            /\.vue(\.[tj]sx?)?\?vue/,
            /\.vue\?v=/,
            /\.ts$/,
            /\.tsx$/,
            /\.js$/,
            /\.jsx$/,
            /\.svelte$/,
            /\.astro$/,
          ],
          exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
        },
      },
      async handler(code, id) {
        try {
          const context: Context = {
            code,
            id,
            options,
            inspector: getInspector(),
            filePaths: getProject().filePaths,
            root,
          }

          return await transform(context)
        } catch (error) {
          console.error(`[${PLUGIN_NAME}]`, `Transform ${relative(cwd(), id)} error:`, error)
          return code
        }
      },
    },
    vite: {
      closeWatcher: closeServer,
      configResolved(config) {
        root = config.root
        if (config.command === 'build') options.inspector = false
      },
      async configureServer(viteServer) {
        viteServer.httpServer?.once('close', () => {
          void closeServer()
        })
        await startTurboConsoleServer(() => {
          const printUrls = viteServer.printUrls
          void loadPkg('@nuxt/kit').then(hasNuxt => {
            if (hasNuxt) printInfo(options, ' ')
            else
              viteServer.printUrls = () => {
                printUrls()
                printInfo(options)
              }
          })
        })
      },
    },
    rollup: { closeWatcher: closeServer },
    rolldown: { closeWatcher: closeServer },
    esbuild: {
      setup(build) {
        build.onDispose(closeServer)
      },
    },
    farm: {
      async configureDevServer(farmServer) {
        farmServer.server?.once('close', () => {
          void closeServer()
        })
        await startTurboConsoleServer()
      },
    },
    webpack(compiler) {
      root = compiler.context
      if (compiler.options.mode !== 'development') options.inspector = false
      compiler.hooks.shutdown.tapPromise(PLUGIN_NAME, closeServer)
      if (compiler.options.mode === 'development') {
        compiler.hooks.done.tapPromise(PLUGIN_NAME, async state => {
          if (state.hasErrors()) return

          await startTurboConsoleServer()
        })
      }
    },
    rspack(compiler) {
      root = compiler.context
      if (compiler.options.mode !== 'development') options.inspector = false
      compiler.hooks.shutdown.tapPromise(PLUGIN_NAME, closeServer)
      if (compiler.options.mode === 'development') {
        compiler.hooks.done.tapPromise(PLUGIN_NAME, async state => {
          if (state.hasErrors()) return

          await startTurboConsoleServer()
        })
      }
    },
    watchChange(id, change) {
      const inspector = project?.inspector
      if (options.inspector === false || !inspector) return
      const filePath = new URL(id, 'file://').pathname
      if (change.event === 'update' || change.event === 'delete') {
        inspector.invalidate(relative(root, filePath))
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin

export * from './types'
