/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.toronto.ca',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'contrib.wp.intra.prod-toronto.ca',
        pathname: '**',
      },
    ],
  },
  async headers() {
    const cacheExts = [
      'jpg',
      'jpeg',
      'png',
      'svg',
      'webp',
      'avif',
      'mp4',
      'webm',
      'ico',
      'woff',
      'woff2',
    ];
    return cacheExts.map((ext) => ({
      source: `/:path*.${ext}`,
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    }));
  },
  async redirects() {
    return [
      {
        source: '/analytics',
        destination:
          'https://cloud.umami.is/analytics/eu/share/6R9CNotgCUNEmDL5/civicdashboard.ca',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
