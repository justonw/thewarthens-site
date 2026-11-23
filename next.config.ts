import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The picture-reading files (/public/ocr) never change, so browsers may keep them for a year instead of asking again.
  async headers() {
    return [{ source: "/ocr/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }];
  },
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
        destination: "/tech/guides",
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
      // Short link for Atiya's "What I Learned in 15 Years of Ministry", for a video description or a QR code.
      {
        source: "/ministry",
        destination: "/faith/15-years-in-ministry",
        permanent: false,
      },
      // Short link for Source of Life, to say out loud or put on a QR code or a slide.
      {
        source: "/source",
        destination: "/source-of-life",
        permanent: false,
      },
      {
        source: "/start",
        destination: "/tech/start-here",
        permanent: false,
      },
      // The resume builder used to live under Tech Journey. Old links and emailed PDFs still work.
      {
        source: "/tech/resume",
        destination: "/resume",
        permanent: true,
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
