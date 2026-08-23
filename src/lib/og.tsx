export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export function renderOgImage(eyebrow: string, title: string) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#090c14",
        backgroundImage:
          "radial-gradient(circle at 25% 20%, rgba(139,92,246,0.35), transparent 55%), radial-gradient(circle at 80% 15%, rgba(56,189,248,0.30), transparent 50%)",
        padding: "0 80px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 96,
          height: 96,
          borderRadius: 22,
          background: "linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #38bdf8 100%)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 36,
        }}
      >
        <span style={{ fontSize: 52, fontWeight: 700, color: "#0a0d16" }}>W</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#7dd3fc",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 16,
          maxWidth: 980,
          fontSize: title.length > 30 ? 52 : 60,
          fontWeight: 700,
          color: "#f3f5fb",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 28,
          color: "#a3aec7",
        }}
      >
        The Warthens
      </div>
    </div>
  );
}
