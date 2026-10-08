import type { FontStyleDefinition } from "./types";
import {
  PARENTHESIZED,
  SMALL_CAPS,
  SUBSCRIPT,
  SUPERSCRIPT,
  UPSIDE_DOWN,
  applyMap,
  buildAlphaMap,
  reverseLines,
  wrapEachLine,
} from "./maps";
import { mapGraphemes } from "./segment";

function mapped(map: Record<string, string>): (input: string) => string {
  return (input) => mapGraphemes(input, (g) => (g.length === 1 ? applyMap(g, map) : g));
}

function combining(mark: string): (input: string) => string {
  return (input) =>
    mapGraphemes(input, (g) => {
      if (g === " " || g === "\t") return g;
      return g + mark;
    });
}

function decorate(prefix: string, suffix: string): (input: string) => string {
  return (input) =>
    wrapEachLine(input, (line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;
      return `${prefix}${trimmed}${suffix}`;
    });
}

function sandwich(left: string, right: string): (input: string) => string {
  return (input) =>
    mapGraphemes(input, (g) => {
      if (g === " " || g === "\t") return g;
      return `${left}${g}${right}`;
    });
}

const MATH = {
  bold: buildAlphaMap({ upperStart: 0x1d400, lowerStart: 0x1d41a, digitStart: 0x1d7ce }),
  italic: buildAlphaMap({
    upperStart: 0x1d434,
    lowerStart: 0x1d44e,
    skipLower: { h: 0x210e },
  }),
  boldItalic: buildAlphaMap({ upperStart: 0x1d468, lowerStart: 0x1d482 }),
  script: buildAlphaMap({
    upperStart: 0x1d49c,
    lowerStart: 0x1d4b6,
    skipUpper: {
      B: 0x212c,
      E: 0x2130,
      F: 0x2131,
      H: 0x210b,
      I: 0x2110,
      L: 0x2112,
      M: 0x2133,
      R: 0x211b,
    },
    skipLower: { e: 0x212f, g: 0x210a, o: 0x2134 },
  }),
  boldScript: buildAlphaMap({ upperStart: 0x1d4d0, lowerStart: 0x1d4ea }),
  fraktur: buildAlphaMap({
    upperStart: 0x1d504,
    lowerStart: 0x1d51e,
    skipUpper: { C: 0x212d, H: 0x210c, I: 0x2111, R: 0x211c, Z: 0x2128 },
  }),
  boldFraktur: buildAlphaMap({ upperStart: 0x1d56c, lowerStart: 0x1d586 }),
  doubleStruck: buildAlphaMap({
    upperStart: 0x1d538,
    lowerStart: 0x1d552,
    digitStart: 0x1d7d8,
    skipUpper: {
      C: 0x2102,
      H: 0x210d,
      N: 0x2115,
      P: 0x2119,
      Q: 0x211a,
      R: 0x211d,
      Z: 0x2124,
    },
  }),
  sans: buildAlphaMap({ upperStart: 0x1d5a0, lowerStart: 0x1d5ba, digitStart: 0x1d7e2 }),
  sansBold: buildAlphaMap({ upperStart: 0x1d5d4, lowerStart: 0x1d5ee, digitStart: 0x1d7ec }),
  sansItalic: buildAlphaMap({ upperStart: 0x1d608, lowerStart: 0x1d622 }),
  sansBoldItalic: buildAlphaMap({ upperStart: 0x1d63c, lowerStart: 0x1d656 }),
  mono: buildAlphaMap({ upperStart: 0x1d670, lowerStart: 0x1d68a, digitStart: 0x1d7f6 }),
};

const CIRCLED: Record<string, string> = {};
for (let i = 0; i < 26; i++) {
  CIRCLED[String.fromCharCode(65 + i)] = String.fromCodePoint(0x24b6 + i);
  CIRCLED[String.fromCharCode(97 + i)] = String.fromCodePoint(0x24d0 + i);
}
for (let i = 0; i < 10; i++) {
  CIRCLED[String(i)] = String.fromCodePoint(i === 0 ? 0x24ea : 0x2460 + i - 1);
}

const NEG_CIRCLED: Record<string, string> = {};
for (let i = 0; i < 26; i++) {
  NEG_CIRCLED[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1f150 + i);
  NEG_CIRCLED[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1f150 + i);
}

const SQUARED: Record<string, string> = {};
for (let i = 0; i < 26; i++) {
  SQUARED[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1f130 + i);
  SQUARED[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1f130 + i);
}

const NEG_SQUARED: Record<string, string> = {};
for (let i = 0; i < 26; i++) {
  NEG_SQUARED[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1f170 + i);
  NEG_SQUARED[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1f170 + i);
}

const FULLWIDTH: Record<string, string> = {};
for (let i = 33; i <= 126; i++) {
  FULLWIDTH[String.fromCharCode(i)] = String.fromCodePoint(0xff01 + (i - 33));
}

const BUBBLE = { ...CIRCLED };
const REGIONAL: Record<string, string> = {};
for (let i = 0; i < 26; i++) {
  const flag = String.fromCodePoint(0x1f1e6 + i);
  REGIONAL[String.fromCharCode(65 + i)] = flag;
  REGIONAL[String.fromCharCode(97 + i)] = flag;
}

function style(
  id: string,
  name: string,
  category: FontStyleDefinition["category"],
  keywords: string[],
  transform: (input: string) => string,
): FontStyleDefinition {
  return { id, name, category, keywords, transform };
}

export const fontStyles: FontStyleDefinition[] = [
  style("bold", "Bold", "bold", ["bold", "strong"], mapped(MATH.bold)),
  style("italic", "Italic", "italic", ["italic", "slant"], mapped(MATH.italic)),
  style("bold-italic", "Bold Italic", "bold", ["bold", "italic"], mapped(MATH.boldItalic)),
  style("sans", "Sans Serif", "sans", ["sans", "clean"], mapped(MATH.sans)),
  style("sans-bold", "Sans Bold", "sans", ["sans", "bold"], mapped(MATH.sansBold)),
  style("sans-italic", "Sans Italic", "sans", ["sans", "italic"], mapped(MATH.sansItalic)),
  style("sans-bold-italic", "Sans Bold Italic", "sans", ["sans", "bold", "italic"], mapped(MATH.sansBoldItalic)),
  style("monospace", "Monospace", "monospace", ["mono", "code", "typewriter"], mapped(MATH.mono)),
  style("double-struck", "Double Struck", "math", ["double", "blackboard", "math"], mapped(MATH.doubleStruck)),
  style("fraktur", "Fraktur", "fraktur", ["fraktur", "gothic"], mapped(MATH.fraktur)),
  style("bold-fraktur", "Bold Fraktur", "fraktur", ["fraktur", "bold", "gothic"], mapped(MATH.boldFraktur)),
  style("old-english", "Old English", "old-english", ["old english", "blackletter"], mapped(MATH.fraktur)),
  style("script", "Script", "script", ["script", "handwriting"], mapped(MATH.script)),
  style("bold-script", "Bold Script", "script", ["script", "bold", "cursive"], mapped(MATH.boldScript)),
  style("cursive", "Cursive", "cursive", ["cursive", "script"], mapped(MATH.script)),
  style("cursive-bold", "Cursive Bold", "cursive", ["cursive", "bold"], mapped(MATH.boldScript)),
  style("small-caps", "Small Caps", "smallcaps", ["small caps", "petite"], mapped(SMALL_CAPS)),
  style("fullwidth", "Fullwidth", "aesthetic", ["fullwidth", "wide", "vaporwave"], mapped(FULLWIDTH)),
  style("circled", "Circled", "circle", ["circle", "bubble", "enclosed"], mapped(CIRCLED)),
  style("negative-circled", "Black Circle", "circle", ["circle", "black", "filled"], mapped(NEG_CIRCLED)),
  style("squared", "Squared", "square", ["square", "boxed"], mapped(SQUARED)),
  style("negative-squared", "Black Square", "square", ["square", "black"], mapped(NEG_SQUARED)),
  style("bubble", "Bubble", "bubble", ["bubble", "circle"], mapped(BUBBLE)),
  style("parenthesized", "Parenthesized", "circle", ["paren", "brackets"], mapped(PARENTHESIZED)),
  style("superscript", "Superscript", "special", ["super", "tiny up"], mapped(SUPERSCRIPT)),
  style("subscript", "Subscript", "special", ["sub", "tiny down"], mapped(SUBSCRIPT)),
  style("underline", "Underline", "underline", ["underline", "underscore"], combining("\u0332")),
  style("double-underline", "Double Underline", "underline", ["double underline"], combining("\u0333")),
  style("strikethrough", "Strikethrough", "strikethrough", ["strike", "cross out"], combining("\u0336")),
  style("slash-through", "Slash Through", "strikethrough", ["slash", "stroke"], combining("\u0338")),
  style("overline", "Overline", "underline", ["overline", "bar"], combining("\u0305")),
  style("tilde-below", "Tilde Below", "decorative", ["tilde"], combining("\u0330")),
  style("dot-below", "Dot Below", "decorative", ["dot"], combining("\u0323")),
  style("diaeresis-below", "Diaeresis Below", "decorative", ["dots"], combining("\u0324")),
  style("ring-above", "Ring Above", "decorative", ["ring"], combining("\u030a")),
  style("caron", "Caron Accent", "decorative", ["caron", "hacek"], combining("\u030c")),
  style("upside-down", "Upside Down", "upside-down", ["upside down", "flip"], (input) => {
    const flipped = mapGraphemes(input, (g) => applyMap(g, UPSIDE_DOWN));
    return reverseLines(flipped);
  }),
  style("reversed", "Reversed", "mirror", ["reverse", "backwards"], reverseLines),
  style("mirror", "Mirror", "mirror", ["mirror"], (input) =>
    reverseLines(mapGraphemes(input, (g) => applyMap(g, UPSIDE_DOWN))),
  ),
  style("spaced", "Wide Spaced", "minimal", ["space", "spread"], (input) =>
    wrapEachLine(input, (line) =>
      mapGraphemes(line, (g) => g)
        .split("")
        .join(" ")
        .replace(/ +/g, " ")
        .trim(),
    ),
  ),
  style("double-spaced", "Double Spaced", "minimal", ["space"], (input) =>
    wrapEachLine(input, (line) => Array.from(line).join("  ")),
  ),
  style("uppercase", "Uppercase", "minimal", ["upper", "caps"], (input) => input.toLocaleUpperCase()),
  style("lowercase", "Lowercase", "minimal", ["lower"], (input) => input.toLocaleLowerCase()),
  style("title-case", "Title Case", "minimal", ["title"], (input) =>
    input.replace(/\w\S*/g, (w) => w.charAt(0).toLocaleUpperCase() + w.slice(1).toLocaleLowerCase()),
  ),
  style("alternating-case", "Alternating Case", "minimal", ["alternating", "sponge"], (input) => {
    let i = 0;
    return mapGraphemes(input, (g) => {
      if (!/[a-zA-Z]/.test(g)) return g;
      const out = i % 2 === 0 ? g.toLocaleUpperCase() : g.toLocaleLowerCase();
      i += 1;
      return out;
    });
  }),
  style("inverse-case", "Inverse Case", "minimal", ["swap case"], (input) =>
    mapGraphemes(input, (g) => {
      if (g.toLocaleUpperCase() !== g.toLocaleLowerCase()) {
        return g === g.toLocaleUpperCase() ? g.toLocaleLowerCase() : g.toLocaleUpperCase();
      }
      return g;
    }),
  ),
  style("stars", "Star Wrapped", "decorative", ["star", "sparkle"], decorate("\u2605 ", " \u2605")),
  style("hearts", "Heart Wrapped", "decorative", ["heart", "love"], decorate("\u2665 ", " \u2665")),
  style("flowers", "Flower Wrapped", "decorative", ["flower"], decorate("\u273f ", " \u273f")),
  style("arrows", "Arrow Wrapped", "decorative", ["arrow"], decorate("\u27a4 ", " \u27a4")),
  style("sparkles", "Sparkle Wrapped", "decorative", ["sparkle"], decorate("\u2728 ", " \u2728")),
  style("music", "Music Wrapped", "decorative", ["music"], decorate("\u266a ", " \u266b")),
  style("fire", "Fire Wrapped", "aesthetic", ["fire", "hot"], decorate("\ud83d\udd25 ", " \ud83d\udd25")),
  style("wave", "Wave Aesthetic", "aesthetic", ["wave", "tilde"], decorate("\u3030 ", " \u3030")),
  style("brackets-angle", "Angle Brackets", "symbols", ["brackets"], decorate("\u3008", "\u3009")),
  style("brackets-corner", "Corner Brackets", "symbols", ["brackets"], decorate("\u300c", "\u300d")),
  style("brackets-lenticular", "Lenticular Brackets", "symbols", ["brackets"], decorate("\u3010", "\u3011")),
  style("brackets-tortoise", "Tortoise Brackets", "symbols", ["brackets"], decorate("\u3014", "\u3015")),
  style("slash-sides", "Slash Sides", "symbols", ["slash"], decorate("/", "/")),
  style("pipe-sides", "Pipe Sides", "symbols", ["pipe"], decorate("|", "|")),
  style("tilde-sides", "Tilde Sides", "symbols", ["tilde"], decorate("~", "~")),
  style("equals-sides", "Equals Sides", "symbols", ["equals"], decorate("=== ", " ===")),
  style("bullet-sides", "Bullet Sides", "symbols", ["bullet"], decorate("\u2022 ", " \u2022")),
  style("diamond-sides", "Diamond Sides", "decorative", ["diamond"], decorate("\u25c6 ", " \u25c6")),
  style("triangle-sides", "Triangle Sides", "decorative", ["triangle"], decorate("\u25b2 ", " \u25b2")),
  style("square-sides", "Square Sides", "decorative", ["square"], decorate("\u25a0 ", " \u25a0")),
  style("circle-sides", "Circle Sides", "decorative", ["circle"], decorate("\u25cf ", " \u25cf")),
  style("clap", "Clap Separated", "aesthetic", ["clap"], (input) =>
    wrapEachLine(input, (line) =>
      line
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .join(" \ud83d\udc4f "),
    ),
  ),
  style("emoji-dots", "Emoji Dot Separated", "aesthetic", ["dot"], (input) =>
    wrapEachLine(input, (line) => Array.from(line.replace(/\s+/g, "")).join(" \u00b7 ") || line),
  ),
  style("vaporwave", "Vaporwave", "aesthetic", ["vaporwave", "aesthetic", "fullwidth"], (input) =>
    mapped(FULLWIDTH)(input),
  ),
  style("aesthetic-spaces", "Aesthetic Spaces", "aesthetic", ["aesthetic", "spaces"], (input) =>
    wrapEachLine(input, (line) => Array.from(line).join("\u2009")),
  ),
  style("slashy", "Slash Letters", "special", ["slash"], sandwich("", "\u0338")),
  style("cross-above", "Cross Above", "decorative", ["cross"], combining("\u033d")),
  style("zigzag", "Zigzag Underline", "underline", ["zigzag"], combining("\u035b")),
  style("seagull", "Seagull Below", "decorative", ["curve"], combining("\u033c")),
  style("bridge-below", "Bridge Below", "decorative", ["bridge"], combining("\u032a")),
  style("inverted-bridge", "Inverted Bridge", "decorative", ["bridge"], combining("\u033a")),
  style("double-overline", "Double Overline", "underline", ["overline"], combining("\u033f")),
  style("short-stroke", "Short Stroke Overlay", "strikethrough", ["stroke"], combining("\u0335")),
  style("long-stroke", "Long Stroke Overlay", "strikethrough", ["stroke"], combining("\u0336")),
  style("x-overlay", "X Overlay", "strikethrough", ["x"], combining("\u0337")),
  style("enclosing-circle", "Enclosing Circle Mark", "circle", ["circle"], combining("\u20dd")),
  style("enclosing-square", "Enclosing Square Mark", "square", ["square"], combining("\u20de")),
  style("enclosing-diamond", "Enclosing Diamond Mark", "decorative", ["diamond"], combining("\u20df")),
  style("enclosing-screen", "Enclosing Screen", "decorative", ["screen"], combining("\u20e2")),
  style("enclosing-keycap", "Enclosing Keycap", "special", ["keycap"], combining("\u20e3")),
  style("regional-flags", "Flag Letters", "special", ["flag", "regional"], mapped(REGIONAL)),
  style("bold-underline", "Bold + Underline", "bold", ["bold", "underline"], (input) =>
    combining("\u0332")(mapped(MATH.bold)(input)),
  ),
  style("italic-underline", "Italic + Underline", "italic", ["italic", "underline"], (input) =>
    combining("\u0332")(mapped(MATH.italic)(input)),
  ),
  style("sans-underline", "Sans + Underline", "sans", ["sans", "underline"], (input) =>
    combining("\u0332")(mapped(MATH.sans)(input)),
  ),
  style("script-underline", "Script + Underline", "script", ["script", "underline"], (input) =>
    combining("\u0332")(mapped(MATH.script)(input)),
  ),
  style("mono-underline", "Mono + Underline", "monospace", ["mono", "underline"], (input) =>
    combining("\u0332")(mapped(MATH.mono)(input)),
  ),
  style("bold-strike", "Bold + Strike", "bold", ["bold", "strike"], (input) =>
    combining("\u0336")(mapped(MATH.bold)(input)),
  ),
  style("double-struck-underline", "Double Struck + Underline", "math", ["double", "underline"], (input) =>
    combining("\u0332")(mapped(MATH.doubleStruck)(input)),
  ),
  style("fraktur-underline", "Fraktur + Underline", "fraktur", ["fraktur", "underline"], (input) =>
    combining("\u0332")(mapped(MATH.fraktur)(input)),
  ),
  style("smallcaps-underline", "Small Caps + Underline", "smallcaps", ["small caps", "underline"], (input) =>
    combining("\u0332")(mapped(SMALL_CAPS)(input)),
  ),
  style("fullwidth-underline", "Fullwidth + Underline", "aesthetic", ["fullwidth", "underline"], (input) =>
    combining("\u0332")(mapped(FULLWIDTH)(input)),
  ),
  style("circled-spaced", "Circled Spaced", "bubble", ["circle", "space"], (input) =>
    wrapEachLine(mapped(CIRCLED)(input), (line) => Array.from(line).join(" ")),
  ),
  style("squared-spaced", "Squared Spaced", "square", ["square", "space"], (input) =>
    wrapEachLine(mapped(SQUARED)(input), (line) => Array.from(line).join(" ")),
  ),
  style("mono-spaced-dots", "Mono Dot Separated", "monospace", ["mono", "dot"], (input) =>
    wrapEachLine(mapped(MATH.mono)(input), (line) => Array.from(line.replace(/ /g, "")).join("\u00b7") || line),
  ),
  style("bold-brackets", "Bold Brackets", "bold", ["bold", "brackets"], (input) =>
    decorate("\u3010", "\u3011")(mapped(MATH.bold)(input)),
  ),
  style("script-hearts", "Script Hearts", "cursive", ["script", "heart"], (input) =>
    decorate("\u2661 ", " \u2661")(mapped(MATH.script)(input)),
  ),
  style("sans-stars", "Sans Stars", "sans", ["sans", "star"], (input) =>
    decorate("\u2726 ", " \u2726")(mapped(MATH.sansBold)(input)),
  ),
  style("double-arrows", "Double Arrow Frame", "decorative", ["arrow"], decorate("\u21d2 ", " \u21d0")),
  style("wavy-frame", "Wavy Frame", "decorative", ["wave"], decorate("\u301c ", " \u301c")),
  style("quote-frame", "Fancy Quotes", "decorative", ["quote"], decorate("\u00ab ", " \u00bb")),
  style("guillemet-bold", "Bold Guillemets", "bold", ["quote", "bold"], (input) =>
    decorate("\u00ab", "\u00bb")(mapped(MATH.bold)(input)),
  ),
  style("tiny-caps", "Tiny Caps Mix", "smallcaps", ["tiny", "caps"], (input) =>
    mapped(SMALL_CAPS)(input.toLocaleLowerCase()),
  ),
  style("math-bold-digits", "Math Bold Digits", "math", ["digits", "bold"], mapped(MATH.bold)),
  style("mono-code", "Code Style", "monospace", ["code", "mono"], (input) =>
    decorate("`", "`")(mapped(MATH.mono)(input)),
  ),
  style("slash-frame", "Heavy Slash Frame", "symbols", ["slash"], decorate("/// ", " ///")),
  style("hash-frame", "Hash Frame", "symbols", ["hash"], decorate("## ", " ##")),
  style("plus-frame", "Plus Frame", "symbols", ["plus"], decorate("+++ ", " +++")),
  style("dot-frame", "Dot Frame", "symbols", ["dot"], decorate("\u2026 ", " \u2026")),
  style("semicolon-frame", "Semicolon Frame", "symbols", [";"], decorate("; ", " ;")),
  style("colon-frame", "Colon Frame", "symbols", ["colon"], decorate(": ", " :")),
  style("slash-bubble", "Bubble Slash Frame", "bubble", ["bubble"], (input) =>
    decorate("/ ", " /")(mapped(CIRCLED)(input)),
  ),
  style("sparkle-sans", "Sparkle Sans", "aesthetic", ["sparkle", "sans"], (input) =>
    decorate("\u2728 ", " \u2728")(mapped(MATH.sansBold)(input)),
  ),
  style("moon-frame", "Moon Frame", "aesthetic", ["moon"], decorate("\u263d ", " \u263e")),
  style("sun-frame", "Sun Frame", "aesthetic", ["sun"], decorate("\u2600 ", " \u2600")),
  style("cloud-frame", "Cloud Frame", "aesthetic", ["cloud"], decorate("\u2601 ", " \u2601")),
  style("snow-frame", "Snow Frame", "aesthetic", ["snow"], decorate("\u2744 ", " \u2744")),
  style("lightning-frame", "Lightning Frame", "aesthetic", ["lightning"], decorate("\u26a1 ", " \u26a1")),
  style("peace-frame", "Peace Frame", "decorative", ["peace"], decorate("\u262e ", " \u262e")),
  style("yinyang-frame", "Yin Yang Frame", "decorative", ["yin", "yang"], decorate("\u262f ", " \u262f")),
  style("recycle-frame", "Recycle Frame", "decorative", ["recycle"], decorate("\u267b ", " \u267b")),
  style("warning-frame", "Warning Frame", "special", ["warning"], decorate("\u26a0 ", " \u26a0")),
  style("check-frame", "Check Frame", "special", ["check"], decorate("\u2714 ", " \u2714")),
  style("cross-frame", "Cross Frame", "special", ["cross"], decorate("\u2716 ", " \u2716")),
  style("asterism", "Asterism Frame", "decorative", ["star"], decorate("\u2042 ", " \u2042")),
  style("therefore-frame", "Therefore Frame", "math", ["therefore"], decorate("\u2234 ", " \u2234")),
  style("infinity-frame", "Infinity Frame", "math", ["infinity"], decorate("\u221e ", " \u221e")),
  style("delta-frame", "Delta Frame", "math", ["delta"], decorate("\u0394 ", " \u0394")),
  style("sigma-frame", "Sigma Frame", "math", ["sigma"], decorate("\u03a3 ", " \u03a3")),
  style("omega-frame", "Omega Frame", "math", ["omega"], decorate("\u03a9 ", " \u03a9")),
  style("bold-italic-strike", "Bold Italic Strike", "bold", ["bold", "italic", "strike"], (input) =>
    combining("\u0336")(mapped(MATH.boldItalic)(input)),
  ),
  style("script-strike", "Script Strike", "script", ["script", "strike"], (input) =>
    combining("\u0336")(mapped(MATH.script)(input)),
  ),
  style("upside-sans", "Upside Sans", "upside-down", ["upside", "sans"], (input) => {
    const base = mapped(MATH.sans)(input);
    const flipped = mapGraphemes(base, (g) => applyMap(g, UPSIDE_DOWN));
    return reverseLines(flipped);
  }),
  style("keep-original", "Plain Text", "minimal", ["plain", "normal"], (input) => input),
];

export function getFontStyleById(id: string): FontStyleDefinition | undefined {
  return fontStyles.find((style) => style.id === id);
}
