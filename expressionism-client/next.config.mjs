/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: true, // turbo compiler (быстрее webpack в dev)
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;

