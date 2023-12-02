import type { Context } from '../../types'
import { viteTransform } from './vite'
import { webpackTransform } from './webpack'

export function transformer(context: Context) {
  const { code, meta } = context
  if (meta!.framework === 'webpack') {
    // only works on webpack development mode
    if (meta!.webpack.compiler.options.mode === 'development')
      return webpackTransform(context)
    return code
  }
  else if (meta!.framework === 'rspack') {
    if (meta!.rspack.compiler.options.mode === 'development')
      return webpackTransform(context)
    return code
  }
  else {
    return viteTransform(context)
  }
}
