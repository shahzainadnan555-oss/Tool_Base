import {
  MAX_PASSWORD_LENGTH,
  MAX_RANDOM_QUANTITY,
  MAX_STRING_LENGTH,
  MAX_UUID_QUANTITY,
} from "./types";
import { requireSecureRandom } from "./utils";

const AMBIGUOUS = new Set(["0", "O", "o", "1", "l", "I", "|"]);

export function generateUuids(quantity: number): string[] {
  const cryptoApi = requireSecureRandom();
  if (!cryptoApi.randomUUID) {
    throw new Error("UUID generation is unavailable in this browser.");
  }
  const count = Math.max(1, Math.min(MAX_UUID_QUANTITY, Math.floor(quantity || 1)));
  return Array.from({ length: count }, () => cryptoApi.randomUUID());
}

function buildCharset(options: {
  includeUpper?: boolean;
  includeLower?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeAmbiguous?: boolean;
  charset?: string;
}): string {
  if (options.charset) return options.charset;
  let set = "";
  if (options.includeUpper !== false) set += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.includeLower !== false) set += "abcdefghijklmnopqrstuvwxyz";
  if (options.includeNumbers !== false) set += "0123456789";
  if (options.includeSymbols) set += "!@#$%^&*()-_=+[]{};:,.<>?";
  if (options.excludeAmbiguous) {
    set = Array.from(set)
      .filter((ch) => !AMBIGUOUS.has(ch))
      .join("");
  }
  if (!set) throw new Error("Select at least one character type.");
  return set;
}

function randomIndexes(count: number, maxExclusive: number): number[] {
  const cryptoApi = requireSecureRandom();
  const out: number[] = [];
  const limit = Math.floor(256 / maxExclusive) * maxExclusive;
  while (out.length < count) {
    const buf = new Uint8Array(Math.max(16, count - out.length));
    cryptoApi.getRandomValues(buf);
    for (const byte of buf) {
      if (byte < limit) out.push(byte % maxExclusive);
      if (out.length >= count) break;
    }
  }
  return out;
}

export function generatePassword(options: {
  length: number;
  includeUpper?: boolean;
  includeLower?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeAmbiguous?: boolean;
}): string {
  const length = Math.max(4, Math.min(MAX_PASSWORD_LENGTH, Math.floor(options.length || 16)));
  const charset = buildCharset(options);
  const picks = randomIndexes(length, charset.length);
  return picks.map((i) => charset[i]).join("");
}

export function generateRandomStrings(options: {
  length: number;
  quantity: number;
  includeUpper?: boolean;
  includeLower?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeAmbiguous?: boolean;
  charset?: string;
}): string[] {
  const length = Math.max(1, Math.min(MAX_STRING_LENGTH, Math.floor(options.length || 16)));
  const quantity = Math.max(1, Math.min(MAX_RANDOM_QUANTITY, Math.floor(options.quantity || 1)));
  if (length * quantity > 500_000) {
    throw new Error("Requested output is too large. Reduce length or quantity.");
  }
  const charset = buildCharset(options);
  return Array.from({ length: quantity }, () => {
    const picks = randomIndexes(length, charset.length);
    return picks.map((i) => charset[i]).join("");
  });
}

export function generateRandomNumbers(options: {
  min: number;
  max: number;
  quantity: number;
  decimalMode?: boolean;
  decimalPlaces?: number;
}): string[] {
  const min = options.min;
  const max = options.max;
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new Error("Minimum and maximum must be valid numbers.");
  }
  if (min > max) throw new Error("Minimum must be less than or equal to maximum.");
  const quantity = Math.max(1, Math.min(MAX_RANDOM_QUANTITY, Math.floor(options.quantity || 1)));
  const cryptoApi = requireSecureRandom();

  if (options.decimalMode) {
    const places = Math.max(0, Math.min(10, Math.floor(options.decimalPlaces ?? 4)));
    return Array.from({ length: quantity }, () => {
      const buf = new Uint32Array(1);
      cryptoApi.getRandomValues(buf);
      const ratio = buf[0] / 0x1_0000_0000;
      const value = min + ratio * (max - min);
      return value.toFixed(places);
    });
  }

  // Integers via rejection sampling with BigInt-safe range when needed
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error("Integer mode requires whole-number minimum and maximum.");
  }
  const range = BigInt(max) - BigInt(min) + BigInt(1);
  if (range <= BigInt(0)) throw new Error("Invalid number range.");

  return Array.from({ length: quantity }, () => {
    const value = secureRandomBigInt(range) + BigInt(min);
    return value.toString();
  });
}

function secureRandomBigInt(exclusiveMax: bigint): bigint {
  const cryptoApi = requireSecureRandom();
  const bits = exclusiveMax.toString(2).length;
  const bytes = Math.ceil(bits / 8);
  while (true) {
    const buf = new Uint8Array(bytes);
    cryptoApi.getRandomValues(buf);
    let value = BigInt(0);
    for (const byte of buf) value = (value << BigInt(8)) + BigInt(byte);
    if (value < exclusiveMax) return value;
  }
}
