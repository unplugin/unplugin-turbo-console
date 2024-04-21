/* eslint-disable no-var */
/* eslint-disable vars-on-top */
export interface global {}

declare global {
  var TurboConsoleFilePathMap: Map<string, string>
  var UNPLUGIN_TURBO_CONSOLE_LAUNCH_SERVER: boolean
}
