import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/seek",
        destination: "/faith/women-who-seek",
        permanent: false,
      },
      {
        source: "/quiz",
        destination: "/tech#quiz",
        permanent: false,
      },
      {
        source: "/hype",
        destination: "/tech#guides",
        permanent: false,
      },
      {
        source: "/coach",
        destination: "/tech/coaching?from=coach-link",
        permanent: false,
      },
      {
        source: "/coaching",
        destination: "/tech/coaching?from=coaching-link",
        permanent: false,
      },
      {
        source: "/start",
        destination: "/tech#start-here",
        permanent: false,
      },
      {
        source: "/resume",
        destination: "/tech#checklist",
        permanent: false,
      },
      {
        source: "/tracker",
        destination: "/tech#tracker",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
