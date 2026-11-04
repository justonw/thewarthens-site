import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";
import { renderKidsOg } from "@/lib/og-kids";

export const alt = "Tech Journey Jr.: free games that teach kids tech, online safety, and careers";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(
    renderKidsOg({
      eyebrow: "Tech Journey Jr. · Ages 5 to 10",
      title: "Free games that teach kids tech, safety & careers",
      subtitle: "Cool facts, careers, and online safety. Two versions, one for ages 5 to 7 and one for 8 to 10.",
    }),
    size
  );
}
