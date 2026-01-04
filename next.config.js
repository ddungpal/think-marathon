/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // pdf-parse는 서버 사이드에서만 사용되며 선택적 의존성입니다
    // 빌드 시점에 모듈이 없어도 에러가 발생하지 않도록 설정
    if (isServer) {
      // pdf-parse를 external로 처리하여 빌드 시점에 번들링하지 않음
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('pdf-parse');
      } else if (typeof config.externals === 'function') {
        const originalExternals = config.externals;
        config.externals = [
          originalExternals,
          ({ request }, callback) => {
            if (request === 'pdf-parse') {
              return callback(null, 'commonjs ' + request);
            }
            callback();
          },
        ];
      } else {
        config.externals = [
          config.externals,
          'pdf-parse',
        ];
      }
    }
    return config;
  },
  // 빌드 시점에 선택적 의존성 체크를 건너뛰도록 설정
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
}

module.exports = nextConfig

