import { formatFixed, formatNumber, formatPercent } from "./format";
import { def, numberField, selectField } from "./catalog-helpers";
import { assertFinite, parseNumber, parseOptionalNumber, parsePositiveInt } from "./parse";
import type { FormulaCalculatorSpec } from "./types";

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error("Factorial requires a non-negative integer.");
  if (n > 170) throw new Error("Factorial is too large to represent.");
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b) [a, b] = [b, a % b];
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function parseList(raw: string): number[] {
  const parts = raw
    .split(/[\n,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s));
  if (!parts.length) throw new Error("Enter at least one number.");
  if (parts.some((n) => !Number.isFinite(n))) throw new Error("All values must be valid numbers.");
  return parts;
}

function mean(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function variance(xs: number[], sample: boolean) {
  if (xs.length < (sample ? 2 : 1)) throw new Error("Not enough values.");
  const m = mean(xs);
  const sum = xs.reduce((a, b) => a + (b - m) ** 2, 0);
  return sum / (sample ? xs.length - 1 : xs.length);
}

export const mathCatalog: FormulaCalculatorSpec[] = [
  def({
    slug: "basic-calculator",
    name: "Basic Calculator",
    subcategory: "math",
    shortDescription: "Add, subtract, multiply, or divide two numbers.",
    keywords: ["basic calculator", "simple calculator", "arithmetic"],
    relatedToolIds: ["scientific-calculator", "percentage-calculator", "fraction-calculator"],
    featured: true,
    fields: [
      numberField("a", "First number", "12"),
      selectField("op", "Operation", "+", [
        { value: "+", label: "+" },
        { value: "-", label: "−" },
        { value: "*", label: "×" },
        { value: "/", label: "÷" },
      ]),
      numberField("b", "Second number", "3"),
    ],
    compute: (v) => {
      const a = parseNumber(v.a, "first number");
      const b = parseNumber(v.b, "second number");
      let result = 0;
      if (v.op === "+") result = a + b;
      else if (v.op === "-") result = a - b;
      else if (v.op === "*") result = a * b;
      else {
        if (b === 0) throw new Error("Cannot divide by zero.");
        result = a / b;
      }
      assertFinite(result);
      return {
        primaryLabel: "Result",
        primary: formatNumber(result, 10),
        formula: `${a} ${v.op} ${b}`,
        copyText: `Result: ${formatNumber(result, 10)}`,
      };
    },
  }),

  def({
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    subcategory: "math",
    shortDescription: "Scientific functions with degrees/radians, powers, roots, and logs.",
    keywords: ["scientific calculator", "sin cos tan", "scientific math"],
    relatedToolIds: ["exponent-calculator", "log-calculator", "root-calculator", "percentage-calculator", "fraction-calculator"],
    featured: true,
    ui: "scientific",
    fields: [],
    compute: () => ({
      primaryLabel: "Result",
      primary: "0",
      copyText: "0",
    }),
  }),

  def({
    slug: "percent-error-calculator",
    name: "Percent Error Calculator",
    subcategory: "math",
    shortDescription: "Measure percent error between experimental and accepted values.",
    keywords: ["percent error", "percentage error"],
    relatedToolIds: ["percentage-calculator", "statistics-calculator"],
    fields: [
      numberField("experimental", "Experimental value", "9.8"),
      numberField("accepted", "Accepted value", "10"),
    ],
    compute: (v) => {
      const exp = parseNumber(v.experimental, "experimental value");
      const acc = parseNumber(v.accepted, "accepted value", { allowZero: false });
      const err = (Math.abs(exp - acc) / Math.abs(acc)) * 100;
      return {
        primaryLabel: "Percent error",
        primary: formatPercent(err),
        formula: "% error = |experimental − accepted| / |accepted| × 100",
        copyText: `Percent error: ${formatPercent(err)}`,
      };
    },
  }),

  def({
    slug: "exponent-calculator",
    name: "Exponent Calculator",
    subcategory: "math",
    shortDescription: "Raise a base to a power and show scientific notation when helpful.",
    keywords: ["exponent calculator", "power calculator", "a^b"],
    relatedToolIds: ["scientific-calculator", "log-calculator", "root-calculator"],
    fields: [numberField("base", "Base", "2"), numberField("exp", "Exponent", "10")],
    compute: (v) => {
      const base = parseNumber(v.base, "base");
      const exp = parseNumber(v.exp, "exponent");
      const result = assertFinite(base ** exp);
      return {
        primaryLabel: "Result",
        primary: formatNumber(result, 12),
        breakdown: [{ label: "Scientific notation", value: result.toExponential(6) }],
        formula: "result = base ^ exponent",
        copyText: `${base}^${exp} = ${formatNumber(result, 12)}`,
      };
    },
  }),

  def({
    slug: "binary-calculator",
    name: "Binary Calculator",
    subcategory: "math",
    shortDescription: "Convert and calculate with binary and decimal integers.",
    keywords: ["binary calculator", "binary to decimal", "base 2"],
    relatedToolIds: ["hex-calculator", "scientific-notation-calculator"],
    fields: [
      selectField("mode", "Mode", "bin2dec", [
        { value: "bin2dec", label: "Binary → Decimal" },
        { value: "dec2bin", label: "Decimal → Binary" },
        { value: "add", label: "Add two binary numbers" },
      ]),
      { id: "a", label: "Value A", type: "text", defaultValue: "1010" },
      { id: "b", label: "Value B (for add)", type: "text", defaultValue: "110" },
    ],
    compute: (v) => {
      if (v.mode === "bin2dec") {
        if (!/^[01]+$/.test(v.a.trim())) throw new Error("Enter a binary value using 0 and 1.");
        const n = Number.parseInt(v.a.trim(), 2);
        return { primaryLabel: "Decimal", primary: String(n), copyText: String(n) };
      }
      if (v.mode === "dec2bin") {
        const n = parseNumber(v.a, "decimal", { allowNegative: false });
        if (!Number.isInteger(n)) throw new Error("Enter a whole number.");
        return { primaryLabel: "Binary", primary: n.toString(2), copyText: n.toString(2) };
      }
      if (!/^[01]+$/.test(v.a.trim()) || !/^[01]+$/.test(v.b.trim())) {
        throw new Error("Enter binary values using 0 and 1.");
      }
      const sum = Number.parseInt(v.a.trim(), 2) + Number.parseInt(v.b.trim(), 2);
      return {
        primaryLabel: "Binary sum",
        primary: sum.toString(2),
        breakdown: [{ label: "Decimal sum", value: String(sum) }],
        copyText: sum.toString(2),
      };
    },
  }),

  def({
    slug: "hex-calculator",
    name: "Hex Calculator",
    subcategory: "math",
    shortDescription: "Convert between hexadecimal and decimal values.",
    keywords: ["hex calculator", "hexadecimal", "hex to decimal"],
    relatedToolIds: ["binary-calculator", "scientific-notation-calculator"],
    fields: [
      selectField("mode", "Mode", "hex2dec", [
        { value: "hex2dec", label: "Hex → Decimal" },
        { value: "dec2hex", label: "Decimal → Hex" },
      ]),
      { id: "value", label: "Value", type: "text", defaultValue: "1A" },
    ],
    compute: (v) => {
      if (v.mode === "hex2dec") {
        if (!/^[0-9a-fA-F]+$/.test(v.value.trim())) throw new Error("Enter a hexadecimal value.");
        const n = Number.parseInt(v.value.trim(), 16);
        return { primaryLabel: "Decimal", primary: String(n), copyText: String(n) };
      }
      const n = parseNumber(v.value, "decimal", { allowNegative: false });
      if (!Number.isInteger(n)) throw new Error("Enter a whole number.");
      return { primaryLabel: "Hexadecimal", primary: n.toString(16).toUpperCase(), copyText: n.toString(16).toUpperCase() };
    },
  }),

  def({
    slug: "half-life-calculator",
    name: "Half-Life Calculator",
    subcategory: "math",
    shortDescription: "Model exponential decay using half-life.",
    keywords: ["half life calculator", "exponential decay"],
    relatedToolIds: ["exponent-calculator", "log-calculator"],
    fields: [
      numberField("initial", "Initial quantity", "100", { min: "0" }),
      numberField("halfLife", "Half-life", "8", { min: "0" }),
      numberField("time", "Elapsed time", "24", { min: "0" }),
      selectField("solve", "Solve for", "remaining", [
        { value: "remaining", label: "Remaining quantity" },
        { value: "time", label: "Time to reach quantity" },
      ]),
      numberField("remaining", "Remaining (for time mode)", "25", { min: "0" }),
    ],
    compute: (v) => {
      const N0 = parseNumber(v.initial, "initial", { allowNegative: false, allowZero: false });
      const hl = parseNumber(v.halfLife, "half-life", { allowNegative: false, allowZero: false });
      if (v.solve === "remaining") {
        const t = parseNumber(v.time, "time", { allowNegative: false });
        const N = N0 * Math.pow(0.5, t / hl);
        return {
          primaryLabel: "Remaining quantity",
          primary: formatNumber(N, 8),
          formula: "N = N0 · (1/2)^(t / t½)",
          copyText: `Remaining: ${formatNumber(N, 8)}`,
        };
      }
      const N = parseNumber(v.remaining, "remaining", { allowNegative: false, allowZero: false });
      if (N > N0) throw new Error("Remaining cannot exceed initial quantity.");
      const t = hl * Math.log(N / N0) / Math.log(0.5);
      return {
        primaryLabel: "Elapsed time",
        primary: formatNumber(t, 8),
        formula: "t = t½ · log(N/N0) / log(1/2)",
        copyText: `Time: ${formatNumber(t, 8)}`,
      };
    },
  }),

  def({
    slug: "quadratic-formula-calculator",
    name: "Quadratic Formula Calculator",
    subcategory: "math",
    shortDescription: "Solve ax² + bx + c = 0 with real or complex roots.",
    keywords: ["quadratic formula", "quadratic equation solver"],
    relatedToolIds: ["scientific-calculator", "exponent-calculator"],
    featured: true,
    fields: [
      numberField("a", "a", "1"),
      numberField("b", "b", "-3"),
      numberField("c", "c", "2"),
    ],
    compute: (v) => {
      const a = parseNumber(v.a, "a", { allowZero: false });
      const b = parseNumber(v.b, "b");
      const c = parseNumber(v.c, "c");
      const d = b * b - 4 * a * c;
      if (d >= 0) {
        const r1 = (-b + Math.sqrt(d)) / (2 * a);
        const r2 = (-b - Math.sqrt(d)) / (2 * a);
        return {
          primaryLabel: "Roots",
          primary: `${formatNumber(r1, 10)}, ${formatNumber(r2, 10)}`,
          breakdown: [{ label: "Discriminant", value: formatNumber(d, 10) }],
          formula: "x = (−b ± √(b² − 4ac)) / (2a)",
          copyText: `Roots: ${formatNumber(r1, 10)}, ${formatNumber(r2, 10)}`,
        };
      }
      const real = -b / (2 * a);
      const imag = Math.sqrt(-d) / (2 * a);
      return {
        primaryLabel: "Complex roots",
        primary: `${formatNumber(real, 8)} ± ${formatNumber(imag, 8)}i`,
        breakdown: [{ label: "Discriminant", value: formatNumber(d, 10) }],
        formula: "x = (−b ± √(b² − 4ac)) / (2a)",
        copyText: `${formatNumber(real, 8)} ± ${formatNumber(imag, 8)}i`,
      };
    },
  }),

  def({
    slug: "log-calculator",
    name: "Log Calculator",
    subcategory: "math",
    shortDescription: "Compute logarithms with common, natural, or custom bases.",
    keywords: ["log calculator", "logarithm", "ln log"],
    relatedToolIds: ["scientific-calculator", "exponent-calculator", "root-calculator"],
    fields: [
      numberField("value", "Value", "100", { min: "0" }),
      selectField("base", "Base", "10", [
        { value: "10", label: "log10" },
        { value: "e", label: "ln (natural)" },
        { value: "2", label: "log2" },
        { value: "custom", label: "Custom base" },
      ]),
      numberField("customBase", "Custom base", "5", { min: "0" }),
    ],
    compute: (v) => {
      const value = parseNumber(v.value, "value", { min: Number.MIN_VALUE });
      if (value <= 0) throw new Error("Value must be positive.");
      let base = 10;
      if (v.base === "e") base = Math.E;
      else if (v.base === "2") base = 2;
      else if (v.base === "custom") base = parseNumber(v.customBase, "custom base", { min: Number.MIN_VALUE });
      if (base <= 0 || base === 1) throw new Error("Base must be positive and not 1.");
      const result = Math.log(value) / Math.log(base);
      return {
        primaryLabel: "Logarithm",
        primary: formatNumber(result, 12),
        formula: "log_b(x) = ln(x) / ln(b)",
        copyText: `log = ${formatNumber(result, 12)}`,
      };
    },
  }),

  def({
    slug: "root-calculator",
    name: "Root Calculator",
    subcategory: "math",
    shortDescription: "Calculate square roots, cube roots, or n-th roots.",
    keywords: ["root calculator", "square root", "nth root"],
    relatedToolIds: ["exponent-calculator", "scientific-calculator", "log-calculator"],
    fields: [
      numberField("value", "Value", "81"),
      numberField("n", "Root degree (n)", "2", { min: "1", step: "1", inputMode: "numeric" }),
    ],
    compute: (v) => {
      const value = parseNumber(v.value, "value");
      const n = parseNumber(v.n, "root degree", { allowZero: false });
      if (value < 0 && n % 2 === 0) throw new Error("Even roots of negative numbers are not real.");
      const result = value < 0 ? -Math.pow(-value, 1 / n) : Math.pow(value, 1 / n);
      assertFinite(result);
      return {
        primaryLabel: "Root",
        primary: formatNumber(result, 12),
        formula: "ⁿ√x = x^(1/n)",
        copyText: `Root: ${formatNumber(result, 12)}`,
      };
    },
  }),

  def({
    slug: "least-common-multiple-calculator",
    name: "Least Common Multiple Calculator",
    subcategory: "math",
    shortDescription: "Find the LCM of two or more integers.",
    keywords: ["lcm calculator", "least common multiple"],
    relatedToolIds: ["greatest-common-factor-calculator", "factor-calculator", "fraction-calculator"],
    fields: [
      {
        id: "numbers",
        label: "Integers (comma or space separated)",
        type: "text",
        defaultValue: "12, 18, 30",
        span: 2,
      },
    ],
    compute: (v) => {
      const nums = parseList(v.numbers).map((n) => {
        if (!Number.isInteger(n)) throw new Error("LCM requires integers.");
        return n;
      });
      const result = nums.reduce((a, b) => lcm(a, b), 1);
      return {
        primaryLabel: "LCM",
        primary: formatNumber(result, 0),
        formula: "LCM(a,b) = |a·b| / GCD(a,b)",
        copyText: `LCM: ${result}`,
      };
    },
  }),

  def({
    slug: "greatest-common-factor-calculator",
    name: "Greatest Common Factor Calculator",
    subcategory: "math",
    shortDescription: "Find the GCF/GCD of two or more integers.",
    keywords: ["gcf calculator", "gcd calculator", "greatest common factor"],
    aliases: ["common-factor-calculator"],
    relatedToolIds: ["least-common-multiple-calculator", "factor-calculator", "fraction-calculator"],
    fields: [
      {
        id: "numbers",
        label: "Integers (comma or space separated)",
        type: "text",
        defaultValue: "48, 18, 30",
        span: 2,
      },
    ],
    compute: (v) => {
      const nums = parseList(v.numbers).map((n) => {
        if (!Number.isInteger(n)) throw new Error("GCF requires integers.");
        return n;
      });
      const result = nums.reduce((a, b) => gcd(a, b));
      return {
        primaryLabel: "GCF",
        primary: String(result),
        formula: "Euclidean algorithm",
        copyText: `GCF: ${result}`,
      };
    },
  }),

  def({
    slug: "factor-calculator",
    name: "Factor Calculator",
    subcategory: "math",
    shortDescription: "List all positive factors of an integer.",
    keywords: ["factor calculator", "factors of a number"],
    relatedToolIds: ["prime-factorization-calculator", "greatest-common-factor-calculator"],
    fields: [numberField("n", "Integer", "60", { step: "1", inputMode: "numeric" })],
    compute: (v) => {
      const n = Math.abs(parseNumber(v.n, "integer"));
      if (!Number.isInteger(n)) throw new Error("Enter a whole number.");
      if (n > 1_000_000) throw new Error("Please enter a number up to 1,000,000.");
      const factors: number[] = [];
      for (let i = 1; i * i <= n; i++) {
        if (n % i === 0) {
          factors.push(i);
          if (i * i !== n) factors.push(n / i);
        }
      }
      factors.sort((a, b) => a - b);
      return {
        primaryLabel: "Factors",
        primary: factors.join(", "),
        breakdown: [{ label: "Count", value: String(factors.length) }],
        copyText: factors.join(", "),
      };
    },
  }),

  def({
    slug: "rounding-calculator",
    name: "Rounding Calculator",
    subcategory: "math",
    shortDescription: "Round numbers to a chosen number of decimal places or significant figures.",
    keywords: ["rounding calculator", "round decimals", "significant figures"],
    relatedToolIds: ["scientific-notation-calculator", "percentage-calculator"],
    fields: [
      numberField("value", "Number", "3.14159265"),
      numberField("places", "Places / significant figures", "3", { step: "1", inputMode: "numeric" }),
      selectField("mode", "Mode", "decimal", [
        { value: "decimal", label: "Decimal places" },
        { value: "sig", label: "Significant figures" },
      ]),
    ],
    compute: (v) => {
      const value = parseNumber(v.value, "number");
      const places = parsePositiveInt(v.places, "places");
      if (v.mode === "decimal") {
        const f = 10 ** places;
        const rounded = Math.round(value * f) / f;
        return {
          primaryLabel: "Rounded",
          primary: formatFixed(rounded, places),
          copyText: formatFixed(rounded, places),
        };
      }
      if (value === 0) return { primaryLabel: "Rounded", primary: "0", copyText: "0" };
      const d = Math.ceil(Math.log10(Math.abs(value)));
      const power = places - d;
      const f = 10 ** power;
      const rounded = Math.round(value * f) / f;
      return {
        primaryLabel: "Rounded",
        primary: formatNumber(rounded, places),
        copyText: formatNumber(rounded, places),
      };
    },
  }),

  def({
    slug: "matrix-calculator",
    name: "Matrix Calculator",
    subcategory: "math",
    shortDescription: "Add, multiply, transpose, and invert small matrices.",
    keywords: ["matrix calculator", "matrix multiplication", "determinant"],
    relatedToolIds: ["scientific-calculator", "basic-calculator"],
    featured: true,
    ui: "matrix",
    fields: [],
    compute: () => ({ primaryLabel: "Result", primary: "—", copyText: "" }),
  }),

  def({
    slug: "scientific-notation-calculator",
    name: "Scientific Notation Calculator",
    subcategory: "math",
    shortDescription: "Convert between decimal and scientific notation.",
    keywords: ["scientific notation", "standard form"],
    relatedToolIds: ["exponent-calculator", "rounding-calculator", "big-number-calculator"],
    fields: [
      selectField("mode", "Mode", "toSci", [
        { value: "toSci", label: "Decimal → scientific" },
        { value: "fromSci", label: "Scientific → decimal" },
      ]),
      numberField("value", "Decimal value", "12300"),
      numberField("coeff", "Coefficient (scientific)", "1.23"),
      numberField("exp", "Exponent", "4", { step: "1", inputMode: "numeric" }),
    ],
    compute: (v) => {
      if (v.mode === "toSci") {
        const value = parseNumber(v.value, "value");
        if (value === 0) return { primaryLabel: "Scientific notation", primary: "0 × 10^0", copyText: "0e0" };
        const exp = Math.floor(Math.log10(Math.abs(value)));
        const coeff = value / 10 ** exp;
        return {
          primaryLabel: "Scientific notation",
          primary: `${formatNumber(coeff, 10)} × 10^${exp}`,
          copyText: `${coeff}e${exp}`,
        };
      }
      const coeff = parseNumber(v.coeff, "coefficient");
      const exp = parseNumber(v.exp, "exponent");
      const value = coeff * 10 ** exp;
      return {
        primaryLabel: "Decimal value",
        primary: formatNumber(value, 12),
        copyText: formatNumber(value, 12),
      };
    },
  }),

  def({
    slug: "big-number-calculator",
    name: "Big Number Calculator",
    subcategory: "math",
    shortDescription: "Add, subtract, multiply, or divide large integers with BigInt precision.",
    keywords: ["big number calculator", "bigint calculator", "large integers"],
    relatedToolIds: ["basic-calculator", "scientific-notation-calculator"],
    fields: [
      { id: "a", label: "First integer", type: "text", defaultValue: "12345678901234567890" },
      selectField("op", "Operation", "+", [
        { value: "+", label: "+" },
        { value: "-", label: "−" },
        { value: "*", label: "×" },
        { value: "/", label: "÷ (integer quotient)" },
      ]),
      { id: "b", label: "Second integer", type: "text", defaultValue: "98765432109876543210" },
    ],
    compute: (v) => {
      try {
        const a = BigInt(v.a.trim());
        const b = BigInt(v.b.trim());
        let result: bigint;
        if (v.op === "+") result = a + b;
        else if (v.op === "-") result = a - b;
        else if (v.op === "*") result = a * b;
        else {
          if (b === BigInt(0)) throw new Error("Cannot divide by zero.");
          result = a / b;
        }
        return {
          primaryLabel: "Result",
          primary: result.toString(),
          copyText: result.toString(),
        };
      } catch (e) {
        if (e instanceof Error && e.message.includes("zero")) throw e;
        throw new Error("Enter valid integers (optional leading minus).");
      }
    },
  }),

  def({
    slug: "prime-factorization-calculator",
    name: "Prime Factorization Calculator",
    subcategory: "math",
    shortDescription: "Factor an integer into primes.",
    keywords: ["prime factorization", "prime factors"],
    relatedToolIds: ["factor-calculator", "greatest-common-factor-calculator"],
    fields: [numberField("n", "Integer", "360", { step: "1", inputMode: "numeric", min: "2" })],
    compute: (v) => {
      let n = parsePositiveInt(v.n, "integer");
      if (n < 2) throw new Error("Enter an integer ≥ 2.");
      if (n > 10_000_000) throw new Error("Please enter a number up to 10,000,000.");
      const factors: number[] = [];
      for (let p = 2; p * p <= n; p++) {
        while (n % p === 0) {
          factors.push(p);
          n /= p;
        }
      }
      if (n > 1) factors.push(n);
      const pretty = factors.reduce<Record<number, number>>((acc, f) => {
        acc[f] = (acc[f] || 0) + 1;
        return acc;
      }, {});
      const expr = Object.entries(pretty)
        .map(([p, e]) => (e === 1 ? p : `${p}^${e}`))
        .join(" × ");
      return {
        primaryLabel: "Prime factorization",
        primary: expr,
        breakdown: [{ label: "Prime list", value: factors.join(" × ") }],
        copyText: expr,
      };
    },
  }),

  def({
    slug: "long-division-calculator",
    name: "Long Division Calculator",
    subcategory: "math",
    shortDescription: "Divide integers and show quotient and remainder.",
    keywords: ["long division calculator", "division with remainder"],
    relatedToolIds: ["basic-calculator", "fraction-calculator"],
    fields: [
      numberField("dividend", "Dividend", "125", { step: "1", inputMode: "numeric" }),
      numberField("divisor", "Divisor", "8", { step: "1", inputMode: "numeric" }),
    ],
    compute: (v) => {
      const a = parseNumber(v.dividend, "dividend");
      const b = parseNumber(v.divisor, "divisor", { allowZero: false });
      if (!Number.isInteger(a) || !Number.isInteger(b)) throw new Error("Enter whole numbers.");
      const quotient = Math.trunc(a / b);
      const remainder = a % b;
      return {
        primaryLabel: "Quotient",
        primary: String(quotient),
        breakdown: [
          { label: "Remainder", value: String(remainder) },
          { label: "Exact value", value: formatNumber(a / b, 10) },
        ],
        formula: "dividend = divisor × quotient + remainder",
        copyText: `${a} ÷ ${b} = ${quotient} R ${remainder}`,
      };
    },
  }),

  def({
    slug: "p-value-calculator",
    name: "P-value Calculator",
    subcategory: "math",
    shortDescription: "Approximate two-tailed p-value from a z-score (normal distribution).",
    keywords: ["p value calculator", "z test p value"],
    relatedToolIds: ["z-score-calculator", "statistics-calculator", "confidence-interval-calculator"],
    notices: ["Uses a standard normal approximation for educational use."],
    fields: [numberField("z", "Z-score", "1.96")],
    compute: (v) => {
      const z = Math.abs(parseNumber(v.z, "z-score"));
      // Abramowitz & Stegun approximation for Φ
      const t = 1 / (1 + 0.2316419 * z);
      const d = Math.exp((-z * z) / 2) / Math.sqrt(2 * Math.PI);
      const p =
        d *
        (0.31938153 * t -
          0.356563782 * t ** 2 +
          1.781477937 * t ** 3 -
          1.821255978 * t ** 4 +
          1.330274429 * t ** 5);
      const twoTail = Math.min(1, Math.max(0, 2 * p));
      return {
        primaryLabel: "Two-tailed p-value",
        primary: formatNumber(twoTail, 6),
        breakdown: [{ label: "One-tailed", value: formatNumber(Math.min(1, p), 6) }],
        formula: "p ≈ 2·(1 − Φ(|z|)) for two-tailed normal tests",
        copyText: `p-value ≈ ${formatNumber(twoTail, 6)}`,
      };
    },
  }),

  def({
    slug: "number-sequence-calculator",
    name: "Number Sequence Calculator",
    subcategory: "math",
    shortDescription: "Generate arithmetic or geometric sequences.",
    keywords: ["number sequence", "arithmetic sequence", "geometric sequence"],
    relatedToolIds: ["average-calculator", "exponent-calculator"],
    fields: [
      selectField("type", "Sequence type", "arithmetic", [
        { value: "arithmetic", label: "Arithmetic" },
        { value: "geometric", label: "Geometric" },
      ]),
      numberField("first", "First term", "3"),
      numberField("step", "Common difference / ratio", "5"),
      numberField("count", "Terms", "8", { min: "1", max: "50", step: "1", inputMode: "numeric" }),
    ],
    compute: (v) => {
      const first = parseNumber(v.first, "first term");
      const step = parseNumber(v.step, "step");
      const count = parsePositiveInt(v.count, "terms");
      if (count > 50) throw new Error("Generate at most 50 terms.");
      const terms: number[] = [];
      for (let i = 0; i < count; i++) {
        terms.push(v.type === "arithmetic" ? first + i * step : first * step ** i);
      }
      return {
        primaryLabel: "Sequence",
        primary: terms.map((t) => formatNumber(t, 8)).join(", "),
        copyText: terms.join(", "),
      };
    },
  }),

  def({
    slug: "sample-size-calculator",
    name: "Sample Size Calculator",
    subcategory: "math",
    shortDescription: "Estimate sample size for a proportion with a chosen confidence level.",
    keywords: ["sample size calculator", "survey sample size"],
    relatedToolIds: ["confidence-interval-calculator", "statistics-calculator", "probability-calculator"],
    notices: ["Uses the normal approximation for proportions."],
    fields: [
      selectField("confidence", "Confidence level", "1.96", [
        { value: "1.645", label: "90%" },
        { value: "1.96", label: "95%" },
        { value: "2.576", label: "99%" },
      ]),
      percentFieldLike("proportion", "Expected proportion (%)", "50"),
      percentFieldLike("moe", "Margin of error (%)", "5"),
    ],
    compute: (v) => {
      const z = parseNumber(v.confidence, "confidence z");
      const p = parseNumber(v.proportion, "proportion", { min: 0, max: 100 }) / 100;
      const e = parseNumber(v.moe, "margin of error", { allowZero: false, min: 0.01, max: 50 }) / 100;
      const n = (z * z * p * (1 - p)) / (e * e);
      return {
        primaryLabel: "Required sample size",
        primary: String(Math.ceil(n)),
        formula: "n = Z² · p(1−p) / E²",
        copyText: `Sample size: ${Math.ceil(n)}`,
      };
    },
  }),

  def({
    slug: "probability-calculator",
    name: "Probability Calculator",
    subcategory: "math",
    shortDescription: "Combine event probabilities with and/or/not operations.",
    keywords: ["probability calculator", "independent events"],
    relatedToolIds: ["permutation-and-combination-calculator", "statistics-calculator"],
    fields: [
      percentFieldLike("pA", "P(A) (%)", "40"),
      percentFieldLike("pB", "P(B) (%)", "25"),
      selectField("independence", "Assume independent?", "yes", [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No (enter P(A and B))" },
      ]),
      percentFieldLike("pBoth", "P(A and B) (%) if dependent", "10"),
    ],
    compute: (v) => {
      const a = parseNumber(v.pA, "P(A)", { min: 0, max: 100 }) / 100;
      const b = parseNumber(v.pB, "P(B)", { min: 0, max: 100 }) / 100;
      const both =
        v.independence === "yes"
          ? a * b
          : parseNumber(v.pBoth, "P(A and B)", { min: 0, max: 100 }) / 100;
      if (both > Math.min(a, b) + 1e-12) throw new Error("P(A and B) cannot exceed min(P(A), P(B)).");
      const either = a + b - both;
      return {
        primaryLabel: "P(A or B)",
        primary: formatPercent(either * 100),
        breakdown: [
          { label: "P(A and B)", value: formatPercent(both * 100) },
          { label: "P(not A)", value: formatPercent((1 - a) * 100) },
        ],
        formula: "P(A∪B) = P(A)+P(B)−P(A∩B)",
        copyText: `P(A or B): ${formatPercent(either * 100)}`,
      };
    },
  }),

  def({
    slug: "statistics-calculator",
    name: "Statistics Calculator",
    subcategory: "math",
    shortDescription: "Compute mean, median, variance, and standard deviation.",
    keywords: ["statistics calculator", "standard deviation", "variance"],
    relatedToolIds: ["mean-median-mode-range-calculator", "z-score-calculator", "sample-size-calculator"],
    featured: true,
    fields: [
      {
        id: "numbers",
        label: "Numbers (comma, space, or line separated)",
        type: "textarea",
        defaultValue: "2, 4, 4, 4, 5, 5, 7, 9",
        span: 2,
      },
      selectField("mode", "Std. deviation / variance", "sample", [
        { value: "sample", label: "Sample" },
        { value: "population", label: "Population" },
      ]),
    ],
    compute: (v) => {
      const xs = parseList(v.numbers);
      const sample = v.mode === "sample";
      const m = mean(xs);
      const sorted = [...xs].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      const vari = variance(xs, sample);
      const sd = Math.sqrt(vari);
      return {
        primaryLabel: "Mean",
        primary: formatNumber(m, 8),
        breakdown: [
          { label: "Median", value: formatNumber(median, 8) },
          { label: sample ? "Sample variance" : "Population variance", value: formatNumber(vari, 8) },
          { label: sample ? "Sample std. dev." : "Population std. dev.", value: formatNumber(sd, 8) },
          { label: "Count", value: String(xs.length) },
        ],
        formula: sample ? "s² uses n−1" : "σ² uses n",
        copyText: `Mean ${formatNumber(m, 8)}; SD ${formatNumber(sd, 8)}`,
      };
    },
  }),

  def({
    slug: "mean-median-mode-range-calculator",
    name: "Mean Median Mode Range Calculator",
    subcategory: "math",
    shortDescription: "Find mean, median, mode, and range for a data set.",
    keywords: ["mean median mode range", "central tendency"],
    relatedToolIds: ["statistics-calculator", "average-calculator"],
    fields: [
      {
        id: "numbers",
        label: "Numbers",
        type: "textarea",
        defaultValue: "1, 2, 2, 3, 4, 7, 9",
        span: 2,
      },
    ],
    compute: (v) => {
      const xs = parseList(v.numbers);
      const m = mean(xs);
      const sorted = [...xs].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      const freq = new Map<number, number>();
      for (const x of xs) freq.set(x, (freq.get(x) || 0) + 1);
      const maxF = Math.max(...freq.values());
      const modes = [...freq.entries()].filter(([, f]) => f === maxF).map(([x]) => x);
      const range = sorted[sorted.length - 1] - sorted[0];
      return {
        primaryLabel: "Mean",
        primary: formatNumber(m, 8),
        breakdown: [
          { label: "Median", value: formatNumber(median, 8) },
          { label: "Mode", value: maxF === 1 ? "No mode (all unique)" : modes.join(", ") },
          { label: "Range", value: formatNumber(range, 8) },
        ],
        copyText: `Mean ${formatNumber(m, 8)}; median ${formatNumber(median, 8)}; range ${formatNumber(range, 8)}`,
      };
    },
  }),

  def({
    slug: "permutation-and-combination-calculator",
    name: "Permutation and Combination Calculator",
    subcategory: "math",
    shortDescription: "Calculate nPr and nCr for selections and arrangements.",
    keywords: ["permutation calculator", "combination calculator", "nPr nCr"],
    relatedToolIds: ["probability-calculator", "factorial-related", "statistics-calculator"],
    fields: [
      numberField("n", "n", "10", { min: "0", step: "1", inputMode: "numeric" }),
      numberField("r", "r", "3", { min: "0", step: "1", inputMode: "numeric" }),
    ],
    compute: (v) => {
      const n = parsePositiveInt(v.n, "n");
      const r = parseNumber(v.r, "r", { allowNegative: false });
      if (!Number.isInteger(r)) throw new Error("r must be a whole number.");
      if (r > n) throw new Error("r cannot exceed n.");
      const nPr = factorial(n) / factorial(n - r);
      const nCr = nPr / factorial(r);
      return {
        primaryLabel: "Combinations nCr",
        primary: formatNumber(nCr, 0),
        breakdown: [{ label: "Permutations nPr", value: formatNumber(nPr, 0) }],
        formula: "nPr = n!/(n−r)!; nCr = n!/(r!(n−r)!)",
        copyText: `nCr=${nCr}; nPr=${nPr}`,
      };
    },
  }),

  def({
    slug: "z-score-calculator",
    name: "Z-score Calculator",
    subcategory: "math",
    shortDescription: "Convert a raw score to a z-score using mean and standard deviation.",
    keywords: ["z score calculator", "standard score"],
    relatedToolIds: ["statistics-calculator", "p-value-calculator", "confidence-interval-calculator"],
    fields: [
      numberField("x", "Raw score", "85"),
      numberField("mean", "Mean", "70"),
      numberField("sd", "Standard deviation", "10", { min: "0" }),
    ],
    compute: (v) => {
      const x = parseNumber(v.x, "raw score");
      const m = parseNumber(v.mean, "mean");
      const sd = parseNumber(v.sd, "standard deviation", { allowZero: false });
      const z = (x - m) / sd;
      return {
        primaryLabel: "Z-score",
        primary: formatNumber(z, 6),
        formula: "z = (x − μ) / σ",
        copyText: `z = ${formatNumber(z, 6)}`,
      };
    },
  }),

  def({
    slug: "confidence-interval-calculator",
    name: "Confidence Interval Calculator",
    subcategory: "math",
    shortDescription: "Estimate a confidence interval for a mean with known σ (z-interval).",
    keywords: ["confidence interval", "ci calculator"],
    relatedToolIds: ["z-score-calculator", "sample-size-calculator", "statistics-calculator"],
    fields: [
      numberField("mean", "Sample mean", "50"),
      numberField("sd", "Std. deviation (σ)", "10", { min: "0" }),
      numberField("n", "Sample size", "40", { min: "1", step: "1", inputMode: "numeric" }),
      selectField("z", "Confidence level", "1.96", [
        { value: "1.645", label: "90%" },
        { value: "1.96", label: "95%" },
        { value: "2.576", label: "99%" },
      ]),
    ],
    compute: (v) => {
      const meanV = parseNumber(v.mean, "mean");
      const sd = parseNumber(v.sd, "std. deviation", { allowZero: false });
      const n = parsePositiveInt(v.n, "sample size");
      const z = parseNumber(v.z, "z");
      const moe = z * (sd / Math.sqrt(n));
      return {
        primaryLabel: "Confidence interval",
        primary: `${formatNumber(meanV - moe, 6)} to ${formatNumber(meanV + moe, 6)}`,
        breakdown: [{ label: "Margin of error", value: formatNumber(moe, 6) }],
        formula: "x̄ ± Z·σ/√n",
        copyText: `CI: ${formatNumber(meanV - moe, 6)} to ${formatNumber(meanV + moe, 6)}`,
      };
    },
  }),

  def({
    slug: "triangle-calculator",
    name: "Triangle Calculator",
    subcategory: "math",
    shortDescription: "Solve triangle sides and area from SSS, SAS, or ASA data.",
    keywords: ["triangle calculator", "triangle area", "law of cosines"],
    relatedToolIds: ["right-triangle-calculator", "pythagorean-theorem-calculator", "area-calculator"],
    featured: true,
    fields: [
      selectField("mode", "Known values", "sss", [
        { value: "sss", label: "Three sides (SSS)" },
        { value: "sas", label: "Two sides + included angle (SAS)" },
      ]),
      numberField("a", "Side a", "3", { min: "0" }),
      numberField("b", "Side b", "4", { min: "0" }),
      numberField("c", "Side c / angle C (deg for SAS)", "5"),
    ],
    compute: (v) => {
      if (v.mode === "sss") {
        const a = parseNumber(v.a, "side a", { allowZero: false, allowNegative: false });
        const b = parseNumber(v.b, "side b", { allowZero: false, allowNegative: false });
        const c = parseNumber(v.c, "side c", { allowZero: false, allowNegative: false });
        if (a + b <= c || a + c <= b || b + c <= a) throw new Error("Sides do not form a triangle.");
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        const A = radToDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
        const B = radToDeg(Math.acos((a * a + c * c - b * b) / (2 * a * c)));
        const C = 180 - A - B;
        return {
          primaryLabel: "Area",
          primary: formatNumber(area, 8),
          breakdown: [
            { label: "Angle A", value: `${formatFixed(A, 4)}°` },
            { label: "Angle B", value: `${formatFixed(B, 4)}°` },
            { label: "Angle C", value: `${formatFixed(C, 4)}°` },
          ],
          formula: "Heron’s formula; angles via law of cosines",
          copyText: `Area ${formatNumber(area, 8)}`,
        };
      }
      const a = parseNumber(v.a, "side a", { allowZero: false, allowNegative: false });
      const b = parseNumber(v.b, "side b", { allowZero: false, allowNegative: false });
      const C = parseNumber(v.c, "angle C", { min: 0, max: 180 });
      const area = 0.5 * a * b * Math.sin(degToRad(C));
      const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(degToRad(C)));
      return {
        primaryLabel: "Area",
        primary: formatNumber(area, 8),
        breakdown: [{ label: "Side c", value: formatNumber(c, 8) }],
        formula: "Area = ½ab sin C",
        copyText: `Area ${formatNumber(area, 8)}`,
      };
    },
  }),

  def({
    slug: "volume-calculator",
    name: "Volume Calculator",
    subcategory: "math",
    shortDescription: "Calculate volumes for box, sphere, cylinder, and cone shapes.",
    keywords: ["volume calculator", "sphere volume", "cylinder volume"],
    relatedToolIds: ["surface-area-calculator", "area-calculator", "cube-calculator"],
    fields: [
      selectField("shape", "Shape", "box", [
        { value: "box", label: "Box" },
        { value: "sphere", label: "Sphere" },
        { value: "cylinder", label: "Cylinder" },
        { value: "cone", label: "Cone" },
      ]),
      numberField("a", "Length / radius", "4", { min: "0" }),
      numberField("b", "Width / height", "3", { min: "0" }),
      numberField("c", "Height (box)", "2", { min: "0" }),
    ],
    compute: (v) => {
      const a = parseNumber(v.a, "dimension a", { allowNegative: false });
      const b = parseOptionalNumber(v.b, "dimension b", 0);
      const c = parseOptionalNumber(v.c, "dimension c", 0);
      let vol = 0;
      let formula = "";
      if (v.shape === "box") {
        vol = a * b * c;
        formula = "V = l·w·h";
      } else if (v.shape === "sphere") {
        vol = (4 / 3) * Math.PI * a ** 3;
        formula = "V = 4/3 π r³";
      } else if (v.shape === "cylinder") {
        vol = Math.PI * a ** 2 * b;
        formula = "V = π r² h";
      } else {
        vol = (1 / 3) * Math.PI * a ** 2 * b;
        formula = "V = 1/3 π r² h";
      }
      return {
        primaryLabel: "Volume",
        primary: formatNumber(vol, 8),
        formula,
        copyText: `Volume: ${formatNumber(vol, 8)}`,
      };
    },
  }),

  def({
    slug: "slope-calculator",
    name: "Slope Calculator",
    subcategory: "math",
    shortDescription: "Find the slope and equation of a line through two points.",
    keywords: ["slope calculator", "line slope", "rise over run"],
    relatedToolIds: ["distance-calculator", "triangle-calculator"],
    fields: [
      numberField("x1", "x₁", "1"),
      numberField("y1", "y₁", "2"),
      numberField("x2", "x₂", "4"),
      numberField("y2", "y₂", "8"),
    ],
    compute: (v) => {
      const x1 = parseNumber(v.x1, "x1");
      const y1 = parseNumber(v.y1, "y1");
      const x2 = parseNumber(v.x2, "x2");
      const y2 = parseNumber(v.y2, "y2");
      if (x1 === x2) {
        return {
          primaryLabel: "Slope",
          primary: "Undefined (vertical line)",
          breakdown: [{ label: "Equation", value: `x = ${x1}` }],
          copyText: `x = ${x1}`,
        };
      }
      const m = (y2 - y1) / (x2 - x1);
      const b = y1 - m * x1;
      return {
        primaryLabel: "Slope",
        primary: formatNumber(m, 8),
        breakdown: [{ label: "Equation", value: `y = ${formatNumber(m, 6)}x + ${formatNumber(b, 6)}` }],
        formula: "m = (y₂ − y₁) / (x₂ − x₁)",
        copyText: `Slope: ${formatNumber(m, 8)}`,
      };
    },
  }),

  def({
    slug: "area-calculator",
    name: "Area Calculator",
    subcategory: "math",
    shortDescription: "Calculate area for rectangle, triangle, circle, and trapezoid.",
    keywords: ["area calculator", "circle area", "rectangle area"],
    relatedToolIds: ["triangle-calculator", "circle-calculator", "surface-area-calculator"],
    featured: true,
    fields: [
      selectField("shape", "Shape", "rectangle", [
        { value: "rectangle", label: "Rectangle" },
        { value: "triangle", label: "Triangle" },
        { value: "circle", label: "Circle" },
        { value: "trapezoid", label: "Trapezoid" },
      ]),
      numberField("a", "Length / base / radius", "6", { min: "0" }),
      numberField("b", "Width / height / base2", "4", { min: "0" }),
      numberField("h", "Height (triangle/trapezoid)", "3", { min: "0" }),
    ],
    compute: (v) => {
      const a = parseNumber(v.a, "a", { allowNegative: false });
      const b = parseOptionalNumber(v.b, "b", 0);
      const h = parseOptionalNumber(v.h, "h", 0);
      let area = 0;
      let formula = "";
      if (v.shape === "rectangle") {
        area = a * b;
        formula = "A = l·w";
      } else if (v.shape === "triangle") {
        area = 0.5 * a * h;
        formula = "A = ½·base·height";
      } else if (v.shape === "circle") {
        area = Math.PI * a * a;
        formula = "A = π r²";
      } else {
        area = 0.5 * (a + b) * h;
        formula = "A = ½(a+b)h";
      }
      return {
        primaryLabel: "Area",
        primary: formatNumber(area, 8),
        formula,
        copyText: `Area: ${formatNumber(area, 8)}`,
      };
    },
  }),

  def({
    slug: "distance-calculator",
    name: "Distance Calculator",
    subcategory: "math",
    shortDescription: "Calculate Euclidean distance between two points.",
    keywords: ["distance calculator", "distance between points"],
    relatedToolIds: ["slope-calculator", "pythagorean-theorem-calculator"],
    fields: [
      numberField("x1", "x₁", "0"),
      numberField("y1", "y₁", "0"),
      numberField("x2", "x₂", "3"),
      numberField("y2", "y₂", "4"),
    ],
    compute: (v) => {
      const x1 = parseNumber(v.x1, "x1");
      const y1 = parseNumber(v.y1, "y1");
      const x2 = parseNumber(v.x2, "x2");
      const y2 = parseNumber(v.y2, "y2");
      const d = Math.hypot(x2 - x1, y2 - y1);
      return {
        primaryLabel: "Distance",
        primary: formatNumber(d, 10),
        formula: "d = √((x₂−x₁)² + (y₂−y₁)²)",
        copyText: `Distance: ${formatNumber(d, 10)}`,
      };
    },
  }),

  def({
    slug: "circle-calculator",
    name: "Circle Calculator",
    subcategory: "math",
    shortDescription: "Find circumference, area, diameter, or radius of a circle.",
    keywords: ["circle calculator", "circumference", "circle area"],
    relatedToolIds: ["area-calculator", "volume-calculator", "surface-area-calculator"],
    fields: [
      selectField("known", "Known value", "radius", [
        { value: "radius", label: "Radius" },
        { value: "diameter", label: "Diameter" },
        { value: "circumference", label: "Circumference" },
        { value: "area", label: "Area" },
      ]),
      numberField("value", "Value", "5", { min: "0" }),
    ],
    compute: (v) => {
      const value = parseNumber(v.value, "value", { allowNegative: false, allowZero: false });
      let r = value;
      if (v.known === "diameter") r = value / 2;
      if (v.known === "circumference") r = value / (2 * Math.PI);
      if (v.known === "area") r = Math.sqrt(value / Math.PI);
      return {
        primaryLabel: "Radius",
        primary: formatNumber(r, 10),
        breakdown: [
          { label: "Diameter", value: formatNumber(2 * r, 10) },
          { label: "Circumference", value: formatNumber(2 * Math.PI * r, 10) },
          { label: "Area", value: formatNumber(Math.PI * r * r, 10) },
        ],
        formula: "C = 2πr; A = πr²",
        copyText: `r=${formatNumber(r, 10)}; C=${formatNumber(2 * Math.PI * r, 10)}; A=${formatNumber(Math.PI * r * r, 10)}`,
      };
    },
  }),

  def({
    slug: "surface-area-calculator",
    name: "Surface Area Calculator",
    subcategory: "math",
    shortDescription: "Calculate surface area for box, sphere, and cylinder.",
    keywords: ["surface area calculator", "sphere surface area"],
    relatedToolIds: ["volume-calculator", "area-calculator", "circle-calculator"],
    fields: [
      selectField("shape", "Shape", "box", [
        { value: "box", label: "Rectangular box" },
        { value: "sphere", label: "Sphere" },
        { value: "cylinder", label: "Cylinder" },
      ]),
      numberField("a", "Length / radius", "3", { min: "0" }),
      numberField("b", "Width / height", "4", { min: "0" }),
      numberField("c", "Height (box)", "5", { min: "0" }),
    ],
    compute: (v) => {
      const a = parseNumber(v.a, "a", { allowNegative: false });
      const b = parseOptionalNumber(v.b, "b", 0);
      const c = parseOptionalNumber(v.c, "c", 0);
      let sa = 0;
      let formula = "";
      if (v.shape === "box") {
        sa = 2 * (a * b + b * c + a * c);
        formula = "SA = 2(lw+wh+lh)";
      } else if (v.shape === "sphere") {
        sa = 4 * Math.PI * a * a;
        formula = "SA = 4πr²";
      } else {
        sa = 2 * Math.PI * a * (a + b);
        formula = "SA = 2πr(r+h)";
      }
      return {
        primaryLabel: "Surface area",
        primary: formatNumber(sa, 8),
        formula,
        copyText: `Surface area: ${formatNumber(sa, 8)}`,
      };
    },
  }),

  def({
    slug: "pythagorean-theorem-calculator",
    name: "Pythagorean Theorem Calculator",
    subcategory: "math",
    shortDescription: "Solve for a missing side of a right triangle.",
    keywords: ["pythagorean theorem", "hypotenuse calculator"],
    relatedToolIds: ["right-triangle-calculator", "triangle-calculator", "distance-calculator"],
    fields: [
      selectField("solve", "Solve for", "c", [
        { value: "c", label: "Hypotenuse c" },
        { value: "a", label: "Leg a" },
        { value: "b", label: "Leg b" },
      ]),
      numberField("a", "Leg a", "3", { min: "0" }),
      numberField("b", "Leg b", "4", { min: "0" }),
      numberField("c", "Hypotenuse c", "5", { min: "0" }),
    ],
    compute: (v) => {
      if (v.solve === "c") {
        const a = parseNumber(v.a, "a", { allowZero: false, allowNegative: false });
        const b = parseNumber(v.b, "b", { allowZero: false, allowNegative: false });
        const c = Math.hypot(a, b);
        return { primaryLabel: "Hypotenuse", primary: formatNumber(c, 10), formula: "c = √(a²+b²)", copyText: formatNumber(c, 10) };
      }
      const c = parseNumber(v.c, "c", { allowZero: false, allowNegative: false });
      if (v.solve === "a") {
        const b = parseNumber(v.b, "b", { allowZero: false, allowNegative: false });
        if (c <= b) throw new Error("Hypotenuse must be longer than leg b.");
        const a = Math.sqrt(c * c - b * b);
        return { primaryLabel: "Leg a", primary: formatNumber(a, 10), formula: "a = √(c²−b²)", copyText: formatNumber(a, 10) };
      }
      const a = parseNumber(v.a, "a", { allowZero: false, allowNegative: false });
      if (c <= a) throw new Error("Hypotenuse must be longer than leg a.");
      const b = Math.sqrt(c * c - a * a);
      return { primaryLabel: "Leg b", primary: formatNumber(b, 10), formula: "b = √(c²−a²)", copyText: formatNumber(b, 10) };
    },
  }),

  def({
    slug: "right-triangle-calculator",
    name: "Right Triangle Calculator",
    subcategory: "math",
    shortDescription: "Solve a right triangle from two known sides or a side and an angle.",
    keywords: ["right triangle calculator", "right angle triangle"],
    relatedToolIds: ["pythagorean-theorem-calculator", "triangle-calculator", "slope-calculator"],
    fields: [
      selectField("mode", "Known", "ab", [
        { value: "ab", label: "Legs a and b" },
        { value: "ac", label: "Leg a and hypotenuse c" },
        { value: "angle", label: "Leg a and angle A (deg)" },
      ]),
      numberField("a", "a / angle A", "3"),
      numberField("b", "b / hypotenuse", "4"),
    ],
    compute: (v) => {
      if (v.mode === "ab") {
        const a = parseNumber(v.a, "a", { allowZero: false, allowNegative: false });
        const b = parseNumber(v.b, "b", { allowZero: false, allowNegative: false });
        const c = Math.hypot(a, b);
        const A = radToDeg(Math.atan(a / b));
        return {
          primaryLabel: "Hypotenuse",
          primary: formatNumber(c, 10),
          breakdown: [
            { label: "Angle A", value: `${formatFixed(A, 4)}°` },
            { label: "Angle B", value: `${formatFixed(90 - A, 4)}°` },
            { label: "Area", value: formatNumber(0.5 * a * b, 10) },
          ],
          formula: "c = √(a²+b²)",
          copyText: `c=${formatNumber(c, 10)}`,
        };
      }
      if (v.mode === "ac") {
        const a = parseNumber(v.a, "a", { allowZero: false, allowNegative: false });
        const c = parseNumber(v.b, "c", { allowZero: false, allowNegative: false });
        if (c <= a) throw new Error("Hypotenuse must be longer than leg a.");
        const b = Math.sqrt(c * c - a * a);
        return {
          primaryLabel: "Leg b",
          primary: formatNumber(b, 10),
          breakdown: [{ label: "Area", value: formatNumber(0.5 * a * b, 10) }],
          copyText: `b=${formatNumber(b, 10)}`,
        };
      }
      const a = parseNumber(v.a, "leg a", { allowZero: false, allowNegative: false });
      const A = parseNumber(v.b, "angle A", { min: 0.01, max: 89.99 });
      const c = a / Math.sin(degToRad(A));
      const b = a / Math.tan(degToRad(A));
      return {
        primaryLabel: "Hypotenuse",
        primary: formatNumber(c, 10),
        breakdown: [
          { label: "Leg b", value: formatNumber(b, 10) },
          { label: "Angle B", value: `${formatFixed(90 - A, 4)}°` },
        ],
        copyText: `c=${formatNumber(c, 10)}`,
      };
    },
  }),
];

function percentFieldLike(id: string, label: string, defaultValue: string) {
  return numberField(id, label, defaultValue, { min: "0", step: "0.01", inputMode: "decimal" });
}

function degToRad(d: number) {
  return (d * Math.PI) / 180;
}
function radToDeg(r: number) {
  return (r * 180) / Math.PI;
}

mathCatalog.forEach((spec) => {
  if (spec.slug === "permutation-and-combination-calculator") {
    spec.relatedToolIds = ["probability-calculator", "statistics-calculator", "factor-calculator"];
  }
  if (spec.slug === "volume-calculator") {
    spec.relatedToolIds = ["surface-area-calculator", "area-calculator", "circle-calculator"];
  }
});
