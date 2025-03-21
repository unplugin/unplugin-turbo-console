/* eslint-disable no-var */
/* eslint-disable vars-on-top */

export interface global {}

interface ExpressionMeta {
  code: string
  method: string
  line: number
  column: number
}

declare global {
  import type { Peer } from 'crossws'

  var TurboConsoleFilePathMap: Map<string, string>
  var TurboConsoleExpressionsMap: Map<string, ExpressionMeta[]>
  var UNPLUGIN_TURBO_CONSOLE_LAUNCH_SERVER: boolean
  var UNPLUGIN_TURBO_CONSOLE_PEERS_SET: Set<Peer> | undefined
}
