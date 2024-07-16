const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  parallel: false,
  configureWebpack: {
    plugins: [
      require('unplugin-turbo-console/webpack').default()
    ]
  }
})
