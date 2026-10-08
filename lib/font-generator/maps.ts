/** Build A–Z / a–z / 0–9 maps from Unicode Mathematical Alphanumeric Symbols. */
export function buildAlphaMap(options: {
  upperStart: number;
  lowerStart: number;
  digitStart?: number;
  skipUpper?: Partial<Record<string, number>>;
  skipLower?: Partial<Record<string, number>>;
}): Record<string, string> {
  const map: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    const U = String.fromCharCode(65 + i);
    const L = String.fromCharCode(97 + i);
    const upperCp = options.skipUpper?.[U] ?? options.upperStart + i;
    const lowerCp = options.skipLower?.[L] ?? options.lowerStart + i;
    if (upperCp > 0) map[U] = String.fromCodePoint(upperCp);
    if (lowerCp > 0) map[L] = String.fromCodePoint(lowerCp);
  }
  if (options.digitStart != null) {
    for (let i = 0; i < 10; i++) {
      map[String(i)] = String.fromCodePoint(options.digitStart + i);
    }
  }
  return map;
}

export function applyMap(char: string, map: Record<string, string>): string {
  return map[char] ?? char;
}

export function wrapEachLine(input: string, wrap: (line: string) => string): string {
  return input.split("\n").map(wrap).join("\n");
}

export function reverseLines(input: string): string {
  return input
    .split("\n")
    .map((line) => Array.from(line).reverse().join(""))
    .join("\n");
}

export const UPSIDE_DOWN: Record<string, string> = {
  a: "\u0250",
  b: "q",
  c: "\u0254",
  d: "p",
  e: "\u01dd",
  f: "\u025f",
  g: "\u0183",
  h: "\u0265",
  i: "\u1d09",
  j: "\u027e",
  k: "\u029e",
  l: "l",
  m: "\u026f",
  n: "u",
  o: "o",
  p: "d",
  q: "b",
  r: "\u0279",
  s: "s",
  t: "\u0287",
  u: "n",
  v: "\u028c",
  w: "\u028d",
  x: "x",
  y: "\u028e",
  z: "z",
  A: "\u2200",
  B: "\ua4ed",
  C: "\u0186",
  D: "\u25d6",
  E: "\u018e",
  F: "\u2132",
  G: "\u2141",
  H: "H",
  I: "I",
  J: "\u017f",
  K: "\u029e",
  L: "\u02e5",
  M: "W",
  N: "N",
  O: "O",
  P: "\u0500",
  Q: "\u038c",
  R: "\u1d1a",
  S: "S",
  T: "\u22a5",
  U: "\u2229",
  V: "\u039b",
  W: "M",
  X: "X",
  Y: "\u2144",
  Z: "Z",
  "0": "0",
  "1": "\u0196",
  "2": "\u1101",
  "3": "\u0190",
  "4": "\u3123",
  "5": "\u03db",
  "6": "9",
  "7": "\u3125",
  "8": "8",
  "9": "6",
  ".": "\u02d9",
  ",": "'",
  "'": ",",
  '"': "\u201e",
  "?": "\u00bf",
  "!": "\u00a1",
  "(": ")",
  ")": "(",
  "[": "]",
  "]": "[",
  "{": "}",
  "}": "{",
  "<": ">",
  ">": "<",
  "&": "\u214b",
  _: "\u203e",
};

export const SMALL_CAPS: Record<string, string> = {
  a: "\u1d00",
  b: "\u0299",
  c: "\u1d04",
  d: "\u1d05",
  e: "\u1d07",
  f: "\u0493",
  g: "\u0262",
  h: "\u029c",
  i: "\u026a",
  j: "\u1d0a",
  k: "\u1d0b",
  l: "\u029f",
  m: "\u1d0d",
  n: "\u0274",
  o: "\u1d0f",
  p: "\u1d18",
  q: "\u01eb",
  r: "\u0280",
  s: "\ua731",
  t: "\u1d1b",
  u: "\u1d1c",
  v: "\u1d20",
  w: "\u1d21",
  x: "x",
  y: "\u028f",
  z: "\u1d22",
};

export const SUPERSCRIPT: Record<string, string> = {
  "0": "\u2070",
  "1": "\u00b9",
  "2": "\u00b2",
  "3": "\u00b3",
  "4": "\u2074",
  "5": "\u2075",
  "6": "\u2076",
  "7": "\u2077",
  "8": "\u2078",
  "9": "\u2079",
  a: "\u1d43",
  b: "\u1d47",
  c: "\u1d9c",
  d: "\u1d48",
  e: "\u1d49",
  f: "\u1da0",
  g: "\u1d4d",
  h: "\u02b0",
  i: "\u2071",
  j: "\u02b2",
  k: "\u1d4f",
  l: "\u02e1",
  m: "\u1d50",
  n: "\u207f",
  o: "\u1d52",
  p: "\u1d56",
  r: "\u02b3",
  s: "\u02e2",
  t: "\u1d57",
  u: "\u1d58",
  v: "\u1d5b",
  w: "\u02b7",
  x: "\u02e3",
  y: "\u02b8",
  z: "\u1dbb",
  A: "\u1d2c",
  B: "\u1d2e",
  D: "\u1d30",
  E: "\u1d31",
  G: "\u1d33",
  H: "\u1d34",
  I: "\u1d35",
  J: "\u1d36",
  K: "\u1d37",
  L: "\u1d38",
  M: "\u1d39",
  N: "\u1d3a",
  O: "\u1d3c",
  P: "\u1d3e",
  R: "\u1d3f",
  T: "\u1d40",
  U: "\u1d41",
  V: "\u2c7d",
  W: "\u1d42",
  "+": "\u207a",
  "-": "\u207b",
  "=": "\u207c",
  "(": "\u207d",
  ")": "\u207e",
};

export const SUBSCRIPT: Record<string, string> = {
  "0": "\u2080",
  "1": "\u2081",
  "2": "\u2082",
  "3": "\u2083",
  "4": "\u2084",
  "5": "\u2085",
  "6": "\u2086",
  "7": "\u2087",
  "8": "\u2088",
  "9": "\u2089",
  a: "\u2090",
  e: "\u2091",
  h: "\u2095",
  i: "\u1d62",
  j: "\u2c7c",
  k: "\u2096",
  l: "\u2097",
  m: "\u2098",
  n: "\u2099",
  o: "\u2092",
  p: "\u209a",
  r: "\u1d63",
  s: "\u209b",
  t: "\u209c",
  u: "\u1d64",
  v: "\u1d65",
  x: "\u2093",
  "+": "\u208a",
  "-": "\u208b",
  "=": "\u208c",
  "(": "\u208d",
  ")": "\u208e",
};

export const PARENTHESIZED: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    const lower = String.fromCodePoint(0x249c + i);
    map[String.fromCharCode(97 + i)] = lower;
    map[String.fromCharCode(65 + i)] = lower;
  }
  for (let i = 1; i <= 20; i++) {
    map[String(i)] = String.fromCodePoint(0x2474 + (i - 1));
  }
  map["0"] = "\u24ea";
  return map;
})();
