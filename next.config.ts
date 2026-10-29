import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Blog post thumbnails come from the platforms the posts are published on.
    // Adding a post with an image from another host? Add it here (a content test checks this).
    remotePatterns: [
      { protocol: 'https', hostname: 'miro.medium.com' },
      { protocol: 'https', hostname: 'cdn.hashnode.com' },
    ],
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
