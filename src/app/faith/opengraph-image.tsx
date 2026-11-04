import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";
import { renderPhotoOg } from "@/lib/og-photo";

export const alt = "Faith Journey: discover, understand, and live out truth | The Warthens";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(
    await renderPhotoOg({
      eyebrow: "Faith Journey",
      title: "Discover, Understand, Live Out Truth",
      subtitle: "Our story, our writings, and a community for women.",
      photos: [{ file: "atiya" }, { file: "juston" }],
      accent: "mauve",
    }),
    size
  );
}
