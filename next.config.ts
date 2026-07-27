import { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
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
