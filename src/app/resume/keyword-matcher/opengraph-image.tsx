import { ImageResponse } from "next/og";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "Free resume keyword scanner from The Warthens";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return new ImageResponse(renderOgImage("Free tool", "Resume keyword scanner: see what your resume is missing"), size);
}
