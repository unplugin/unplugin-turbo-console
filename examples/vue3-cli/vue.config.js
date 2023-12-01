const { defineConfig } = require('@vue/cli-service')
const { default: unpluginTurboConsole } = require('unplugin-turbo-console/webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      unpluginTurboConsole()
    ]
  }
})
