/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.plugins.push(
      require('unplugin-turbo-console/webpack')()
    )

    return config
  }
}

module.exports = nextConfig
