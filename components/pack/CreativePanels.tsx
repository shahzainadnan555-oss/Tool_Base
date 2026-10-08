"use client";

import { useMemo, useRef, useState } from "react";
import { copyText, downloadBlob, downloadTextFile } from "@/lib/security/utils";
import { contrastRatio, textToAsciiArt } from "@/lib/pack/helpers";
import { Field, Status, useNotice } from "./shared";

export function TextShadowPanel() {
  const [x, setX] = useState("2");
  const [y, setY] = useState("3");
  const [blur, setBlur] = useState("6");
  const [color, setColor] = useState("#0f172a");
  const css = `${x}px ${y}px ${blur}px ${color}`;
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="tsx" label="X offset"><input id="tsx" className="tm-input" value={x} onChange={(e) => setX(e.target.value)} /></Field>
        <Field id="tsy" label="Y offset"><input id="tsy" className="tm-input" value={y} onChange={(e) => setY(e.target.value)} /></Field>
        <Field id="tsb" label="Blur"><input id="tsb" className="tm-input" value={blur} onChange={(e) => setBlur(e.target.value)} /></Field>
        <Field id="tsc" label="Color"><input id="tsc" type="color" className="h-11 w-full" value={color} onChange={(e) => setColor(e.target.value)} /></Field>
      </div>
      <p className="rounded-2xl border border-tm-border bg-tm-elevated p-8 text-center text-3xl font-black text-tm-text" style={{ textShadow: css }}>Sample text</p>
      <pre className="overflow-x-auto rounded-xl border border-tm-border bg-tm-elevated p-3 text-sm">text-shadow: {css};</pre>
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => { if (await copyText(`text-shadow: ${css};`)) done("Copied."); else fail("Copy failed. Try again."); }}>Copy CSS</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

const CLIPS: Record<string, string> = {
  Circle: "circle(50% at 50% 50%)",
  Ellipse: "ellipse(40% 50% at 50% 50%)",
  Inset: "inset(10% 12% 10% 12% round 16px)",
  Triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
  Diamond: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  Hexagon: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
};

export function ClipPathPanel() {
  const [shape, setShape] = useState("Circle");
  const css = CLIPS[shape];
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="cp" label="Shape">
        <select id="cp" className="tm-input" value={shape} onChange={(e) => setShape(e.target.value)}>
          {Object.keys(CLIPS).map((name) => <option key={name}>{name}</option>)}
        </select>
      </Field>
      <div className="flex justify-center rounded-2xl border border-tm-border bg-tm-soft p-8">
        <div className="h-40 w-40 bg-[var(--tm-accent)]" style={{ clipPath: css }} />
      </div>
      <pre className="overflow-x-auto rounded-xl border border-tm-border bg-tm-elevated p-3 text-sm">clip-path: {css};</pre>
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => { if (await copyText(`clip-path: ${css};`)) done("Copied."); else fail("Copy failed. Try again."); }}>Copy CSS</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

function drawCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement, size: number) {
  const side = Math.min(image.naturalWidth, image.naturalHeight);
  const sx = (image.naturalWidth - side) / 2;
  const sy = (image.naturalHeight - side) / 2;
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(image, sx, sy, side, side, 0, 0, size, size);
}

export function FaviconPanel() {
  const [file, setFile] = useState<File | null>(null);
  const small = useRef<HTMLCanvasElement>(null);
  const mid = useRef<HTMLCanvasElement>(null);
  const large = useRef<HTMLCanvasElement>(null);
  const { ok, error, fail, done } = useNotice();
  async function preview(next: File) {
    const url = URL.createObjectURL(next);
    const image = new Image();
    image.src = url;
    try {
      await image.decode();
      for (const [ref, size] of [[small, 16], [mid, 32], [large, 48]] as const) {
        const canvas = ref.current;
        if (!canvas) continue;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) drawCover(ctx, image, size);
      }
      done("Preview updated.");
    } catch {
      fail("Unsupported format.");
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  return (
    <div className="space-y-4">
      <Field label="Image">
        <input className="tm-input" type="file" accept="image/*" onChange={(e) => {
          const next = e.target.files?.[0] ?? null;
          setFile(next);
          if (next) void preview(next);
        }} />
      </Field>
      <div className="flex flex-wrap items-end gap-6">
        <div><p className="mb-1 text-xs font-bold">16</p><canvas ref={small} className="border border-tm-border bg-white" /></div>
        <div><p className="mb-1 text-xs font-bold">32</p><canvas ref={mid} className="border border-tm-border bg-white" /></div>
        <div><p className="mb-1 text-xs font-bold">48</p><canvas ref={large} className="border border-tm-border bg-white" /></div>
      </div>
      <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
        const canvas = mid.current;
        if (!file || !canvas || canvas.width < 2) { fail("Choose an image first."); return; }
        canvas.toBlob((blob) => {
          if (!blob) { fail("Processing failed."); return; }
          downloadBlob(blob, "favicon-32.png");
          done("Downloaded.");
        }, "image/png");
      }}>Download 32×32 PNG</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

const SOCIAL: Record<string, [number, number]> = {
  "Open Graph": [1200, 630],
  "Instagram post": [1080, 1080],
  "Instagram story": [1080, 1920],
  "X header": [1500, 500],
  "YouTube thumbnail": [1280, 720],
  "LinkedIn post": [1200, 627],
};

export function SocialSizePanel() {
  const [preset, setPreset] = useState("Open Graph");
  const [w, setW] = useState("1200");
  const [h, setH] = useState("630");
  const [title, setTitle] = useState("Headline");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ok, error, fail, done } = useNotice();
  function render() {
    const width = Number(w);
    const height = Number(h);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 4096 || height > 4096) {
      fail("Invalid value. Use integer sizes up to 4096.");
      return null;
    }
    const canvas = canvasRef.current;
    if (!canvas) return null;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) { fail("Processing failed."); return null; }
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(0, height - 16, width, 16);
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.max(24, Math.round(width / 18))}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(title, width / 2, height / 2);
    ctx.font = `${Math.max(14, Math.round(width / 40))}px sans-serif`;
    ctx.fillText(`${width}×${height}`, width / 2, height / 2 + 40);
    return canvas;
  }
  return (
    <div className="space-y-4">
      <Field id="sp" label="Preset">
        <select id="sp" className="tm-input" value={preset} onChange={(e) => {
          const name = e.target.value;
          setPreset(name);
          const size = SOCIAL[name];
          if (size) { setW(String(size[0])); setH(String(size[1])); }
        }}>
          {Object.keys(SOCIAL).map((name) => <option key={name}>{name}</option>)}
          <option>Custom</option>
        </select>
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="sw" label="Width"><input id="sw" className="tm-input" value={w} onChange={(e) => { setW(e.target.value); setPreset("Custom"); }} /></Field>
        <Field id="sh" label="Height"><input id="sh" className="tm-input" value={h} onChange={(e) => { setH(e.target.value); setPreset("Custom"); }} /></Field>
      </div>
      <Field id="st" label="Title"><input id="st" className="tm-input" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <canvas ref={canvasRef} className="max-h-80 w-full rounded-xl border border-tm-border bg-tm-elevated object-contain" />
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => { if (render()) done("Preview updated."); }}>Preview</button>
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
          const canvas = render();
          if (!canvas) return;
          canvas.toBlob((blob) => {
            if (!blob) { fail("Processing failed."); return; }
            downloadBlob(blob, `social-${w}x${h}.png`);
            done("Downloaded.");
          }, "image/png");
        }}>Download PNG</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function PlaceholderPanel() {
  const [w, setW] = useState("640");
  const [h, setH] = useState("360");
  const [bg, setBg] = useState("#94a3b8");
  const [label, setLabel] = useState("640×360");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ok, error, fail, done } = useNotice();
  function draw() {
    const width = Number(w);
    const height = Number(h);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 4096 || height > 4096) {
      fail("Invalid value.");
      return null;
    }
    const canvas = canvasRef.current;
    if (!canvas) return null;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#0f172a";
    ctx.font = `bold ${Math.max(16, Math.round(width / 16))}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(label || `${width}×${height}`, width / 2, height / 2);
    return canvas;
  }
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="pw" label="Width"><input id="pw" className="tm-input" value={w} onChange={(e) => setW(e.target.value)} /></Field>
        <Field id="ph" label="Height"><input id="ph" className="tm-input" value={h} onChange={(e) => setH(e.target.value)} /></Field>
        <Field id="pb" label="Background"><input id="pb" type="color" className="h-11 w-full" value={bg} onChange={(e) => setBg(e.target.value)} /></Field>
        <Field id="pl" label="Label"><input id="pl" className="tm-input" value={label} onChange={(e) => setLabel(e.target.value)} /></Field>
      </div>
      <canvas ref={canvasRef} className="max-h-64 w-full rounded-xl border border-tm-border bg-white object-contain" />
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => { if (draw()) done("Preview updated."); }}>Preview</button>
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
          const canvas = draw();
          if (!canvas) return;
          canvas.toBlob((blob) => {
            if (!blob) { fail("Processing failed."); return; }
            downloadBlob(blob, `placeholder-${w}x${h}.png`);
            done("Downloaded.");
          }, "image/png");
        }}>Download</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => {
          const canvas = draw();
          if (!canvas) return;
          void copyText(canvas.toDataURL("image/png")).then((copied) => copied ? done("Copied data URL.") : fail("Copy failed. Try again."));
        }}>Copy data URL</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function PixelArtPanel() {
  const [size, setSize] = useState(16);
  const [color, setColor] = useState("#0ea5e9");
  const [erase, setErase] = useState(false);
  const [cells, setCells] = useState<string[]>(() => Array(256).fill(""));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const { ok, error, fail, done } = useNotice();
  function paint(i: number) {
    setCells((rows) => {
      const next = rows.length === size * size ? [...rows] : Array(size * size).fill("");
      next[i] = erase ? "" : color;
      return next;
    });
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Field id="ps" label="Grid">
          <select id="ps" className="tm-input" value={size} onChange={(e) => {
            const n = Number(e.target.value);
            setSize(n);
            setCells(Array(n * n).fill(""));
          }}>
            <option value={8}>8×8</option>
            <option value={16}>16×16</option>
            <option value={24}>24×24</option>
          </select>
        </Field>
        <Field id="pc" label="Color"><input id="pc" type="color" className="h-11 w-24" value={color} onChange={(e) => setColor(e.target.value)} /></Field>
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" className="size-4 accent-[var(--tm-accent)]" checked={erase} onChange={(e) => setErase(e.target.checked)} /> Erase</label>
      </div>
      <p className="text-xs font-semibold text-tm-muted md:hidden">
        Tap or drag across cells to paint.
      </p>
      <div
        className="inline-grid max-w-full touch-none border border-tm-border"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(1.75rem, 1fr))` }}
        onPointerDown={(event) => {
          drawingRef.current = true;
          (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drawingRef.current) return;
          const target = document.elementFromPoint(
            event.clientX,
            event.clientY,
          ) as HTMLElement | null;
          const index = target?.dataset?.pixelIndex;
          if (index != null) paint(Number(index));
        }}
        onPointerUp={() => {
          drawingRef.current = false;
        }}
        onPointerCancel={() => {
          drawingRef.current = false;
        }}
      >
        {Array.from({ length: size * size }, (_, i) => (
          <button
            key={i}
            type="button"
            data-pixel-index={i}
            aria-label={`Pixel ${i + 1}`}
            className="aspect-square min-h-7 min-w-7 border border-tm-border sm:min-h-5 sm:min-w-5"
            style={{ background: cells[i] || "transparent" }}
            onPointerDown={() => paint(i)}
          />
        ))}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => setCells(Array(size * size).fill(""))}>Reset</button>
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const scale = 16;
          canvas.width = size * scale;
          canvas.height = size * scale;
          const ctx = canvas.getContext("2d");
          if (!ctx) { fail("Processing failed."); return; }
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          cells.forEach((fill, i) => {
            if (!fill) return;
            ctx.fillStyle = fill;
            ctx.fillRect((i % size) * scale, Math.floor(i / size) * scale, scale, scale);
          });
          canvas.toBlob((blob) => {
            if (!blob) { fail("Processing failed."); return; }
            downloadBlob(blob, "pixel-art.png");
            done("Downloaded.");
          }, "image/png");
        }}>Export PNG</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function AsciiArtPanel() {
  const [text, setText] = useState("TOOL");
  const art = useMemo(() => textToAsciiArt(text.slice(0, 16)), [text]);
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="aa" label="Text"><input id="aa" className="tm-input" value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <pre className="overflow-x-auto rounded-xl border border-tm-border bg-tm-elevated p-3 font-mono text-xs leading-4">{art}</pre>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={async () => { if (!text.trim()) { fail("Empty input."); return; } if (await copyText(art)) done("Copied."); else fail("Copy failed. Try again."); }}>Copy</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => { if (!text.trim()) { fail("Empty input."); return; } downloadTextFile(art, "ascii-art.txt"); done("Downloaded."); }}>Download</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function PaletteExtractPanel() {
  const [swatches, setSwatches] = useState<Array<{ hex: string; rgb: string; count: number }>>([]);
  const { ok, error, fail, done } = useNotice();
  async function extract(file: File) {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    try {
      await image.decode();
      const canvas = document.createElement("canvas");
      const max = 120;
      const scale = Math.min(max / image.naturalWidth, max / image.naturalHeight, 1);
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) { fail("Processing failed."); return; }
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const buckets = new Map<string, number>();
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 40) continue;
        const r = data[i] >> 4 << 4;
        const g = data[i + 1] >> 4 << 4;
        const b = data[i + 2] >> 4 << 4;
        const key = `${r},${g},${b}`;
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }
      const ranked = [...buckets.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([key, count]) => {
        const [r, g, b] = key.split(",").map(Number);
        const hex = `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
        return { hex, rgb: `rgb(${r}, ${g}, ${b})`, count };
      });
      setSwatches(ranked);
      done("Palette extracted.");
    } catch {
      fail("Unsupported format.");
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  return (
    <div className="space-y-4">
      <Field label="Image"><input className="tm-input" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) void extract(file); }} /></Field>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {swatches.map((swatch) => (
          <div key={swatch.hex} className="overflow-hidden rounded-xl border border-tm-border">
            <div className="h-16" style={{ background: swatch.hex }} />
            <div className="p-2 text-xs font-bold">
              <button type="button" className="block" onClick={() => void copyText(swatch.hex)}>{swatch.hex}</button>
              <button type="button" className="block text-tm-muted" onClick={() => void copyText(swatch.rgb)}>{swatch.rgb}</button>
            </div>
          </div>
        ))}
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function SvgShapePanel() {
  const [shape, setShape] = useState("rect");
  const [fill, setFill] = useState("#38bdf8");
  const [stroke, setStroke] = useState("#0f172a");
  const inner =
    shape === "circle" ? `<circle cx="80" cy="80" r="54" fill="${fill}" stroke="${stroke}" stroke-width="4"/>` :
    shape === "ellipse" ? `<ellipse cx="80" cy="80" rx="64" ry="40" fill="${fill}" stroke="${stroke}" stroke-width="4"/>` :
    shape === "polygon" ? `<polygon points="80,18 142,142 18,142" fill="${fill}" stroke="${stroke}" stroke-width="4"/>` :
    shape === "star" ? `<polygon points="80,12 96,58 146,58 106,88 120,138 80,108 40,138 54,88 14,58 64,58" fill="${fill}" stroke="${stroke}" stroke-width="4"/>` :
    `<rect x="24" y="24" width="112" height="112" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="4"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">${inner}</svg>`;
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field id="ss" label="Shape">
          <select id="ss" className="tm-input" value={shape} onChange={(e) => setShape(e.target.value)}>
            <option value="rect">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="ellipse">Ellipse</option>
            <option value="polygon">Triangle</option>
            <option value="star">Star</option>
          </select>
        </Field>
        <Field id="sf" label="Fill"><input id="sf" type="color" className="h-11 w-full" value={fill} onChange={(e) => setFill(e.target.value)} /></Field>
        <Field id="sk" label="Stroke"><input id="sk" type="color" className="h-11 w-full" value={stroke} onChange={(e) => setStroke(e.target.value)} /></Field>
      </div>
      <div className="flex justify-center rounded-2xl border border-tm-border bg-tm-elevated p-6" dangerouslySetInnerHTML={{ __html: svg }} />
      <pre className="overflow-x-auto rounded-xl border border-tm-border bg-tm-elevated p-3 text-xs">{svg}</pre>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={async () => { if (await copyText(svg)) done("Copied."); else fail("Copy failed. Try again."); }}>Copy SVG</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => { downloadTextFile(svg, "shape.svg"); done("Downloaded."); }}>Download</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function TransformPanel() {
  const [x, setX] = useState("0");
  const [y, setY] = useState("0");
  const [rot, setRot] = useState("12");
  const [sx, setSx] = useState("1");
  const [sy, setSy] = useState("1");
  const [kx, setKx] = useState("0");
  const [ky, setKy] = useState("0");
  const css = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${sx}, ${sy}) skew(${kx}deg, ${ky}deg)`;
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      {[["Translate X", x, setX], ["Translate Y", y, setY], ["Rotate", rot, setRot], ["Scale X", sx, setSx], ["Scale Y", sy, setSy], ["Skew X", kx, setKx], ["Skew Y", ky, setKy]].map(([label, value, set]) => (
        <Field key={String(label)} id={String(label)} label={String(label)}>
          <input id={String(label)} className="tm-input" value={String(value)} onChange={(e) => (set as (v: string) => void)(e.target.value)} />
        </Field>
      ))}
      <div className="flex h-48 items-center justify-center rounded-2xl border border-tm-border bg-tm-soft">
        <div className="h-16 w-24 rounded-lg bg-[var(--tm-accent)]" style={{ transform: css }} />
      </div>
      <pre className="overflow-x-auto rounded-xl border border-tm-border bg-tm-elevated p-3 text-sm">transform: {css};</pre>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={async () => { if (await copyText(`transform: ${css};`)) done("Copied."); else fail("Copy failed. Try again."); }}>Copy CSS</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => { setX("0"); setY("0"); setRot("0"); setSx("1"); setSy("1"); setKx("0"); setKy("0"); }}>Reset</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function ButtonGenPanel() {
  const [padX, setPadX] = useState("18");
  const [padY, setPadY] = useState("10");
  const [radius, setRadius] = useState("12");
  const [bg, setBg] = useState("#0ea5e9");
  const [hover, setHover] = useState("#0284c7");
  const [fg, setFg] = useState("#ffffff");
  const [border, setBorder] = useState("0");
  const [shadow, setShadow] = useState("0 8px 20px rgba(14,165,233,.35)");
  const css = `.tb-btn{display:inline-flex;padding:${padY}px ${padX}px;border-radius:${radius}px;background:${bg};color:${fg};border:${border}px solid currentColor;box-shadow:${shadow};font-weight:700;}\n.tb-btn:hover{background:${hover};}`;
  const html = `<button class="tb-btn" type="button">Button</button>`;
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="bx" label="Padding X"><input id="bx" className="tm-input" value={padX} onChange={(e) => setPadX(e.target.value)} /></Field>
        <Field id="by" label="Padding Y"><input id="by" className="tm-input" value={padY} onChange={(e) => setPadY(e.target.value)} /></Field>
        <Field id="br" label="Radius"><input id="br" className="tm-input" value={radius} onChange={(e) => setRadius(e.target.value)} /></Field>
        <Field id="bb" label="Border"><input id="bb" className="tm-input" value={border} onChange={(e) => setBorder(e.target.value)} /></Field>
        <Field id="bg" label="Background"><input id="bg" type="color" className="h-11 w-full" value={bg} onChange={(e) => setBg(e.target.value)} /></Field>
        <Field id="hv" label="Hover"><input id="hv" type="color" className="h-11 w-full" value={hover} onChange={(e) => setHover(e.target.value)} /></Field>
        <Field id="fg" label="Text"><input id="fg" type="color" className="h-11 w-full" value={fg} onChange={(e) => setFg(e.target.value)} /></Field>
        <Field id="sh" label="Shadow"><input id="sh" className="tm-input" value={shadow} onChange={(e) => setShadow(e.target.value)} /></Field>
      </div>
      <div className="rounded-2xl border border-tm-border bg-tm-elevated p-6 text-center">
        <style>{css}</style>
        <button className="tb-btn" type="button">Button</button>
      </div>
      <pre className="overflow-x-auto rounded-xl border border-tm-border bg-tm-elevated p-3 text-xs">{html}\n{css}</pre>
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => { if (await copyText(`${html}\n${css}`)) done("Copied."); else fail("Copy failed. Try again."); }}>Copy HTML/CSS</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function FilterPanel() {
  const [blur, setBlur] = useState("0");
  const [bright, setBright] = useState("100");
  const [contrast, setContrast] = useState("100");
  const [sat, setSat] = useState("100");
  const [gray, setGray] = useState("0");
  const css = `blur(${blur}px) brightness(${bright}%) contrast(${contrast}%) saturate(${sat}%) grayscale(${gray}%)`;
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      {[["Blur", blur, setBlur], ["Brightness", bright, setBright], ["Contrast", contrast, setContrast], ["Saturate", sat, setSat], ["Grayscale", gray, setGray]].map(([label, value, set]) => (
        <Field key={String(label)} id={String(label)} label={String(label)}>
          <input id={String(label)} type="range" min="0" max={label === "Blur" ? "20" : "200"} value={String(value)} onChange={(e) => (set as (v: string) => void)(e.target.value)} className="w-full" />
        </Field>
      ))}
      <div className="h-28 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500" style={{ filter: css }} />
      <pre className="overflow-x-auto rounded-xl border border-tm-border bg-tm-elevated p-3 text-sm">filter: {css};</pre>
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => { if (await copyText(`filter: ${css};`)) done("Copied."); else fail("Copy failed. Try again."); }}>Copy CSS</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function FlexboxPanel() {
  const [dir, setDir] = useState("row");
  const [wrap, setWrap] = useState("wrap");
  const [justify, setJustify] = useState("space-between");
  const [align, setAlign] = useState("center");
  const [gap, setGap] = useState("12");
  const [count, setCount] = useState(4);
  const css = `display: flex;\nflex-direction: ${dir};\nflex-wrap: ${wrap};\njustify-content: ${justify};\nalign-items: ${align};\ngap: ${gap}px;`;
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="fd" label="Direction"><select id="fd" className="tm-input" value={dir} onChange={(e) => setDir(e.target.value)}><option>row</option><option>column</option><option>row-reverse</option></select></Field>
        <Field id="fw" label="Wrap"><select id="fw" className="tm-input" value={wrap} onChange={(e) => setWrap(e.target.value)}><option>nowrap</option><option>wrap</option></select></Field>
        <Field id="fj" label="Justify"><select id="fj" className="tm-input" value={justify} onChange={(e) => setJustify(e.target.value)}><option>flex-start</option><option>center</option><option>flex-end</option><option>space-between</option><option>space-around</option></select></Field>
        <Field id="fa" label="Align"><select id="fa" className="tm-input" value={align} onChange={(e) => setAlign(e.target.value)}><option>stretch</option><option>flex-start</option><option>center</option><option>flex-end</option></select></Field>
      </div>
      <Field id="fg" label="Gap"><input id="fg" className="tm-input" value={gap} onChange={(e) => setGap(e.target.value)} /></Field>
      <div className="rounded-2xl border border-tm-border bg-tm-elevated p-4" style={{ display: "flex", flexDirection: dir as "row", flexWrap: wrap as "wrap", justifyContent: justify, alignItems: align, gap: `${gap}px` }}>
        {Array.from({ length: count }, (_, i) => <div key={i} className="rounded-lg bg-[var(--tm-accent)] px-3 py-4 text-center text-xs font-bold text-white">Item {i + 1}</div>)}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => setCount((n) => n + 1)}>Add item</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => setCount((n) => Math.max(1, n - 1))}>Remove item</button>
        <button type="button" className="tm-btn tm-btn-primary" onClick={async () => { if (await copyText(css)) done("Copied."); else fail("Copy failed. Try again."); }}>Copy CSS</button>
      </div>
      <pre className="overflow-x-auto rounded-xl border border-tm-border bg-tm-elevated p-3 text-sm">{css}</pre>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function GlassPanel() {
  const [blur, setBlur] = useState("16");
  const [alpha, setAlpha] = useState("0.35");
  const [radius, setRadius] = useState("20");
  const css = `background: rgba(255,255,255,${alpha});\nbackdrop-filter: blur(${blur}px) saturate(160%);\nborder: 1px solid rgba(255,255,255,.4);\nborder-radius: ${radius}px;`;
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="gb" label="Blur"><input id="gb" className="tm-input" value={blur} onChange={(e) => setBlur(e.target.value)} /></Field>
      <Field id="ga" label="Fill alpha"><input id="ga" className="tm-input" value={alpha} onChange={(e) => setAlpha(e.target.value)} /></Field>
      <Field id="gr" label="Radius"><input id="gr" className="tm-input" value={radius} onChange={(e) => setRadius(e.target.value)} /></Field>
      <div className="rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 p-10">
        <div className="p-6 text-sm font-bold text-tm-text" style={{ background: `rgba(255,255,255,${alpha})`, backdropFilter: `blur(${blur}px) saturate(160%)`, border: "1px solid rgba(255,255,255,.4)", borderRadius: `${radius}px` }}>Glass card</div>
      </div>
      <pre className="overflow-x-auto rounded-xl border border-tm-border bg-tm-elevated p-3 text-sm">{css}</pre>
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => { if (await copyText(css)) done("Copied."); else fail("Copy failed. Try again."); }}>Copy CSS</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function ContrastPanel() {
  const [fg, setFg] = useState("#0f172a");
  const [bg, setBg] = useState("#ffffff");
  const { error } = useNotice();
  let ratio = 0;
  let message: string | null = null;
  try {
    ratio = contrastRatio(fg, bg);
  } catch (err) {
    message = err instanceof Error ? err.message : "Invalid value.";
  }
  const pass = (min: number) => ratio >= min;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="cfg" label="Foreground"><input id="cfg" className="tm-input" value={fg} onChange={(e) => setFg(e.target.value)} /></Field>
        <Field id="cbg" label="Background"><input id="cbg" className="tm-input" value={bg} onChange={(e) => setBg(e.target.value)} /></Field>
      </div>
      <button type="button" className="tm-btn tm-btn-ghost" onClick={() => { const a = fg; setFg(bg); setBg(a); }}>Swap</button>
      {message ? <p className="tm-notice tm-notice-error">{message}</p> : (
        <>
          <p className="text-3xl font-black">{ratio.toFixed(2)}:1</p>
          <ul className="text-sm font-bold">
            <li>AA normal text: {pass(4.5) ? "Pass" : "Fail"}</li>
            <li>AA large text: {pass(3) ? "Pass" : "Fail"}</li>
            <li>AAA normal text: {pass(7) ? "Pass" : "Fail"}</li>
            <li>AAA large text: {pass(4.5) ? "Pass" : "Fail"}</li>
          </ul>
          <p className="rounded-xl border border-tm-border p-4" style={{ color: fg, background: bg }}>Sample sentence for contrast.</p>
        </>
      )}
      <Status error={error} ok={null} />
    </div>
  );
}
