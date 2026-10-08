/**
 * Split text into grapheme clusters when Intl.Segmenter is available.
 * Falls back to code-point iteration (safer than UTF-16 code units).
 */
export function segmentGraphemes(input: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    try {
      const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
      return [...segmenter.segment(input)].map((part) => part.segment);
    } catch {
      // Fall through.
    }
  }
  return Array.from(input);
}

export function mapGraphemes(
  input: string,
  mapOne: (grapheme: string) => string,
): string {
  return segmentGraphemes(input)
    .map((g) => {
      if (g === "\n" || g === "\r") return g;
      return mapOne(g);
    })
    .join("");
}
