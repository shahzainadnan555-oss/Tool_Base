import { reportRatioStage } from "@/lib/processing/report";
import {
  attachProgress,
  getFfmpeg,
  readOutputFile,
  safeDelete,
  writeInputFile,
} from "@/lib/audio/ffmpeg";
import type {
  VideoProcessOptions,
  VideoProcessResult,
  VideoSourceFile,
  VideoToolConfig,
} from "./types";
import {
  canCopyAudioToMp4,
  canCopyVideoToMp4,
  canFullyRemuxToMp4,
  probeWrittenInput,
  type MediaStreamProbe,
} from "./probe";
import {
  buildVideoOutputName,
  captureFrameAt,
  extensionFromName,
  formatBytes,
  formatDuration,
  probeVideoMeta,
} from "./utils";
import { friendlyVideoError } from "./validate";

function bytesToBlobPart(bytes: Uint8Array): BlobPart {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

function resultFromBytes(
  bytes: Uint8Array,
  config: VideoToolConfig,
  sourceName: string,
  extras: Partial<VideoProcessResult> = {},
): VideoProcessResult {
  const ext = config.outputExtension || "mp4";
  const mime = config.outputMime || "video/mp4";
  const blob = new Blob([bytesToBlobPart(bytes)], { type: mime });
  const previewUrl =
    mime.startsWith("video/") || mime.startsWith("audio/") || mime === "image/gif"
      ? URL.createObjectURL(blob)
      : undefined;
  return {
    blob,
    fileName: buildVideoOutputName(sourceName, config.filenameSuffix, ext),
    mimeType: mime,
    sizeBytes: blob.size,
    previewUrl,
    ...extras,
  };
}

function crfForQuality(quality?: number): string {
  const q = quality ?? 6;
  if (q <= 2) return "32";
  if (q <= 4) return "28";
  if (q <= 6) return "23";
  if (q <= 8) return "20";
  return "18";
}

function looksLikeMp4(bytes: Uint8Array): boolean {
  if (bytes.byteLength < 12) return false;
  const brand = String.fromCharCode(
    bytes[4],
    bytes[5],
    bytes[6],
    bytes[7],
  );
  return brand === "ftyp";
}

function looksLikeWebm(bytes: Uint8Array): boolean {
  return (
    bytes.byteLength > 4 &&
    bytes[0] === 0x1a &&
    bytes[1] === 0x45 &&
    bytes[2] === 0xdf &&
    bytes[3] === 0xa3
  );
}

function looksLikeGif(bytes: Uint8Array): boolean {
  if (bytes.byteLength < 6) return false;
  const header = String.fromCharCode(...bytes.slice(0, 6));
  return header === "GIF87a" || header === "GIF89a";
}

function looksLikeMp3(bytes: Uint8Array): boolean {
  if (bytes.byteLength < 3) return false;
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return true;
  return bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;
}

function looksLikeWav(bytes: Uint8Array): boolean {
  if (bytes.byteLength < 12) return false;
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const wave = String.fromCharCode(...bytes.slice(8, 12));
  return riff === "RIFF" && wave === "WAVE";
}

function assertValidOutput(bytes: Uint8Array, format: string): void {
  if (!bytes.byteLength) {
    throw new Error("The conversion produced an empty file.");
  }
  const ok =
    format === "mp4" || format === "mov"
      ? looksLikeMp4(bytes)
      : format === "webm"
        ? looksLikeWebm(bytes)
        : format === "gif"
          ? looksLikeGif(bytes)
          : format === "mp3"
            ? looksLikeMp3(bytes)
            : format === "wav"
              ? looksLikeWav(bytes)
              : true;
  if (!ok) {
    throw new Error("The conversion produced an unreadable output file.");
  }
}

async function execChecked(
  ffmpeg: Awaited<ReturnType<typeof getFfmpeg>>,
  args: string[],
): Promise<void> {
  const code = await ffmpeg.exec(args);
  if (code !== 0) {
    throw new Error("Video processing failed.");
  }
}

async function runFfmpeg(
  sources: VideoSourceFile[],
  config: VideoToolConfig,
  argsBuilder: (input: string, output: string) => string[],
  options: VideoProcessOptions,
  label: string,
  sourceName?: string,
): Promise<VideoProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a video file.");
  const ffmpeg = await getFfmpeg();
  const inputExt = extensionFromName(source.name) || "bin";
  const input = `input.${inputExt}`;
  const outExt = config.outputExtension || "mp4";
  const output = `output.${outExt}`;
  const detach = attachProgress(ffmpeg, options.onProgress, label);
  try {
    reportRatioStage(options.onProgress, "Preparing…");
    await writeInputFile(ffmpeg, source.file, input);
    await execChecked(ffmpeg, argsBuilder(input, output));
    const bytes = await readOutputFile(ffmpeg, output);
    assertValidOutput(bytes, outExt);
    return resultFromBytes(bytes, config, sourceName || source.name);
  } finally {
    detach();
    await safeDelete(ffmpeg, input);
    await safeDelete(ffmpeg, output);
  }
}

function fullMp4EncodeArgs(
  input: string,
  output: string,
  hasAudio: boolean,
  preset = "ultrafast",
): string[] {
  if (!hasAudio) {
    return [
      "-i",
      input,
      "-c:v",
      "libx264",
      "-preset",
      preset,
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-an",
      "-movflags",
      "+faststart",
      output,
    ];
  }
  return [
    "-i",
    input,
    "-c:v",
    "libx264",
    "-preset",
    preset,
    "-crf",
    "23",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    output,
  ];
}

function mp4TranscodeArgs(
  input: string,
  output: string,
  probe: MediaStreamProbe,
  preset = "ultrafast",
): string[] {
  const videoCopy = canCopyVideoToMp4(probe);
  const audioCopy = canCopyAudioToMp4(probe);

  if (videoCopy && audioCopy) {
    return ["-i", input, "-c", "copy", "-movflags", "+faststart", output];
  }
  if (videoCopy && !audioCopy) {
    return [
      "-i",
      input,
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      output,
    ];
  }
  if (!videoCopy && audioCopy && probe.hasAudio) {
    return [
      "-i",
      input,
      "-c:v",
      "libx264",
      "-preset",
      preset,
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "copy",
      "-movflags",
      "+faststart",
      output,
    ];
  }
  return fullMp4EncodeArgs(input, output, probe.hasAudio, preset);
}

export async function convertVideo(
  sources: VideoSourceFile[],
  config: VideoToolConfig,
  options: VideoProcessOptions = {},
): Promise<VideoProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a video file.");

  const format = config.ffmpegFormat || "mp4";
  const start = Math.max(0, options.startSeconds ?? 0);
  const end = options.endSeconds;
  const hasRange = end != null && Number.isFinite(end) && end > start;

  const ffmpeg = await getFfmpeg();
  const inputExt = extensionFromName(source.name) || "bin";
  const input = `input.${inputExt}`;
  const outExt = config.outputExtension || "mp4";
  const output = `output.${outExt}`;
  const detach = attachProgress(ffmpeg, options.onProgress, "Converting video…");

  try {
    reportRatioStage(options.onProgress, "Preparing…");
    await writeInputFile(ffmpeg, source.file, input);

    const finish = async () => {
      const bytes = await readOutputFile(ffmpeg, output);
      assertValidOutput(bytes, outExt);
      return resultFromBytes(bytes, config, source.name);
    };

    if (format === "mp3") {
      reportRatioStage(options.onProgress, "Extracting audio…");
      const probe = await probeWrittenInput(input);
      if (probe.audioCodec === "mp3") {
        try {
          await execChecked(ffmpeg, ["-i", input, "-vn", "-c:a", "copy", output]);
          return await finish();
        } catch {
          await safeDelete(ffmpeg, output);
        }
      }
      await execChecked(ffmpeg, [
        "-i",
        input,
        "-vn",
        "-c:a",
        "libmp3lame",
        "-b:a",
        "192k",
        output,
      ]);
      return await finish();
    }

    if (format === "wav") {
      reportRatioStage(options.onProgress, "Extracting audio…");
      await execChecked(ffmpeg, [
        "-i",
        input,
        "-vn",
        "-acodec",
        "pcm_s16le",
        output,
      ]);
      return await finish();
    }

    if (format === "gif") {
      const fps = options.gifFps ?? 10;
      const width = options.gifWidth ?? 480;
      const gifArgs: string[] = [];
      if (hasRange) {
        // Seek before decode when a range is selected — much faster on long clips.
        gifArgs.push("-ss", start.toFixed(3));
      }
      gifArgs.push("-i", input);
      if (hasRange) {
        gifArgs.push("-t", (end! - start).toFixed(3));
      }
      gifArgs.push(
        "-vf",
        `fps=${fps},scale=${width}:-1:flags=lanczos`,
        "-loop",
        "0",
        output,
      );
      await execChecked(ffmpeg, gifArgs);
      return await finish();
    }

    if (format === "webm") {
      reportRatioStage(options.onProgress, "Encoding WebM…");
      // VP8 + realtime deadline is substantially faster than default VP9 in WASM.
      try {
        await execChecked(ffmpeg, [
          "-i",
          input,
          "-c:v",
          "libvpx",
          "-b:v",
          "1M",
          "-deadline",
          "realtime",
          "-cpu-used",
          "8",
          "-c:a",
          "libopus",
          "-b:a",
          "96k",
          output,
        ]);
        return await finish();
      } catch {
        await safeDelete(ffmpeg, output);
        await execChecked(ffmpeg, [
          "-i",
          input,
          "-c:v",
          "libvpx",
          "-b:v",
          "1M",
          "-deadline",
          "realtime",
          "-cpu-used",
          "8",
          "-an",
          output,
        ]);
        return await finish();
      }
    }

    if (config.slug === "gif-to-mp4") {
      await execChecked(ffmpeg, [
        "-i",
        input,
        "-movflags",
        "+faststart",
        "-pix_fmt",
        "yuv420p",
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "23",
        "-an",
        output,
      ]);
      return await finish();
    }

    reportRatioStage(options.onProgress, "Inspecting video…");
    const probe = await probeWrittenInput(input);
    const preferred = mp4TranscodeArgs(input, output, probe, "ultrafast");
    const triedStreamCopy = preferred.includes("copy");

    try {
      if (canFullyRemuxToMp4(probe)) {
        reportRatioStage(options.onProgress, "Converting video…");
      }
      await execChecked(ffmpeg, preferred);
      return await finish();
    } catch (error) {
      await safeDelete(ffmpeg, output);
      if (!triedStreamCopy) throw error;
      // Stream-copy / partial-copy failed — fall back to a full encode.
      await execChecked(
        ffmpeg,
        fullMp4EncodeArgs(input, output, probe.hasAudio, "ultrafast"),
      );
      return await finish();
    }
  } finally {
    detach();
    await safeDelete(ffmpeg, input);
    await safeDelete(ffmpeg, output);
  }
}

export async function compressVideo(
  sources: VideoSourceFile[],
  config: VideoToolConfig,
  options: VideoProcessOptions = {},
): Promise<VideoProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a video file.");
  const crf = crfForQuality(options.quality);
  const result = await runFfmpeg(
    sources,
    config,
    (input, output) => [
      "-i",
      input,
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-crf",
      crf,
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "96k",
      "-movflags",
      "+faststart",
      output,
    ],
    options,
    "Compressing video…",
  );
  const original = source.sizeBytes;
  const outputSize = result.sizeBytes;
  const reduction =
    original > 0
      ? `${Math.max(0, ((original - outputSize) / original) * 100).toFixed(1)}%`
      : "0%";
  return {
    ...result,
    stats: {
      "Original size": formatBytes(original),
      "Compressed size": formatBytes(outputSize),
      Reduction: reduction,
    },
    notice:
      outputSize >= original
        ? "This file did not shrink further at the selected quality. Try a lower quality setting."
        : undefined,
  };
}

export async function resizeVideo(
  sources: VideoSourceFile[],
  config: VideoToolConfig,
  options: VideoProcessOptions = {},
): Promise<VideoProcessResult> {
  const width = Math.max(16, Math.round(options.width ?? 1280));
  const height = Math.max(16, Math.round(options.height ?? 720));
  const w = width % 2 === 0 ? width : width + 1;
  const h = height % 2 === 0 ? height : height + 1;
  return runFfmpeg(
    sources,
    config,
    (input, output) => [
      "-i",
      input,
      "-vf",
      `scale=${w}:${h}`,
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      output,
    ],
    options,
    "Resizing video…",
  );
}

export async function cropVideo(
  sources: VideoSourceFile[],
  config: VideoToolConfig,
  options: VideoProcessOptions = {},
): Promise<VideoProcessResult> {
  const crop = options.crop;
  if (!crop || crop.width < 2 || crop.height < 2) {
    throw new Error("Choose a valid crop region before processing.");
  }
  const x = Math.max(0, Math.round(crop.x));
  const y = Math.max(0, Math.round(crop.y));
  let w = Math.max(2, Math.round(crop.width));
  let h = Math.max(2, Math.round(crop.height));
  if (w % 2 !== 0) w -= 1;
  if (h % 2 !== 0) h -= 1;
  return runFfmpeg(
    sources,
    config,
    (input, output) => [
      "-i",
      input,
      "-vf",
      `crop=${w}:${h}:${x}:${y}`,
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "copy",
      "-movflags",
      "+faststart",
      output,
    ],
    options,
    "Cropping video…",
  );
}

export async function trimOrCutVideo(
  sources: VideoSourceFile[],
  config: VideoToolConfig,
  options: VideoProcessOptions = {},
): Promise<VideoProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a video file.");
  const start = Math.max(0, options.startSeconds ?? 0);
  const end = options.endSeconds;
  if (end == null || !Number.isFinite(end) || end <= start) {
    throw new Error("Choose a valid start and end time for the selection.");
  }
  const duration = end - start;
  const label = config.kind === "cut" ? "Cutting video…" : "Trimming video…";

  const ffmpeg = await getFfmpeg();
  const inputExt = extensionFromName(source.name) || "bin";
  const input = `input.${inputExt}`;
  const output = "output.mp4";
  const detach = attachProgress(ffmpeg, options.onProgress, label);

  try {
    reportRatioStage(options.onProgress, "Preparing…");
    await writeInputFile(ffmpeg, source.file, input);
    reportRatioStage(options.onProgress, "Inspecting video…");
    const probe = await probeWrittenInput(input);

    const copyArgs = [
      "-ss",
      start.toFixed(3),
      "-i",
      input,
      "-t",
      duration.toFixed(3),
      "-c",
      "copy",
      "-avoid_negative_ts",
      "make_zero",
      "-movflags",
      "+faststart",
      output,
    ];
    const encodeArgs = [
      "-ss",
      start.toFixed(3),
      "-i",
      input,
      "-t",
      duration.toFixed(3),
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      output,
    ];

    if (canFullyRemuxToMp4(probe)) {
      try {
        await execChecked(ffmpeg, copyArgs);
        const bytes = await readOutputFile(ffmpeg, output);
        assertValidOutput(bytes, "mp4");
        return resultFromBytes(bytes, config, source.name);
      } catch {
        await safeDelete(ffmpeg, output);
      }
    }

    await execChecked(ffmpeg, encodeArgs);
    const bytes = await readOutputFile(ffmpeg, output);
    assertValidOutput(bytes, "mp4");
    return resultFromBytes(bytes, config, source.name);
  } finally {
    detach();
    await safeDelete(ffmpeg, input);
    await safeDelete(ffmpeg, output);
  }
}

export async function mergeVideos(
  sources: VideoSourceFile[],
  config: VideoToolConfig,
  options: VideoProcessOptions = {},
): Promise<VideoProcessResult> {
  if (sources.length < 2) throw new Error("Please upload at least two videos to merge.");
  const ffmpeg = await getFfmpeg();
  const detach = attachProgress(ffmpeg, options.onProgress, "Merging videos…");
  const inputNames: string[] = [];
  const partNames: string[] = [];
  const listName = "list.txt";
  const output = "output.mp4";
  try {
    reportRatioStage(options.onProgress, "Preparing files…");
    let list = "";
    for (let i = 0; i < sources.length; i += 1) {
      const name = `in_${i}.${extensionFromName(sources[i].name) || "bin"}`;
      inputNames.push(name);
      await writeInputFile(ffmpeg, sources[i].file, name);
      const normalized = `part_${i}.mp4`;
      partNames.push(normalized);
      await execChecked(ffmpeg, [
        "-i",
        name,
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        "-vf",
        "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2",
        normalized,
      ]);
      list += `file '${normalized}'\n`;
      reportRatioStage(
        options.onProgress,
        `Preparing clip ${i + 1} of ${sources.length}…`,
      );
    }
    await ffmpeg.writeFile(listName, list);
    await execChecked(ffmpeg, [
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listName,
      "-c",
      "copy",
      output,
    ]);
    const bytes = await readOutputFile(ffmpeg, output);
    assertValidOutput(bytes, "mp4");
    return resultFromBytes(bytes, config, "merged-video", {
      stats: { Clips: String(sources.length) },
    });
  } finally {
    detach();
    for (const name of inputNames) await safeDelete(ffmpeg, name);
    for (const name of partNames) await safeDelete(ffmpeg, name);
    await safeDelete(ffmpeg, listName);
    await safeDelete(ffmpeg, output);
  }
}

export async function rotateVideo(
  sources: VideoSourceFile[],
  config: VideoToolConfig,
  options: VideoProcessOptions = {},
): Promise<VideoProcessResult> {
  const rotation = options.rotation ?? 90;
  let transpose = "transpose=1";
  if (rotation === 180) transpose = "transpose=1,transpose=1";
  else if (rotation === 270 || rotation === -90) transpose = "transpose=2";
  else if (rotation === 90) transpose = "transpose=1";
  return runFfmpeg(
    sources,
    config,
    (input, output) => [
      "-i",
      input,
      "-vf",
      transpose,
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "copy",
      "-movflags",
      "+faststart",
      output,
    ],
    options,
    "Rotating video…",
  );
}

export async function changeVideoSpeed(
  sources: VideoSourceFile[],
  config: VideoToolConfig,
  options: VideoProcessOptions = {},
): Promise<VideoProcessResult> {
  const speed = options.speed ?? 1.25;
  if (![0.5, 0.75, 1, 1.25, 1.5, 2].includes(speed)) {
    throw new Error("Choose a supported speed value.");
  }
  if (speed === 1) throw new Error("Choose a speed other than 1x to process the video.");
  const setpts = (1 / speed).toFixed(6);
  const atempoFilters: string[] = [];
  let remaining = speed;
  while (remaining > 2.0 + 1e-6) {
    atempoFilters.push("atempo=2.0");
    remaining /= 2;
  }
  while (remaining < 0.5 - 1e-6) {
    atempoFilters.push("atempo=0.5");
    remaining /= 0.5;
  }
  atempoFilters.push(`atempo=${remaining.toFixed(4)}`);
  const suffix = `${String(speed).replace(".", "")}x`;
  const updatedConfig = { ...config, filenameSuffix: suffix };

  try {
    return await runFfmpeg(
      sources,
      updatedConfig,
      (input, output) => [
        "-i",
        input,
        "-filter_complex",
        `[0:v]setpts=${setpts}*PTS[v];[0:a]${atempoFilters.join(",")}[a]`,
        "-map",
        "[v]",
        "-map",
        "[a]",
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        output,
      ],
      options,
      "Changing speed…",
    );
  } catch {
    return runFfmpeg(
      sources,
      updatedConfig,
      (input, output) => [
        "-i",
        input,
        "-vf",
        `setpts=${setpts}*PTS`,
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        output,
      ],
      options,
      "Changing speed…",
    );
  }
}

export async function extractImageFrame(
  sources: VideoSourceFile[],
  config: VideoToolConfig,
  options: VideoProcessOptions = {},
): Promise<VideoProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a video file.");
  const time = Math.max(0, options.timestampSeconds ?? 0);
  if (source.durationSeconds != null && time > source.durationSeconds) {
    throw new Error("Timestamp cannot be beyond the video duration.");
  }
  reportRatioStage(options.onProgress, "Seeking…");
  const blob = await captureFrameAt(source.file, time, "image/png");
  if (!blob.size) throw new Error("Could not extract a frame from this video.");
  const previewUrl = URL.createObjectURL(blob);
  return {
    blob,
    fileName: buildVideoOutputName(
      source.name,
      config.filenameSuffix || "frame",
      "png",
    ),
    mimeType: "image/png",
    sizeBytes: blob.size,
    previewUrl,
    imagePreviewUrl: previewUrl,
    stats: {
      Timestamp: formatDuration(time),
    },
  };
}

export async function readVideoMetadata(
  sources: VideoSourceFile[],
): Promise<VideoProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload a video file.");
  const rows: Array<{ label: string; value: string }> = [
    { label: "File name", value: source.name },
    { label: "File size", value: formatBytes(source.sizeBytes) },
    {
      label: "Format",
      value: source.type || extensionFromName(source.name).toUpperCase() || "Not detected",
    },
  ];
  const probe =
    source.durationSeconds != null
      ? {
          durationSeconds: source.durationSeconds,
          width: source.width,
          height: source.height,
        }
      : await probeVideoMeta(source.file);

  if (probe.durationSeconds != null) {
    rows.push({ label: "Duration", value: formatDuration(probe.durationSeconds) });
  } else {
    rows.push({ label: "Duration", value: "Not detected" });
  }
  if (probe.width && probe.height) {
    rows.push({ label: "Width", value: String(probe.width) });
    rows.push({ label: "Height", value: String(probe.height) });
  } else {
    rows.push({ label: "Width", value: "Not detected" });
    rows.push({ label: "Height", value: "Not detected" });
  }

  try {
    const { parseBlob } = await import("music-metadata");
    const meta = await parseBlob(source.file);
    if (meta.format.bitrate != null) {
      rows.push({
        label: "Bitrate",
        value: `${Math.round(meta.format.bitrate / 1000)} kbps`,
      });
    } else {
      rows.push({ label: "Bitrate", value: "Not detected" });
    }
    if (meta.format.sampleRate != null) {
      rows.push({ label: "Sample rate", value: `${meta.format.sampleRate} Hz` });
    }
    if (meta.format.numberOfChannels != null) {
      rows.push({ label: "Audio channels", value: String(meta.format.numberOfChannels) });
    }
    if (meta.format.container) {
      rows.push({ label: "Container", value: String(meta.format.container) });
    }
    const videoTrack = meta.format.codec || meta.format.codecProfile;
    rows.push({
      label: "Frame rate",
      value: "Not detected",
    });
    rows.push({
      label: "Video codec",
      value: videoTrack ? String(videoTrack) : "Not detected",
    });
    rows.push({
      label: "Audio codec",
      value: meta.format.codecProfile
        ? String(meta.format.codecProfile)
        : "Not detected",
    });
  } catch {
    rows.push({ label: "Bitrate", value: "Not detected" });
    rows.push({ label: "Frame rate", value: "Not detected" });
    rows.push({ label: "Video codec", value: "Not detected" });
    rows.push({ label: "Audio codec", value: "Not detected" });
  }

  const seen = new Set<string>();
  const unique = rows.filter((row) => {
    if (seen.has(row.label)) return false;
    seen.add(row.label);
    return true;
  });

  return {
    blob: source.file,
    fileName: source.name,
    mimeType: source.type || "video/mp4",
    sizeBytes: source.sizeBytes,
    metadataRows: unique,
    stats: { Fields: String(unique.length) },
  };
}

export async function processVideoTool(
  sources: VideoSourceFile[],
  config: VideoToolConfig,
  options: VideoProcessOptions = {},
): Promise<VideoProcessResult> {
  try {
    switch (config.kind) {
      case "convert":
        return await convertVideo(sources, config, options);
      case "compress":
        return await compressVideo(sources, config, options);
      case "resize":
        return await resizeVideo(sources, config, options);
      case "crop":
        return await cropVideo(sources, config, options);
      case "trim":
      case "cut":
        return await trimOrCutVideo(sources, config, options);
      case "merge":
        return await mergeVideos(sources, config, options);
      case "rotate":
        return await rotateVideo(sources, config, options);
      case "speed":
        return await changeVideoSpeed(sources, config, options);
      case "thumbnail":
      case "frame":
        return await extractImageFrame(sources, config, options);
      case "metadata":
        return await readVideoMetadata(sources);
      default:
        throw new Error("Unsupported video tool.");
    }
  } catch (error) {
    throw new Error(friendlyVideoError(error));
  }
}
