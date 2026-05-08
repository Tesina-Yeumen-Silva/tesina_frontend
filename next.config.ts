import { NextConfig } from "next";

const config: NextConfig = {
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
