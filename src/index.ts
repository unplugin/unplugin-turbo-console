import type { Plugin } from 'vite'
import { transformCode } from './transform'

export default function plugin() {
  return {
    name: 'vite-plugin-turbo-console',
    enforce: 'pre',
    apply: 'serve',
    transform(code, id) {
      return transformCode(code, id)
    },
  } as Plugin
}
