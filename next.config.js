/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forces the entire app to live under /revarie1
  basePath: '/revarie1',
  
  // Redirects root traffic to the /revarie1 path automatically
  async redirects() {
    return [
      {
        source: '/',
        destination: '/revarie1',
        basePath: false,
        permanent: true,
      },
    ];
  },

  // Your existing image CDN configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.imace.online",
        port: "",
        pathname: "**",
      },
    ],
  },
  
  // Your existing experimental features
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
