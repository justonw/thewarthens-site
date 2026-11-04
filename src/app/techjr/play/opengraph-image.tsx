import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";
import { renderKidsOg } from "@/lib/og-kids";

export const alt = "Play Tech Journey Jr.: free games for kids ages 5 to 10";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(
    renderKidsOg({
      eyebrow: "Play now · Ages 5 to 10",
      title: "Tech Journey Jr.",
      subtitle: "Free games for kids. Pick an age group and start playing.",
    }),
    size
  );
}
