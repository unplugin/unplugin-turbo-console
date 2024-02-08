import type { Context } from '../../types'
import { viteTransform } from './vite'
import { webpackTransform } from './webpack'

export function transformer(context: Context) {
  const { meta } = context
  if (['webpack', 'rspack'].includes(meta!.framework))
    return webpackTransform(context)

  else return viteTransform(context)
}
