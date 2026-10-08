"use client";

import {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  buildTargetText,
  calcAccuracy,
  calcRawWpm,
  calcWpm,
  compareTyped,
  createSessionId,
  formatRemaining,
  wordModeComplete,
  type TimeOption,
  type TypingMode,
  type WordOption,
} from "@/lib/typing/engine";

interface Props {
  convertHeading?: string;
}

type Phase = "idle" | "running" | "paused" | "finished";

interface LiveStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  incorrectChars: number;
  totalTyped: number;
  elapsedMs: number;
  remainingMs: number;
}

const CharSpan = memo(function CharSpan({
  char,
  state,
}: {
  char: string;
  state: "untouched" | "correct" | "incorrect" | "current";
}) {
  const display = char === " " ? "\u00a0" : char;
  return (
    <span
      className={
        state === "correct"
          ? "text-tm-text"
          : state === "incorrect"
            ? "rounded-sm bg-red-500/20 text-red-700 underline decoration-red-600 decoration-2 underline-offset-2 dark:text-red-300"
            : state === "current"
              ? "relative text-tm-muted before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[2px] before:animate-pulse before:bg-tm-accent before:content-['']"
              : "text-tm-muted/70"
      }
    >
      {display}
    </span>
  );
});

function emptyStats(remainingMs: number): LiveStats {
  return {
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    errors: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalTyped: 0,
    elapsedMs: 0,
    remainingMs,
  };
}

export function TypingSpeedTestWorkspace({ convertHeading }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sessionRef = useRef(createSessionId());
  const startRef = useRef<number | null>(null);
  const pausedTotalRef = useRef(0);
  const pauseBeganRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const composingRef = useRef(false);
  const typedRef = useRef("");
  const keystrokeRef = useRef({ total: 0, correct: 0, incorrect: 0 });

  const [mode, setMode] = useState<TypingMode>("time");
  const [timeLimit, setTimeLimit] = useState<TimeOption>(60);
  const [wordCount, setWordCount] = useState<WordOption>(25);
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [target, setTarget] = useState(() =>
    buildTargetText({
      mode: "time",
      timeLimit: 60,
      wordCount: 25,
      punctuation: false,
      numbers: false,
    }),
  );
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [stats, setStats] = useState<LiveStats>(() => emptyStats(60_000));
  const [finalStats, setFinalStats] = useState<LiveStats | null>(null);
  const [tick, setTick] = useState(0);

  const focusInput = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    // On mobile, allow scroll so the field stays above the virtual keyboard.
    el.focus({ preventScroll: false });
    requestAnimationFrame(() => {
      el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
    });
  }, []);

  const resetWithOptions = useCallback(
    (next: {
      mode: TypingMode;
      timeLimit: TimeOption;
      wordCount: WordOption;
      punctuation: boolean;
      numbers: boolean;
    }) => {
      sessionRef.current = createSessionId();
      startRef.current = null;
      pausedTotalRef.current = 0;
      pauseBeganRef.current = null;
      finishedRef.current = false;
      keystrokeRef.current = { total: 0, correct: 0, incorrect: 0 };
      typedRef.current = "";
      setTyped("");
      setPhase("idle");
      setFinalStats(null);
      setStats(emptyStats(next.mode === "time" ? next.timeLimit * 1000 : 0));
      setTarget(buildTargetText(next));
      requestAnimationFrame(() => focusInput());
    },
    [focusInput],
  );

  const resetTest = useCallback(() => {
    resetWithOptions({ mode, timeLimit, wordCount, punctuation, numbers });
  }, [resetWithOptions, mode, timeLimit, wordCount, punctuation, numbers]);

  const finish = useCallback(
    (sessionId: string, typedValue: string, elapsedMs: number) => {
      if (finishedRef.current || sessionRef.current !== sessionId) return;
      finishedRef.current = true;
      const { correctChars, incorrectChars } = compareTyped(target, typedValue);
      const ks = keystrokeRef.current;
      const next: LiveStats = {
        wpm: Math.max(0, Math.round(calcWpm(correctChars, elapsedMs))),
        rawWpm: Math.max(0, Math.round(calcRawWpm(typedValue.length, elapsedMs))),
        accuracy: Math.round(calcAccuracy(ks.correct, ks.total) * 10) / 10,
        errors: ks.incorrect,
        correctChars,
        incorrectChars,
        totalTyped: typedValue.length,
        elapsedMs,
        remainingMs: 0,
      };
      setStats(next);
      setFinalStats(next);
      setPhase("finished");
    },
    [target],
  );

  const getElapsed = useCallback(() => {
    if (startRef.current == null) return 0;
    const now = performance.now();
    let paused = pausedTotalRef.current;
    if (pauseBeganRef.current != null) {
      paused += now - pauseBeganRef.current;
    }
    return Math.max(0, now - startRef.current - paused);
  }, []);

  // Display refresh while running
  useEffect(() => {
    if (phase !== "running") return;
    const sessionId = sessionRef.current;
    const id = window.setInterval(() => {
      if (sessionRef.current !== sessionId || finishedRef.current) return;
      const elapsed = getElapsed();
      if (mode === "time" && elapsed >= timeLimit * 1000) {
        finish(sessionId, typedRef.current, timeLimit * 1000);
        return;
      }
      setTick((n) => n + 1);
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, mode, timeLimit, finish, getElapsed]);

  // Recompute live stats on typed/tick
  useEffect(() => {
    if (phase === "finished" || finalStats) return;
    const elapsed = getElapsed();
    const { correctChars, incorrectChars } = compareTyped(target, typed);
    const ks = keystrokeRef.current;
    const remaining =
      mode === "time" ? Math.max(0, timeLimit * 1000 - elapsed) : 0;
    setStats({
      wpm: elapsed > 250 ? Math.max(0, Math.round(calcWpm(correctChars, elapsed))) : 0,
      rawWpm:
        elapsed > 250 ? Math.max(0, Math.round(calcRawWpm(typed.length, elapsed))) : 0,
      accuracy: Math.round(calcAccuracy(ks.correct, ks.total) * 10) / 10,
      errors: ks.incorrect,
      correctChars,
      incorrectChars,
      totalTyped: typed.length,
      elapsedMs: elapsed,
      remainingMs: remaining,
    });
  }, [typed, tick, phase, finalStats, target, mode, timeLimit, getElapsed]);

  // Visibility pause policy
  useEffect(() => {
    function onVisibility() {
      if (finishedRef.current || startRef.current == null) return;
      if (document.hidden) {
        if (pauseBeganRef.current == null) {
          pauseBeganRef.current = performance.now();
          setPhase((p) => (p === "running" ? "paused" : p));
        }
      } else if (pauseBeganRef.current != null) {
        pausedTotalRef.current += performance.now() - pauseBeganRef.current;
        pauseBeganRef.current = null;
        setPhase((p) => (p === "paused" ? "running" : p));
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Keep typing area clear of the mobile virtual keyboard when possible.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const sync = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      document.documentElement.style.setProperty(
        "--tm-keyboard-inset",
        inset > 40 ? `${inset}px` : "0px",
      );
    };
    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
      document.documentElement.style.removeProperty("--tm-keyboard-inset");
    };
  }, []);

  function applyTyped(nextTyped: string) {
    const sessionId = sessionRef.current;
    if (finishedRef.current) return;

    if (startRef.current == null && nextTyped.length > 0) {
      startRef.current = performance.now();
      setPhase("running");
    }

    const previous = typedRef.current;
    const capped = nextTyped.slice(0, target.length);
    if (capped === previous) return;

    // Keystroke accounting for additions only (backspace does not reverse prior errors)
    if (capped.length > previous.length) {
      const added = capped.slice(previous.length);
      for (let i = 0; i < added.length; i += 1) {
        const pos = previous.length + i;
        keystrokeRef.current.total += 1;
        if (added[i] === target[pos]) keystrokeRef.current.correct += 1;
        else keystrokeRef.current.incorrect += 1;
      }
    }

    typedRef.current = capped;
    setTyped(capped);

    const elapsed = startRef.current == null ? 0 : getElapsed();

    if (mode === "time" && startRef.current != null && elapsed >= timeLimit * 1000) {
      finish(sessionId, capped, timeLimit * 1000);
      return;
    }

    if (mode === "words" && wordModeComplete(target, capped, wordCount)) {
      finish(sessionId, capped, Math.max(elapsed, 1));
      return;
    }

    if (mode === "sentence" && capped.length >= target.length) {
      finish(sessionId, capped, Math.max(elapsed, 1));
    }
  }

  /**
   * Mobile virtual keyboards often skip keydown and can leave composition
   * flags stuck. Always read the real textarea value from input/change.
   */
  function onTypedInput(event: React.SyntheticEvent<HTMLTextAreaElement>) {
    if (finishedRef.current) return;
    applyTyped(event.currentTarget.value);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
    }
    if (event.key === "Escape") {
      resetTest();
    }
  }

  const chars = useMemo(() => {
    const nodes: React.ReactNode[] = [];
    const limit = Math.min(target.length, Math.max(typed.length + 80, 120));
    for (let i = 0; i < limit; i += 1) {
      let state: "untouched" | "correct" | "incorrect" | "current" = "untouched";
      if (i === typed.length && phase !== "finished") state = "current";
      else if (i < typed.length) state = typed[i] === target[i] ? "correct" : "incorrect";
      nodes.push(<CharSpan key={i} char={target[i] ?? ""} state={state} />);
    }
    return nodes;
  }, [target, typed, phase]);

  const displayStats = finalStats ?? stats;
  const timeLabel =
    mode === "time"
      ? formatRemaining(phase === "idle" ? timeLimit * 1000 : displayStats.remainingMs)
      : formatRemaining(displayStats.elapsedMs);

  return (
    <div className="space-y-6">
      {convertHeading ? <h2 className="tm-h2">{convertHeading}</h2> : null}

      <div
        id="typing-settings"
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Test settings"
      >
        <Segmented
          label="Mode"
          value={mode}
          disabled={phase === "running" || phase === "paused"}
          options={[
            ["time", "Time"],
            ["words", "Words"],
            ["sentence", "Sentence"],
          ]}
          onChange={(value) => {
            const nextMode = value as TypingMode;
            setMode(nextMode);
            resetWithOptions({
              mode: nextMode,
              timeLimit,
              wordCount,
              punctuation,
              numbers,
            });
          }}
        />
        {mode === "time" ? (
          <Segmented
            label="Duration"
            value={String(timeLimit)}
            disabled={phase === "running" || phase === "paused"}
            options={[
              ["15", "15s"],
              ["30", "30s"],
              ["60", "60s"],
              ["120", "120s"],
            ]}
            onChange={(value) => {
              const next = Number(value) as TimeOption;
              setTimeLimit(next);
              resetWithOptions({
                mode,
                timeLimit: next,
                wordCount,
                punctuation,
                numbers,
              });
            }}
          />
        ) : (
          <Segmented
            label="Words"
            value={String(wordCount)}
            disabled={phase === "running" || phase === "paused"}
            options={[
              ["10", "10"],
              ["25", "25"],
              ["50", "50"],
              ["100", "100"],
            ]}
            onChange={(value) => {
              const next = Number(value) as WordOption;
              setWordCount(next);
              resetWithOptions({
                mode,
                timeLimit,
                wordCount: next,
                punctuation,
                numbers,
              });
            }}
          />
        )}
        <label className="inline-flex items-center gap-2 rounded-xl border border-tm-border bg-tm-soft px-3 py-2 text-sm font-bold text-tm-text">
          <input
            type="checkbox"
            className="size-4 accent-[var(--tm-accent)]"
            checked={punctuation}
            disabled={phase === "running" || phase === "paused"}
            onChange={(e) => {
              const next = e.target.checked;
              setPunctuation(next);
              resetWithOptions({
                mode,
                timeLimit,
                wordCount,
                punctuation: next,
                numbers,
              });
            }}
          />
          Punctuation
        </label>
        <label className="inline-flex items-center gap-2 rounded-xl border border-tm-border bg-tm-soft px-3 py-2 text-sm font-bold text-tm-text">
          <input
            type="checkbox"
            className="size-4 accent-[var(--tm-accent)]"
            checked={numbers}
            disabled={phase === "running" || phase === "paused"}
            onChange={(e) => {
              const next = e.target.checked;
              setNumbers(next);
              resetWithOptions({
                mode,
                timeLimit,
                wordCount,
                punctuation,
                numbers: next,
              });
            }}
          />
          Numbers
        </label>
      </div>

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        aria-live="polite"
        aria-atomic="true"
      >
        <Stat label="WPM" value={phase === "idle" ? "—" : String(displayStats.wpm)} />
        <Stat
          label="Accuracy"
          value={phase === "idle" ? "—" : `${displayStats.accuracy}%`}
        />
        <Stat label={mode === "time" ? "Time" : "Elapsed"} value={timeLabel} />
        <Stat label="Errors" value={phase === "idle" ? "—" : String(displayStats.errors)} />
      </div>

      {phase === "paused" ? (
        <p className="tm-notice tm-notice-warning">
          Test paused while this tab is hidden. Return here to continue without counting idle time.
        </p>
      ) : null}

      {phase === "finished" && finalStats ? (
        <div className="rounded-3xl border border-tm-border bg-tm-soft p-6 md:p-8" aria-live="polite">
          <p className="text-xs font-extrabold tracking-wide text-tm-accent uppercase">
            Your Result
          </p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-tm-text sm:text-5xl">
            {finalStats.wpm} WPM
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            <li className="text-sm font-bold text-tm-text">Accuracy: {finalStats.accuracy}%</li>
            <li className="text-sm font-bold text-tm-text">Raw WPM: {finalStats.rawWpm}</li>
            <li className="text-sm font-bold text-tm-text">Errors: {finalStats.errors}</li>
            <li className="text-sm font-bold text-tm-text">
              Characters: {finalStats.correctChars} correct / {finalStats.incorrectChars} incorrect
            </li>
            <li className="text-sm font-bold text-tm-text">
              Test:{" "}
              {mode === "time"
                ? `${timeLimit} seconds`
                : mode === "words"
                  ? `${wordCount} words`
                  : "sentence"}
            </li>
            <li className="text-sm font-bold text-tm-text">
              Typed: {finalStats.totalTyped} characters
            </li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" className="tm-btn tm-btn-primary w-full sm:w-auto" onClick={resetTest}>
              Try Again
            </button>
            <button type="button" className="tm-btn tm-btn-secondary w-full sm:w-auto" onClick={resetTest}>
              New Test
            </button>
            <button
              type="button"
              className="tm-btn tm-btn-ghost w-full sm:w-auto"
              onClick={() => {
                document.getElementById("typing-settings")?.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }}
            >
              Change Settings
            </button>
          </div>
        </div>
      ) : (
        <div className="scroll-mt-24 space-y-3 rounded-3xl border border-tm-border bg-tm-soft p-4 sm:p-5 md:p-8">
          <p className="text-sm font-bold text-tm-muted">
            {phase === "idle"
              ? "Tap the box below and type the text shown"
              : "Keep typing — stats update live"}
          </p>
          <div
            className="min-h-28 cursor-text font-mono text-lg leading-relaxed tracking-wide break-words select-none sm:min-h-32 sm:text-xl md:text-2xl md:leading-relaxed"
            aria-hidden="true"
            onPointerDown={(event) => {
              event.preventDefault();
              focusInput();
            }}
          >
            {chars}
          </div>
          <label htmlFor={inputId} className="block text-sm font-bold text-tm-text">
            Your typing
          </label>
          <textarea
            id={inputId}
            ref={inputRef}
            value={typed}
            onInput={onTypedInput}
            onChange={onTypedInput}
            onKeyDown={onKeyDown}
            onFocus={() => {
              requestAnimationFrame(() => {
                inputRef.current?.scrollIntoView({
                  block: "center",
                  inline: "nearest",
                  behavior: "smooth",
                });
              });
            }}
            onCompositionStart={() => {
              composingRef.current = true;
            }}
            onCompositionEnd={(event) => {
              composingRef.current = false;
              if (!finishedRef.current) applyTyped(event.currentTarget.value);
            }}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            inputMode="text"
            enterKeyHint="next"
            lang="en"
            rows={3}
            className="tm-input min-h-24 resize-y font-mono text-base leading-relaxed"
            aria-describedby={`${inputId}-help`}
          />
          <p id={`${inputId}-help`} className="text-xs font-semibold text-tm-muted">
            Type exactly what you see above. Spaces, backspace, and punctuation all count.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" className="tm-btn tm-btn-secondary" onClick={resetTest}>
          Restart Test
        </button>
        <button type="button" className="tm-btn tm-btn-ghost" onClick={resetTest}>
          New Test
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="tm-h3">Start Typing</h3>
        <p className="text-sm font-medium leading-relaxed text-tm-muted">
          The first character starts the timer. Spaces, capitalization, and punctuation count exactly
          as shown. Browser autocorrect is disabled for this input.
        </p>
        <h3 className="tm-h3">Track Your WPM and Accuracy</h3>
        <p className="text-sm font-medium leading-relaxed text-tm-muted">
          Live WPM uses correct characters with the common five-characters-per-word convention. Raw
          WPM uses all typed characters. Accuracy uses correct keystrokes divided by total
          keystrokes, so a mistype counted once is not recounted when you backspace.
        </p>
        <h3 className="tm-h3">Review Your Final Score</h3>
        <p className="text-sm font-medium leading-relaxed text-tm-muted">
          When the timer or word goal ends, results freeze. Later keystrokes cannot change that
          score. Switching tabs pauses timing so hidden idle time is not counted.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-tm-border bg-tm-elevated px-4 py-3">
      <p className="text-xs font-extrabold tracking-wide text-tm-muted uppercase">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-tm-text">{value}</p>
    </div>
  );
}

function Segmented({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-tm-border bg-tm-soft p-1"
      role="group"
      aria-label={label}
    >
      {options.map(([id, text]) => (
        <button
          key={id}
          type="button"
          disabled={disabled}
          className={
            value === id
              ? "min-h-11 rounded-lg bg-tm-navy px-3 py-2 text-sm font-bold text-tm-on-brand"
              : "min-h-11 rounded-lg px-3 py-2 text-sm font-bold text-tm-muted hover:text-tm-text"
          }
          onClick={() => onChange(id)}
          aria-pressed={value === id}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
