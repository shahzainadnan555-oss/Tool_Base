import { reportRatioStage } from "@/lib/processing/report";
import type {
  AudioProcessOptions,
  AudioProcessResult,
  AudioSourceFile,
  AudioToolConfig,
} from "./types";
import {
  attachProgress,
  getFfmpeg,
  readOutputFile,
  safeDelete,
  writeInputFile,
} from "./ffmpeg";
import {
  buildAudioOutputName,
  extensionFromName,
  formatBytes,
  formatDuration,
} from "./utils";
import { friendlyAudioError } from "./validate";

function resultFromBytes(
  bytes: Uint8Array,
  config: AudioToolConfig,
  sourceName: string,
  extras: Partial<AudioProcessResult> = {},
): AudioProcessResult {
  const ext = config.outputExtension || "mp3";
  const mime = config.outputMime || "audio/mpeg";
  const blob = new Blob([Uint8Array.from(bytes)], { type: mime });
  const previewUrl = mime.startsWith("audio/") ? URL.createObjectURL(blob) : undefined;
  return {
    blob,
    fileName: buildAudioOutputName(sourceName, config.filenameSuffix, ext),
    mimeType: mime,
    sizeBytes: blob.size,
    previewUrl,
    ...extras,
  };
}

function bitrateForQuality(quality?: number): string {
  const q = quality ?? 5;
  if (q <= 2) return "96k";
  if (q <= 4) return "128k";
  if (q <= 6) return "160k";
  if (q <= 8) return "192k";
  return "256k";
}

async function runFfmpegConvert(
  sources: AudioSourceFile[],
  config: AudioToolConfig,
  argsBuilder: (input: string, output: string) => string[],
  options: AudioProcessOptions,
  label: string,
): Promise<AudioProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload an audio file.");
  const ffmpeg = await getFfmpeg();
  const inputExt = extensionFromName(source.name) || "bin";
  const input = `input.${inputExt}`;
  const outExt = config.outputExtension || "mp3";
  const output = `output.${outExt}`;
  const detach = attachProgress(ffmpeg, options.onProgress, label);
  try {
    reportRatioStage(options.onProgress, "Preparing…");
    await writeInputFile(ffmpeg, source.file, input);
    const args = argsBuilder(input, output);
    await ffmpeg.exec(args);
    const bytes = await readOutputFile(ffmpeg, output);
    if (!bytes.byteLength) throw new Error("The conversion produced an empty file.");
    return resultFromBytes(bytes, config, source.name);
  } finally {
    detach();
    await safeDelete(ffmpeg, input);
    await safeDelete(ffmpeg, output);
  }
}

export async function convertAudio(
  sources: AudioSourceFile[],
  config: AudioToolConfig,
  options: AudioProcessOptions = {},
): Promise<AudioProcessResult> {
  const format = config.ffmpegFormat || "mp3";
  const bitrate = options.bitrate || bitrateForQuality(options.quality);
  return runFfmpegConvert(
    sources,
    config,
    (input, output) => {
      if (format === "wav") return ["-i", input, "-vn", "-acodec", "pcm_s16le", output];
      if (format === "flac") return ["-i", input, "-vn", "-acodec", "flac", output];
      if (format === "ogg") {
        return ["-i", input, "-vn", "-c:a", "libvorbis", "-q:a", "4", output];
      }
      if (format === "adts") {
        return ["-i", input, "-vn", "-c:a", "aac", "-b:a", bitrate, output];
      }
      if (format === "ipod") {
        return ["-i", input, "-vn", "-c:a", "aac", "-b:a", bitrate, "-f", "ipod", output];
      }
      return ["-i", input, "-vn", "-c:a", "libmp3lame", "-b:a", bitrate, output];
    },
    options,
    "Converting audio…",
  );
}

export async function compressAudio(
  sources: AudioSourceFile[],
  config: AudioToolConfig,
  options: AudioProcessOptions = {},
): Promise<AudioProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload an audio file.");
  const bitrate = options.bitrate || bitrateForQuality(options.quality ?? 4);
  const result = await runFfmpegConvert(
    sources,
    { ...config, outputExtension: "mp3", outputMime: "audio/mpeg", ffmpegFormat: "mp3" },
    (input, output) => ["-i", input, "-vn", "-c:a", "libmp3lame", "-b:a", bitrate, output],
    options,
    "Compressing audio…",
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
      "Output size": formatBytes(outputSize),
      Reduction: reduction,
    },
    notice:
      outputSize >= original
        ? "This file did not shrink further at the selected quality. Try a lower bitrate."
        : undefined,
  };
}

export async function trimOrCutAudio(
  sources: AudioSourceFile[],
  config: AudioToolConfig,
  options: AudioProcessOptions = {},
): Promise<AudioProcessResult> {
  const start = Math.max(0, options.startSeconds ?? 0);
  const end = options.endSeconds;
  if (end == null || !Number.isFinite(end) || end <= start) {
    throw new Error("Choose a valid start and end time for the selection.");
  }
  const duration = end - start;
  return runFfmpegConvert(
    sources,
    config,
    (input, output) => [
      "-ss",
      start.toFixed(3),
      "-i",
      input,
      "-t",
      duration.toFixed(3),
      "-vn",
      "-c:a",
      "libmp3lame",
      "-b:a",
      "192k",
      output,
    ],
    options,
    config.kind === "cut" ? "Cutting audio…" : "Trimming audio…",
  );
}

export async function joinAudio(
  sources: AudioSourceFile[],
  config: AudioToolConfig,
  options: AudioProcessOptions = {},
): Promise<AudioProcessResult> {
  if (sources.length < 2) throw new Error("Please upload at least two audio files to join.");
  const ffmpeg = await getFfmpeg();
  const detach = attachProgress(ffmpeg, options.onProgress, "Joining audio…");
  const inputNames: string[] = [];
  const listName = "list.txt";
  const output = "output.mp3";
  try {
    reportRatioStage(options.onProgress, "Preparing files…");
    let list = "";
    for (let i = 0; i < sources.length; i += 1) {
      const name = `in_${i}.${extensionFromName(sources[i].name) || "bin"}`;
      inputNames.push(name);
      await writeInputFile(ffmpeg, sources[i].file, name);
      // Re-encode each to wav for safe concat of mixed formats
      const wav = `part_${i}.wav`;
      await ffmpeg.exec(["-i", name, "-vn", "-acodec", "pcm_s16le", wav]);
      list += `file '${wav}'\n`;
      reportRatioStage(options.onProgress, `Preparing file ${i + 1} of ${sources.length}…`);
    }
    await ffmpeg.writeFile(listName, list);
    await ffmpeg.exec([
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listName,
      "-c:a",
      "libmp3lame",
      "-b:a",
      "192k",
      output,
    ]);
    const bytes = await readOutputFile(ffmpeg, output);
    return resultFromBytes(bytes, config, "joined-audio", {
      stats: { Files: String(sources.length) },
    });
  } finally {
    detach();
    for (const name of inputNames) await safeDelete(ffmpeg, name);
    for (let i = 0; i < sources.length; i += 1) await safeDelete(ffmpeg, `part_${i}.wav`);
    await safeDelete(ffmpeg, listName);
    await safeDelete(ffmpeg, output);
  }
}

export async function changeVolume(
  sources: AudioSourceFile[],
  config: AudioToolConfig,
  options: AudioProcessOptions = {},
): Promise<AudioProcessResult> {
  const gain = Math.max(-24, Math.min(24, options.volumeGainDb ?? 6));
  return runFfmpegConvert(
    sources,
    config,
    (input, output) => [
      "-i",
      input,
      "-vn",
      "-af",
      `volume=${gain}dB`,
      "-c:a",
      "libmp3lame",
      "-b:a",
      "192k",
      output,
    ],
    options,
    "Adjusting volume…",
  );
}

export async function changeSpeed(
  sources: AudioSourceFile[],
  config: AudioToolConfig,
  options: AudioProcessOptions = {},
): Promise<AudioProcessResult> {
  const speed = options.speed ?? 1;
  if (![0.5, 0.75, 1, 1.25, 1.5, 2].includes(speed)) {
    throw new Error("Choose a supported speed value.");
  }
  if (speed === 1) {
    throw new Error("Choose a speed other than 1x to process the audio.");
  }
  // atempo supports 0.5–2.0 per filter; chain if needed
  const filters: string[] = [];
  let remaining = speed;
  while (remaining > 2.0 + 1e-6) {
    filters.push("atempo=2.0");
    remaining /= 2;
  }
  while (remaining < 0.5 - 1e-6) {
    filters.push("atempo=0.5");
    remaining /= 0.5;
  }
  filters.push(`atempo=${remaining.toFixed(4)}`);
  return runFfmpegConvert(
    sources,
    config,
    (input, output) => [
      "-i",
      input,
      "-vn",
      "-filter:a",
      filters.join(","),
      "-c:a",
      "libmp3lame",
      "-b:a",
      "192k",
      output,
    ],
    options,
    "Changing speed…",
  );
}

export async function changePitch(
  sources: AudioSourceFile[],
  config: AudioToolConfig,
  options: AudioProcessOptions = {},
): Promise<AudioProcessResult> {
  const semitones = Math.max(-12, Math.min(12, options.pitchSemitones ?? 2));
  if (semitones === 0) throw new Error("Choose a pitch shift other than 0.");
  const factor = 2 ** (semitones / 12);
  // asetrate + aresample + atempo restores duration while shifting pitch
  return runFfmpegConvert(
    sources,
    config,
    (input, output) => [
      "-i",
      input,
      "-vn",
      "-af",
      `asetrate=44100*${factor.toFixed(6)},aresample=44100,atempo=${(1 / factor).toFixed(6)}`,
      "-c:a",
      "libmp3lame",
      "-b:a",
      "192k",
      output,
    ],
    options,
    "Changing pitch…",
  );
}

export async function removeSilence(
  sources: AudioSourceFile[],
  config: AudioToolConfig,
  options: AudioProcessOptions = {},
): Promise<AudioProcessResult> {
  const threshold = Math.max(-60, Math.min(-20, options.silenceThresholdDb ?? -40));
  const minDur = Math.max(0.2, Math.min(5, options.silenceMinDuration ?? 0.5));
  return runFfmpegConvert(
    sources,
    config,
    (input, output) => [
      "-i",
      input,
      "-vn",
      "-af",
      `silenceremove=start_periods=1:start_duration=${minDur}:start_threshold=${threshold}dB:detection=peak,aformat=dblp,areverse,silenceremove=start_periods=1:start_duration=${minDur}:start_threshold=${threshold}dB:detection=peak,aformat=dblp,areverse`,
      "-c:a",
      "libmp3lame",
      "-b:a",
      "192k",
      output,
    ],
    options,
    "Removing silence…",
  );
}

export async function generateWaveform(
  sources: AudioSourceFile[],
  config: AudioToolConfig,
  options: AudioProcessOptions = {},
): Promise<AudioProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload an audio file.");
  reportRatioStage(options.onProgress, "Reading audio…");
  const arrayBuffer = await source.file.arrayBuffer();
  const audioCtx = new AudioContext();
  try {
    const decoded = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
    reportRatioStage(options.onProgress, "Drawing waveform…");
    const channel = decoded.getChannelData(0);
    const width = 1200;
    const height = 320;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not prepare a canvas for the waveform.");
    ctx.fillStyle = "#0B1F3A";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#2563EB";
    ctx.lineWidth = 2;
    const mid = height / 2;
    const step = Math.max(1, Math.floor(channel.length / width));
    ctx.beginPath();
    for (let x = 0; x < width; x += 1) {
      let min = 1;
      let max = -1;
      const start = x * step;
      for (let i = 0; i < step && start + i < channel.length; i += 1) {
        const v = channel[start + i];
        if (v < min) min = v;
        if (v > max) max = v;
      }
      const y1 = mid + min * mid * 0.9;
      const y2 = mid + max * mid * 0.9;
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
    }
    ctx.stroke();
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (value) => (value ? resolve(value) : reject(new Error("Could not encode waveform image."))),
        "image/png",
      );
    });
    const previewUrl = URL.createObjectURL(blob);
    return {
      blob,
      fileName: buildAudioOutputName(source.name, "waveform", "png"),
      mimeType: "image/png",
      sizeBytes: blob.size,
      waveformDataUrl: previewUrl,
      previewUrl,
      stats: {
        Duration: formatDuration(decoded.duration),
        Channels: String(decoded.numberOfChannels),
      },
    };
  } finally {
    await audioCtx.close();
  }
}

export async function readAudioMetadata(
  sources: AudioSourceFile[],
): Promise<AudioProcessResult> {
  const source = sources[0];
  if (!source) throw new Error("Please upload an audio file.");
  const { parseBlob } = await import("music-metadata");
  const rows: Array<{ label: string; value: string }> = [
    { label: "File name", value: source.name },
    { label: "File size", value: formatBytes(source.sizeBytes) },
    { label: "Format", value: source.type || extensionFromName(source.name).toUpperCase() },
  ];
  if (source.durationSeconds != null) {
    rows.push({ label: "Duration", value: formatDuration(source.durationSeconds) });
  }
  try {
    const meta = await parseBlob(source.file);
    if (meta.format.duration != null) {
      rows.push({ label: "Duration", value: formatDuration(meta.format.duration) });
    }
    if (meta.format.bitrate != null) {
      rows.push({ label: "Bitrate", value: `${Math.round(meta.format.bitrate / 1000)} kbps` });
    }
    if (meta.format.sampleRate != null) {
      rows.push({ label: "Sample rate", value: `${meta.format.sampleRate} Hz` });
    }
    if (meta.format.numberOfChannels != null) {
      rows.push({ label: "Channels", value: String(meta.format.numberOfChannels) });
    }
    if (meta.format.codec) rows.push({ label: "Codec", value: String(meta.format.codec) });
    if (meta.format.container) {
      rows.push({ label: "Container", value: String(meta.format.container) });
    }
    const { common } = meta;
    if (common.title) rows.push({ label: "Title", value: common.title });
    if (common.artist) rows.push({ label: "Artist", value: common.artist });
    if (common.album) rows.push({ label: "Album", value: common.album });
    if (common.genre?.length) rows.push({ label: "Genre", value: common.genre.join(", ") });
    if (common.year != null) rows.push({ label: "Year", value: String(common.year) });
  } catch {
    // Keep basic file rows only.
  }

  // Deduplicate duration if both sources filled it
  const seen = new Set<string>();
  const unique = rows.filter((row) => {
    if (seen.has(row.label)) return false;
    seen.add(row.label);
    return true;
  });

  const hasExtra = unique.length > 3;
  return {
    blob: source.file,
    fileName: source.name,
    mimeType: source.type || "audio/mpeg",
    sizeBytes: source.sizeBytes,
    metadataRows: unique,
    stats: hasExtra
      ? { Fields: String(unique.length) }
      : { Status: "No additional metadata was found." },
    notice: hasExtra ? undefined : "No additional metadata was found in this audio file.",
  };
}

export async function processAudioTool(
  sources: AudioSourceFile[],
  config: AudioToolConfig,
  options: AudioProcessOptions = {},
): Promise<AudioProcessResult> {
  try {
    switch (config.kind) {
      case "convert":
        return await convertAudio(sources, config, options);
      case "compress":
        return await compressAudio(sources, config, options);
      case "trim":
      case "cut":
        return await trimOrCutAudio(sources, config, options);
      case "join":
        return await joinAudio(sources, config, options);
      case "volume":
        return await changeVolume(sources, config, options);
      case "speed":
        return await changeSpeed(sources, config, options);
      case "pitch":
        return await changePitch(sources, config, options);
      case "waveform":
        return await generateWaveform(sources, config, options);
      case "metadata":
        return await readAudioMetadata(sources);
      case "silence-remove":
        return await removeSilence(sources, config, options);
      default:
        throw new Error("Unsupported audio tool.");
    }
  } catch (error) {
    throw new Error(friendlyAudioError(error));
  }
}
