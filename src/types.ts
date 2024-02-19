import type { UnpluginBuildContext, UnpluginContext, UnpluginContextMeta } from 'unplugin'

export interface Options {
  /**
   * Add a string prefix to the console log.
   *
   * @defaultValue ''
   */
  prefix?: string
  /**
   * Add a string suffix to the console log.
   *
   * @defaultValue ''
   */
  suffix?: string
  /**
   * Whether to disable the launch editor feature.
   *
   * @defaultValue false
   */
  disableLaunchEditor?: boolean
  /**
   * Whether to disable the highlight output feature.
   *
   * @defaultValue false
   */
  disableHighlight?: boolean
  /**
   * The specific service port of launch editor server.
   *
   * @defaultValue 3070
   */
  port?: number
  /**
   * Whether to show extended path name when the file's (or folder's) name contains an element in the array.
   *
   * @remarks
   *
   * Consider a project includes these files:
   *
   * /views/Feature1/index.vue
   *
   * /views/Feature2/index.vue
   *
   * Set extendedPathFileNames as ['index'] can show the extended path name in the console output.
   *
   * @defaultValue `[]`
   *
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
