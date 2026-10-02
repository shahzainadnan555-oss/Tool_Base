import {
  createMD5,
  createSHA1,
  createSHA256,
  createSHA512,
} from "hash-wasm";
import type { HashAlgorithm } from "./types";
import { HASH_CHUNK_SIZE, MAX_FILE_BYTES } from "./types";
import { utf8Encode } from "./utils";

async function createHasher(algorithm: HashAlgorithm) {
  switch (algorithm) {
    case "SHA-256":
      return createSHA256();
    case "SHA-512":
      return createSHA512();
    case "SHA-1":
      return createSHA1();
    case "MD5":
      return createMD5();
    default:
      throw new Error("Unsupported hash algorithm.");
  }
}

export async function hashText(
  text: string,
  algorithm: HashAlgorithm,
): Promise<string> {
  if (!text) throw new Error("Please enter text to hash.");
  const hasher = await createHasher(algorithm);
  hasher.init();
  hasher.update(utf8Encode(text));
  return hasher.digest("hex");
}

export async function hashFile(
  file: File,
  algorithm: HashAlgorithm,
  onProgress?: (ratio: number) => void,
  signal?: AbortSignal,
): Promise<string> {
  if (!file) throw new Error("Please choose a file to hash.");
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(
      `File is too large (max ${Math.floor(MAX_FILE_BYTES / (1024 * 1024))} MB).`,
    );
  }

  const hasher = await createHasher(algorithm);
  hasher.init();

  let offset = 0;
  while (offset < file.size) {
    if (signal?.aborted) throw new Error("Hashing was cancelled.");
    const end = Math.min(offset + HASH_CHUNK_SIZE, file.size);
    const chunk = await file.slice(offset, end).arrayBuffer();
    hasher.update(new Uint8Array(chunk));
    offset = end;
    onProgress?.(file.size === 0 ? 1 : offset / file.size);
  }

  return hasher.digest("hex");
}
