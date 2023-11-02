export interface Options {
  /**
   * Add a string prefix to the console log.
   * @default: ''
   */
  prefix?: string
  /**
   * Add a string suffix to the console log.
   * @default: ''
   */
  suffix?: string
  /**
   * Whether to disable the launch editor feature.
   * @default: false
   */
  disableLaunchEditor?: boolean
}

export interface Extra {
  nuxtDevServerPort: number
}
