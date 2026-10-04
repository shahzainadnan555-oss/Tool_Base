import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon from the official Tool Base TB monogram. */
export default async function Icon() {
  const bytes = await readFile(join(process.cwd(), "public/tb-favicon.png"));
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
          background: "#000000",
        }}
      >
        <img
          alt=""
          src={dataUrl}
          width={64}
          height={64}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    size,
  );
}
