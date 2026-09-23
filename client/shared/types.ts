import type { Immutable } from 'devframe/utils/shared-state'
import type { InspectorState } from '../../src/types'

export type ExpressionsMapResponse = Immutable<InspectorState>
export type ExpressionsMap = Record<string, ExpressionsMapResponse['expressionsMap'][string]>
