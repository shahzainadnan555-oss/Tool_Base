"use client";

import { useEffect, useMemo, useState } from "react";
import { copyText, downloadTextFile } from "@/lib/security/utils";
import {
  encodeCode39,
  gcd,
  HTTP_STATUS,
  matchSignature,
  mimeFromName,
  parseUserAgent,
} from "@/lib/pack/helpers";
import { Field, Status, useNotice } from "./shared";

export function BarcodePanel() {
  const [text, setText] = useState("TOOLBASE");
  const encoded = encodeCode39(text);
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="bc" label="Text"><input id="bc" className="tm-input" value={text} onChange={(e) => setText(e.target.value)} /></Field>
      {encoded.error ? <p className="tm-notice tm-notice-error">{encoded.error}</p> : (
        <div className="overflow-x-auto rounded-xl border border-tm-border bg-white p-4" dangerouslySetInnerHTML={{ __html: encoded.svg }} />
      )}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={async () => {
          if (encoded.error || !encoded.svg) { fail(encoded.error || "Empty input."); return; }
          if (await copyText(encoded.svg)) done("Copied."); else fail("Copy failed. Try again.");
        }}>Copy SVG</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => {
          if (encoded.error || !encoded.svg) { fail(encoded.error || "Empty input."); return; }
          downloadTextFile(encoded.svg, "barcode.svg");
          done("Downloaded.");
        }}>Download</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function ScreenPanel() {
  const [info, setInfo] = useState(() =>
    typeof window === "undefined"
      ? { width: 0, height: 0, availWidth: 0, availHeight: 0 }
      : {
          width: window.screen.width,
          height: window.screen.height,
          availWidth: window.screen.availWidth,
          availHeight: window.screen.availHeight,
        },
  );
  function read() {
    setInfo({
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
    });
  }
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      {info.width ? (
        <ul className="space-y-1 font-bold">
          <li>Screen {info.width} × {info.height}</li>
          <li>Available {info.availWidth} × {info.availHeight}</li>
        </ul>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-secondary" onClick={read}>Refresh</button>
        <button type="button" className="tm-btn tm-btn-primary" onClick={async () => {
          if (await copyText(`${info.width}x${info.height}`)) done("Copied."); else fail("Copy failed. Try again.");
        }}>Copy</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function ViewportPanel() {
  const [size, setSize] = useState(() =>
    typeof window === "undefined" ? { w: 0, h: 0 } : { w: window.innerWidth, h: window.innerHeight },
  );
  useEffect(() => {
    const read = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <p className="text-3xl font-black">{size.w} × {size.h}</p>
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => {
        if (await copyText(`${size.w}x${size.h}`)) done("Copied."); else fail("Copy failed. Try again.");
      }}>Copy</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function DprPanel() {
  const [dpr, setDpr] = useState(() => (typeof window === "undefined" ? 1 : window.devicePixelRatio || 1));
  const [vw, setVw] = useState(() => (typeof window === "undefined" ? 0 : window.innerWidth));
  const [vh, setVh] = useState(() => (typeof window === "undefined" ? 0 : window.innerHeight));
  useEffect(() => {
    const read = () => {
      setDpr(window.devicePixelRatio || 1);
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <p className="text-3xl font-black">{dpr}</p>
      <p className="font-bold text-tm-muted">Estimated physical viewport {Math.round(vw * dpr)} × {Math.round(vh * dpr)}</p>
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => { if (await copyText(String(dpr))) done("Copied."); else fail("Copy failed. Try again."); }}>Copy</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

function browserRows(): Array<[string, string]> {
  if (typeof navigator === "undefined") return [];
  const nav = navigator as Navigator & { deviceMemory?: number };
  return [
    ["User agent", navigator.userAgent],
    ["Platform", navigator.platform || "Unavailable"],
    ["Language", navigator.language || "Unavailable"],
    ["Cookies", navigator.cookieEnabled ? "Enabled" : "Disabled"],
    ["Online", navigator.onLine ? "Online" : "Offline"],
    ["Hardware concurrency", String(navigator.hardwareConcurrency ?? "Unavailable")],
    ["Device memory (GiB)", nav.deviceMemory != null ? String(nav.deviceMemory) : "Unavailable"],
    ["Vendor", navigator.vendor || "Unavailable"],
  ];
}

export function BrowserInfoPanel() {
  const rows = browserRows();
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <dl className="space-y-2">
        {rows.map(([k, v]) => (
          <div key={k}><dt className="text-xs font-bold text-tm-muted">{k}</dt><dd className="break-all font-medium">{v}</dd></div>
        ))}
      </dl>
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => {
        if (await copyText(rows.map(([k, v]) => `${k}: ${v}`).join("\n"))) done("Copied."); else fail("Copy failed. Try again.");
      }}>Copy</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function UaParserPanel() {
  const [ua, setUa] = useState(() => (typeof navigator === "undefined" ? "" : navigator.userAgent));
  const parsed = useMemo(() => (ua ? parseUserAgent(ua) : {}), [ua]);
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="ua" label="User agent"><textarea id="ua" className="tm-input min-h-24 font-mono text-xs" value={ua} onChange={(e) => setUa(e.target.value)} /></Field>
      <dl className="space-y-2">
        {Object.entries(parsed).filter(([k]) => k !== "raw").map(([k, v]) => (
          <div key={k}><dt className="text-xs font-bold uppercase text-tm-muted">{k}</dt><dd className="font-medium">{v}</dd></div>
        ))}
      </dl>
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => { if (await copyText(JSON.stringify(parsed, null, 2))) done("Copied."); else fail("Copy failed. Try again."); }}>Copy JSON</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function KeyboardPanel() {
  const [log, setLog] = useState<string[]>([]);
  const [current, setCurrent] = useState("Press a key");
  return (
    <div
      className="space-y-4 rounded-2xl border border-tm-border bg-tm-white p-4"
      tabIndex={0}
      onKeyDown={(e) => {
        e.preventDefault();
        const line = `${e.key} · ${e.code} · loc ${e.location}${e.repeat ? " · repeat" : ""}${e.ctrlKey ? " · Ctrl" : ""}${e.altKey ? " · Alt" : ""}${e.shiftKey ? " · Shift" : ""}${e.metaKey ? " · Meta" : ""}`;
        setCurrent(line);
        setLog((rows) => [line, ...rows].slice(0, 20));
      }}
    >
      <p className="text-sm font-bold text-tm-muted">Click this pad, then press keys.</p>
      <p className="font-mono text-lg font-black" aria-live="polite">{current}</p>
      <ol className="space-y-1 font-mono text-xs">{log.map((row, i) => <li key={`${row}-${i}`}>{row}</li>)}</ol>
      <button type="button" className="tm-btn tm-btn-ghost" onClick={() => { setLog([]); setCurrent("Press a key"); }}>Clear</button>
    </div>
  );
}

export function MousePanel() {
  const [info, setInfo] = useState("Move or click in the pad.");
  return (
    <div
      className="h-56 rounded-2xl border border-tm-border bg-slate-100 p-4 dark:bg-slate-800"
      onMouseMove={(e) => setInfo(`Move · client ${e.clientX},${e.clientY} · buttons ${e.buttons}`)}
      onMouseDown={(e) => setInfo(`Down · button ${e.button} · buttons ${e.buttons}`)}
      onMouseUp={(e) => setInfo(`Up · button ${e.button}`)}
      onWheel={(e) => setInfo(`Wheel · deltaY ${e.deltaY}`)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <p className="font-mono text-sm font-bold" aria-live="polite">{info}</p>
    </div>
  );
}

export function UrlParserPanel() {
  const [raw, setRaw] = useState("https://example.com/path?q=tools#hash");
  const { ok, error, fail, done } = useNotice();
  let parsed: Record<string, string> | null = null;
  let message: string | null = null;
  try {
    const url = new URL(raw);
    parsed = {
      href: url.href,
      protocol: url.protocol,
      host: url.host,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      params: url.searchParams.toString(),
    };
  } catch {
    message = "Invalid value. Enter an absolute URL including a scheme.";
  }
  return (
    <div className="space-y-4">
      <Field id="url" label="URL"><input id="url" className="tm-input" value={raw} onChange={(e) => setRaw(e.target.value)} /></Field>
      {message ? <p className="tm-notice tm-notice-error">{message}</p> : (
        <dl className="space-y-2">{parsed && Object.entries(parsed).map(([k, v]) => <div key={k}><dt className="text-xs font-bold uppercase text-tm-muted">{k}</dt><dd className="break-all font-medium">{v || "—"}</dd></div>)}</dl>
      )}
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => {
        if (!parsed) { fail(message || "Invalid value."); return; }
        if (await copyText(JSON.stringify(parsed, null, 2))) done("Copied."); else fail("Copy failed. Try again.");
      }}>Copy JSON</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function DataUriPanel() {
  const [text, setText] = useState("Hello");
  const [mime, setMime] = useState("text/plain");
  const [b64, setB64] = useState(true);
  const [uri, setUri] = useState("");
  const { ok, error, fail, done } = useNotice();
  function fromText() {
    if (!text) { fail("Empty input."); return; }
    const payload = b64 ? btoa(unescape(encodeURIComponent(text))) : encodeURIComponent(text);
    setUri(`data:${mime}${b64 ? ";base64" : ""},${payload}`);
    done("Generated.");
  }
  return (
    <div className="space-y-4">
      <Field id="dt" label="Text"><textarea id="dt" className="tm-input min-h-24" value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <Field id="dm" label="MIME type"><input id="dm" className="tm-input" value={mime} onChange={(e) => setMime(e.target.value)} /></Field>
      <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" className="size-4 accent-[var(--tm-accent)]" checked={b64} onChange={(e) => setB64(e.target.checked)} /> Base64</label>
      <Field label="Or choose a file">
        <input className="tm-input" type="file" onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              setUri(reader.result);
              setMime(file.type || "application/octet-stream");
              done("Generated.");
            }
          };
          reader.onerror = () => fail("Processing failed.");
          reader.readAsDataURL(file);
        }} />
      </Field>
      <button type="button" className="tm-btn tm-btn-secondary" onClick={fromText}>Generate from text</button>
      {uri ? <textarea className="tm-input min-h-24 font-mono text-xs" readOnly value={uri} /> : null}
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => {
        if (!uri) { fail("Empty input."); return; }
        if (await copyText(uri)) done("Copied."); else fail("Copy failed. Try again.");
      }}>Copy</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function MimePanel() {
  const [name, setName] = useState("document.pdf");
  const [fileType, setFileType] = useState<string | null>(null);
  const mapped = mimeFromName(name);
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="mn" label="Filename or extension"><input id="mn" className="tm-input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <p className="font-bold">{mapped ?? "Unknown mapping"}</p>
      <Field label="File">
        <input className="tm-input" type="file" onChange={(e) => setFileType(e.target.files?.[0]?.type || "Unavailable")} />
      </Field>
      {fileType ? <p className="text-sm font-bold">Browser file type: {fileType || "Unavailable"}</p> : null}
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => {
        const value = mapped ?? "Unknown mapping";
        if (await copyText(value)) done("Copied."); else fail("Copy failed. Try again.");
      }}>Copy</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function FileSigPanel() {
  const [hex, setHex] = useState("");
  const [sig, setSig] = useState("");
  const [name, setName] = useState("");
  const { ok, error, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field label="File">
        <input className="tm-input" type="file" onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setName(file.name);
          const buf = new Uint8Array(await file.slice(0, 16).arrayBuffer());
          const dump = [...buf].map((b) => b.toString(16).padStart(2, "0")).join(" ");
          setHex(dump);
          setSig(matchSignature(buf));
          done("Inspected.");
        }} />
      </Field>
      {hex ? (
        <div>
          <p className="font-mono text-sm">{hex}</p>
          <p className="mt-2 font-black">{sig}</p>
          {name && sig !== "Unknown" && mimeFromName(name) ? (
            <p className="text-sm text-tm-muted">Filename suggests {mimeFromName(name)}.</p>
          ) : null}
        </div>
      ) : null}
      <Status error={error} ok={ok} />
    </div>
  );
}

export function HttpStatusPanel() {
  const [q, setQ] = useState("404");
  const matches = HTTP_STATUS.filter((row) => `${row.code} ${row.phrase} ${row.detail}`.toLowerCase().includes(q.trim().toLowerCase()));
  const { ok, error, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="hs" label="Search"><input id="hs" className="tm-input" value={q} onChange={(e) => setQ(e.target.value)} /></Field>
      <ul className="space-y-3">
        {matches.map((row) => (
          <li key={row.code} className="rounded-xl border border-tm-border bg-tm-white p-3">
            <p className="font-black">{row.code} {row.phrase}</p>
            <p className="text-sm text-tm-muted">{row.detail}</p>
          </li>
        ))}
      </ul>
      {!matches.length ? <p className="tm-notice tm-notice-info">No matching status codes.</p> : null}
      <button type="button" className="tm-btn tm-btn-primary" onClick={async () => {
        if (!matches.length) { fail("Empty input."); return; }
        if (await copyText(matches.map((r) => `${r.code} ${r.phrase}`).join("\n"))) done("Copied."); else fail("Copy failed. Try again.");
      }}>Copy</button>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function BatteryPanel() {
  const [msg, setMsg] = useState(() =>
    typeof navigator !== "undefined" && "getBattery" in navigator
      ? "Checking…"
      : "Unavailable. This browser does not expose battery data.",
  );
  const [level, setLevel] = useState<string | null>(null);
  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<{ charging: boolean; level: number; addEventListener: (e: string, fn: () => void) => void; removeEventListener: (e: string, fn: () => void) => void }> };
    if (!nav.getBattery) return;
    let battery: { charging: boolean; level: number; addEventListener: (e: string, fn: () => void) => void; removeEventListener: (e: string, fn: () => void) => void } | null = null;
    const update = () => {
      if (!battery) return;
      setLevel(`${Math.round(battery.level * 100)}%`);
      setMsg(battery.charging ? "Charging" : "Not charging");
    };
    void nav.getBattery().then((b) => {
      battery = b;
      update();
      b.addEventListener("levelchange", update);
      b.addEventListener("chargingchange", update);
    }).catch(() => setMsg("Unavailable. This browser does not expose battery data."));
  }, []);
  return (
    <div className="space-y-4">
      <p className="text-3xl font-black">{level ?? "—"}</p>
      <p className="font-bold text-tm-muted">{msg}</p>
    </div>
  );
}

export function OnlinePanel() {
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [log, setLog] = useState<string[]>([]);
  useEffect(() => {
    const on = () => { setOnline(true); setLog((rows) => [`Online at ${new Date().toLocaleTimeString()}`, ...rows].slice(0, 8)); };
    const off = () => { setOnline(false); setLog((rows) => [`Offline at ${new Date().toLocaleTimeString()}`, ...rows].slice(0, 8)); };
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return (
    <div className="space-y-4">
      <p className="text-3xl font-black" aria-live="polite">{online ? "Online" : "Offline"}</p>
      <ul className="text-sm font-medium text-tm-muted">{log.map((row) => <li key={row}>{row}</li>)}</ul>
    </div>
  );
}

export function TtsPanel() {
  const [text, setText] = useState("Hello from Tool Base.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() =>
    typeof window === "undefined" ? [] : (window.speechSynthesis?.getVoices() ?? []),
  );
  const [voice, setVoice] = useState("");
  const [rate, setRate] = useState("1");
  const [pitch, setPitch] = useState("1");
  const { ok, error, fail, done } = useNotice();
  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis?.getVoices() ?? []);
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);
  return (
    <div className="space-y-4">
      <Field id="tt" label="Text"><textarea id="tt" className="tm-input min-h-24" value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <Field id="tv" label="Voice">
        <select id="tv" className="tm-input" value={voice} onChange={(e) => setVoice(e.target.value)}>
          <option value="">Default</option>
          {voices.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>
      </Field>
      {!voices.length ? <p className="tm-notice tm-notice-info">No voices available in this browser.</p> : null}
      <Field id="tr" label="Rate"><input id="tr" type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full" /></Field>
      <Field id="tp" label="Pitch"><input id="tp" type="range" min="0" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(e.target.value)} className="w-full" /></Field>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
          if (!text.trim()) { fail("Empty input."); return; }
          if (!window.speechSynthesis) { fail("Unavailable."); return; }
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(text);
          utter.rate = Number(rate);
          utter.pitch = Number(pitch);
          const chosen = voices.find((v) => v.name === voice);
          if (chosen) utter.voice = chosen;
          window.speechSynthesis.speak(utter);
          done("Speaking.");
        }}>Play</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => window.speechSynthesis?.cancel()}>Stop</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function AspectPanel() {
  const [w, setW] = useState("1920");
  const [h, setH] = useState("1080");
  const [lockW, setLockW] = useState("");
  const [lockH, setLockH] = useState("");
  const width = Number(w);
  const height = Number(h);
  const valid = Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
  const g = valid ? gcd(width, height) : 1;
  const ratio = valid ? `${width / g}:${height / g}` : null;
  let solved: string | null = null;
  if (valid && lockW) {
    const lw = Number(lockW);
    if (Number.isFinite(lw) && lw > 0) solved = `Height ${((lw * height) / width).toFixed(2)}`;
  } else if (valid && lockH) {
    const lh = Number(lockH);
    if (Number.isFinite(lh) && lh > 0) solved = `Width ${((lh * width) / height).toFixed(2)}`;
  }
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="aw" label="Width"><input id="aw" className="tm-input" value={w} onChange={(e) => setW(e.target.value)} /></Field>
        <Field id="ah" label="Height"><input id="ah" className="tm-input" value={h} onChange={(e) => setH(e.target.value)} /></Field>
        <Field id="lw" label="Solve height from width"><input id="lw" className="tm-input" value={lockW} onChange={(e) => { setLockW(e.target.value); setLockH(""); }} /></Field>
        <Field id="lh" label="Solve width from height"><input id="lh" className="tm-input" value={lockH} onChange={(e) => { setLockH(e.target.value); setLockW(""); }} /></Field>
      </div>
      {ratio ? <p className="text-3xl font-black">{ratio}</p> : <p className="tm-notice tm-notice-error">Invalid value.</p>}
      {solved ? <p className="font-bold">{solved}</p> : null}
      <div className="flex flex-wrap gap-2">
        {[["16:9", 16, 9], ["4:3", 4, 3], ["1:1", 1, 1], ["9:16", 9, 16]].map(([label, a, b]) => (
          <button key={String(label)} type="button" className="tm-btn tm-btn-ghost" onClick={() => { setW(String(a)); setH(String(b)); }}>{label}</button>
        ))}
      </div>
    </div>
  );
}
