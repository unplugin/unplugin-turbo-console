/* eslint-disable no-var */
/* eslint-disable vars-on-top */

export interface global {}

declare global {
  import type { Peer } from 'crossws'
  import type { ExpressionsMap } from './src/types'

  var TurboConsoleFilePathMap: Map<string, string>
  var TurboConsoleExpressionsMap: Map<string, ExpressionsMap>
  var UNPLUGIN_TURBO_CONSOLE_LAUNCH_SERVER: boolean
  var UNPLUGIN_TURBO_CONSOLE_PEERS_SET: Set<Peer> | undefined
}
