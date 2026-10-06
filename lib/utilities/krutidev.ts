/** Original Tool Base KrutiDev 010-style mapping for everyday Devanagari text. */
const UNICODE_TO_KRUTI: Array<[string, string]> = [
  ["क्ष", "If"], ["त्र", "=k"], ["ज्ञ", "K"], ["श्र", "Zz"],
  ["क़", "q"], ["ख़", "Q"], ["ग़", "x"], ["ज़", "tZ"], ["ड़", "M+"], ["ढ़", "<+"], ["फ़", "Q+"], ["य़", ""] ,
  ["आ", "vk"], ["इ", "b"], ["ई", "bZ"], ["उ", "m"], ["ऊ", "Å"], ["ऋ", "_"],
  ["ए", ","], ["ऐ", "a"], ["ओ", "vks"], ["औ", "vkS"], ["अं", "va"], ["अः", "v%"], ["अ", "v"],
  ["क", "d"], ["ख", "[k"], ["ग", "x"], ["घ", "?k"], ["ङ", "³"],
  ["च", "p"], ["छ", "N"], ["ज", "t"], ["झ", ">;"], ["ञ", "´"],
  ["ट", "V"], ["ठ", "B"], ["ड", "M"], ["ढ", "<"], ["ण", ".k"],
  ["त", "r"], ["थ", "Fk"], ["द", "n"], ["ध", "/k"], ["न", "u"],
  ["प", "i"], ["फ", "Q"], ["ब", "c"], ["भ", "Hk"], ["म", "e"],
  ["य", ";"], ["र", "j"], ["ल", "y"], ["व", "o"], ["श", "'k"], ["ष", "\"k"], ["स", "l"], ["ह", "g"],
  ["ा", "k"], ["ि", "f"], ["ी", "h"], ["ु", "q"], ["ू", "w"], ["ृ", "`"],
  ["े", "s"], ["ै", "S"], ["ो", "ks"], ["ौ", "kS"], ["्", "~"], ["ं", "a"], ["ः", "%"], ["ँ", "¡"],
  ["०", "0"], ["१", "1"], ["२", "2"], ["३", "3"], ["४", "4"], ["५", "5"], ["६", "6"], ["७", "7"], ["८", "8"], ["९", "9"],
  ["।", "A"], ["॥", "AA"],
];

function applyPairs(input: string, pairs: Array<[string, string]>): string {
  let out = input;
  for (const [from, to] of pairs) {
    if (!from) continue;
    out = out.split(from).join(to);
  }
  return out;
}

export function unicodeToKrutidev(input: string): string {
  if (!input.trim()) throw new Error("Please enter Devanagari (Unicode) text.");
  return applyPairs(input, UNICODE_TO_KRUTI);
}

export function krutidevToUnicode(input: string): string {
  if (!input.trim()) throw new Error("Please enter KrutiDev-encoded text.");
  const reversed = [...UNICODE_TO_KRUTI]
    .filter(([, to]) => to)
    .sort((a, b) => b[1].length - a[1].length);
  return applyPairs(input, reversed.map(([u, k]) => [k, u]));
}
