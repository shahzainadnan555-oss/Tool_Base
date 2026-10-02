const BELOW_20 = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
const SCALES = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion"];

function twoDigits(n: number): string {
  if (n < 20) return BELOW_20[n];
  const t = Math.floor(n / 10);
  const r = n % 10;
  return r ? `${TENS[t]}-${BELOW_20[r]}` : TENS[t];
}

function threeDigits(n: number): string {
  if (n < 100) return twoDigits(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  return r ? `${BELOW_20[h]} Hundred ${twoDigits(r)}` : `${BELOW_20[h]} Hundred`;
}

function intToWords(value: bigint): string {
  if (value === BigInt(0)) return "Zero";
  let n = value < BigInt(0) ? -value : value;
  const parts: string[] = [];
  let scale = 0;
  while (n > BigInt(0) && scale < SCALES.length) {
    const chunk = Number(n % BigInt(1000));
    if (chunk) {
      const words = threeDigits(chunk);
      parts.unshift(SCALES[scale] ? `${words} ${SCALES[scale]}` : words);
    }
    n /= BigInt(1000);
    scale += 1;
  }
  if (n > BigInt(0)) throw new Error("Number is too large for this converter.");
  const text = parts.join(" ");
  return value < BigInt(0) ? `Negative ${text}` : text;
}

export function numberToWords(input: string): string {
  const trimmed = input.trim().replace(/,/g, "");
  if (!trimmed) throw new Error("Please enter a number.");
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
    throw new Error("Please enter a valid number.");
  }

  const negative = trimmed.startsWith("-");
  const [intPart, fracPart] = (negative ? trimmed.slice(1) : trimmed).split(".");
  if (intPart.length > 18) {
    throw new Error("Integer part is too large (max 18 digits).");
  }
  let words = intToWords(BigInt(intPart || "0"));
  if (negative && intPart !== "0") words = `Negative ${words.replace(/^Negative /, "")}`;

  if (fracPart != null && fracPart.length) {
    const digits = fracPart.split("").map((d) => BELOW_20[Number(d)]).join(" ");
    words = `${words} Point ${digits}`;
  }
  return words;
}
