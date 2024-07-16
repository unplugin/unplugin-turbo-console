/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.plugins.push(
      require('unplugin-turbo-console/webpack').default()
    )

    return config
  }
}

module.exports = nextConfig
