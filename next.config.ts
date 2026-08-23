import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/seek",
        destination: "/faith/women-who-seek",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
