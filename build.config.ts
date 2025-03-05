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
  externals: ['crossws'],
})
