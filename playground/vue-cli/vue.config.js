const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  parallel: false,
  configureWebpack: {
    plugins: [
      require('../../dist/webpack.cjs')['default']()
    ]
  }
})
