"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { aesDecrypt, aesEncrypt } from "@/lib/security/aes";
import { copyText, downloadBlob, downloadTextFile } from "@/lib/security/utils";
import { toBionicHtml } from "@/lib/utilities/bionic";
import { buildPrivacyPolicy, buildTerms } from "@/lib/utilities/legal";
import { generateRandomIpv4, ipv4ToBinary } from "@/lib/utilities/ip";
import { randomObjects } from "@/lib/utilities/lists";
import { STARTER_TEMPLATES } from "@/lib/utilities/templates";
import type { UtilitySlug } from "@/lib/utilities/slugs";
import { ICON_CATALOG, Icon, iconSvgMarkup } from "@/components/ui/Icon";

interface Props {
  slug: UtilitySlug;
  convertHeading?: string;
}

function Field({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-tm-text">
        {label}
      </label>
      {children}
    </div>
  );
}

export function UtilityWorkspace({ slug, convertHeading }: Props) {
  return (
    <div className="space-y-6">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}
      {slug === "meme-generator" ? <MemePanel /> : null}
      {slug === "e-signature" ? <SignaturePanel /> : null}
      {slug === "invoice-generator" ? <InvoicePanel /> : null}
      {slug === "webcam-test" ? <WebcamPanel /> : null}
      {slug === "corrupt-file" ? <CorruptPanel /> : null}
      {slug === "icons" ? <IconsPanel /> : null}
      {slug === "web-templates" ? <TemplatesPanel /> : null}
      {slug === "json-viewer" ? <JsonPanel /> : null}
      {slug === "terms-generator" || slug === "privacy-policy-generator" ? (
        <LegalPanel kind={slug} />
      ) : null}
      {slug === "text-to-image" || slug === "text-to-handwriting" ? (
        <TextImagePanel handwriting={slug === "text-to-handwriting"} />
      ) : null}
      {slug === "mhtml-to-pdf" ? <MhtmlPanel /> : null}
      {slug === "image-to-base64" || slug === "base64-to-image" || slug === "base64" ? (
        <Base64Panel mode={slug} />
      ) : null}
      {slug === "aes-encrypt" || slug === "aes-decrypt" ? <AesPanel mode={slug} /> : null}
      {slug === "ip-to-binary" ? <IpPanel /> : null}
      {slug === "random-ip-generator" ? <RandomIpPanel /> : null}
      {slug === "random-object-generator" ? <ObjectsPanel /> : null}
      {slug === "bionic-reading-converter" ? <BionicPanel /> : null}
    </div>
  );
}

function useNotice() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const fail = (message: string) => {
    setOk(null);
    setError(message);
  };
  const done = (message: string) => {
    setError(null);
    setOk(message);
  };
  return { error, ok, fail, done, setError, setOk };
}

function Status({ error, ok }: { error: string | null; ok: string | null }) {
  if (error) return <p className="tm-notice tm-notice-error">{error}</p>;
  if (ok) return <p className="tm-notice tm-notice-success">{ok}</p>;
  return null;
}

function MemePanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [top, setTop] = useState("TOP TEXT");
  const [bottom, setBottom] = useState("BOTTOM TEXT");
  const [size, setSize] = useState(42);
  const { error, ok, fail, done } = useNotice();

  async function draw() {
    if (!file || !preview) {
      fail("Choose an image first.");
      return;
    }
    const image = new Image();
    image.src = preview;
    await image.decode();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      fail("Could not prepare a drawing canvas.");
      return;
    }
    ctx.drawImage(image, 0, 0);
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    ctx.font = `bold ${size}px Impact, Haettenschweiler, sans-serif`;
    ctx.strokeStyle = "#111827";
    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = Math.max(4, size / 10);
    const cx = canvas.width / 2;
    ctx.strokeText(top, cx, size + 8);
    ctx.fillText(top, cx, size + 8);
    ctx.strokeText(bottom, cx, canvas.height - 16);
    ctx.fillText(bottom, cx, canvas.height - 16);
    done("Preview updated.");
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width < 2) {
      fail("Create a preview first.");
      return;
    }
    canvas.toBlob((blob) => {
      if (!blob) {
        fail("Could not create a PNG.");
        return;
      }
      downloadBlob(blob, "meme.png");
      done("PNG downloaded.");
    }, "image/png");
  }

  return (
    <div className="space-y-4">
      <Field label="Image">
        <input
          className="tm-input"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const next = e.target.files?.[0] ?? null;
            if (preview) URL.revokeObjectURL(preview);
            setFile(next);
            setPreview(next ? URL.createObjectURL(next) : null);
          }}
        />
      </Field>
      <div className="grid gap-3 md:grid-cols-2">
        <Field id="meme-top" label="Top text">
          <input id="meme-top" className="tm-input" value={top} onChange={(e) => setTop(e.target.value)} />
        </Field>
        <Field id="meme-bottom" label="Bottom text">
          <input id="meme-bottom" className="tm-input" value={bottom} onChange={(e) => setBottom(e.target.value)} />
        </Field>
      </div>
      <Field id="meme-size" label={`Font size: ${size}`}>
        <input id="meme-size" type="range" min={18} max={96} value={size} onChange={(e) => setSize(Number(e.target.value))} />
      </Field>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => void draw()}>
          Update Preview
        </button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={download}>
          Download PNG
        </button>
        <button
          type="button"
          className="tm-btn tm-btn-ghost"
          onClick={() => {
            if (preview) URL.revokeObjectURL(preview);
            setFile(null);
            setPreview(null);
            setTop("TOP TEXT");
            setBottom("BOTTOM TEXT");
          }}
        >
          Reset
        </button>
      </div>
      <canvas ref={canvasRef} className="max-h-[420px] w-full rounded-2xl border border-tm-border bg-tm-soft object-contain" />
      <Status error={error} ok={ok} />
    </div>
  );
}

function SignaturePanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const strokes = useRef<Array<Array<{ x: number; y: number }>>>([]);
  const [width, setWidth] = useState(3);
  const { error, ok, fail, done } = useNotice();

  const pos = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = width;
    for (const stroke of strokes.current) {
      if (!stroke.length) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (const point of stroke.slice(1)) ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-tm-muted">Draw in the pad. Download creates a PNG with a transparent background.</p>
      <canvas
        ref={canvasRef}
        width={900}
        height={320}
        className="h-48 w-full touch-none rounded-2xl border border-tm-border bg-[repeating-linear-gradient(0deg,transparent,transparent_31px,#d0dae8_32px)] dark:bg-tm-elevated"
        onPointerDown={(e) => {
          drawing.current = true;
          strokes.current.push([pos(e)]);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          strokes.current[strokes.current.length - 1].push(pos(e));
          redraw();
        }}
        onPointerUp={() => {
          drawing.current = false;
        }}
      />
      <Field id="pen" label={`Pen thickness: ${width}`}>
        <input id="pen" type="range" min={1} max={10} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
      </Field>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => { strokes.current.pop(); redraw(); }}>
          Undo
        </button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => { strokes.current = []; redraw(); }}>
          Clear
        </button>
        <button
          type="button"
          className="tm-btn tm-btn-primary"
          onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas || !strokes.current.length) {
              fail("Draw a signature first.");
              return;
            }
            canvas.toBlob((blob) => {
              if (!blob) return fail("Could not create a PNG.");
              downloadBlob(blob, "signature.png");
              done("PNG downloaded.");
            }, "image/png");
          }}
        >
          Download PNG
        </button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

function InvoicePanel() {
  const [from, setFrom] = useState("Northline Studio\n12 Harbor Lane");
  const [to, setTo] = useState("Bright Harbor Co.");
  const [number, setNumber] = useState("INV-1042");
  const [date, setDate] = useState("2026-10-06");
  const [tax, setTax] = useState(8);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("Thank you for your business.");
  const [items, setItems] = useState([{ desc: "Design hours", qty: 8, price: 95 }]);
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const total = Math.max(0, subtotal - discount) * (1 + tax / 100);

  function printInvoice() {
    const html = `<html><head><title>${number}</title>
      <style>body{font-family:ui-sans-serif,system-ui;padding:32px;color:#111} table{width:100%;border-collapse:collapse} td,th{border-bottom:1px solid #ddd;padding:8px;text-align:left}</style>
      </head><body>
      <h1>Invoice ${number}</h1>
      <p>Date: ${date}</p>
      <h2>From</h2><pre>${from}</pre>
      <h2>Bill to</h2><pre>${to}</pre>
      <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead><tbody>
      ${items.map((item) => `<tr><td>${item.desc}</td><td>${item.qty}</td><td>${item.price.toFixed(2)}</td><td>${(item.qty * item.price).toFixed(2)}</td></tr>`).join("")}
      </tbody></table>
      <p>Subtotal: ${subtotal.toFixed(2)} · Discount: ${discount.toFixed(2)} · Tax: ${tax}% · Total: ${total.toFixed(2)}</p>
      <p>${notes}</p>
      </body></html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Field id="inv-from" label="From"><textarea id="inv-from" className="tm-input min-h-24" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
        <Field id="inv-to" label="Bill to"><textarea id="inv-to" className="tm-input min-h-24" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
        <Field id="inv-no" label="Invoice number"><input id="inv-no" className="tm-input" value={number} onChange={(e) => setNumber(e.target.value)} /></Field>
        <Field id="inv-date" label="Date"><input id="inv-date" type="date" className="tm-input" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      </div>
      {items.map((item, index) => (
        <div key={index} className="grid gap-2 md:grid-cols-4">
          <input className="tm-input" value={item.desc} aria-label="Item" onChange={(e) => setItems((rows) => rows.map((row, i) => i === index ? { ...row, desc: e.target.value } : row))} />
          <input className="tm-input" type="number" min={0} value={item.qty} aria-label="Quantity" onChange={(e) => setItems((rows) => rows.map((row, i) => i === index ? { ...row, qty: Number(e.target.value) } : row))} />
          <input className="tm-input" type="number" min={0} value={item.price} aria-label="Price" onChange={(e) => setItems((rows) => rows.map((row, i) => i === index ? { ...row, price: Number(e.target.value) } : row))} />
          <p className="self-center text-sm font-bold">{(item.qty * item.price).toFixed(2)}</p>
        </div>
      ))}
      <button type="button" className="tm-btn tm-btn-ghost" onClick={() => setItems((rows) => [...rows, { desc: "", qty: 1, price: 0 }])}>Add line</button>
      <div className="grid gap-3 md:grid-cols-2">
        <Field id="inv-tax" label="Tax %"><input id="inv-tax" className="tm-input" type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} /></Field>
        <Field id="inv-disc" label="Discount"><input id="inv-disc" className="tm-input" type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} /></Field>
      </div>
      <Field id="inv-notes" label="Notes"><textarea id="inv-notes" className="tm-input min-h-20" value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
      <p className="text-lg font-extrabold">Total {total.toFixed(2)}</p>
      <button type="button" className="tm-btn tm-btn-primary" onClick={printInvoice}>Print / Save PDF</button>
    </div>
  );
}

function WebcamPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mirror, setMirror] = useState(true);
  const { error, ok, fail, done } = useNotice();

  async function start() {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(media);
      if (videoRef.current) videoRef.current.srcObject = media;
      done("Camera is live.");
    } catch {
      fail("Camera permission was denied or no camera is available.");
    }
  }

  function stop() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  function snapshot() {
    const video = videoRef.current;
    if (!video || !stream) {
      fail("Start the camera first.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return fail("Could not capture a snapshot.");
      downloadBlob(blob, "webcam-snapshot.png");
      done("Snapshot downloaded.");
    }, "image/png");
  }

  return (
    <div className="space-y-4">
      <video ref={videoRef} autoPlay playsInline muted className={`w-full rounded-2xl border border-tm-border bg-black ${mirror ? "-scale-x-100" : ""}`} />
      <p className="text-sm font-bold text-tm-muted">{stream ? "Camera on" : "Camera off"}</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => void start()}>Start camera</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={stop}>Stop</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => setMirror((v) => !v)}>Toggle mirror</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={snapshot}>Snapshot</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

function CorruptPanel() {
  const { error, ok, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-tm-muted">
        This creates a new downloadable copy with deliberately altered bytes for testing. Your original file is not overwritten.
      </p>
      <input
        className="tm-input"
        type="file"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            const buffer = new Uint8Array(await file.arrayBuffer());
            const copy = new Uint8Array(buffer);
            const count = Math.max(8, Math.floor(copy.length * 0.01));
            const idx = new Uint32Array(count);
            crypto.getRandomValues(idx);
            const noise = new Uint8Array(count);
            crypto.getRandomValues(noise);
            for (let i = 0; i < count; i += 1) {
              const at = idx[i] % copy.length;
              copy[at] = noise[i];
            }
            const blob = new Blob([copy], { type: "application/octet-stream" });
            downloadBlob(blob, `corrupted-test-${file.name}`);
            done("Downloaded a corrupted test copy. The original file is unchanged.");
          } catch {
            fail("Could not create a test copy of this file.");
          }
        }}
      />
      <Status error={error} ok={ok} />
    </div>
  );
}

function IconsPanel() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const items = ICON_CATALOG.filter((item) =>
    `${item.name} ${item.label} ${item.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-4">
      <Field id="icon-q" label="Search icons">
        <input id="icon-q" className="tm-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="search, pdf, shield" />
      </Field>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.name} className="tm-card p-4">
            <Icon name={item.name} className="h-7 w-7 text-tm-accent" />
            <p className="mt-2 text-sm font-bold">{item.label}</p>
            <p className="text-xs font-semibold text-tm-muted">{item.category}</p>
            <button
              type="button"
              className="mt-3 text-sm font-bold text-tm-accent"
              onClick={async () => {
                await copyText(iconSvgMarkup(item.name));
                setCopied(item.name);
              }}
            >
              {copied === item.name ? "Copied SVG" : "Copy SVG"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplatesPanel() {
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {STARTER_TEMPLATES.map((tpl) => (
        <article key={tpl.id} className="tm-card p-5">
          <h3 className="text-lg font-bold">{tpl.name}</h3>
          <p className="mt-2 text-sm font-medium text-tm-muted">{tpl.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="tm-btn tm-btn-secondary"
              onClick={async () => {
                await copyText(tpl.html);
                setCopied(tpl.id);
              }}
            >
              {copied === tpl.id ? "Copied" : "Copy HTML"}
            </button>
            <button
              type="button"
              className="tm-btn tm-btn-primary"
              onClick={() =>
                downloadBlob(new Blob([tpl.html], { type: "text/html" }), tpl.filename)
              }
            >
              Download
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function JsonNode({
  name,
  value,
  query,
}: {
  name: string;
  value: unknown;
  query: string;
}) {
  const [open, setOpen] = useState(true);
  const match = query && JSON.stringify(value).toLowerCase().includes(query.toLowerCase());
  if (value && typeof value === "object") {
    const entries = Array.isArray(value)
      ? value.map((item, i) => [String(i), item] as const)
      : Object.entries(value);
    return (
      <div className="ml-2">
        <button type="button" className="text-left text-sm font-bold" onClick={() => setOpen((v) => !v)}>
          {open ? "▾" : "▸"} {name} {Array.isArray(value) ? `[${value.length}]` : "{…}"}
        </button>
        {open
          ? entries.map(([key, child]) => (
              <JsonNode key={key} name={key} value={child} query={query} />
            ))
          : null}
      </div>
    );
  }
  return (
    <p className={`ml-6 text-sm ${match ? "text-tm-accent" : "text-tm-text"}`}>
      <span className="font-bold">{name}:</span> {JSON.stringify(value)}
    </p>
  );
}

function JsonPanel() {
  const [input, setInput] = useState('{"project":"Harbor Marks","pages":3}');
  const [query, setQuery] = useState("");
  const [openAll, setOpenAll] = useState(true);
  const parsed = useMemo(() => {
    try {
      return { value: JSON.parse(input) as unknown, error: null };
    } catch (error) {
      return { value: null, error: error instanceof Error ? error.message : "Malformed JSON" };
    }
  }, [input]);
  return (
    <div className="space-y-4">
      <textarea className="tm-input min-h-40 font-mono text-sm" value={input} onChange={(e) => setInput(e.target.value)} aria-label="JSON input" />
      <div className="flex flex-wrap gap-2">
        <input className="tm-input max-w-xs" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search keys or values" />
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => setOpenAll(true)}>Expand all</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => setOpenAll(false)}>Collapse all</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => void copyText(input)}>Copy JSON</button>
      </div>
      {parsed.error ? <p className="tm-notice tm-notice-error">{parsed.error}</p> : (
        <div key={String(openAll)} className="rounded-2xl border border-tm-border bg-tm-soft p-4">
          <JsonNode name="root" value={parsed.value} query={query} />
        </div>
      )}
    </div>
  );
}

function LegalPanel({ kind }: { kind: "terms-generator" | "privacy-policy-generator" }) {
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [effective, setEffective] = useState("2026-10-06");
  const text = kind === "terms-generator"
    ? buildTerms({ company, website, effective })
    : buildPrivacyPolicy({ company, website, effective });
  return (
    <div className="space-y-4">
      <p className="tm-notice tm-notice-warning">This creates a starter document with placeholders. It is not legal advice.</p>
      <div className="grid gap-3 md:grid-cols-3">
        <Field id="co" label="Organization"><input id="co" className="tm-input" value={company} onChange={(e) => setCompany(e.target.value)} /></Field>
        <Field id="web" label="Website"><input id="web" className="tm-input" value={website} onChange={(e) => setWebsite(e.target.value)} /></Field>
        <Field id="eff" label="Effective date"><input id="eff" className="tm-input" value={effective} onChange={(e) => setEffective(e.target.value)} /></Field>
      </div>
      <textarea readOnly className="tm-input min-h-72 font-mono text-sm" value={text} />
      <div className="flex gap-3">
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => void copyText(text)}>Copy</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => downloadTextFile(text, `${kind}.txt`)}>Download</button>
      </div>
    </div>
  );
}

function TextImagePanel({ handwriting }: { handwriting: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("Harbor light on still water.");
  const [size, setSize] = useState(handwriting ? 36 : 42);
  const [bg, setBg] = useState("#f8fafc");
  const [fg, setFg] = useState("#0f172a");
  const { error, ok, fail, done } = useNotice();

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = 1200;
    const padding = 48;
    const font = handwriting
      ? `${size}px "Segoe Script", "Bradley Hand", "Apple Chancery", cursive`
      : `600 ${size}px ui-sans-serif, system-ui, sans-serif`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = font;
    const lines = text.split("\n");
    const lineH = size * 1.45;
    canvas.width = width;
    canvas.height = Math.max(240, padding * 2 + lines.length * lineH);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fg;
    ctx.font = font;
    ctx.textBaseline = "top";
    lines.forEach((line, i) => {
      const y = padding + i * lineH;
      if (handwriting) {
        let x = padding;
        for (const ch of line) {
          const jitter = (Math.sin(x + i) * 1.4);
          ctx.fillText(ch, x, y + jitter);
          x += ctx.measureText(ch).width;
        }
      } else {
        ctx.fillText(line, padding, y);
      }
    });
    done("Preview updated.");
  }, [bg, done, fg, handwriting, size, text]);

  return (
    <div className="space-y-4">
      <textarea className="tm-input min-h-32" value={text} onChange={(e) => setText(e.target.value)} aria-label="Text" />
      <div className="grid gap-3 md:grid-cols-3">
        <Field id="ts" label="Size"><input id="ts" type="number" className="tm-input" value={size} onChange={(e) => setSize(Number(e.target.value))} /></Field>
        <Field id="bg" label="Background"><input id="bg" type="color" className="tm-input h-11" value={bg} onChange={(e) => setBg(e.target.value)} /></Field>
        <Field id="fg" label="Text color"><input id="fg" type="color" className="tm-input h-11" value={fg} onChange={(e) => setFg(e.target.value)} /></Field>
      </div>
      <div className="flex gap-3">
        <button type="button" className="tm-btn tm-btn-primary" onClick={render}>Update Preview</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => {
          const canvas = canvasRef.current;
          if (!canvas) return fail("Create a preview first.");
          canvas.toBlob((blob) => blob ? downloadBlob(blob, handwriting ? "handwriting.png" : "text-image.png") : fail("Could not create PNG."), "image/png");
        }}>Download PNG</button>
      </div>
      <canvas ref={canvasRef} className="w-full rounded-2xl border border-tm-border" />
      <Status error={error} ok={ok} />
    </div>
  );
}

function MhtmlPanel() {
  const { error, ok, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-tm-muted">
        Upload an MHTML/MHT file. Tool Base extracts the HTML part and opens a print dialog so you can save a PDF.
      </p>
      <input
        className="tm-input"
        type="file"
        accept=".mhtml,.mht,multipart/related,message/rfc822"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            const text = await file.text();
            const match = text.match(/<html[\s\S]*<\/html>/i);
            if (!match) {
              fail("Could not find HTML inside this MHTML file.");
              return;
            }
            const win = window.open("", "_blank");
            if (!win) {
              fail("Pop-up blocked. Allow pop-ups to print the extracted page.");
              return;
            }
            win.document.write(match[0]);
            win.document.close();
            win.focus();
            win.print();
            done("Extracted HTML opened for printing.");
          } catch {
            fail("Could not read this MHTML file.");
          }
        }}
      />
      <Status error={error} ok={ok} />
    </div>
  );
}

function Base64Panel({ mode }: { mode: "image-to-base64" | "base64-to-image" | "base64" }) {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [encode, setEncode] = useState(true);
  const { error, ok, fail, done } = useNotice();

  return (
    <div className="space-y-4">
      {mode === "base64" ? (
        <label className="inline-flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={encode} onChange={(e) => setEncode(e.target.checked)} />
          Encode (off = decode)
        </label>
      ) : null}
      {mode !== "base64-to-image" ? (
        <input
          className="tm-input"
          type="file"
          accept={mode === "image-to-base64" ? "image/*" : undefined}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              const value = String(reader.result);
              setOut(value);
              setPreview(mode === "image-to-base64" ? value : null);
              done("Encoded.");
            };
            reader.onerror = () => fail("Could not read this file.");
            reader.readAsDataURL(file);
          }}
        />
      ) : null}
      {mode !== "image-to-base64" ? (
        <textarea className="tm-input min-h-32 font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text or a data URL" />
      ) : null}
      {mode === "base64" ? (
        <button
          type="button"
          className="tm-btn tm-btn-primary"
          onClick={() => {
            try {
              if (encode) {
                setOut(`data:text/plain;base64,${btoa(unescape(encodeURIComponent(text)))}`);
                done("Encoded.");
              } else {
                const raw = text.includes(",") ? text.slice(text.indexOf(",") + 1) : text;
                setOut(decodeURIComponent(escape(atob(raw.replace(/\s+/g, "")))));
                done("Decoded.");
              }
            } catch {
              fail(encode ? "Could not encode this text." : "Invalid Base64 input.");
            }
          }}
        >
          Convert
        </button>
      ) : null}
      {mode === "base64-to-image" ? (
        <button
          type="button"
          className="tm-btn tm-btn-primary"
          onClick={() => {
            const value = text.trim();
            if (!value.startsWith("data:image")) {
              fail("Paste a data URL that starts with data:image.");
              return;
            }
            setPreview(value);
            setOut(value);
            done("Image preview ready.");
          }}
        >
          Preview image
        </button>
      ) : null}
      {out ? <textarea readOnly className="tm-input min-h-32 font-mono text-sm" value={out} /> : null}
      {preview ? (
        // Data URLs are user-generated previews, not static assets.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Decoded preview" className="max-h-72 rounded-2xl border border-tm-border" />
      ) : null}
      <div className="flex gap-3">
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => void copyText(out)} disabled={!out}>Copy</button>
        {preview ? (
          <a className="tm-btn tm-btn-primary" href={preview} download="image.png">Download image</a>
        ) : null}
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

function AesPanel({ mode }: { mode: "aes-encrypt" | "aes-decrypt" }) {
  const [input, setInput] = useState("");
  const [pass, setPass] = useState("");
  const [out, setOut] = useState("");
  const { error, ok, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-tm-muted">
        AES-256-GCM with a passphrase-derived key. Hashes cannot be decrypted; this tool is encryption, not hashing.
      </p>
      <Field id="aes-in" label={mode === "aes-encrypt" ? "Text" : "Encrypted payload"}>
        <textarea id="aes-in" className="tm-input min-h-32 font-mono text-sm" value={input} onChange={(e) => setInput(e.target.value)} />
      </Field>
      <Field id="aes-pass" label="Passphrase">
        <input id="aes-pass" type="password" className="tm-input" value={pass} onChange={(e) => setPass(e.target.value)} />
      </Field>
      <button
        type="button"
        className="tm-btn tm-btn-primary"
        onClick={async () => {
          try {
            const value = mode === "aes-encrypt" ? await aesEncrypt(input, pass) : await aesDecrypt(input, pass);
            setOut(value);
            done(mode === "aes-encrypt" ? "Encrypted." : "Decrypted.");
          } catch (err) {
            fail(err instanceof Error ? err.message : "Processing failed.");
          }
        }}
      >
        {mode === "aes-encrypt" ? "Encrypt" : "Decrypt"}
      </button>
      <textarea readOnly className="tm-input min-h-32 font-mono text-sm" value={out} />
      <button type="button" className="tm-btn tm-btn-secondary" onClick={() => void copyText(out)} disabled={!out}>Copy</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

function IpPanel() {
  const [input, setInput] = useState("192.0.2.10");
  const [out, setOut] = useState("");
  const { error, ok, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="ip" label="IPv4 address">
        <input id="ip" className="tm-input" value={input} onChange={(e) => setInput(e.target.value)} />
      </Field>
      <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
        try {
          setOut(ipv4ToBinary(input));
          done("Converted.");
        } catch (err) {
          fail(err instanceof Error ? err.message : "Invalid IP address.");
        }
      }}>Convert</button>
      <textarea readOnly className="tm-input font-mono" value={out} />
      <Status error={error} ok={ok} />
    </div>
  );
}

function RandomIpPanel() {
  const [count, setCount] = useState(8);
  const [out, setOut] = useState("");
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-tm-muted">
        These addresses are synthetic values in the 203.0.0.0/16 documentation range. They are not assigned hosts and are not a network lookup.
      </p>
      <Field id="n" label="How many">
        <input id="n" type="number" min={1} max={50} className="tm-input" value={count} onChange={(e) => setCount(Number(e.target.value))} />
      </Field>
      <button type="button" className="tm-btn tm-btn-primary" onClick={() => setOut(generateRandomIpv4(count).join("\n"))}>Generate</button>
      <textarea readOnly className="tm-input min-h-40 font-mono" value={out} />
    </div>
  );
}

function ObjectsPanel() {
  const [count, setCount] = useState(10);
  const [out, setOut] = useState("");
  return (
    <div className="space-y-4">
      <Field id="objn" label="How many">
        <input id="objn" type="number" min={1} max={40} className="tm-input" value={count} onChange={(e) => setCount(Number(e.target.value))} />
      </Field>
      <button type="button" className="tm-btn tm-btn-primary" onClick={() => setOut(randomObjects(count))}>Generate</button>
      <textarea readOnly className="tm-input min-h-40" value={out} />
    </div>
  );
}

function BionicPanel() {
  const [input, setInput] = useState("Read a little faster by emphasizing the start of each word.");
  const html = useMemo(() => {
    try {
      return toBionicHtml(input);
    } catch {
      return "";
    }
  }, [input]);
  return (
    <div className="space-y-4">
      <textarea className="tm-input min-h-32" value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="rounded-2xl border border-tm-border bg-tm-soft p-5 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
      <button type="button" className="tm-btn tm-btn-secondary" onClick={() => void copyText(html)}>Copy HTML</button>
    </div>
  );
}
