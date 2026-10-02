const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const destDir = path.join(root, "public", "ffmpeg");

const copies = [
  ["node_modules/@ffmpeg/ffmpeg/dist/esm/worker.js", "worker.js"],
  ["node_modules/@ffmpeg/ffmpeg/dist/esm/const.js", "const.js"],
  ["node_modules/@ffmpeg/ffmpeg/dist/esm/errors.js", "errors.js"],
  ["node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js", "ffmpeg-core.js"],
  ["node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm", "ffmpeg-core.wasm"],
];

fs.mkdirSync(destDir, { recursive: true });
for (const [fromRel, name] of copies) {
  const from = path.join(root, fromRel);
  const to = path.join(destDir, name);
  if (!fs.existsSync(from)) {
    console.warn(`[copy-ffmpeg-assets] Missing source: ${from}`);
    continue;
  }
  fs.copyFileSync(from, to);
}
console.log("[copy-ffmpeg-assets] Copied ffmpeg assets to public/ffmpeg");
