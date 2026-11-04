import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType } from "@/lib/og";
import { renderPhotoOg } from "@/lib/og-photo";

export const alt = "Tech Journey: career change to tech, with honest guides and free tools | The Warthens";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(
    await renderPhotoOg({
      eyebrow: "Tech Journey",
      title: "Career Change to Tech",
      subtitle: "Honest guides, real pay data, and free tools to find your fit.",
      photos: [{ file: "juston" }, { file: "atiya" }],
      accent: "blue",
    }),
    size
  );
}
