const nextConfig = {
  reactStrictMode: false, // отключаем Strict Mode, ускоряет перерендеры
  eslint: {
    ignoreDuringBuilds: true, // не запускать eslint при билде
  },
  typescript: {
    ignoreBuildErrors: true, // не прерывать билд из-за ошибок типов
  },
  productionBrowserSourceMaps: false, // отключаем sourcemaps в проде для ускорения билда и меньшего размера
  webpack: (config, { dev, isServer }) => {
    // Отключаем canvas алиас
    config.resolve.alias.canvas = false;

    // Отключаем генерацию source maps в dev для быстрого старта
    if (dev) {
      config.devtool = false;
    }

    // Можно отключить полифиллы (если не нужны)
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        zlib: false,
      };
    }

    return config;
  },
  experimental: {
    turbo: {}, // можно оставить, ускоряет сборку
  },
  // Отключаем реактивный SWC для сборки (если нужно)
  swcMinify: true, // оставить true для быстрой минимизации
};

export default nextConfig;
