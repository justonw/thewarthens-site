import { ImageResponse } from "next/og";
import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "1:1 Coaching with Jermell Mitchell | The Warthens";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(
    renderOgImage("1:1 Coaching", "Coaching with Jermell Mitchell"),
    size
  );
}
