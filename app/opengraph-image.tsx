import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Tool Base — Free Online Tools, Converters & Utilities";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const bytes = await readFile(join(process.cwd(), "public/tb-logo.png"));
  const logo = `data:image/png;base64,${bytes.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(145deg, #0B1635 0%, #101C42 55%, #13213D 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#FFFFFF",
            borderRadius: 16,
            padding: "12px 18px",
            width: 360,
          }}
        >
          <img alt="" src={logo} width={320} height={122} style={{ objectFit: "contain" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Every Tool You Need. One Simple Place.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#AAB7CE",
              maxWidth: 860,
              lineHeight: 1.4,
            }}
          >
            Free online converters, compressors, generators, and calculators — no
            sign-up required.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
