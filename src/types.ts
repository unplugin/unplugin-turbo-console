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
}

export interface Context {
  pluginContext: any
  option: Options
  network: {
    protocol: string
    port: number
    base: string
  }
}

export interface Extra {
  nuxtDevServerPort: number
}
