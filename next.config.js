/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.imace.online',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/vault/:path*',
        destination: 'https://revarie-vault-api.revarie-lm-v1-study-1-vault.workers.dev/:path*',
      },
    ];
  },
};

export default nextConfig;
