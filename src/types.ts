export interface __Options {
  /**
   * Add a string prefix to the console output.
   *
   * @defaultValue ''
   */
  prefix?: string
  /**
   * Add a string suffix to the console output.
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
  /**
   * The specific editor to launch.
   *
   * All available editors: https://github.com/yyx990803/launch-editor#supported-editors
   *
   * Linked issues:#33
   *
   * @defaultValue undefined
   *
   */
  specifiedEditor?: string | undefined

  /**
   *
   * @deprecated This option has been removed since v1.11.0 and will be deleted on next major version.
   */
  babelParserPlugins?: never

  /**
   * Whether to disable pass logs feature.
   *
   * @defaultValue false
   */
  disablePassLogs?: boolean

  /**
   * Whether to print plugin server url to the console.
   *
   *
   * @defaultValue false
   */
  silent?: boolean
}

interface LaunchEditorOption {
  /**
   * The specific editor to launch.
   *
   * @see https://github.com/yyx990803/launch-editor#supported-editors
   * @default undefined
   *
   */
  specifiedEditor?: string
}

interface HighlightOption {
  /**
   * Whether to show extended path name when the file's (or folder's) name contains an element in the array.
   *
   * @see https://utc.yuy1n.io/features/highlight.html#expand-path-file-name
   * @default undefined
   *
   */
  extendedPathFileNames?: string[]
}

interface InspectorOption {
  /**
   * Print inspector url in the console when server start.
   *
   * @default true
   */
  printUrl?: boolean
}

export interface Options {
  /**
   * Add a string prefix to the console output.
   *
   * @see https://utc.yuy1n.io/features/custom-prefix.html
   * @default undefined
   */
  prefix?: string
  /**
   * Add a string suffix to the console output.
   *
   * @see https://utc.yuy1n.io/features/custom-prefix.html
   * @default undefined
   */
  suffix?: string
  /**
   * Launch editor option
   *
   * @see https://utc.yuy1n.io/features/launch-editor.html
   * @default true
   */
  launchEditor?: boolean | LaunchEditorOption
  /**
   * Highlight option
   *
   * @see https://utc.yuy1n.io/features/highlight.html
   * @default true
   */
  highlight?: boolean | HighlightOption
  /**
   * Enable pass logs feature.
   *
   * @see https://utc.yuy1n.io/features/pass-logs.html
   * @default true
   */
  passLogs?: boolean
  /**
   * Enable inspector feature.
   *
   * @see https://utc.yuy1n.io/features/inspector.html
   * @default { printUrl: true }
   */
  inspector?: boolean | InspectorOption
  /**
   * Custom server option.
   *
   * @default { port: 3070, host: '127.0.0.1' }
   */
  server?: {
    port?: number
    host?: string
  }
}

export interface GenContext {
  options: Options
  originalLine: number
  originalColumn: number
  argsName: string
  argType: string
  id: string
  consoleMethod: string
}

export type Compiler = 'vanilla' | 'vue' | 'svelte'

export interface Context {
  code: string
  id: string
  options: Options
}

export type Lang = 'js' | 'jsx' | 'ts' | 'tsx' | undefined

export interface CompileResult {
  script: string
  lang: Lang
  offset: number
  line: number
}

export type TCMethod = 'log' | 'error' | 'warn' | 'info' | 'table' | 'dir'

export type TConsole = Record<TCMethod, (...args: any[]) => void>

export interface ExpressionMeta {
  code: string
  method: string
  line: number
  column: number
}

export interface ExpressionsMap {
  id: string
  filePath: string
  expressions: ExpressionMeta[]
}
