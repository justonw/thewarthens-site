import { ImageResponse } from "next/og";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "Faith Journey | The Warthens";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(renderOgImage("Faith Journey", "Discover, Understand, Live Out Truth"), size);
}
