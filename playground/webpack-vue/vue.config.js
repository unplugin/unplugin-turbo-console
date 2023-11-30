const { defineConfig } = require('@vue/cli-service')
const TurboConsole = require('../../dist/webpack.cjs')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      TurboConsole.default(),
    ],
  },
})
