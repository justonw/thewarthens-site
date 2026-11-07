import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";
import { renderPhotoOg } from "@/lib/og-photo";

export const alt = "Present but Missing: a lesson and exercise for men | Faith Journey";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(
    await renderPhotoOg({
      eyebrow: "Faith Journey · A lesson for men",
      title: "Present but Missing",
      subtitle: "When a man provides everything but himself.",
      photos: [{ file: "juston" }],
      accent: "mauve",
    }),
    size
  );
}
