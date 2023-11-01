import { defineBuildConfig } from 'unbuild'
import { copy } from 'fs-extra'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
  hooks: {
    'build:done': () => {
      copy('./src/client', './dist/client', (err) => {
        // eslint-disable-next-line no-console
        console.log(err)
      })
    },
  },
})
