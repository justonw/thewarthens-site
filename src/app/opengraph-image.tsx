import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";
import { renderPhotoOg } from "@/lib/og-photo";

export const alt = "The Warthens: Tech Journey and Faith Journey, with Juston and Atiya Warthen";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(
    await renderPhotoOg({
      eyebrow: "Tech Journey + Faith Journey",
      title: "We're Juston & Atiya Warthen",
      subtitle: "A career change into tech, and a faith journey lived out loud.",
      photos: [{ file: "atiya" }, { file: "juston" }],
      accent: "violet",
    }),
    size
  );
}
