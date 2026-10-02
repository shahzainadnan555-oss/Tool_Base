/**
 * Unit smoke test for codec-aware remux decisions (no browser / ffmpeg required).
 */
const assert = require("assert");

function normalizeCodecName(raw) {
  const c = String(raw).toLowerCase().replace(/[^a-z0-9.+]/g, "");
  if (c.includes("h264") || c.includes("avc1") || c === "avc") return "h264";
  if (c.includes("h265") || c.includes("hevc") || c.includes("hvc1")) return "hevc";
  if (c.includes("vp9") || c.includes("vp09")) return "vp9";
  if (c.includes("vp8") || c.includes("vp08")) return "vp8";
  if (c.includes("av1") || c.includes("av01")) return "av1";
  if (c.includes("mpeg4") || c.includes("mp4v") || c === "xvid" || c === "divx") {
    return "mpeg4";
  }
  if (c.includes("aac") || c.includes("mp4a")) return "aac";
  if (c.includes("mp3") || c.includes("libmp3") || c === "mpga") return "mp3";
  if (c.includes("opus")) return "opus";
  if (c.includes("ac3") || c.includes("eac3")) return "ac3";
  return c.split(/[,(\s]/)[0] || c;
}

function parseFfmpegProbeLogs(logText) {
  const result = { hasVideo: false, hasAudio: false };
  const streamRegex =
    /Stream #\d+:\d+(?:\([^)]*\))?: (Video|Audio):\s*([^\s,]+)/gi;
  let match;
  while ((match = streamRegex.exec(logText)) !== null) {
    const kind = match[1].toLowerCase();
    const codec = normalizeCodecName(match[2]);
    if (kind === "video") {
      result.hasVideo = true;
      if (!result.videoCodec) result.videoCodec = codec;
    } else if (kind === "audio") {
      result.hasAudio = true;
      if (!result.audioCodec) result.audioCodec = codec;
    }
  }
  const videoLine = logText.match(
    /Stream #\d+:\d+(?:\([^)]*\))?: Video:[^\n]+/i,
  )?.[0];
  if (videoLine) {
    const dim = videoLine.match(/,\s*(\d{2,5})x(\d{2,5})(?:\s*[,\[])/);
    if (dim) {
      result.width = Number(dim[1]) || undefined;
      result.height = Number(dim[2]) || undefined;
    }
  }
  return result;
}

const MP4_VIDEO_COPY = new Set(["h264", "mpeg4"]);
const MP4_AUDIO_COPY = new Set(["aac", "mp3"]);

function canFullyRemuxToMp4(probe) {
  if (!probe.hasVideo || !probe.videoCodec) return false;
  if (!MP4_VIDEO_COPY.has(probe.videoCodec)) return false;
  if (!probe.hasAudio) return true;
  if (!probe.audioCodec) return false;
  return MP4_AUDIO_COPY.has(probe.audioCodec);
}

function canCopyVideoToMp4(probe) {
  return Boolean(probe.videoCodec && MP4_VIDEO_COPY.has(probe.videoCodec));
}

function canCopyAudioToMp4(probe) {
  if (!probe.hasAudio) return true;
  return Boolean(probe.audioCodec && MP4_AUDIO_COPY.has(probe.audioCodec));
}

assert.strictEqual(normalizeCodecName("h264 (High)"), "h264");
assert.strictEqual(normalizeCodecName("aac (LC)"), "aac");
assert.strictEqual(normalizeCodecName("vp9"), "vp9");

const remuxProbe = parseFfmpegProbeLogs(`
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'input.mov':
  Duration: 00:00:05.00, start: 0.000000, bitrate: 1200 kb/s
  Stream #0:0(und): Video: h264 (High) (avc1 / 0x31637661), yuv420p, 1280x720, 1000 kb/s, 30 fps
  Stream #0:1(und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 128 kb/s
`);
assert.strictEqual(remuxProbe.videoCodec, "h264");
assert.strictEqual(remuxProbe.audioCodec, "aac");
assert.strictEqual(remuxProbe.width, 1280);
assert.strictEqual(remuxProbe.height, 720);
assert.ok(canFullyRemuxToMp4(remuxProbe));

const webmProbe = parseFfmpegProbeLogs(`
Input #0, matroska,webm, from 'input.webm':
  Stream #0:0: Video: vp8, yuv420p, 640x360, 30 fps
  Stream #0:1: Audio: opus, 48000 Hz, stereo
`);
assert.strictEqual(webmProbe.videoCodec, "vp8");
assert.strictEqual(webmProbe.audioCodec, "opus");
assert.ok(!canFullyRemuxToMp4(webmProbe));
assert.ok(!canCopyVideoToMp4(webmProbe));
assert.ok(!canCopyAudioToMp4(webmProbe));

const videoOnly = parseFfmpegProbeLogs(`
Stream #0:0: Video: h264 (Main), yuv420p, 1920x1080, 24 fps
`);
assert.ok(canFullyRemuxToMp4(videoOnly));

const partial = parseFfmpegProbeLogs(`
Stream #0:0: Video: h264, yuv420p, 720x480, 25 fps
Stream #0:1: Audio: ac3, 48000 Hz, stereo
`);
assert.ok(!canFullyRemuxToMp4(partial));
assert.ok(canCopyVideoToMp4(partial));
assert.ok(!canCopyAudioToMp4(partial));

console.log("smoke-video-probe: ok");
