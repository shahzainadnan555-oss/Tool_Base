"use client";

import { useCallback, useEffect, useState } from "react";

export function Field({
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

export function useNotice() {
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
  return { error, ok, fail, done };
}

export function Status({ error, ok }: { error: string | null; ok: string | null }) {
  if (error) return <p className="tm-notice tm-notice-error">{error}</p>;
  if (ok) return <p className="tm-notice tm-notice-success">{ok}</p>;
  return null;
}

export function formatClock(ms: number): string {
  const clamped = Math.max(0, ms);
  const total = Math.floor(clamped / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const tenths = Math.floor((clamped % 1000) / 100);
  const pad = (n: number) => String(n).padStart(2, "0");
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}.${tenths}`;
}

export function randomInt(min: number, max: number): number {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  const span = high - low + 1;
  if (span <= 0) return low;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return low + (buf[0] % span);
  }
  return low + Math.floor(Math.random() * span);
}

export function useRaf(active: boolean, onFrame: () => void) {
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const loop = () => {
      onFrame();
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [active, onFrame]);
}

export function useNow(running: boolean) {
  const [now, setNow] = useState(() => Date.now());
  const tick = useCallback(() => setNow(Date.now()), []);
  useRaf(running, tick);
  return now;
}

export function useNowExpire(running: boolean, remaining: number, onExpire: () => void) {
  const tick = useCallback(() => {
    if (running && remaining <= 0) onExpire();
  }, [running, remaining, onExpire]);
  useRaf(running && remaining <= 0, tick);
}
