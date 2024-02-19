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
   * Whether to disable the highlight output feature.
   *
   * @default false
   */
  disableHighlight?: boolean
  /**
   * The specific service port of launch editor server.
   *
   * @default 3070
   */
  port?: number
  /**
   * Whether to show extended path name when the file's (or folder's) name contains an element in the array.
   *
   * @default []
   */
  extendedPathFileNames?: string[]
}

export interface Context {
  pluginContext?: UnpluginBuildContext & UnpluginContext
  options: Options
  code: string
  id: string
  meta?: UnpluginContextMeta
}

export interface GenContext {
  options: Options
  originalLine: number
  originalColumn: number
  argsName: string
  argType: string
  id: string
}
