import type { Context } from '../../types'
import { viteTransform } from './vite'
import { webpackTransform } from './webpack'

export function transformer(context: Context) {
  if (context.meta.framework === 'webpack')
    return webpackTransform(context)
  else
    return viteTransform(context)
}
