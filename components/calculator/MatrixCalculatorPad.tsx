"use client";

import { useMemo, useState } from "react";

type Op = "add" | "sub" | "mul" | "det" | "transpose" | "inverse";

function parseMatrix(raw: string): number[][] {
  const rows = raw
    .trim()
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) =>
      line
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((cell) => Number(cell)),
    );
  if (!rows.length) throw new Error("Enter matrix values.");
  const cols = rows[0].length;
  if (!cols || rows.some((r) => r.length !== cols || r.some((n) => !Number.isFinite(n)))) {
    throw new Error("Matrix rows must have equal numeric columns.");
  }
  return rows;
}

function fmt(m: number[][]): string {
  return m.map((row) => row.map((n) => Number(n.toPrecision(10)).toString()).join("\t")).join("\n");
}

function det(m: number[][]): number {
  const n = m.length;
  if (m.some((r) => r.length !== n)) throw new Error("Determinant requires a square matrix.");
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  let d = 0;
  for (let j = 0; j < n; j++) {
    const minor = m.slice(1).map((row) => row.filter((_, c) => c !== j));
    d += (j % 2 === 0 ? 1 : -1) * m[0][j] * det(minor);
  }
  return d;
}

function inverse(m: number[][]): number[][] {
  const n = m.length;
  const d = det(m);
  if (Math.abs(d) < 1e-12) throw new Error("Matrix is singular and cannot be inverted.");
  if (n === 1) return [[1 / m[0][0]]];
  const adj: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const minor = m.filter((_, r) => r !== i).map((row) => row.filter((_, c) => c !== j));
      const cofactor = ((i + j) % 2 === 0 ? 1 : -1) * det(minor);
      adj[j][i] = cofactor / d;
    }
  }
  return adj;
}

export function MatrixCalculatorPad() {
  const [aText, setAText] = useState("1 2\n3 4");
  const [bText, setBText] = useState("5 6\n7 8");
  const [op, setOp] = useState<Op>("mul");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");

  const needsB = op === "add" || op === "sub" || op === "mul";

  const compute = () => {
    try {
      const A = parseMatrix(aText);
      if (op === "transpose") {
        const T = A[0].map((_, c) => A.map((row) => row[c]));
        setResult(fmt(T));
        setError(null);
        return;
      }
      if (op === "det") {
        setResult(String(det(A)));
        setError(null);
        return;
      }
      if (op === "inverse") {
        setResult(fmt(inverse(A)));
        setError(null);
        return;
      }
      const B = parseMatrix(bText);
      if (op === "add" || op === "sub") {
        if (A.length !== B.length || A[0].length !== B[0].length) {
          throw new Error("Matrices must have the same dimensions.");
        }
        const out = A.map((row, i) =>
          row.map((cell, j) => (op === "add" ? cell + B[i][j] : cell - B[i][j])),
        );
        setResult(fmt(out));
        setError(null);
        return;
      }
      if (A[0].length !== B.length) {
        throw new Error("For multiplication, A columns must equal B rows.");
      }
      const out = A.map((row) =>
        B[0].map((_, j) => row.reduce((sum, cell, k) => sum + cell * B[k][j], 0)),
      );
      setResult(fmt(out));
      setError(null);
    } catch (err) {
      setResult("");
      setError(err instanceof Error ? err.message : "Unable to calculate.");
    }
  };

  const hint = useMemo(
    () => "Enter numbers separated by spaces or commas; one row per line.",
    [],
  );

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-tm-muted">{hint}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="matrix-a" className="mb-2 block text-sm font-bold text-tm-text">
            Matrix A
          </label>
          <textarea
            id="matrix-a"
            className="tm-input min-h-32 w-full font-mono"
            value={aText}
            onChange={(e) => setAText(e.target.value)}
          />
        </div>
        {needsB ? (
          <div>
            <label htmlFor="matrix-b" className="mb-2 block text-sm font-bold text-tm-text">
              Matrix B
            </label>
            <textarea
              id="matrix-b"
              className="tm-input min-h-32 w-full font-mono"
              value={bText}
              onChange={(e) => setBText(e.target.value)}
            />
          </div>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="matrix-op" className="mb-2 block text-sm font-bold text-tm-text">
            Operation
          </label>
          <select
            id="matrix-op"
            className="tm-input w-full"
            value={op}
            onChange={(e) => setOp(e.target.value as Op)}
          >
            <option value="add">A + B</option>
            <option value="sub">A − B</option>
            <option value="mul">A × B</option>
            <option value="det">det(A)</option>
            <option value="transpose">Transpose A</option>
            <option value="inverse">Inverse A</option>
          </select>
        </div>
        <div className="flex items-end gap-3">
          <button type="button" className="tm-btn tm-btn-primary" onClick={compute}>
            Calculate
          </button>
          <button
            type="button"
            className="tm-btn tm-btn-secondary"
            onClick={() => {
              setAText("1 2\n3 4");
              setBText("5 6\n7 8");
              setResult("");
              setError(null);
            }}
          >
            Reset
          </button>
        </div>
      </div>
      {error ? (
        <p className="tm-notice tm-notice-error" role="alert">
          {error}
        </p>
      ) : null}
      {result ? (
        <div className="rounded-2xl border border-tm-border bg-tm-soft p-5">
          <p className="text-xs font-extrabold tracking-wide text-tm-accent uppercase">Result</p>
          <pre className="mt-3 overflow-x-auto whitespace-pre font-mono text-sm font-bold text-tm-text">
            {result}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
