/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import type { Peer } from 'crossws'

export interface global {}

declare global {
  var TurboConsoleFilePathMap: Map<string, string>
  var UNPLUGIN_TURBO_CONSOLE_LAUNCH_SERVER: boolean
  var UNPLUGIN_TURBO_CONSOLE_PEERS_SET: Set<Peer> | undefined
}
