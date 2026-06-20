import { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "User-Agent",
            value: "MendozaReporta/1.0 (contacto@tuapp.com)",
          },
        ],
      },
    ];
  },
};

export default config;
