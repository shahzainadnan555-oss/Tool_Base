import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon from the official TM logo on deep navy. */
export default async function AppleIcon() {
  const bytes = await readFile(join(process.cwd(), "public/tm-logo.png"));
  const dataUrl = `data:image/png;base64,${bytes.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 40%, #1E3A8A 0%, #0B1220 70%)",
          borderRadius: 36,
        }}
      >
        <img
          alt=""
          src={dataUrl}
          width={132}
          height={88}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    size,
  );
}
