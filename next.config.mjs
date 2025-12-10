/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.toronto.ca',
        pathname: '/wp-content/uploads/**',
      },
    ],
    domains: ['contrib.wp.intra.prod-toronto.ca'],
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
