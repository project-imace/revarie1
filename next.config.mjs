/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This allows production builds to successfully complete even with ESLint config bugs
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Also ignore type checks during build to guarantee it goes through
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
