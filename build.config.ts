import { defineBuildConfig } from 'unbuild'
import { copy } from 'fs-extra'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/nuxt',
  ],
  declaration: true,
  clean: false,
  externals: [
    'vite',
    '@nuxt/kit',
    '@nuxt/schema',
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    dts: {
      respectExternal: true,
    },
  },
  hooks: {
    'build:done': () => {
      copy('./src/client', './dist/client', (err) => {
        // eslint-disable-next-line no-console
        err && console.log(err)
      })
    },
  },
})
