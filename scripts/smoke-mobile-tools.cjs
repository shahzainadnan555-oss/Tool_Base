/* eslint-disable no-console */
/**
 * Static mobile-readiness smoke matrix for all Tool Base tool routes.
 * Run: node scripts/smoke-mobile-tools.cjs
 *
 * Inventory matches scripts/validate-registry.cjs (331 tools).
 * Does not drive a real browser (no Playwright in this repo).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const TOOL_FILES = [
  "lib/tools/image-converter-tools.ts",
  "lib/tools/image-editor-tools.ts",
  "lib/tools/pdf-tools.ts",
  "lib/tools/document-data-tools.ts",
  "lib/tools/audio-tools.ts",
  "lib/tools/video-tools.ts",
  "lib/tools/text-tools.ts",
  "lib/tools/developer-tools.ts",
  "lib/tools/security-tools.ts",
  "lib/tools/calculator-tools.ts",
  "lib/tools/specialized-calculator-tools.ts",
  "lib/tools/generator-tools.ts",
  "lib/tools/content-generator-tools.ts",
  "lib/tools/typing-tools.ts",
  "lib/tools/expansion-tools.ts",
  "lib/tools/category-pack-tools.ts",
];

function extractToolBlocks(src) {
  const tools = [];
  const re = /(?:tool|base)\(\{([\s\S]*?)\n\s*\}\)/g;
  let match;
  while ((match = re.exec(src))) tools.push(match[1]);
  return tools;
}

function field(block, key) {
  const m = block.match(new RegExp(`${key}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
  return m ? m[1] : null;
}

const list = [];
for (const file of TOOL_FILES) {
  const src = fs.readFileSync(path.join(ROOT, file), "utf8");
  for (const block of extractToolBlocks(src)) {
    const slug = field(block, "slug") || field(block, "id");
    const name = field(block, "name") || slug;
    const category = field(block, "category") || path.basename(file, ".ts");
    if (slug) list.push({ slug, name, category });
  }
}

const pageExists = () =>
  fs.existsSync(path.join(ROOT, "app/tools/[slug]/page.tsx"));

const checks = {
  themeVariant: fs
    .readFileSync(path.join(ROOT, "app/globals.css"), "utf8")
    .includes("@custom-variant dark"),
  themeSwitchInMobileNav: fs
    .readFileSync(path.join(ROOT, "components/layout/MobileNav.tsx"), "utf8")
    .includes('variant="switch"'),
  typingMobileInput: fs
    .readFileSync(
      path.join(ROOT, "components/typing/TypingSpeedTestWorkspace.tsx"),
      "utf8",
    )
    .includes("inputMode"),
  cropTouchNone: fs
    .readFileSync(
      path.join(ROOT, "components/image-editor/ImageCropperControl.tsx"),
      "utf8",
    )
    .includes("touch-none"),
  signaturePointer: fs
    .readFileSync(
      path.join(ROOT, "components/utilities/UtilityWorkspace.tsx"),
      "utf8",
    )
    .includes("onPointerCancel"),
  dropzoneMobileHint: fs
    .readFileSync(path.join(ROOT, "app/globals.css"), "utf8")
    .includes("tm-dropzone-mobile-hint"),
  mousePointerEvents: fs
    .readFileSync(path.join(ROOT, "components/pack/UtilityPanels.tsx"), "utf8")
    .includes("onPointerMove"),
};

console.log("TOTAL_TOOLS_FOUND:", list.length);
console.log("DYNAMIC_TOOL_ROUTE:", pageExists());
console.log("MOBILE_CHECKS:");
for (const [key, ok] of Object.entries(checks)) {
  console.log(`  ${ok ? "PASS" : "FAIL"} ${key}`);
}

const byCat = {};
for (const tool of list) {
  byCat[tool.category] = (byCat[tool.category] || 0) + 1;
}
console.log("BY_CATEGORY:");
for (const [cat, count] of Object.entries(byCat).sort()) {
  console.log(`  ${cat}: ${count}`);
}

const failed = Object.values(checks).some((v) => !v) || list.length !== 331;
if (list.length !== 331) {
  console.error(`Expected 331 tools, found ${list.length}`);
}
process.exit(failed ? 1 : 0);
