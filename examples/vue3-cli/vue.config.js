const { defineConfig } = require('@vue/cli-service')
const TurboConsole = require('unplugin-turbo-console/webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  parallel: false,
  configureWebpack: {
    plugins: [
      TurboConsole()
    ]
  }
})
