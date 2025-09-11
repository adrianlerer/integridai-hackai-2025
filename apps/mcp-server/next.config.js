/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    // Allow production builds even with TypeScript errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow production builds even with ESLint errors  
    ignoreDuringBuilds: false,
  },
  env: {
    // Expose environment variables to the client
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  distDir: 'out',
};

module.exports = nextConfig;