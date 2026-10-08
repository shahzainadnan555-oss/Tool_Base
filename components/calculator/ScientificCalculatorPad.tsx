"use client";

import { useState } from "react";

type AngleMode = "deg" | "rad";

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error("n!");
  if (n > 170) throw new Error("overflow");
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  const re =
    /\d+(\.\d+)?([eE][+-]?\d+)?|π|e|sin|cos|tan|asin|acos|atan|log|ln|sqrt|abs|[()+\-*/^%!]|,/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(expr))) tokens.push(m[0]);
  return tokens;
}

function toRpn(tokens: string[], mode: AngleMode): (string | number)[] {
  const output: (string | number)[] = [];
  const ops: string[] = [];
  const prec: Record<string, number> = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3,
    "!": 4,
    unary: 5,
  };
  const rightAssoc = new Set(["^", "unary"]);
  const fns = new Set(["sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt", "abs"]);
  let expectUnary = true;

  for (const raw of tokens) {
    const t = raw;
    if (/^\d/.test(t)) {
      output.push(Number(t));
      expectUnary = false;
      continue;
    }
    if (t === "π") {
      output.push(Math.PI);
      expectUnary = false;
      continue;
    }
    if (t === "e" && expectUnary) {
      output.push(Math.E);
      expectUnary = false;
      continue;
    }
    if (fns.has(t)) {
      ops.push(t);
      expectUnary = true;
      continue;
    }
    if (t === ",") {
      while (ops.length && ops[ops.length - 1] !== "(") output.push(ops.pop()!);
      expectUnary = true;
      continue;
    }
    if (t === "(") {
      ops.push(t);
      expectUnary = true;
      continue;
    }
    if (t === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") output.push(ops.pop()!);
      if (!ops.length) throw new Error("Mismatched parentheses");
      ops.pop();
      if (ops.length && fns.has(ops[ops.length - 1])) output.push(ops.pop()!);
      expectUnary = false;
      continue;
    }
    let op = t;
    if ((op === "+" || op === "-") && expectUnary) op = "unary" + op;
    if (op === "!") {
      output.push("!");
      expectUnary = false;
      continue;
    }
    const p = prec[op.startsWith("unary") ? "unary" : op] ?? 0;
    while (ops.length) {
      const top = ops[ops.length - 1];
      if (top === "(" || fns.has(top)) break;
      const topKey = top.startsWith("unary") ? "unary" : top;
      const tp = prec[topKey] ?? 0;
      if (tp > p || (tp === p && !rightAssoc.has(op.startsWith("unary") ? "unary" : op))) {
        output.push(ops.pop()!);
      } else break;
    }
    ops.push(op);
    expectUnary = true;
  }
  while (ops.length) {
    const op = ops.pop()!;
    if (op === "(" || op === ")") throw new Error("Mismatched parentheses");
    output.push(op);
  }
  void mode;
  return output;
}

function evalRpn(rpn: (string | number)[], mode: AngleMode): number {
  const stack: number[] = [];
  const toRad = (x: number) => (mode === "deg" ? (x * Math.PI) / 180 : x);
  const fromRad = (x: number) => (mode === "deg" ? (x * 180) / Math.PI : x);
  for (const token of rpn) {
    if (typeof token === "number") {
      stack.push(token);
      continue;
    }
    if (token === "unary-") {
      stack.push(-stack.pop()!);
      continue;
    }
    if (token === "unary+") {
      continue;
    }
    if (token === "!") {
      stack.push(factorial(stack.pop()!));
      continue;
    }
    const fns: Record<string, (x: number) => number> = {
      sin: (x) => Math.sin(toRad(x)),
      cos: (x) => Math.cos(toRad(x)),
      tan: (x) => Math.tan(toRad(x)),
      asin: (x) => fromRad(Math.asin(x)),
      acos: (x) => fromRad(Math.acos(x)),
      atan: (x) => fromRad(Math.atan(x)),
      log: (x) => Math.log10(x),
      ln: (x) => Math.log(x),
      sqrt: (x) => Math.sqrt(x),
      abs: (x) => Math.abs(x),
    };
    if (fns[token]) {
      const x = stack.pop();
      if (x == null) throw new Error("Invalid expression");
      const y = fns[token](x);
      if (!Number.isFinite(y)) throw new Error("Domain error");
      stack.push(y);
      continue;
    }
    const b = stack.pop();
    const a = stack.pop();
    if (a == null || b == null) throw new Error("Invalid expression");
    let y = 0;
    if (token === "+") y = a + b;
    else if (token === "-") y = a - b;
    else if (token === "*") y = a * b;
    else if (token === "/") {
      if (b === 0) throw new Error("Division by zero");
      y = a / b;
    } else if (token === "^") y = a ** b;
    else throw new Error("Unknown operator");
    if (!Number.isFinite(y)) throw new Error("Overflow");
    stack.push(y);
  }
  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
}

function evaluate(expr: string, mode: AngleMode): number {
  const cleaned = expr.replace(/\s+/g, "");
  if (!cleaned) return 0;
  return evalRpn(toRpn(tokenize(cleaned), mode), mode);
}

const BUTTONS: Array<{ label: string; insert?: string; action?: string; span?: number }> = [
  { label: "Rad/Deg", action: "mode" },
  { label: "AC", action: "clear" },
  { label: "⌫", action: "back" },
  { label: "(", insert: "(" },
  { label: ")", insert: ")" },
  { label: "sin", insert: "sin(" },
  { label: "cos", insert: "cos(" },
  { label: "tan", insert: "tan(" },
  { label: "π", insert: "π" },
  { label: "e", insert: "e" },
  { label: "ln", insert: "ln(" },
  { label: "log", insert: "log(" },
  { label: "√", insert: "sqrt(" },
  { label: "x²", insert: "^2" },
  { label: "^", insert: "^" },
  { label: "7", insert: "7" },
  { label: "8", insert: "8" },
  { label: "9", insert: "9" },
  { label: "÷", insert: "/" },
  { label: "!", insert: "!" },
  { label: "4", insert: "4" },
  { label: "5", insert: "5" },
  { label: "6", insert: "6" },
  { label: "×", insert: "*" },
  { label: "asin", insert: "asin(" },
  { label: "1", insert: "1" },
  { label: "2", insert: "2" },
  { label: "3", insert: "3" },
  { label: "−", insert: "-" },
  { label: "acos", insert: "acos(" },
  { label: "0", insert: "0" },
  { label: ".", insert: "." },
  { label: "%", insert: "/100" },
  { label: "+", insert: "+" },
  { label: "=", action: "equals" },
];

export function ScientificCalculatorPad() {
  const [expr, setExpr] = useState("");
  const [mode, setMode] = useState<AngleMode>("deg");
  const [error, setError] = useState<string | null>(null);
  const [memory, setMemory] = useState(0);

  const onAction = (action: string, insert?: string) => {
    setError(null);
    if (action === "mode") {
      setMode((m) => (m === "deg" ? "rad" : "deg"));
      return;
    }
    if (action === "clear") {
      setExpr("");
      return;
    }
    if (action === "back") {
      setExpr((e) => e.slice(0, -1));
      return;
    }
    if (action === "equals") {
      try {
        const value = evaluate(expr, mode);
        setExpr(String(value));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid expression");
      }
      return;
    }
    if (insert != null) setExpr((e) => e + insert);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="rounded-2xl border border-tm-border bg-tm-soft p-4">
        <div className="flex items-center justify-between gap-2 text-xs font-bold text-tm-muted uppercase">
          <span>{mode === "deg" ? "Degrees" : "Radians"}</span>
          <span>Mem {memory}</span>
        </div>
        <p className="mt-2 min-h-12 break-all text-right text-2xl font-extrabold text-tm-text">
          {expr || "0"}
        </p>
        {error ? (
          <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => setMemory(Number(expr) || memory)}>
          MS
        </button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => setExpr((e) => e + String(memory))}>
          MR
        </button>
        <button type="button" className="tm-btn tm-btn-secondary" onClick={() => setMemory(0)}>
          MC
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            className="tm-btn tm-btn-secondary min-h-12 px-1 text-sm font-bold"
            onClick={() => onAction(btn.action ?? "insert", btn.insert)}
          >
            {btn.label === "Rad/Deg" ? mode.toUpperCase() : btn.label}
          </button>
        ))}
      </div>
      <label className="block text-sm font-bold text-tm-text" htmlFor="sci-expr">
        Expression
      </label>
      <input
        id="sci-expr"
        className="tm-input w-full"
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onAction("equals");
        }}
        inputMode="decimal"
        autoComplete="off"
      />
    </div>
  );
}
