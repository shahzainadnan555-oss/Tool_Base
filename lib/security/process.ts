import {
  binaryToDecimal,
  binaryToText,
  decimalToBinary,
  hexToText,
  textToBinary,
  textToHex,
} from "./convert";
import { decodeBase32, decodeBase64ToBlob, encodeBase32, fileToBase64 } from "./encode";
import {
  generatePassword,
  generateRandomNumbers,
  generateRandomStrings,
  generateUuids,
} from "./generate";
import { hashFile, hashText } from "./hash";
import { decodeJwt } from "./jwt";
import { generateQr } from "./qr";
import { convertUnixTimestamp, generateUnixTimestamp } from "./timestamp";
import type {
  SecurityProcessOptions,
  SecurityProcessResult,
  SecurityToolConfig,
} from "./types";
import { MAX_FILE_BYTES, MAX_TEXT_CHARS } from "./types";
import { formatBytes } from "./utils";

function assertTextSize(input: string) {
  if (input.length > MAX_TEXT_CHARS) {
    throw new Error(
      `Input is too large (max ${MAX_TEXT_CHARS.toLocaleString()} characters).`,
    );
  }
}

export async function processSecurityTool(
  config: SecurityToolConfig,
  input: string,
  options: SecurityProcessOptions = {},
): Promise<SecurityProcessResult> {
  assertTextSize(input);

  switch (config.kind) {
    case "hash": {
      const algorithm = config.hashAlgorithm!;
      if (options.hashMode === "file") {
        if (!options.file) throw new Error("Please choose a file to hash.");
        const digest = await hashFile(
          options.file,
          algorithm,
          options.onProgress,
          options.signal,
        );
        return {
          output: digest,
          meta: {
            algorithm,
            fileName: options.file.name,
            fileSize: formatBytes(options.file.size),
          },
        };
      }
      const digest = await hashText(input, algorithm);
      return { output: digest, meta: { algorithm } };
    }
    case "uuid":
      return { output: generateUuids(options.quantity ?? 1).join("\n") };
    case "password":
      return {
        output: generatePassword({
          length: options.length ?? 16,
          includeUpper: options.includeUpper,
          includeLower: options.includeLower,
          includeNumbers: options.includeNumbers,
          includeSymbols: options.includeSymbols,
          excludeAmbiguous: options.excludeAmbiguous,
        }),
      };
    case "random-string":
      return {
        output: generateRandomStrings({
          length: options.length ?? 16,
          quantity: options.quantity ?? 1,
          includeUpper: options.includeUpper,
          includeLower: options.includeLower,
          includeNumbers: options.includeNumbers,
          includeSymbols: options.includeSymbols,
          excludeAmbiguous: options.excludeAmbiguous,
          charset: options.charset,
        }).join("\n"),
      };
    case "random-number":
      return {
        output: generateRandomNumbers({
          min: options.min ?? 1,
          max: options.max ?? 100,
          quantity: options.quantity ?? 1,
          decimalMode: options.decimalMode,
          decimalPlaces: options.decimalPlaces,
        }).join("\n"),
      };
    case "hex-to-text":
      return { output: hexToText(input) };
    case "text-to-hex":
      return { output: textToHex(input) };
    case "binary-to-text":
      return { output: binaryToText(input) };
    case "text-to-binary":
      return { output: textToBinary(input) };
    case "decimal-to-binary":
      return { output: decimalToBinary(input) };
    case "binary-to-decimal":
      return { output: binaryToDecimal(input) };
    case "base32":
      return {
        output:
          options.mode === "decode" ? decodeBase32(input) : encodeBase32(input),
      };
    case "base64-file": {
      if (options.mode === "decode") {
        const blob = decodeBase64ToBlob(input, options.mimeType);
        if (blob.size > MAX_FILE_BYTES) {
          throw new Error("Decoded file is too large.");
        }
        return {
          output: `Decoded file ready (${formatBytes(blob.size)})`,
          downloadBlob: blob,
          downloadName: options.fileName || "decoded-file.bin",
        };
      }
      if (!options.file) throw new Error("Please choose a file to convert.");
      if (options.file.size > MAX_FILE_BYTES) {
        throw new Error(
          `File is too large (max ${Math.floor(MAX_FILE_BYTES / (1024 * 1024))} MB).`,
        );
      }
      const encoded = await fileToBase64(options.file, options.onProgress);
      return {
        output: encoded,
        meta: {
          fileName: options.file.name,
          mimeType: options.file.type || "application/octet-stream",
          fileSize: formatBytes(options.file.size),
        },
      };
    }
    case "jwt": {
      const jwt = decodeJwt(input);
      const output = [
        "Decoded — Not Verified",
        "",
        "HEADER",
        JSON.stringify(jwt.header, null, 2),
        "",
        "PAYLOAD",
        JSON.stringify(jwt.payload, null, 2),
        "",
        "SIGNATURE",
        jwt.signature,
      ].join("\n");
      return {
        output,
        jwt,
        notice: "Decoded — Not Verified. Decoding does not prove authenticity.",
      };
    }
    case "timestamp-generate": {
      const result = generateUnixTimestamp({
        useNow: options.useNow,
        dateValue: options.dateValue,
      });
      return {
        output: [
          `Unix seconds: ${result.seconds}`,
          `Unix milliseconds: ${result.milliseconds}`,
          `ISO: ${result.iso}`,
        ].join("\n"),
        meta: result,
      };
    }
    case "timestamp-convert": {
      const result = convertUnixTimestamp(
        input,
        options.timestampUnit ?? "seconds",
      );
      return {
        output: [
          `Local: ${result.local}`,
          `UTC: ${result.utc}`,
          `ISO: ${result.iso}`,
          `Seconds: ${result.seconds}`,
          `Milliseconds: ${result.milliseconds}`,
        ].join("\n"),
        meta: result,
      };
    }
    case "qr": {
      const qr = await generateQr({
        text: input,
        size: options.qrSize,
        errorCorrection: options.qrErrorCorrection,
        margin: options.qrMargin,
        dark: options.qrDark,
        light: options.qrLight,
      });
      const pngBlob = await (await fetch(qr.dataUrl)).blob();
      return {
        output: input,
        qrDataUrl: qr.dataUrl,
        qrSvg: qr.svg,
        downloadBlob: pngBlob,
        downloadName: "qr-code.png",
        notice: qr.warning,
      };
    }
    default:
      return { output: input };
  }
}
