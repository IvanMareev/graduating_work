const nextConfig = {
  reactStrictMode: false,
  experimental: {
    turbo: {},
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
