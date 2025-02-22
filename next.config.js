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
};

module.exports = nextConfig;
