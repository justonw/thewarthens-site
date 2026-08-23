import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Warthens",
    short_name: "The Warthens",
    description: "Tech Journey & Faith Journey with The Warthens",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#090c14",
    icons: [
      {
        src: "/brand/icon-square.png",
        sizes: "460x460",
        type: "image/png",
      },
    ],
  };
}
