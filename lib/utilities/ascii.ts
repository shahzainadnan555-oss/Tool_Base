export function textToAscii(input: string): string {
  if (!input) throw new Error("Please enter text.");
  return Array.from(input)
    .map((ch) => ch.codePointAt(0) ?? 0)
    .join(" ");
}

export function asciiToText(input: string): string {
  const tokens = input.trim().split(/[\s,]+/).filter(Boolean);
  if (!tokens.length) throw new Error("Enter ASCII/Unicode code points separated by spaces.");
  return tokens
    .map((token) => {
      const n = token.toLowerCase().startsWith("0x") ? parseInt(token, 16) : Number(token);
      if (!Number.isInteger(n) || n < 0 || n > 0x10ffff) {
        throw new Error(`Invalid code point: ${token}`);
      }
      return String.fromCodePoint(n);
    })
    .join("");
}
