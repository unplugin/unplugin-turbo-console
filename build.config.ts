import { fileURLToPath } from 'node:url'
import { copy } from 'fs-extra'
import { dirname, join } from 'pathe'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  rollup: {
    inlineDependencies: true,
    dts: {
      respectExternal: false,
    },
    emitCJS: true,
    output: {
      exports: 'named',
    },
  },
  hooks: {
    'build:done': () => {
      const source = join(dirname(fileURLToPath(import.meta.url)), './src/core/client')
      const target = join(dirname(fileURLToPath(import.meta.url)), './dist/client')

      copy(source, target)
    },
  },
  externals: ['crossws'],
})
