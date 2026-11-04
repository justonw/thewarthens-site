import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";
import { renderPhotoOg } from "@/lib/og-photo";

export const alt = "Women Who Seek: a faith community for women, hosted by Atiya Warthen";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(
    await renderPhotoOg({
      eyebrow: "Faith Journey",
      title: "Women Who Seek",
      subtitle: "A community for women, hosted by Atiya.",
      photos: [{ file: "wws" }],
      accent: "mauve",
    }),
    size
  );
}
