"use client";

import { useCallback, useMemo, useState } from "react";
import { copyText, downloadTextFile } from "@/lib/security/utils";
import { simpleMarkdown } from "@/lib/pack/helpers";
import { Field, Status, formatClock, randomInt, useNotice, useNow, useNowExpire } from "./shared";

export function PomodoroPanel() {
  const FOCUS = 25 * 60 * 1000;
  const BREAK = 5 * 60 * 1000;
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedAtPause, setElapsedAtPause] = useState(0);
  const now = useNow(running);
  const duration = phase === "focus" ? FOCUS : BREAK;
  const elapsed = running && startedAt ? elapsedAtPause + (now - startedAt) : elapsedAtPause;
  const remaining = Math.max(0, duration - elapsed);
  const finish = useCallback(() => {
    setRunning(false);
    setStartedAt(null);
    setElapsedAtPause(0);
    setPhase((p) => (p === "focus" ? "break" : "focus"));
  }, []);
  useNowExpire(running, remaining, finish);
  return (
    <div className="space-y-4">
      <p className="font-mono text-4xl font-black text-tm-text" aria-live="polite">
        {formatClock(remaining)}
      </p>
      <p className="text-sm font-bold text-tm-muted">{phase === "focus" ? "Focus" : "Break"}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="tm-btn tm-btn-primary"
          onClick={() => {
            if (running) {
              setElapsedAtPause(elapsed);
              setRunning(false);
              setStartedAt(null);
            } else {
              setStartedAt(Date.now());
              setRunning(true);
            }
          }}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          className="tm-btn tm-btn-secondary"
          onClick={() => {
            setRunning(false);
            setStartedAt(null);
            setElapsedAtPause(0);
            setPhase("focus");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export function FocusTimerPanel() {
  const [minutes, setMinutes] = useState("25");
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedAtPause, setElapsedAtPause] = useState(0);
  const [done, setDone] = useState(false);
  const now = useNow(running);
  const duration = Math.max(0, Number(minutes) * 60 * 1000);
  const elapsed = running && startedAt ? elapsedAtPause + (now - startedAt) : elapsedAtPause;
  const remaining = Math.max(0, duration - elapsed);
  const finish = useCallback(() => {
    setRunning(false);
    setStartedAt(null);
    setDone(true);
  }, []);
  useNowExpire(running, remaining, finish);
  return (
    <div className="space-y-4">
      <Field id="focus-min" label="Minutes">
        <input id="focus-min" className="tm-input" inputMode="decimal" value={minutes} onChange={(e) => setMinutes(e.target.value)} disabled={running} />
      </Field>
      <p className="font-mono text-4xl font-black text-tm-text" aria-live="polite">
        {formatClock(remaining)}
      </p>
      {done ? <p className="tm-notice tm-notice-success">Focus session complete.</p> : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="tm-btn tm-btn-primary"
          onClick={() => {
            if (!Number.isFinite(duration) || duration <= 0) return;
            setDone(false);
            if (running) {
              setElapsedAtPause(elapsed);
              setRunning(false);
              setStartedAt(null);
            } else {
              setStartedAt(Date.now());
              setRunning(true);
            }
          }}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          className="tm-btn tm-btn-secondary"
          onClick={() => {
            setRunning(false);
            setStartedAt(null);
            setElapsedAtPause(0);
            setDone(false);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export function StopwatchPanel() {
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedAtPause, setElapsedAtPause] = useState(0);
  const now = useNow(running);
  const [laps, setLaps] = useState<number[]>([]);
  const elapsed = running && startedAt ? elapsedAtPause + (now - startedAt) : elapsedAtPause;
  const { error, ok, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <p className="font-mono text-4xl font-black text-tm-text" aria-live="polite">
        {formatClock(elapsed)}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="tm-btn tm-btn-primary"
          onClick={() => {
            if (running) {
              setElapsedAtPause(elapsed);
              setRunning(false);
              setStartedAt(null);
            } else {
              setStartedAt(Date.now());
              setRunning(true);
            }
          }}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => setLaps((rows) => [...rows, elapsed])}>
          Lap
        </button>
        <button
          type="button"
          className="tm-btn tm-btn-ghost"
          onClick={() => {
            setRunning(false);
            setStartedAt(null);
            setElapsedAtPause(0);
            setLaps([]);
          }}
        >
          Reset
        </button>
        <button
          type="button"
          className="tm-btn tm-btn-ghost"
          onClick={async () => {
            if (!laps.length) {
              fail("Empty input. Add a lap first.");
              return;
            }
            const okCopy = await copyText(laps.map((ms, i) => `${i + 1}. ${formatClock(ms)}`).join("\n"));
            if (okCopy) done("Copied.");
            else fail("Copy failed. Try again.");
          }}
        >
          Copy laps
        </button>
      </div>
      <Status error={error} ok={ok} />
      {laps.length ? (
        <ol className="list-decimal space-y-1 pl-5 font-mono text-sm">
          {laps.map((ms, i) => (
            <li key={`${ms}-${i}`}>{formatClock(ms)}</li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export function CountdownPanel() {
  const [h, setH] = useState("0");
  const [m, setM] = useState("5");
  const [s, setS] = useState("0");
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedAtPause, setElapsedAtPause] = useState(0);
  const now = useNow(running);
  const [complete, setComplete] = useState(false);
  const duration = (Number(h) * 3600 + Number(m) * 60 + Number(s)) * 1000;
  const elapsed = running && startedAt ? elapsedAtPause + (now - startedAt) : elapsedAtPause;
  const remaining = Math.max(0, duration - elapsed);
  const finish = useCallback(() => {
    setRunning(false);
    setStartedAt(null);
    setComplete(true);
  }, []);
  useNowExpire(running, remaining, finish);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field id="cd-h" label="Hours"><input id="cd-h" className="tm-input" value={h} onChange={(e) => setH(e.target.value)} disabled={running} /></Field>
        <Field id="cd-m" label="Minutes"><input id="cd-m" className="tm-input" value={m} onChange={(e) => setM(e.target.value)} disabled={running} /></Field>
        <Field id="cd-s" label="Seconds"><input id="cd-s" className="tm-input" value={s} onChange={(e) => setS(e.target.value)} disabled={running} /></Field>
      </div>
      <p className="font-mono text-4xl font-black text-tm-text" aria-live="polite">{formatClock(remaining)}</p>
      {complete ? <p className="tm-notice tm-notice-success">Countdown complete.</p> : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
          if (!Number.isFinite(duration) || duration <= 0) return;
          setComplete(false);
          if (running) {
            setElapsedAtPause(elapsed);
            setRunning(false);
            setStartedAt(null);
          } else {
            setStartedAt(Date.now());
            setRunning(true);
          }
        }}>{running ? "Pause" : "Start"}</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => { setRunning(false); setStartedAt(null); setElapsedAtPause(0); setComplete(false); }}>Reset</button>
      </div>
    </div>
  );
}

export function NotepadPanel() {
  const [text, setText] = useState(() =>
    typeof window === "undefined" ? "" : (window.localStorage.getItem("tb-notepad") ?? ""),
  );
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const { error, ok, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="notes" label="Notes">
        <textarea id="notes" className="tm-input min-h-64" value={text} onChange={(e) => {
          const next = e.target.value;
          setText(next);
          window.localStorage.setItem("tb-notepad", next);
        }} />
      </Field>
      <p className="text-sm font-bold text-tm-muted">{words} words · {text.length} characters</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={async () => {
          if (!text) { fail("Empty input."); return; }
          if (await copyText(text)) done("Copied."); else fail("Copy failed. Try again.");
        }}>Copy</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => { if (!text) { fail("Empty input."); return; } downloadTextFile(text, "notes.txt"); done("Downloaded."); }}>Download</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => { setText(""); window.localStorage.removeItem("tb-notepad"); }}>Clear</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function MarkdownPanel() {
  const [src, setSrc] = useState("# Heading\n\nWrite **Markdown** with a [link](https://example.com).\n\n- Item one\n- Item two\n\n`code`");
  const html = useMemo(() => simpleMarkdown(src), [src]);
  const { error, ok, fail, done } = useNotice();
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Field id="md" label="Markdown">
        <textarea id="md" className="tm-input min-h-72 font-mono text-sm" value={src} onChange={(e) => setSrc(e.target.value)} />
      </Field>
      <div>
        <p className="mb-2 text-sm font-bold text-tm-text">Preview</p>
        <div className="prose prose-slate dark:prose-invert max-w-none rounded-2xl border border-tm-border bg-tm-white p-4" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className="flex flex-wrap gap-2 lg:col-span-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={async () => { if (await copyText(src)) done("Copied Markdown."); else fail("Copy failed. Try again."); }}>Copy Markdown</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={async () => { if (await copyText(html)) done("Copied HTML."); else fail("Copy failed. Try again."); }}>Copy HTML</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function TodoPanel() {
  const [items, setItems] = useState<Array<{ text: string; done: boolean }>>([
    { text: "Draft the outline", done: false },
    { text: "Review the draft", done: true },
  ]);
  const [next, setNext] = useState("");
  const [remainingOnly, setRemainingOnly] = useState(false);
  const { error, ok, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input className="tm-input min-w-[12rem] flex-1" value={next} onChange={(e) => setNext(e.target.value)} aria-label="New task" />
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
          if (!next.trim()) { fail("Empty input."); return; }
          setItems((rows) => [...rows, { text: next.trim(), done: false }]);
          setNext("");
        }}>Add</button>
      </div>
      <label className="flex items-center gap-2 text-sm font-bold">
        <input type="checkbox" className="size-4 accent-[var(--tm-accent)]" checked={remainingOnly} onChange={(e) => setRemainingOnly(e.target.checked)} />
        Remaining only
      </label>
      <ul className="space-y-2">
        {items.map((item, index) => {
          if (remainingOnly && item.done) return null;
          return (
            <li key={`${item.text}-${index}`} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4 accent-[var(--tm-accent)]"
                checked={item.done}
                aria-label={item.text}
                onChange={() =>
                  setItems((rows) =>
                    rows.map((row, i) => (i === index ? { ...row, done: !row.done } : row)),
                  )
                }
              />
              <span className={item.done ? "text-tm-muted line-through" : "font-medium"}>{item.text}</span>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => {
          if (!items.length) { fail("Empty input."); return; }
          downloadTextFile(items.map((i) => `${i.done ? "[x]" : "[ ]"} ${i.text}`).join("\n"), "todo.txt");
          done("Downloaded.");
        }}>Download</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => setItems([])}>Reset</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function ChecklistPanel() {
  const [src, setSrc] = useState("Milk\nEggs\nBread");
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const items = src.split("\n").map((l) => l.trim()).filter(Boolean);
  const { error, ok, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="cl" label="Items (one per line)">
        <textarea id="cl" className="tm-input min-h-40" value={src} onChange={(e) => { setSrc(e.target.value); setChecked({}); }} />
      </Field>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={`${item}-${i}`} className="flex items-center gap-2">
            <input id={`cl-${i}`} type="checkbox" className="size-4 accent-[var(--tm-accent)]" checked={Boolean(checked[i])} onChange={(e) => setChecked((c) => ({ ...c, [i]: e.target.checked }))} />
            <label htmlFor={`cl-${i}`} className={checked[i] ? "text-tm-muted line-through" : "font-medium"}>{item}</label>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={async () => {
          if (!items.length) { fail("Empty input."); return; }
          const text = items.map((item, i) => `${checked[i] ? "[x]" : "[ ]"} ${item}`).join("\n");
          if (await copyText(text)) done("Copied."); else fail("Copy failed. Try again.");
        }}>Copy</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => window.print()}>Print</button>
      </div>
      <Status error={error} ok={ok} />
    </div>
  );
}

export function DicePanel() {
  const [count, setCount] = useState("2");
  const [sides, setSides] = useState("6");
  const [rolls, setRolls] = useState<number[]>([]);
  const { error, ok, fail, done } = useNotice();
  function roll() {
    const n = Number(count);
    const s = Number(sides);
    if (!Number.isInteger(n) || n < 1 || n > 40) { fail("Invalid value. Dice count must be 1–40."); return; }
    if (!Number.isInteger(s) || s < 2 || s > 1000) { fail("Invalid value. Sides must be 2–1000."); return; }
    const next = Array.from({ length: n }, () => randomInt(1, s));
    setRolls(next);
    done("Rolled.");
  }
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="dc" label="Dice"><input id="dc" className="tm-input" value={count} onChange={(e) => setCount(e.target.value)} /></Field>
        <Field id="ds" label="Sides"><input id="ds" className="tm-input" value={sides} onChange={(e) => setSides(e.target.value)} /></Field>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={roll}>Roll</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => setRolls([])}>Reset</button>
      </div>
      <Status error={error} ok={ok} />
      {rolls.length ? <p className="text-lg font-black">{rolls.join(", ")} · sum {rolls.reduce((a, b) => a + b, 0)}</p> : null}
    </div>
  );
}

export function CoinPanel() {
  const [count, setCount] = useState("1");
  const [flips, setFlips] = useState<string[]>([]);
  const { error, ok, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="cf" label="Flips"><input id="cf" className="tm-input" value={count} onChange={(e) => setCount(e.target.value)} /></Field>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
          const n = Number(count);
          if (!Number.isInteger(n) || n < 1 || n > 200) { fail("Invalid value. Use 1–200 flips."); return; }
          const next = Array.from({ length: n }, () => (randomInt(0, 1) === 0 ? "Heads" : "Tails"));
          setFlips(next);
          done("Flipped.");
        }}>Flip</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => setFlips([])}>Reset</button>
      </div>
      <Status error={error} ok={ok} />
      {flips.length ? (
        <p className="font-bold">Heads {flips.filter((f) => f === "Heads").length} · Tails {flips.filter((f) => f === "Tails").length}</p>
      ) : null}
      {flips.length ? <p className="text-sm text-tm-muted">{flips.join(", ")}</p> : null}
    </div>
  );
}

export function WheelPanel() {
  const [src, setSrc] = useState("Alpha\nBeta\nGamma\nDelta");
  const [angle, setAngle] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const options = src.split("\n").map((l) => l.trim()).filter(Boolean);
  const { error, ok, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="wh" label="Options">
        <textarea id="wh" className="tm-input min-h-40" value={src} onChange={(e) => setSrc(e.target.value)} />
      </Field>
      <div className="flex justify-center">
        <div className="relative h-48 w-48 rounded-full border-4 border-tm-navy bg-[conic-gradient(#0ea5e9,#0369a1,#0ea5e9)]" style={{ transform: `rotate(${angle}deg)`, transition: "transform 1.2s ease-out" }} />
      </div>
      <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
        if (options.length < 2) { fail("Add at least two options."); return; }
        const index = randomInt(0, options.length - 1);
        setAngle((a) => a + 720 + (360 / options.length) * index);
        setWinner(options[index]);
        done("Spun.");
      }}>Spin</button>
      {winner ? <p className="text-lg font-black" aria-live="polite">Result: {winner}</p> : null}
      <Status error={error} ok={ok} />
    </div>
  );
}

export function DaysUntilPanel() {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [date, setDate] = useState(iso);
  const start = new Date(`${iso}T00:00:00`);
  const target = new Date(`${date}T00:00:00`);
  const days = Number.isNaN(target.getTime()) ? null : Math.round((target.getTime() - start.getTime()) / 86400000);
  return (
    <div className="space-y-4">
      <Field id="du" label="Target date"><input id="du" type="date" className="tm-input" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      {days === null ? <p className="tm-notice tm-notice-error">Invalid value.</p> : (
        <p className="text-2xl font-black">{days === 0 ? "That date is today." : days > 0 ? `${days} day${days === 1 ? "" : "s"} remaining` : `${Math.abs(days)} day${days === -1 ? "" : "s"} ago`}</p>
      )}
    </div>
  );
}

export function WeekNumberPanel() {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [date, setDate] = useState(iso);
  const d = new Date(`${date}T00:00:00`);
  const valid = !Number.isNaN(d.getTime());
  const utc = valid ? new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) : null;
  if (utc) utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
  const yearStart = utc ? new Date(Date.UTC(utc.getUTCFullYear(), 0, 1)) : null;
  const week = utc && yearStart ? Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7) : null;
  return (
    <div className="space-y-4">
      <Field id="wn" label="Date"><input id="wn" type="date" className="tm-input" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      {week === null ? <p className="tm-notice tm-notice-error">Invalid value.</p> : (
        <p className="text-2xl font-black">ISO week {week} · {d.toLocaleDateString(undefined, { weekday: "long" })}</p>
      )}
    </div>
  );
}

export function WorkHoursPanel() {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:30");
  const [brk, setBrk] = useState("30");
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  let minutes = endH * 60 + endM - (startH * 60 + startM);
  if (minutes < 0) minutes += 24 * 60;
  minutes -= Number(brk) || 0;
  const invalid = !Number.isFinite(minutes);
  const hours = Math.floor(Math.max(0, minutes) / 60);
  const mins = Math.max(0, minutes) % 60;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field id="ws" label="Start"><input id="ws" type="time" className="tm-input" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field id="we" label="End"><input id="we" type="time" className="tm-input" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
        <Field id="wb" label="Unpaid break (minutes)"><input id="wb" className="tm-input" value={brk} onChange={(e) => setBrk(e.target.value)} /></Field>
      </div>
      {invalid ? <p className="tm-notice tm-notice-error">Invalid value.</p> : (
        <p className="text-2xl font-black">{hours}h {mins}m</p>
      )}
    </div>
  );
}

export function MeetingCostPanel() {
  const [people, setPeople] = useState("6");
  const [rate, setRate] = useState("85");
  const [minutes, setMinutes] = useState("45");
  const [extra, setExtra] = useState("0");
  const n = Number(people);
  const r = Number(rate);
  const m = Number(minutes);
  const x = Number(extra);
  const okNums = [n, r, m, x].every((v) => Number.isFinite(v) && v >= 0);
  const cost = okNums ? n * r * (m / 60) + x : null;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="mp" label="Attendees"><input id="mp" className="tm-input" value={people} onChange={(e) => setPeople(e.target.value)} /></Field>
        <Field id="mr" label="Hourly rate"><input id="mr" className="tm-input" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
        <Field id="mm" label="Duration (minutes)"><input id="mm" className="tm-input" value={minutes} onChange={(e) => setMinutes(e.target.value)} /></Field>
        <Field id="mx" label="Extra cost"><input id="mx" className="tm-input" value={extra} onChange={(e) => setExtra(e.target.value)} /></Field>
      </div>
      {cost === null ? <p className="tm-notice tm-notice-error">Invalid value.</p> : (
        <p className="text-2xl font-black">{cost.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 })}</p>
      )}
      <p className="text-sm text-tm-muted">Planning estimate from the rate you entered. Not a payroll result.</p>
    </div>
  );
}

export function IntervalTimerPanel() {
  const [work, setWork] = useState("40");
  const [rest, setRest] = useState("20");
  const [rounds, setRounds] = useState("8");
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedAtPause, setElapsedAtPause] = useState(0);
  const now = useNow(running);
  const workMs = Number(work) * 1000;
  const restMs = Number(rest) * 1000;
  const roundMs = workMs + restMs;
  const total = roundMs * Number(rounds);
  const elapsed = running && startedAt ? elapsedAtPause + (now - startedAt) : elapsedAtPause;
  const clamped = Math.min(elapsed, Number.isFinite(total) ? total : 0);
  const roundIndex = roundMs > 0 ? Math.min(Number(rounds) - 1, Math.floor(clamped / roundMs)) : 0;
  const into = roundMs > 0 ? clamped % roundMs : 0;
  const inWork = into < workMs;
  const remaining = inWork ? workMs - into : restMs - (into - workMs);
  const remainingTotal = Number.isFinite(total) ? Math.max(0, total - elapsed) : 0;
  const complete = remainingTotal <= 0 && Number.isFinite(total) && total > 0;
  const finish = useCallback(() => {
    setRunning(false);
    setStartedAt(null);
  }, []);
  useNowExpire(running, remainingTotal, finish);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field id="iw" label="Work seconds"><input id="iw" className="tm-input" value={work} disabled={running} onChange={(e) => setWork(e.target.value)} /></Field>
        <Field id="ir" label="Rest seconds"><input id="ir" className="tm-input" value={rest} disabled={running} onChange={(e) => setRest(e.target.value)} /></Field>
        <Field id="io" label="Rounds"><input id="io" className="tm-input" value={rounds} disabled={running} onChange={(e) => setRounds(e.target.value)} /></Field>
      </div>
      <p className="text-sm font-bold text-tm-muted">{complete ? "Complete" : `Round ${roundIndex + 1} · ${inWork ? "Work" : "Rest"}`}</p>
      <p className="font-mono text-4xl font-black">{formatClock(complete ? 0 : remaining)}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
          if (![workMs, restMs, Number(rounds)].every((v) => Number.isFinite(v) && v > 0)) return;
          if (running) {
            setElapsedAtPause(elapsed);
            setRunning(false);
            setStartedAt(null);
          } else {
            setStartedAt(Date.now());
            setRunning(true);
          }
        }}>{running ? "Pause" : "Start"}</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => { setRunning(false); setStartedAt(null); setElapsedAtPause(0); }}>Reset</button>
      </div>
    </div>
  );
}

export function BreathingPanel() {
  const [mode, setMode] = useState<"box" | "478">("box");
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const now = useNow(running);
  const phases = mode === "box"
    ? [{ name: "Inhale", ms: 4000 }, { name: "Hold", ms: 4000 }, { name: "Exhale", ms: 4000 }, { name: "Hold", ms: 4000 }]
    : [{ name: "Inhale", ms: 4000 }, { name: "Hold", ms: 7000 }, { name: "Exhale", ms: 8000 }];
  const cycle = phases.reduce((s, p) => s + p.ms, 0);
  const elapsed = running && startedAt ? (now - startedAt) % cycle : 0;
  let cursor = elapsed;
  let current = phases[0];
  for (const phase of phases) {
    if (cursor < phase.ms) { current = phase; break; }
    cursor -= phase.ms;
  }
  return (
    <div className="space-y-4">
      <Field id="br" label="Pattern">
        <select id="br" className="tm-input" value={mode} onChange={(e) => setMode(e.target.value as "box" | "478")}>
          <option value="box">Box 4-4-4-4</option>
          <option value="478">4-7-8</option>
        </select>
      </Field>
      <p className="text-3xl font-black" aria-live="polite">{running ? current.name : "Ready"}</p>
      <p className="font-mono text-xl">{formatClock(running ? current.ms - cursor : 0)}</p>
      <p className="text-sm text-tm-muted">Pacing aid only. Not medical advice.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
          if (running) { setRunning(false); setStartedAt(null); }
          else { setStartedAt(Date.now()); setRunning(true); }
        }}>{running ? "Pause" : "Start"}</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => { setRunning(false); setStartedAt(null); }}>Reset</button>
      </div>
    </div>
  );
}

export function PasswordStrengthPanel() {
  const [pw, setPw] = useState("");
  const classes = {
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  };
  const pool = (classes.lower ? 26 : 0) + (classes.upper ? 26 : 0) + (classes.digit ? 10 : 0) + (classes.symbol ? 33 : 0);
  const entropy = pw.length && pool ? pw.length * Math.log2(pool) : 0;
  const score = Math.min(4, Math.floor(entropy / 20));
  const labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];
  return (
    <div className="space-y-4">
      <Field id="pw" label="Password">
        <input id="pw" type="password" autoComplete="new-password" className="tm-input" value={pw} onChange={(e) => setPw(e.target.value)} />
      </Field>
      <p className="text-xl font-black">{pw ? labels[score] : "Enter a password"}</p>
      <p className="text-sm font-bold text-tm-muted">Length {pw.length} · estimated entropy {entropy.toFixed(1)} bits</p>
      <ul className="text-sm font-medium text-tm-muted">
        <li>{classes.lower ? "Includes lowercase" : "Missing lowercase"}</li>
        <li>{classes.upper ? "Includes uppercase" : "Missing uppercase"}</li>
        <li>{classes.digit ? "Includes a digit" : "Missing a digit"}</li>
        <li>{classes.symbol ? "Includes a symbol" : "Missing a symbol"}</li>
      </ul>
      <p className="text-sm text-tm-muted">Heuristic only. A high score does not mean an account is safe.</p>
    </div>
  );
}

export function RandomPickerPanel() {
  const [src, setSrc] = useState("North\nSouth\nEast\nWest");
  const [count, setCount] = useState("1");
  const [winners, setWinners] = useState<string[]>([]);
  const { error, ok, fail, done } = useNotice();
  return (
    <div className="space-y-4">
      <Field id="rp" label="Options"><textarea id="rp" className="tm-input min-h-40" value={src} onChange={(e) => setSrc(e.target.value)} /></Field>
      <Field id="rc" label="Winners"><input id="rc" className="tm-input" value={count} onChange={(e) => setCount(e.target.value)} /></Field>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-primary" onClick={() => {
          const list = src.split("\n").map((l) => l.trim()).filter(Boolean);
          const n = Number(count);
          if (!Number.isInteger(n) || n < 1) { fail("Invalid value."); return; }
          if (n > list.length) { fail("The list is too short for that many winners."); return; }
          const pool = [...list];
          const picked: string[] = [];
          for (let i = 0; i < n; i += 1) {
            const idx = randomInt(0, pool.length - 1);
            picked.push(pool.splice(idx, 1)[0]);
          }
          setWinners(picked);
          done("Picked.");
        }}>Pick</button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={() => setWinners([])}>Reset</button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={async () => {
          if (!winners.length) { fail("Empty input."); return; }
          if (await copyText(winners.join("\n"))) done("Copied."); else fail("Copy failed. Try again.");
        }}>Copy</button>
      </div>
      {winners.length ? <p className="text-lg font-black">{winners.join(", ")}</p> : null}
      <Status error={error} ok={ok} />
    </div>
  );
}
