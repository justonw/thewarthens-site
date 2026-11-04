import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";
import { renderPhotoOg } from "@/lib/og-photo";

export const alt = "1:1 career coaching with Jermell Mitchell | The Warthens";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(
    await renderPhotoOg({
      eyebrow: "1:1 Coaching",
      title: "Coaching with Jermell Mitchell",
      subtitle: "Start with a free 15-minute intro call.",
      photos: [{ file: "jermell" }],
      accent: "blue",
    }),
    size
  );
}
