import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";
import { renderPhotoOg } from "@/lib/og-photo";

export const alt = "What I Learned in 15 Years of Ministry: three lessons from Atiya Warthen";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(
    await renderPhotoOg({
      eyebrow: "Faith Journey",
      title: "What I Learned in 15 Years of Ministry",
      subtitle: "Three lessons for anyone who serves, or has stepped back.",
      photos: [{ file: "atiya", caption: "Atiya Warthen" }],
      accent: "mauve",
    }),
    size
  );
}
