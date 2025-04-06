/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: {
        bodySizeLimit: '2mb',
      },
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          child_process: false,
          dns: false,
          path: false,
          os: false,
          crypto: false,
          stream: false,
          http: false,
          https: false,
          zlib: false,
          util: false,
          url: false,
          assert: false,
          buffer: false,
          process: false,
          querystring: false,
          punycode: false,
          string_decoder: false,
          stringify: false,
          sys: false,
          vm: false,
          constants: false,
          domain: false,
          events: false,
          readline: false,
          repl: false,
          v8: false,
          worker_threads: false,
        };
      }
      return config;
    },
  }

export default nextConfig;
