const { default: unpluginTurboConsole } = require('unplugin-turbo-console/webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.plugins.push(
      unpluginTurboConsole()
    )

    return config
  }
}

module.exports = nextConfig
