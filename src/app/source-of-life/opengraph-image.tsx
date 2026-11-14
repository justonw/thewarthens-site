import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType, renderOgImage } from "@/lib/og";

export const alt = "Source of Life: Praise Him anyway | Faith Journey with The Warthens";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return new ImageResponse(renderOgImage("Faith Journey", "Source of Life: Praise Him anyway."), size);
}
