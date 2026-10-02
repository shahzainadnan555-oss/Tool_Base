"use client";

import { useRef, useState } from "react";
import { hexToRgb, loadHtmlImage, rgbToHsl } from "@/lib/image-editor/utils";

interface ImageColorPickerProps {
  imageUrl: string;
}

export function ImageColorPickerPanel({ imageUrl }: ImageColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hex, setHex] = useState("#2563EB");
  const [copied, setCopied] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  async function ensureCanvas() {
    const canvas = canvasRef.current;
    if (!canvas || ready) return canvas;
    const image = await loadHtmlImage(imageUrl);
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(image, 0, 0);
    setReady(true);
    return canvas;
  }

  async function pickFromEvent(
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) {
    const canvas = await ensureCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in event ? event.touches[0]?.clientX : event.clientX;
    const clientY = "touches" in event ? event.touches[0]?.clientY : event.clientY;
    if (clientX == null || clientY == null) return;
    const x = Math.floor(((clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((clientY - rect.top) / rect.height) * canvas.height);
    const pixel = ctx.getImageData(Math.max(0, x), Math.max(0, y), 1, 1).data;
    const next = `#${[pixel[0], pixel[1], pixel[2]]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")}`;
    setHex(next.toUpperCase());
  }

  const rgb = hexToRgb(hex) ?? { r: 37, g: 99, b: 235 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const rgbText = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslText = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  async function copyValue(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-tm-muted">
        Click or tap the image to sample a color.
      </p>
      <div className="overflow-hidden rounded-2xl border border-tm-border bg-tm-soft">
        <canvas
          ref={canvasRef}
          className="mx-auto max-h-96 w-full cursor-crosshair object-contain"
          onClick={(event) => void pickFromEvent(event)}
          onTouchStart={(event) => void pickFromEvent(event)}
        />
        {/* hidden preload draw on mount via image element */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="hidden"
          onLoad={() => {
            void ensureCanvas();
          }}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
        <div
          className="h-24 rounded-2xl border border-tm-border"
          style={{ backgroundColor: hex }}
          aria-label={`Selected color ${hex}`}
        />
        <div className="space-y-2 text-sm font-semibold text-tm-text">
          <p>HEX: {hex}</p>
          <p>RGB: {rgbText}</p>
          <p>HSL: {hslText}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" className="tm-btn tm-btn-secondary" onClick={() => void copyValue("HEX", hex)}>
              Copy HEX
            </button>
            <button
              type="button"
              className="tm-btn tm-btn-secondary"
              onClick={() => void copyValue("RGB", rgbText)}
            >
              Copy RGB
            </button>
            <button
              type="button"
              className="tm-btn tm-btn-secondary"
              onClick={() => void copyValue("HSL", hslText)}
            >
              Copy HSL
            </button>
            {copied ? <span className="self-center text-tm-success">Copied {copied}</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
