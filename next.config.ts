import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Medium hosts the blog post thumbnails
    remotePatterns: [{ protocol: 'https', hostname: 'miro.medium.com' }],
  },

  // Keep links from the previous version of the site working
  async redirects() {
    return [
      { source: '/work', destination: '/projects', permanent: true },
      { source: '/contact', destination: '/contacts', permanent: true },
      { source: '/experience/:path*', destination: '/about#awards', permanent: true },
    ]
  },
}

export default nextConfig
