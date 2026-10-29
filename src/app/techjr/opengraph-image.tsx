import { ImageResponse } from "next/og";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "Tech Journey Jr. | Tech and creator careers for kids | The Warthens";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(
    renderOgImage("Tech Journey Jr.", "Tech & creator careers for kids"),
    size
  );
}
