import type { UnpluginBuildContext, UnpluginContext, UnpluginContextMeta } from 'unplugin'

export interface Options {
  /**
   * Add a string prefix to the console log.
   *
   * @default ''
   */
  prefix?: string
  /**
   * Add a string suffix to the console log.
   *
   * @default ''
   */
  suffix?: string
  /**
   * Whether to disable the launch editor feature.
   *
   * @default false
   */
  disableLaunchEditor?: boolean
  /**
   * The specific service port of launch editor server.
   *
   * @default undefined
   */
  port?: number
}

export interface Context {
  pluginContext: UnpluginBuildContext & UnpluginContext
  options: Options
  code: string
  id: string
  meta: UnpluginContextMeta
}

export interface GenContext {
  options: Options
  filePath: string
  fileName: string
  fileType: string
  originalLine: number
  originalColumn: number
  argsName: string
  argType: string
}
