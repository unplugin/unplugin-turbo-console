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
   * @default
   * {
   *   printUrl: true
   * }
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
  /**
   * Whether to detect the system theme and adjust the highlight color.
   *
   * @see https://utc.yuy1n.io/features/highlight.html#theme-detect
   * @default false
   *
   */
  themeDetect?: boolean
}

interface InspectorOption {
  /**
   * Print inspector url in the console when server start.
   *
   * @default true
   */
  printUrl?: boolean
}
