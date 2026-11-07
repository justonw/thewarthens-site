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
        source: "/career-day",
        destination: "/techjr/play",
        permanent: false,
      },
      {
        source: "/careerday",
        destination: "/techjr/play",
        permanent: false,
      },
      // The game used to have one map. Those addresses now live under the ages 8 to 10 group.
      {
        source: "/techjr/play/:world(helper|creator|gift|facts|cyber|coding|data|badge)",
        destination: "/techjr/play/ages-8-10/:world",
        permanent: false,
      },
      {
        source: "/tech-jr",
        destination: "/techjr",
        permanent: false,
      },
      // Short link to say out loud or put on a QR code in a men's session.
      {
        source: "/present",
        destination: "/faith/present-but-missing",
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
