import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fbf3ef",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 8,
            height: 96,
            borderRadius: 4,
            backgroundColor: "#6b4550",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 75,
            width: 68,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#6b4550",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
