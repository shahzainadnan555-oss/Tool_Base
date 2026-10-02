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
  buildVideoOutputName,
  captureFrameAt,
  extensionFromName,
  formatBytes,
  formatDuration,
  probeVideoMeta,
} from "./utils";
import { friendlyVideoError } from "./validate";

function resultFromBytes(
  bytes: Uint8Array,
  config: VideoToolConfig,
  sourceName: string,
  extras: Partial<VideoProcessResult> = {},
): VideoProcessResult {
  const ext = config.outputExtension || "mp4";
  const mime = config.outputMime || "video/mp4";
  const blob = new Blob([Uint8Array.from(bytes)], { type: mime });
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
    options.onProgress?.(0.02, "Preparing…");
    await writeInputFile(ffmpeg, source.file, input);
    await ffmpeg.exec(argsBuilder(input, output));
    const bytes = await readOutputFile(ffmpeg, output);
    if (!bytes.byteLength) throw new Error("The conversion produced an empty file.");
    options.onProgress?.(1, "Done");
    return resultFromBytes(bytes, config, sourceName || source.name);
  } finally {
    detach();
    await safeDelete(ffmpeg, input);
    await safeDelete(ffmpeg, output);
  }
}

export async function convertVideo(
  sources: VideoSourceFile[],
  config: VideoToolConfig,
  options: VideoProcessOptions = {},
): Promise<VideoProcessResult> {
  const format = config.ffmpegFormat || "mp4";
  const start = Math.max(0, options.startSeconds ?? 0);
  const end = options.endSeconds;
  const hasRange = end != null && Number.isFinite(end) && end > start;

  return runFfmpeg(
    sources,
    config,
    (input, output) => {
      if (format === "mp3") {
        return ["-i", input, "-vn", "-c:a", "libmp3lame", "-b:a", "192k", output];
      }
      if (format === "wav") {
        return ["-i", input, "-vn", "-acodec", "pcm_s16le", output];
      }
      if (format === "gif") {
        const fps = options.gifFps ?? 10;
        const width = options.gifWidth ?? 480;
        const args = ["-i", input];
        if (hasRange) {
          args.push("-ss", start.toFixed(3), "-t", (end! - start).toFixed(3));
        }
        args.push(
          "-vf",
          `fps=${fps},scale=${width}:-1:flags=lanczos`,
          "-loop",
          "0",
          output,
        );
        return args;
      }
      if (format === "webm") {
        return [
          "-i",
          input,
          "-c:v",
          "libvpx-vp9",
          "-b:v",
          "1M",
          "-c:a",
          "libopus",
          "-b:a",
          "128k",
          output,
        ];
      }
      // Default: transcode to MP4 (H.264 + AAC)
      if (config.slug === "gif-to-mp4") {
        return [
          "-i",
          input,
          "-movflags",
          "faststart",
          "-pix_fmt",
          "yuv420p",
          "-c:v",
          "libx264",
          "-c:a",
          "aac",
          output,
        ];
      }
      return [
        "-i",
        input,
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "23",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "faststart",
        output,
      ];
    },
    options,
    "Converting video…",
  );
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
      "fast",
      "-crf",
      crf,
      "-c:a",
      "aac",
      "-b:a",
      "96k",
      "-movflags",
      "faststart",
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
  // Ensure even dimensions for H.264
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
      "fast",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "faststart",
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
      "fast",
      "-crf",
      "23",
      "-c:a",
      "copy",
      "-movflags",
      "faststart",
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
  const start = Math.max(0, options.startSeconds ?? 0);
  const end = options.endSeconds;
  if (end == null || !Number.isFinite(end) || end <= start) {
    throw new Error("Choose a valid start and end time for the selection.");
  }
  const duration = end - start;
  return runFfmpeg(
    sources,
    config,
    (input, output) => [
      "-ss",
      start.toFixed(3),
      "-i",
      input,
      "-t",
      duration.toFixed(3),
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "faststart",
      output,
    ],
    options,
    config.kind === "cut" ? "Cutting video…" : "Trimming video…",
  );
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
  const listName = "list.txt";
  const output = "output.mp4";
  try {
    options.onProgress?.(0.05, "Preparing files…");
    let list = "";
    for (let i = 0; i < sources.length; i += 1) {
      const name = `in_${i}.${extensionFromName(sources[i].name) || "bin"}`;
      inputNames.push(name);
      await writeInputFile(ffmpeg, sources[i].file, name);
      const normalized = `part_${i}.mp4`;
      await ffmpeg.exec([
        "-i",
        name,
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "23",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "faststart",
        "-vf",
        "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2",
        normalized,
      ]);
      list += `file '${normalized}'\n`;
      options.onProgress?.((i + 1) / (sources.length + 1), `Prepared clip ${i + 1}`);
    }
    await ffmpeg.writeFile(listName, list);
    await ffmpeg.exec([
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
    if (!bytes.byteLength) throw new Error("The merge produced an empty file.");
    options.onProgress?.(1, "Done");
    return resultFromBytes(bytes, config, "merged-video", {
      stats: { Clips: String(sources.length) },
    });
  } finally {
    detach();
    for (const name of inputNames) await safeDelete(ffmpeg, name);
    for (let i = 0; i < sources.length; i += 1) await safeDelete(ffmpeg, `part_${i}.mp4`);
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
      "fast",
      "-crf",
      "23",
      "-c:a",
      "copy",
      "-movflags",
      "faststart",
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
        "fast",
        "-crf",
        "23",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "faststart",
        output,
      ],
      options,
      "Changing speed…",
    );
  } catch {
    // Retry without audio when the source has no usable audio stream.
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
        "fast",
        "-crf",
        "23",
        "-movflags",
        "faststart",
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
  options.onProgress?.(0.2, "Seeking…");
  const blob = await captureFrameAt(source.file, time, "image/png");
  options.onProgress?.(1, "Done");
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
  const probe = source.durationSeconds != null
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
    if (meta.format.codec) rows.push({ label: "Codec", value: String(meta.format.codec) });
    if (meta.format.container) {
      rows.push({ label: "Container", value: String(meta.format.container) });
    }
    rows.push({
      label: "Frame rate",
      value: "Not detected",
    });
    rows.push({
      label: "Video codec",
      value: meta.format.codec ? String(meta.format.codec) : "Not detected",
    });
    rows.push({
      label: "Audio codec",
      value: meta.format.codecProfile ? String(meta.format.codecProfile) : "Not detected",
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
